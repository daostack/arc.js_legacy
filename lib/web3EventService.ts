import {
  DecodedLogEntryEvent,
  FilterTransactionEventResult,
  LogTopic,
  TransactionReceipt
} from "web3";
import { fnVoid, Hash } from "./commonTypes";
import { IContractWrapperBase } from "./iContractWrapperBase";
import { LoggingService } from "./loggingService";
import { IEventSubscription, PubSubEventService } from "./pubSubEventService";
import { TransactionReceiptTruffle, TransactionService } from "./transactionService";
import { Utils } from "./utils";
import { UtilsInternal, Web3Watcher } from "./utilsInternal";

/**
 * Support for working with events that originate from Arc contracts
 * and are served up by Web3.
 *
 * See [Arc Web3 Events in Arc.js](/Events#web3events).
 */
export class Web3EventService {
  /**
   * Returns a function that creates an EventFetcher<TEventArgs>.
   * For subclasses to use to create their event handlers.
   * This is identical to what you get with Truffle, except with enhancements.
   *
   * Note that the callback parameter of `EventFetcher.get` is optional; you
   * may alternatively obtain the promise of a `Array<TEventArgs>` from the return value
   * of `get`.
   *
   * See [Arc Web3 Events in Arc.js](/Events#web3events).
   *
   * @param baseEvent - the event from the Truffle contract.
   * @param preProcessEvent - optionally supply this to modify the err and log arguments before they are
   * passed to the `get`/`watch` callback.
   * @param baseArgFilter arg filter to always merge into any supplied argFilter.
   * @type TEventArgs - name of the event args (EventResult) interface, like NewProposalEventResult
   */
  public createEventFetcherFactory<TEventArgs>(
    baseEvent: any,
    preProcessEvent?: PreProcessEventCallback<TEventArgs>,
    baseArgFilter: any = {}
  ): EventFetcherFactory<TEventArgs> {

    return this._createEventFetcherFactory(
      baseEvent,
      preProcessEvent,
      baseArgFilter) as any as EventFetcherFactory<TEventArgs>;
  }

