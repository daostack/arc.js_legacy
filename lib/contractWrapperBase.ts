import { DecodedLogEntryEvent, FilterObject as FilterObjectWeb3, TransactionReceipt } from "web3";
import { AvatarService } from "./avatarService";
import { Address, Hash, SchemePermissions } from "./commonTypes";
import { ContractWrapperFactory } from "./contractWrapperFactory";
import { LoggingService } from "./loggingService";
import { TransactionService } from "./transactionService";
import { Utils } from "./utils";
/**
 * Abstract base class for all Arc contract wrapper classes
 *
 * Example of how to define a wrapper:
 *
 * ```
 * import { ContractWrapperBase } from "../contractWrapperBase";
 * import { ContractWrapperFactory } from "../contractWrapperFactory";
 *
 * export class AbsoluteVoteWrapper extends ContractWrapperBase {
 *   [ wrapper properties and methods ]
 * }
 *
 * export const AbsoluteVote = new ContractWrapperFactory("AbsoluteVote", AbsoluteVoteWrapper);
 * ```
 */
export abstract class ContractWrapperBase {

  /**
   * The wrapper factor class providing static methods `at(someAddress)`, `new()` and `deployed()`.
   */
  public abstract factory: ContractWrapperFactory<any>;
  /**
   * The name of the contract.
   */
  public abstract name: string;
  /**
   * A more friendly name for the contract.
   */
  public abstract friendlyName: string;
  /**
   * The address of the contract
   */
  public get address(): Address { return this.contract.address; }
  /**
   * The underlying truffle contract object.  Use this to access
   * parts of the contract that aren't accessible via the wrapper.
   */
  public contract: any;

  /**
   * ContractWrapperFactory constructs this
   * @param solidityContract The json contract truffle artifact
   */
  constructor(private solidityContract: any) {
  }

  /**
   * Initialize from a newly-migrated instance.
   * This will migrate a new instance of the contract to the net.
   * @returns this
   */
  public async hydrateFromNew(...rest: Array<any>): Promise<any> {
    try {
      this.contract = await this.solidityContract.new(...rest)
        .then((contract: any) => contract, (error: any) => { throw error; });
    } catch (ex) {
      LoggingService.error(`hydrateFromNew failing: ${ex}`);
      return undefined;
    }
    return this;
  }

  /**
   * Initialize from a given address on the current network.
   * @param address of the deployed contract
   * @returns this
   */
  public async hydrateFromAt(address: string): Promise<any> {
    try {
      this.contract = await this.solidityContract.at(address)
        .then((contract: any) => contract, (error: any) => { throw error; });
    } catch (ex) {
      LoggingService.error(`hydrateFromAt failing: ${ex}`);
      return undefined;
    }
    return this;
  }

  /**
   * Initialize as it was migrated by Arc.js on the current network.
   * @returns this
   */
  public async hydrateFromDeployed(): Promise<any> {
    try {
      this.contract = await this.solidityContract.deployed()
        .then((contract: any) => contract, (error: any) => { throw error; });
    } catch (ex) {
      LoggingService.error(`hydrateFromDeployed failing: ${ex}`);
      return undefined;
    }
    return this;
  }

  /**
   * Call setParameters on this.contract.
   * Returns promise of ArcTransactionDataResult<Hash> where Result is the parameters hash.
   *
   * @param {any} params -- parameters as the contract.setParameters function expects them.
   */
  public async setParameters(...params: Array<any>): Promise<ArcTransactionDataResult<Hash>> {
    throw new Error("setParameters has not been not implemented by the contract wrapper");
  }

  /**
   * Given a hash, returns the associated parameters as an object.
   * @param paramsHash
   */
  public async getParameters(paramsHash: Hash): Promise<any> {
    throw new Error("getParameters has not been not implemented by the contract wrapper");
  }

  /**
   * Given an avatar address, returns the schemes parameters hash
   * @param avatarAddress
   */
  public async getSchemeParametersHash(avatarAddress: Address): Promise<Hash> {
    const controller = await this.getController(avatarAddress);
    return controller.getSchemeParameters(this.address, avatarAddress);
  }

  /**
   * Given a hash, returns the associated parameters as an array, ordered by the order
   * in which the parameters appear in the contract's Parameters struct.
   * @param paramsHash
   */
  public async getParametersArray(paramsHash: Hash): Promise<Array<any>> {
    return this.contract.parameters(paramsHash);
  }

  /**
   * Returns the controller associated with the given avatar
   * @param avatarAddress
   */
  public async getController(avatarAddress: Address): Promise<any> {
    const avatarService = new AvatarService(avatarAddress);
    return avatarService.getController();
  }

