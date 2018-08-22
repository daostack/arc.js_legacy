import { promisify } from "es6-promisify";
import { BlockWithoutTransactionData, DecodedLogEntryEvent, TransactionReceipt } from "web3";
import { Address } from "./commonTypes";
import { IContractWrapperBase } from "./iContractWrapperBase";
import { LoggingService } from "./loggingService";
import { EventSubscription, IEventSubscription, PubSubEventService } from "./pubSubEventService";
import { TransactionReceiptTruffle, TransactionService } from "./transactionService";
import { Utils } from "./utils";
import { UtilsInternal } from "./utilsInternal";

export class AggregateEventService {

  /**
   * Set up a PubSub event with the given topic that will be published
   * for every transaction that emitted one or more of the given contract events.
   *
   * The event payload will be an `AggregatedEventsPayload` that includes the TransactionReceipt and a
   * `Map<EventToAggregate, DecodedLogEntryEvent<any>>` that you can use to obtain the requested
   * contract events emitted by the transaction.
   *
   * You may subscribe to the events like this:
   *
   *   `PubSubService.subscribe(eventTopic, (topic: string, payload: AggregatedEventsPayload) => { ... })`
   *
   * The events are aggregated from the logs of transactions occuring in each block in the
   * chain, as specified by the range of blocks given in the filter.
   *
   * @param events An array of `EventToAggregate` that specifies which events to look for,
   * by name and Arc.js contract wrapper.
   * @param eventTopic the name of the event to which the events will be published and to which you
   * may subscribe.
   * @param filter optionally provide `fromBlock` (default is "latest") and `toBlock` (optional).
   * If you don't supply `fromBlock`, or `fromBlock` is "latest'," then will start with the current block.
   * If you don't supply `toBlock`, or `toBlock` is "latest'," then will watch until unsubscribed.
   * @param requiredDepth -- If set then the event is not published until each transaction has been mined to
   * the requiredDepth. Pass -1 to use the Arc.js's global default depth.
   * @returns A subscription if the filter requires waiting for blocks that have not yet been mined.
   * If a subscription is returned you must unsubscribe to it when you are done with it,
   * or else the watch will continue forever.
   */
  public async aggregateEvents(
    events: Array<EventToAggregate>,
    eventTopic: string,
    filter: AggregateEventsFilter = { fromBlock: "latest" },
    requiredDepth: number = 0)
    : Promise<IEventSubscription | undefined> {

    if (!events) {
      throw new Event("events was not supplied");
    }

    if (filter.fromBlock === 0) {
      LoggingService.warn(`Web3EventService.aggregateEvents: can be very slow when \`fromBlock\` is zero`);
    }

    const newestBlockNumber = await UtilsInternal.lastBlock();

    if (
      (typeof filter.fromBlock !== undefined) &&
      (filter.fromBlock !== "latest") &&
      !Number.isInteger(filter.fromBlock as any)) {

      throw new Event(`fromBlock must be either undefined, integer, or "latest"`);
    }

    if (
      (typeof filter.toBlock !== undefined) &&
      (filter.toBlock !== "latest") &&
      !Number.isInteger(filter.toBlock as any)) {

      throw new Event(`toBlock must be either undefined, integer, or "latest"`);
    }

    let lastBlockComplete = (
      ((typeof filter.fromBlock === undefined) || (filter.fromBlock === "latest")) ?
        newestBlockNumber : filter.fromBlock as number) - 1;

    const isWatch = this.isForever(filter);

    if (!isWatch) {
      if (filter.toBlock < filter.fromBlock) {
        throw new Event("toBlock must be undefined or greater than or equal to fromBlock");
      }
    }

    let mutex = false;

    const requestedContractbyAddress = new Map<Address, any>();

    /**
     * Map the contract address to the truffle contract
     */
    events.forEach((event: EventToAggregate) => {
      requestedContractbyAddress.set(event.contract.address, event.contract.contract);
    });

    const eventSpecsByContractAddress = new Map<Address, Map<string, EventToAggregate>>();

    /**
     * Map the contract address to a Map of event name to EventToAggregate
     */
    events.forEach((event: EventToAggregate) => {
      let namesMap = eventSpecsByContractAddress.get(event.contract.address);
      if (!namesMap) {
        namesMap = new Map<string, EventToAggregate>();
        events.filter((e: EventToAggregate): boolean => e.contract.address === event.contract.address)
          .forEach((eventSpecWithAddress: EventToAggregate): void => {
            namesMap.set(eventSpecWithAddress.eventName, eventSpecWithAddress);
          });
        eventSpecsByContractAddress.set(event.contract.address, namesMap);
      }
    });

    const handler = async (): Promise<boolean> => {

      if (!mutex) {
        // prevent reentrancy
        mutex = true;

        lastBlockComplete = await this.handleAggregateEventNewBlock(
          requestedContractbyAddress,
          eventSpecsByContractAddress,
          eventTopic,
          filter,
          lastBlockComplete
        );
        mutex = false;
      }

      // return whether we're done. filter.toBlock must be a number if not forever
      return (!isWatch && (lastBlockComplete === filter.toBlock));
    };

    /**
     * run once and see if we're done
     */
    const done = await handler();
    /**
     * if not, start polling
     */
    if (!done) {

      let pollingInterval;

      // TODO: confirm these values are reasonable? make them configurable?
      switch (await Utils.getNetworkName()) {
        case "Ganache": pollingInterval = 500; break;
        case "Live": pollingInterval = 7000; break;
        default: pollingInterval = 5000; break;
      }

      const timer = setInterval(handler, pollingInterval);
      return new EventSubscription(
        eventTopic,
        (): Promise<void> => { clearInterval(timer); return Promise.resolve(); });
    }
  }