  /**
   * Converts a `EventFetcherFactory<TEventArgs>` into a
   * `EntityFetcherFactory<TEntity, TEventArgs>`.  So whenever a web3 event
   * is received by the given `EventFetcherFactory`, we transform the `TEventArgs`
   * into `TEntities`.
   *
   * Note that the callback parameter of `EntityFetcher.get` is optional; you
   * may alternatively obtain the promise of a `Array<TEntity>` from the return value
   * of `get`.
   *
   * See [Arc Web3 Events in Arc.js](/Events#web3events).
   *
   * @param eventFetcherFactory
   * @param transformEventCallback Function to convert an instance of TEventArgs into
   * the promise of an instance of TEntity.  If it returns `undefined` then no entity
   * is returned for that event, so this is a programatic way in which events
   * can be filtered.
   * @param baseArgFilter arg filter to always merge into any supplied argFilter.
   */
  public createEntityFetcherFactory<TEntity, TEventArgs>(
    eventFetcherFactory: EventFetcherFactory<TEventArgs> | FilterFetcherFactory,
    transformEventCallback: TransformEventCallback<TEntity, TEventArgs>,
    baseArgFilter: any = {}
  ): EntityFetcherFactory<TEntity, TEventArgs> {

    if (!eventFetcherFactory) {
      throw new Error("eventFetcherFactory was not supplied");
    }

    if (!transformEventCallback) {
      throw new Error("transformEventCallback was not supplied");
    }

    /**
     * This is the function that returns the EntityFetcher<TEventArgs>
     * argFilter - Optional event argument filter, like `{ _proposalId: [someHash] }`.
     * filterObject - Optional event filter.  Default is `{ fromBlock: "latest" }`
     * callback.
     * immediateWatchCallback - when supplied, starts watch immediately
     * immediateRequiredDepth - only used when immediateWatchCallback is supplied. If set
     * then will not invoke the callback until the transaction has been mined to the requiredDepth.
     */
    return (
      argFilter: any = {},
      filterObject: EventFetcherFilterObject = {},
      immediateWatchCallback?: EntityWatchCallback<TEntity>,
      immediateRequiredDepth: number = 0
    ): EntityFetcher<TEntity, TEventArgs> => {

      // handler that takes the events and issues givenCallback appropriately
      const handleEvent =
        (error: Error,
         log: EventCallbackArrayPayload<TEventArgs> | EventCallbackSinglyPayload<TEventArgs>,
          // singly true to issue callback on every arg rather than on the array
         singly: boolean,
          /*
           * invoke this callback on every event (watch)
           * or on the array of events (get), depending on the value of singly.
           * when singly, callback gets the entity.
           * watch is always singly.
           * when not singly, callback gets a promise of the array of entities.
           * get is not singly.  so get gets a promise of an array.
           */
         callback?: (error: Error, args: TEntity | Promise<Array<TEntity>>) => void):
          Promise<Array<TEntity>> => {

          const promiseOfEntities: Promise<Array<TEntity>> =
            new Promise(
              async (resolve: (result: Array<TEntity>) => void, reject: (error: Error) => void): Promise<void> => {

                if (error) {
                  return reject(error);
                }

                // it's not an array when singly
                if (!Array.isArray(log)) {
                  log = [log] as EventCallbackArrayPayload<TEventArgs>;
                }

                const entities = new Array<TEntity>();
                // transform all the log entries into entities
                for (const event of log) {
                  const transformedEntity = await transformEventCallback(event);
                  if (typeof transformedEntity !== "undefined") {
                    if (callback && singly) {
                      callback(error, transformedEntity);
                    }
                    entities.push(transformedEntity);
                  }
                }
                resolve(entities);
              });
          // invoke the given callback with the promise of an array of entities
          if (callback && !singly) {
            callback(error, promiseOfEntities);
          }
          return promiseOfEntities;
        };

      const baseFetcher: IFetcher = (eventFetcherFactory as any)(
        Object.assign(argFilter, baseArgFilter), // argsFilter
        filterObject); // web3Filter

      /**
       * If `immediateWatchCallback` is defined then we should start watching immediately.
       */
      if (immediateWatchCallback) {
        baseFetcher.watch((error: Error, log: any) => {
          handleEvent(error, log, true, immediateWatchCallback);
        }, immediateRequiredDepth);
      }

      /**
       * return the fetcher
       */
      return {

        get(callback?: EntityGetCallback<TEntity>, requiredDepth: number = 0)
          : Promise<Array<TEntity>> {
          // remember get is singly, so there is a promise of an array
          return new Promise<Array<TEntity>>(
            (resolve: (result: Array<TEntity>) => void, reject: (error: Error) => void): void => {
              baseFetcher.get(async (error: Error, log: EventCallbackArrayPayload<TEventArgs>): Promise<void> => {
                if (error) {
                  return reject(error);
                }
                resolve(await handleEvent(error, log, false, callback));
              }, requiredDepth);
            });
        },

        watch(callback?: EntityWatchCallback<TEntity>, requiredDepth: number = 0): void {
          // remember watch is singly, no promises
          baseFetcher.watch((error: Error, log: EventCallbackSinglyPayload<TEventArgs>) => {
            handleEvent(error, log, true, callback);
          }, requiredDepth);
        },

        subscribe(
          eventName: string,
          callback?: EntityWatchSubscriptionCallback<TEntity>,
          requiredDepth: number = 0): Web3EventSubscription<TEventArgs> {

          if (!callback) {
            /* tslint:disable-next-line:no-empty */
            callback = (): void => { };
          }

          const subscription = PubSubEventService.subscribe(eventName, callback);

          this.watch((error: Error, entity: TEntity) => {
            PubSubEventService.publish(eventName, entity);
          }, requiredDepth);

          return new Web3EventSubscription(subscription, baseFetcher);
        },

        stopWatching(callback?: fnVoid): void {
          baseFetcher.stopWatching(callback);
        },
        stopWatchingAsync(): Promise<void> {
          return UtilsInternal.stopWatchingAsync(baseFetcher);
        },
      };
    };
  }