  protected async _setParameters(functionName: string, ...params: Array<any>): Promise<ArcTransactionDataResult<Hash>> {

    const parametersHash: Hash = await this.contract.getParametersHash(...params);
    const eventTopic = "txReceipts.ContractWrapperBase.setParameters";

    const txReceiptEventPayload = TransactionService.publishKickoffEvent(eventTopic, params, 1);

    const txResult = await this.wrapTransactionInvocation(functionName,
      // typically this is supposed to be an object, but here it is an array
      params,
      () => {
        return this.contract.setParameters(...params);
      });

    TransactionService.publishTxEvent(eventTopic, txReceiptEventPayload, txResult.tx);

    return new ArcTransactionDataResult<Hash>(txResult.tx, parametersHash);
  }

  /**
   * Returns this scheme's permissions.
   * @param avatarAddress
   */
  protected async _getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions> {
    const permissions = (await this.getController(avatarAddress))
      .getSchemePermissions(this.address, avatarAddress) as string;

    return SchemePermissions.fromString(permissions);
  }

  protected async _getSchemeParameters(avatarAddress: Address): Promise<any> {
    const paramsHash = await this.getSchemeParametersHash(avatarAddress);
    return this.getParameters(paramsHash);
  }

  /**
   * Returns a function that creates an EventFetcher<TArgs>.
   * For subclasses to use to create their event handlers.
   * This is identical to what you get with Truffle, except that
   * the result param of the callback is always guaranteed to be an array.
   *
   * Example:
   *
   *    public NewProposal = this.eventWrapperFactory<NewProposalEventResult>("NewProposal");
   *    const event = NewProposal(...);
   *    event.get(...).
   *
   * @type TArgs - name of the event args (EventResult) interface, like NewProposalEventResult
   * @param eventName - Name of the event like "NewProposal"
   */
  protected createEventFetcherFactory<TArgs>(eventName: string): EventFetcherFactory<TArgs> {

    const that = this;

    /**
     * This is the function that returns the EventFetcher<TArgs>
     * @param argFilter
     * @param filterObject
     * @param callback
     */
    const eventFetcherFactory: EventFetcherFactory<TArgs> = (
      argFilter: any,
      filterObject: FilterObject,
      rootCallback?: EventCallback<TArgs>
    ): EventFetcher<TArgs> => {

      let baseEvent: EventFetcher<TArgs>;
      let receivedEvents: Set<Hash>;

      if (!!filterObject.suppressDups) {
        receivedEvents = new Set<Hash>();
      }

      const handleEvent = (
        error: any,
        log: DecodedLogEntryEvent<TArgs> | Array<DecodedLogEntryEvent<TArgs>>,
        callback?: EventCallback<TArgs>): void => {

        /**
         * always provide an array
         */
        if (!!error) {
          log = [];
        } else if (!Array.isArray(log)) {
          log = [log];
        }

        /**
         * optionally prune duplicate events (see https://github.com/ethereum/web3.js/issues/398)
         */
        if (receivedEvents && log.length) {
          log = log.filter((evt: DecodedLogEntryEvent<TArgs>) => {
            if (!receivedEvents.has(evt.transactionHash)) {
              receivedEvents.add(evt.transactionHash);
              return true;
            } else {
              return false;
            }
          });
        }
        callback(error, log);
      };

      const eventFetcher: EventFetcher<TArgs> = {

        get(callback?: EventCallback<TArgs>): void {
          baseEvent.get((error: any, log: DecodedLogEntryEvent<TArgs> | Array<DecodedLogEntryEvent<TArgs>>) => {
            handleEvent(error, log, callback);
          });
        },

        watch(callback?: EventCallback<TArgs>): void {
          baseEvent.watch((error: any, log: DecodedLogEntryEvent<TArgs> | Array<DecodedLogEntryEvent<TArgs>>) => {
            handleEvent(error, log, callback);
          });
        },

        stopWatching(): void {
          baseEvent.stopWatching();
        },
      };
      /**
       * if callback is set then this will start watching immediately,
       * otherwise caller must use `get` and `watch`
       */
      const wrapperRootCallback: EventCallback<TArgs> | undefined = rootCallback ?
        (error: any, log: DecodedLogEntryEvent<TArgs> | Array<DecodedLogEntryEvent<TArgs>>): void => {
          if (!!error) {
            log = [];
          } else if (!Array.isArray(log)) {
            log = [log];
          }
          rootCallback(error, log);
        } : undefined;

      baseEvent = that.contract[eventName](argFilter, filterObject, wrapperRootCallback);

      return eventFetcher;
    };

    return eventFetcherFactory;
  }

  protected validateStandardSchemeParams(params: StandardSchemeParams): void {
    if (!params.voteParametersHash) {
      throw new Error(`voteParametersHash is not defined`);
    }
    if (!params.votingMachineAddress) {
      throw new Error(`votingMachineAddress is not defined`);
    }
  }