  private isForever(filter: AggregateEventsFilter): boolean {
    return (typeof filter.toBlock === "undefined") || (filter.toBlock === "latest");
  }

  private async getFeasibleDestinationBlockNumber(
    filter: AggregateEventsFilter
  ): Promise<number> {
    const forever = this.isForever(filter);
    const newestBlockNumber = await UtilsInternal.lastBlock();
    /**
     * If forever then we go to the newestBlockNumber.
     * else we go to filter.toBlock or newestBlockNumber, whichever is smallest
     */
    // filter.toBlock is allowed to be greater than newestBlockNumber
    return forever ? newestBlockNumber : Math.min(filter.toBlock as number, newestBlockNumber);
  }

  private async handleAggregateEventNewBlock(
    requestedContractbyAddress: Map<Address, any>,
    eventSpecsByContractAddress: Map<Address, Map<string, EventToAggregate>>,
    eventTopic: string,
    filter: AggregateEventsFilter,
    lastBlockCompleteNumber: number): Promise<number> {

    const web3 = await Utils.getWeb3();

    const toBlockNumber = await this.getFeasibleDestinationBlockNumber(filter);
    /**
     * enumerate requested blocks until the subscription is cancelled
     */
    while (lastBlockCompleteNumber < toBlockNumber) {

      ++lastBlockCompleteNumber;

      const newBlock: BlockWithoutTransactionData =
        await promisify((callback: any): void => web3.eth.getBlock(lastBlockCompleteNumber, false, callback))() as any;

      for (const txHash of newBlock.transactions) {
        const txReceipt = await TransactionService.getMinedTransaction(txHash) as TransactionReceipt;
        const foundEvents = new Map<EventToAggregate, DecodedLogEntryEvent<any>>();

        for (const log of txReceipt.logs) {
          /**
           * see if a contract of interest generated this log
           */
          const foundContract = requestedContractbyAddress.get(log.address);

          if (foundContract) {
            /**
             * get the decoded events for this contract.
             * Note each log can come from a different contract, so have to redecode each time.
             *
             * TODO:  seems like truffle would have a way to decode all the log entries just knowing
             * the contract that generated the transaction??  Find out.
             */
            (txReceipt as any).receipt = null; // force it to redo
            const txReceiptDecoded = await TransactionService.toTxTruffle(txReceipt, foundContract);

            /**
             * get the decoded log corresponding to the undecoded log we are at
             */
            const decodedEvent =
              txReceiptDecoded.logs.filter((l: DecodedLogEntryEvent<any>) => l.logIndex === log.logIndex)[0];

            /**
             * determine whether the log is from a requested event, by name
             */
            const eventSpecsByName = eventSpecsByContractAddress.get(log.address);
            const eventSpec = eventSpecsByName.get(decodedEvent.event);

            if (eventSpec) {
              foundEvents.set(eventSpec, decodedEvent);
            }
          }
        }
        if (foundEvents.size) {
          PubSubEventService.publish(eventTopic, { events: foundEvents, txReceipt } as AggregatedEventsPayload);
        }
      }
    }
    return lastBlockCompleteNumber;
  }
}

export interface AggregatedEventsPayload {
  /**
   * The requested events, decoded
   */
  events: Map<EventToAggregate, DecodedLogEntryEvent<any>>;
  txReceipt: TransactionReceipt;
}

/**
 * for specifying desired events in `aggregatedEventsFetcherFactory`
 */
export interface EventToAggregate {
  /**
   * Arc.js contract wrapper for the contract that will fire the event.
   */
  contract: IContractWrapperBase;
  /**
   * name of the event to trap
   */
  eventName: string;
}

export interface AggregateEventsFilter {
  fromBlock?: number | string;
  toBlock?: number | string;
}