  /**
   * Create an `FilterFetcherFactory` for `web3.eth.filter` that generates `FilterTransactionResult`
   * rather than `DecodedLogEntryEvent<T>`.
   *
   * Note that the `FilterFetcher` does not accept an argFilter parameter like the contract event fetchers do.
   * @param preProcessEvent
   */
  public createFilterFetcherFactory(
    preProcessEvent?: PreProcessEventCallback<any>
  ): FilterFetcherFactory {

    const web3 = UtilsInternal.getWeb3Sync();

    const eventFetcherFactory = this._createEventFetcherFactory(
      (argFilter: any, webFilter: EventFetcherFilterObject) => web3.eth.filter(webFilter),
      preProcessEvent);

    return (
      filterObject?: EventFetcherFilterObject,
      callback?: FilterWatchCallback,
      requiredDepth?: number
    ): FilterFetcher => {
      return eventFetcherFactory({}, filterObject, callback, requiredDepth) as any as FilterFetcher;
    };
  }

  /**
   * Given a list of contract events, return an EntityFetcherFactory that enables you to get, watch and subscribe
   * to an event that fires whenever a transaction is detected that emitted one or more of the given contract events.
   * You will receive an `AggregatedEventsResult` that includes the TransactionReceipt and a
   * `Map<EventToAggregate, DecodedLogEntryEvent<any>>`
   * that you can use to obtain the requested contract events, if any were emitted by the transaction.
   * @param events An array of `EventToAggregate` that specifies which events to look for,
   * by name and Arc.js contract wrapper.
   */
  public aggregatedEventsFetcherFactory(events: Array<EventToAggregate>)
    : EntityFetcherFactory<AggregatedEventsResult, FilterTransactionEventResult> {

    if (!events) {
      throw new Event("events was not supplied");
    }

    const baseFetcher = this.createFilterFetcherFactory();

    return this.createEntityFetcherFactory<AggregatedEventsResult, FilterTransactionEventResult>(
      baseFetcher,
      async (tx: FilterTransactionEventResult): Promise<AggregatedEventsResult | undefined> => {
        /**
         * TODO: worry about dups as blocks settle?
         */
        const foundEvents = new Map<EventToAggregate, DecodedLogEntryEvent<any>>();
        let txReceiptWithLogs;
        if (tx.type === "pending") {
          /* tslint:disable-next-line:max-line-length */
          LoggingService.warn(`Web3EventService.aggregateEvents: transaction has not yet been mined, potential for transaction to appear out of sequence: ${tx.transactionHash}`);
        }

        const txReceipt = await TransactionService.getMinedTransaction(tx.transactionHash) as TransactionReceipt;
        const foundContractAddress = txReceipt.contractAddress;
        let foundContract: IContractWrapperBase;

        /**
         * The contract that generated this transaction must be among those given in options.events
         */
        for (const eventSpec of events) {
          if (foundContractAddress === eventSpec.contract.address) {
            foundContract = eventSpec.contract;
            break;
          }
        }

        if (foundContract) {
          /**
           * get the decoded logs
           */
          txReceiptWithLogs = await TransactionService.toTxTruffle(txReceipt, foundContract.contract);

          txReceiptWithLogs.logs.forEach((foundTxLog: DecodedLogEntryEvent<any>): void => {

            events.filter((es: EventToAggregate) => es.contract.address === foundContractAddress)
              .forEach((aggregatedEvent: EventToAggregate) => {

                if (aggregatedEvent.eventName === foundTxLog.event) {
                  foundEvents.set(aggregatedEvent, foundTxLog);
                }
              });
          });
        }
        if (foundEvents.keys.length) {
          return { events: foundEvents, txReceipt: txReceiptWithLogs };
        }
      });
  }