  /**
   * Wrap code that creates a transaction in the given transaction event. This is a helper
   * just for the common case of generating a single transaction.
   * @param functionName Should look like [contractName].[functionName]
   * @param options Options that will be passed to the contract function being invoked
   * @param generateTx Callback that will invoke the contract function
   */
  protected async wrapTransactionInvocation(
    functionName: string,
    options: any,
    generateTx: () => Promise<TransactionReceiptTruffle>): Promise<ArcTransactionResult> {

    const topic = `txReceipts.${functionName}`;

    const txReceiptEventPayload = TransactionService.publishKickoffEvent(topic, options, 1);

    const tx = await generateTx();

    TransactionService.publishTxEvent(topic, txReceiptEventPayload, tx);

    return new ArcTransactionResult(tx);
  }

  protected logContractFunctionCall(functionName: string, params?: any): void {
    LoggingService.debug(`calling ${functionName}${params ? ` with: ${LoggingService.stringifyObject(params)}` : ""}`);
  }
}

/**
 * The bundle of logs, TransactionReceipt and other information as returned by Truffle after invoking
 * a contract function that causes a transaction.
 */
export interface TransactionReceiptTruffle {
  logs: Array<any>;
  receipt: TransactionReceipt;
  transactionHash: Hash;
  /**
   * address of the transaction
   */
  tx: Address;
}

export class ArcTransactionResult {

  /**
   * the transaction result to be returned
   */
  public tx: TransactionReceiptTruffle;

  constructor(tx: TransactionReceiptTruffle) {
    this.tx = tx;
  }

  /**
   * Returns a value from the transaction logs.
   * @param valueName - The name of the property whose value we wish to return
   * @param eventName - Name of the event in whose log we are to look for the value
   * @param index - Index of the log in which to look for the value, when eventName is not given.
   * Default is the index of the last log in the transaction.
   */
  public getValueFromTx(valueName: string, eventName: string = null, index: number = 0): any | undefined {
    return Utils.getValueFromLogs(this.tx, valueName, eventName, index);
  }
}
/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction and initiate a proposal.
 */
export class ArcTransactionProposalResult extends ArcTransactionResult {

  /**
   * unique hash identifying a proposal
   */
  public proposalId: string;

  constructor(tx: TransactionReceiptTruffle) {
    super(tx);
    this.proposalId = Utils.getValueFromLogs(tx, "_proposalId");
  }
}
/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction and any other result.
 */
export class ArcTransactionDataResult<TData> extends ArcTransactionResult {
  /**
   * The data result to be returned
   */
  public result: TData;

  constructor(tx: TransactionReceiptTruffle, result: TData) {
    super(tx);
    this.result = result;
  }
}

export type EventCallback<TArgs> =
  (
    err: Error,
    log: Array<DecodedLogEntryEvent<TArgs>>
  ) => void;

/**
 * The generic type of every handler function that returns an event.  See this
 * web3 documentation article for more information:
 * https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events
 *
 * argsFilter - contains the return values by which you want to filter the logs, e.g.
 * {'valueA': 1, 'valueB': [myFirstAddress, mySecondAddress]}
 * By default all filter  values are set to null which means that they will match
 * any event of given type sent from this contract.  Default is {}.
 *
 * filterObject - Additional filter options.  Typically something like { from: "latest" }.
 * Note if you don't want Arc.js to suppress duplicate events, set `suppressDups` to false.
 *
 * callback - (optional) If you pass a callback it will immediately
 * start watching.  Otherwise you will need to call .get or .watch.
 */
export type EventFetcherFactory<TArgs> =
  (
    argFilter: any,
    filterObject: FilterObject,
    callback?: EventCallback<TArgs>
  ) => EventFetcher<TArgs>;

export type EventFetcherHandler<TArgs> =
  (
    callback: EventCallback<TArgs>
  ) => void;

/**
 * returned by EventFetcherFactory<TArgs> which is created by eventWrapperFactory.
 */
export interface EventFetcher<TArgs> {
  get: EventFetcherHandler<TArgs>;
  watch: EventFetcherHandler<TArgs>;
  stopWatching(): void;
}

export type LogTopic = null | string | Array<string>;

/**
 * Options supplied to `EventFetcherFactory` and thence to `get and `watch`.
 */
export interface FilterObject extends FilterObjectWeb3 {
  /**
   * true to suppress duplicate events (see https://github.com/ethereum/web3.js/issues/398).
   * The default is true.
   */
  suppressDups?: boolean;
}

/**
 * Common scheme parameters for schemes that are able to create proposals.
 */
export interface StandardSchemeParams {
  /**
   * Hash of the voting machine parameters to use when voting on a proposal.
   */
  voteParametersHash: Hash;
  /**
   * Address of the voting machine to use when voting on a proposal.
   */
  votingMachineAddress: Address;
}

export { DecodedLogEntryEvent, TransactionReceipt } from "web3";