  /**
   * Convert the EntityFetcherFactory<TEntitySrc, TEntityOriginalSrc> into an
   * EntityFetcherFactory<TEntityDest, TEntitySrc>.
   *
   * @param entityFetcherFactory The source EntityFetcherFactory
   * @param transformEventCallback Converts TEntitySrc into TEntityDest
   */
  public pipeEntityFetcherFactory<TEntityDest, TEntitySrc, TEntityOriginalSrc>(
    entityFetcherFactory: EntityFetcherFactory<TEntitySrc, TEntityOriginalSrc>,
    transformEventCallback: TransformEventCallback<TEntityDest, TEntitySrc>
  ): EntityFetcherFactory<TEntityDest, TEntitySrc> {

    const fetcher = entityFetcherFactory();

    /**
     * replace the existing transformEventCallback with the new one that will invoke the old one
     */
    /* tslint:disable:max-line-length */
    ((fetcher as any).transformEventCallback as any) = async (entity: TEntityOriginalSrc): Promise<TEntityDest | undefined> => {
      const transformedEntity =
        await ((fetcher as any).transformEventCallback(entity as TEntityOriginalSrc) as Promise<TEntitySrc | undefined>);
      if (typeof transformedEntity !== "undefined") {
        return transformEventCallback(transformedEntity) as Promise<TEntityDest | undefined>;
      }
    };
    /* tslint:enable:max-line-length */

    return entityFetcherFactory as EntityFetcherFactory<any, any>;
  }

  private _createEventFetcherFactory(
    baseEvent: any,
    preProcessEvent?: PreProcessEventCallbackInternal,
    baseArgFilter: any = {}
  ): IFetcherFactory {

    if (!baseEvent) {
      throw new Error("baseEvent was not supplied");
    }
    /**
     * This is the function that returns the EventFetcher<TEventArgs>
     * argFilter - Optional event argument filter, like `{ _proposalId: [someHash] }`.
     * filterObject - Optional event filter.  Default is `{ fromBlock: "latest" }`
     * callback.
     * immediateWatchCallback - when supplied, starts watch immediately
     * immediateRequiredDepth - only used when immediateWatchCallback is supplied. If set
     * then will not invoke the callback until the transaction has been mined to the requiredDepth.
     */
    return (
      argFilter: any = {},
      filterObject: EventFetcherFilterObject = {},
      immediateWatchCallback?: EventWatchCallback<any> | FilterWatchCallback,
      immediateRequiredDepth: number = 0
    ): IFetcher => {

      const handleEvent = this.createBaseWeb3EventHandler(
        filterObject.suppressDups,
        preProcessEvent);

      const baseFetcher: IFetcher =
        baseEvent(Object.assign(argFilter, baseArgFilter), filterObject);

      /**
       * If `immediateWatchCallback` is defined then we should start watching immediately.
       */
      if (immediateWatchCallback) {
        baseFetcher.watch(
          async (error: Error, log: EventCallbackArrayPayload<any> | EventCallbackSinglyPayload<any>) => {
            await handleEvent(error, log, true, immediateWatchCallback, immediateRequiredDepth);
          });
      }

      /**
       * return the fetcher
       */
      return {

        get(callback?: any, requiredDepth: number = 0)
          : Promise<any> {
          return new Promise<any>(
            (resolve: (result: any) => void,
             reject: (error: Error) => void): void => {

              baseFetcher.get(
                async (error: Error, log: any): Promise<void> => {

                  if (error) {
                    return reject(error);
                  }
                  resolve(await handleEvent(error, log, false, callback, requiredDepth));
                });
            });
        },

        watch(callback: any, requiredDepth: number = 0): void {
          baseFetcher.watch(
            async (error: Error, log: any) => {
              await handleEvent(error, log, true, callback, requiredDepth);
            });
        },

        subscribe(
          eventName: string,
          callback?: any,
          requiredDepth: number = 0): Web3EventSubscription<any> {

          if (!callback) {
            /* tslint:disable-next-line:no-empty */
            callback = (): void => { };
          }

          const subscription = PubSubEventService.subscribe(eventName, callback);

          this.watch((error: Error, args: any) => {
            PubSubEventService.publish(eventName, args);
          }, requiredDepth);

          return new Web3EventSubscription(subscription, baseFetcher);
        },
        stopWatching(callback?: fnVoid): void {
          baseFetcher.stopWatching(callback);
        },
        stopWatchingAsync(): Promise<void> {
          return UtilsInternal.stopWatchingAsync(baseFetcher);
        },
      };
    };
  }

  /**
   * Returns a function that we will use internally to handle each Web3 event
   * @param suppressDups
   * @param preProcessEvent
   */
  private createBaseWeb3EventHandler(
    suppressDups: boolean,
    preProcessEvent?: PreProcessEventCallbackInternal)
    : BaseWeb3EventCallback {

    let receivedEvents: Set<Hash>;

    if (!!suppressDups) {
      receivedEvents = new Set<Hash>();
    }

    return async (
      error: Error,
      events: FilterEvent | Array<FilterEvent>,
      // singly true to issue callback on every arg rather than on the array
      singly: boolean,
      /*
       * invoke this callback on every event (watch)
       * or on the array of events (get), depending on the value of singly
       */
      callback?: (
        error: Error,
        args: FilterEvent | Array<FilterEvent>) => void,
      requiredDepth: number = 0)
      : Promise<Array<FilterEvent>> => {
      /**
       * convert to an array
       */
      if (!!error) {
        events = [];
      } else if (!Array.isArray(events)) {
        events = [events];
      }

      /**
       * optionally prune duplicate events (see https://github.com/ethereum/web3.js/issues/398)
       */
      if (receivedEvents && events.length) {
        events = events.filter((evt: FilterEvent) => {
          if (!receivedEvents.has(evt.transactionHash)) {
            receivedEvents.add(evt.transactionHash);
            return true;
          } else {
            return false;
          }
        });
      }

      if (preProcessEvent) {
        const processedResult = await preProcessEvent(error, events);
        error = processedResult.error;
        events = processedResult.log;
      }

      // invoke callback if there is one
      if (callback) {
        for (const e of events) {
          if (requiredDepth) {
            if (requiredDepth === -1) { requiredDepth = undefined; } // to use the default value
            await TransactionService.watchForConfirmedTransaction(e.transactionHash, null, requiredDepth);
          }
          if (singly) {
            callback(error, e);
          }
        }
        if (!singly) {
          callback(error, events);
        }
      }

      // return array of DecodedLogEntryEvents in any case
      return events;
    };
  }
}

/**
 * Function that returns an `EntityFetcher<TEntity>`.
 *
 * @type TEntity The type returns to the callback.
 */
export type EntityFetcherFactory<TDest, TSrc> =
  (
    /**
     * Arg values by which you wish to filter the web3 event logs, e.g.
     * `{'valueA': 1, 'valueB': [myFirstAddress, mySecondAddress]}`.
     *
     * Note this always applies to the underlying web3 event values
     * not to property values of transformed entities.
     */
    argsFilter?: any,
    /**
     * Web3 event filter options.  Typically something like `{ fromBlock: 0 }`.
     * Note if you don't want Arc.js to suppress duplicate events, set `suppressDups` to false.
     */
    filterObject?: EventFetcherFilterObject,
    /**
     * Optional callback to immediately start start watching.
     * Without this you will call `get` or `watch`.
     */
    callback?: EntityWatchCallback<TDest>,
    /**
     * Optional and only used when callback is supplied. If set
     * then will not invoke the callback until the transaction has been mined to the requiredDepth.
     */
    requiredDepth?: number
  ) => EntityFetcher<TDest, TSrc>;

export type EntityWatchCallback<TEntity> = (error: Error, entity: TEntity) => void;
export type EntityGetCallback<TEntity> = (error: Error, entity: Promise<Array<TEntity>>) => void;
export type EntityWatchSubscriptionCallback<TEntity> = (eventName: string, payload: TEntity) => void;
export type TransformEventCallback<TDest, TSrc> =
  (event: TSrc | EventCallbackSinglyPayload<TSrc>) => Promise<TDest | undefined>;
/**
 * Returned by EntityFetcherFactory<TDest, TSrc>.
 */
export interface EntityFetcher<TDest, TSrc> {
  /**
   * Get an array of `TDest` from Web3, given the filter supplied to the EntityFetcherFactory.
   * You may supply a callback, which will be given the array, or you may
   * accept the promise of the array from the return value of `get`.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.  Pass -1 to use the Arc.js's global default depth.
   */
  get: (callback?: EntityGetCallback<TDest>, requiredDepth?: number) => Promise<Array<TDest>>;
  /**
   * Watch for `TDest`s from Web3, given the filter supplied to the EntityFetcherFactory.
   * The callback is invoked once per event firing.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.  Pass -1 to use the Arc.js's global default depth.
   */
  watch: (callback: EntityWatchCallback<TDest>, requiredDepth?: number) => void;
  /**
   * Watch for `TDest`s from Web3, given the filter supplied to the EntityFetcherFactory.
   * The Pub.Sub is published once per event firing.
   * `subscribe` returns the subscription on which you must remember to call `unsubscribe` when you are
   * done watching.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.  Pass -1 to use the Arc.js's global default depth.
   *
   * Supply whatever name you want for `eventName`.  This enables you to scope
   * event handlers across event types and schemes.
   */
  subscribe: (
    eventName: string,
    callback?: EntityWatchSubscriptionCallback<TDest>,
    requiredDepth?: number) => IEventSubscription;
  /**
   * Stop watching the event.
   */
  stopWatching(callback?: fnVoid): void;
  /**
   * Asynchronously stop watching the event, for environments where
   * synchronous methods are not allowed.
   */
  stopWatchingAsync(): Promise<void>;
}

export interface EventPreProcessorReturn<TEventArgs> {
  error: Error;
  log: EventCallbackArrayPayload<TEventArgs>;
}

export type PreProcessEventCallback<TEventArgs> =
  (error: Error, log: Array<DecodedLogEntryEvent<TEventArgs>>) => Promise<EventPreProcessorReturn<TEventArgs>>;

export type EventCallbackArrayPayload<TEventArgs> = Array<DecodedLogEntryEvent<TEventArgs>>;
export type EventCallbackSinglyPayload<TEventArgs> = DecodedLogEntryEvent<TEventArgs>;

export type EventWatchCallback<TEventArgs> =
  (error: Error, args: EventCallbackSinglyPayload<TEventArgs>) => void;
export type EventGetCallback<TEventArgs> =
  (error: Error, args: EventCallbackArrayPayload<TEventArgs>) => void;
export type EventWatchSubscriptionCallback<TEventArgs> =
  (eventName: string, payload: EventCallbackSinglyPayload<TEventArgs>) => void;

/**
 * Function that returns an `EventFetcher<TEventArgs>`.
 *
 * @type TEventArgs The type of the `args` object.
 */
export type EventFetcherFactory<TEventArgs> =
  (
    /**
     * Values by which you wish to filter the logs, e.g.
     * `{'valueA': 1, 'valueB': [myFirstAddress, mySecondAddress]}`.
     */
    argsFilter?: any,
    /**
     * Additional filter options.  Typically something like `{ fromBlock: 0 }`.
     * Note if you don't want Arc.js to suppress duplicate events, set `suppressDups` to false.
     */
    filterObject?: EventFetcherFilterObject,
    /**
     * Optional callback to immediately start start watching.
     * Without this you will call `get` or `watch`.
     */
    callback?: EventWatchCallback<TEventArgs>,
    /**
     * Optional and only used when callback is supplied. If set
     * then will not invoke the callback until the transaction has been mined to the requiredDepth.
     */
    requiredDepth?: number
  ) => EventFetcher<TEventArgs>;

/**
 * Returned by EventFetcherFactory<TEventArgs>.
 * See web3 documentation article for more information about events:
 * https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events
 *
 * @type TEventArgs The type of the `args` object.
 */
export interface EventFetcher<TEventArgs> {
  /**
   * Get an array of `DecodedLogEntryEvent` from Web3, given the filter supplied to the EventFetcherFactory.
   * You may supply a callback, which will be given the array, or you may
   * accept the promise of the array from the return value of `get`.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.  Pass -1 to use the Arc.js's global default depth.
   */
  get: (
    callback?: EventGetCallback<TEventArgs>,
    requiredDepth?: number) => Promise<EventCallbackArrayPayload<TEventArgs>>;
  /**
   * Watch for `DecodedLogEntryEvent`s from Web3, given the filter supplied to the EventFetcherFactory.
   * The callback is invoked once per event firing.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.  Pass -1 to use the Arc.js's global default depth.
   */
  watch: (callback: EventWatchCallback<TEventArgs>, requiredDepth?: number) => void;
  /**
   * Watch for `DecodedLogEntryEvent`s from Web3, given the filter supplied to the EventFetcherFactory.
   * The Pub.Sub is published once per event firing.
   * `subscribe` returns the subscription on which you must remember to call `unsubscribe` when you are
   * done watching.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.  Pass -1 to use the Arc.js's global default depth.
   *
   * Supply whatever name you want for `eventName`.  This enables you to scope
   * event handlers across event types and schemes.
   */
  subscribe: (
    eventName: string,
    callback?: EventWatchSubscriptionCallback<TEventArgs>,
    requiredDepth?: number) => IEventSubscription;
  /**
   * Stop watching the event.
   */
  stopWatching(callback?: fnVoid): void;
  /**
   * Asynchronously stop watching the event, for environments where
   * synchronous methods are not allowed.
   */
  stopWatchingAsync(): Promise<void>;
}

/**
 * Function that returns an `EntityFetcher<TEntity>`.
 *
 * @type TEntity The type returns to the callback.
 */
export type FilterFetcherFactory =
  (
    /**
     * Web3 event filter options.  Typically something like `{ fromBlock: 0 }`.
     * Note if you don't want Arc.js to suppress duplicate events, set `suppressDups` to false.
     */
    filterObject?: EventFetcherFilterObject,
    /**
     * Optional callback to immediately start start watching.
     * Without this you will call `get` or `watch`.
     */
    callback?: FilterWatchCallback,
    /**
     * Optional and only used when callback is supplied. If set
     * then will not invoke the callback until the transaction has been mined to the requiredDepth.
     */
    requiredDepth?: number
  ) => FilterFetcher;

export type FilterCallbackArrayPayload = Array<FilterTransactionEventResult>;
export type FilterCallbackSinglyPayload = FilterTransactionEventResult;

export type FilterWatchCallback =
  (error: Error, args: FilterCallbackSinglyPayload) => void;
export type FilterGetCallback =
  (error: Error, args: FilterCallbackArrayPayload) => void;
export type FilterWatchSubscriptionCallback =
  (eventName: string, payload: FilterCallbackSinglyPayload) => void;

/**
 * Returned by FilterFetcherFactory.
 * See web3 documentation article for more information about events:
 * https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events
 *
 * @type TEventArgs The type of the `args` object.
 */
export interface FilterFetcher {
  /**
   * Get an array of `FilterTransactionResult` from Web3, given the filter supplied to the FilterFetcherFactory.
   * You may supply a callback, which will be given the array, or you may
   * accept the promise of the array from the return value of `get`.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.  Pass -1 to use the Arc.js's global default depth.
   */
  get: (
    callback?: FilterGetCallback,
    requiredDepth?: number) => Promise<FilterCallbackArrayPayload>;
  /**
   * Watch for `FilterTransactionResult`s from Web3, given the filter supplied to the FilterFetcherFactory.
   * The callback is invoked once per event firing.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.  Pass -1 to use the Arc.js's global default depth.
   */
  watch: (callback: FilterWatchCallback, requiredDepth?: number) => void;
  /**
   * Watch for `FilterTransactionResult`s from Web3, given the filter supplied to the FilterFetcherFactory.
   * The Pub.Sub is published once per event firing.
   * `subscribe` returns the subscription on which you must remember to call `unsubscribe` when you are
   * done watching.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.  Pass -1 to use the Arc.js's global default depth.
   *
   * Supply whatever name you want for `eventName`.  This enables you to scope
   * event handlers across event types and schemes.
   */
  subscribe: (
    eventName: string,
    callback?: FilterWatchSubscriptionCallback,
    requiredDepth?: number) => IEventSubscription;
  /**
   * Stop watching the event.
   */
  stopWatching(callback?: fnVoid): void;
  /**
   * Asynchronously stop watching the event, for environments where
   * synchronous methods are not allowed.
   */
  stopWatchingAsync(): Promise<void>;
}

/**
 * Options supplied to `EventFetcherFactory` and thence to `get and `watch`.
 */
export interface EventFetcherFilterObject {
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: string;
  topics?: Array<LogTopic>;
  /**
   * true to suppress duplicate events (see https://github.com/ethereum/web3.js/issues/398).
   * The default is true.
   */
  suppressDups?: boolean;
}

export class Web3EventSubscription<TEventArgs> implements IEventSubscription {
  constructor(
    private subscription: IEventSubscription,
    private fetcher: Web3Watcher) { }

  /**
   * Unsubscribe from all of the events
   * @param milliseconds number of milliseconds to timeout.
   * Default is -1 which means not to timeout at all.
   */
  public unsubscribe(milliseconds: number = -1): Promise<void> {
    return new Promise((resolve: fnVoid): Promise<void> => {
      return UtilsInternal.stopWatchingAsync(this.fetcher)
        .then((): void => {
          this.subscription.unsubscribe.call(this.subscription, milliseconds)
            .then(() => { resolve(); });
        });
    });
  }
}

type BaseWeb3EventCallback =
  (
    error: Error,
    log: FilterEvent | Array<FilterEvent>,
    singly: boolean,
    callback?: (error: Error, args: FilterEvent | Array<FilterEvent>) => void,
    requiredDepth?: number
  ) => Promise<Array<any>>;

export interface AggregatedEventsResult {
  /**
   * The requested events, decoded
   */
  events: Map<EventToAggregate, DecodedLogEntryEvent<any>>;
  /**
   * TransactionReceipt for the transaction that generated the events
   */
  txReceipt: TransactionReceiptTruffle;
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

interface FilterEvent {
  transactionHash: Hash;
}

interface EventPreProcessorReturnInternal {
  error: Error;
  log: Array<FilterEvent>;
}

type PreProcessEventCallbackInternal =
  (error: Error, log: Array<FilterEvent>) => Promise<EventPreProcessorReturnInternal>;

type IFetcherFactory =
  (
    argsFilter?: any,
    filterObject?: EventFetcherFilterObject,
    callback?: EventWatchCallback<any> | FilterWatchCallback,
    requiredDepth?: number
  ) => IFetcher;

interface IFetcher {
  get: (
    callback?: EventGetCallback<any> | FilterGetCallback,
    requiredDepth?: number) => Promise<EventGetCallback<any> | FilterGetCallback>;
  watch: (callback: EventWatchCallback<any> | FilterWatchCallback, requiredDepth?: number) => void;
  subscribe: (
    eventName: string,
    callback?: EventWatchSubscriptionCallback<any> | FilterWatchSubscriptionCallback,
    requiredDepth?: number) => IEventSubscription;
  stopWatching(callback?: fnVoid): void;
  stopWatchingAsync(): Promise<void>;
}
