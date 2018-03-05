import { Address, Hash } from "./commonTypes";
import { Config } from "./config";
import { Utils } from "./utils";
/**
 * Abstract base class for all Arc contract wrapper classes
 *
 * Example of how to define a wrapper:
 *
 *   import { ExtendTruffleContract } from "../ExtendTruffleContract";
 *   const SolidityContract = Utils.requireContract("AbsoluteVote");
 *   import ContractWrapperFactory from "../ContractWrapperFactory";
 *
 *   export class AbsoluteVoteWrapper extends ExtendTruffleContract {
 *     [ wrapper properties and methods ]
 *   }
 *
 *   const AbsoluteVote = new ContractWrapperFactory(SolidityContract, AbsoluteVoteWrapper);
 *   export { AbsoluteVote };
 */
export abstract class ExtendTruffleContract {

  /**
   * The underlying truffle contract object.  Use this to access
   * parts of the contract that aren't accessible via the wrapper.
   */
  public contract: any;

  /**
   * base classes invoke this constructor
   * @param factory - TruffleContract such as is returned by Utils.requireContract()
   */
  constructor(private solidityContract: any) {
    // Make sure this contract is configured with the web3 provider and default config values
    solidityContract.setProvider(Utils.getWeb3().currentProvider);
    solidityContract.defaults({
      // Use web3.eth.defaultAccount as the from account for all transactions
      from: Utils.getDefaultAccount(),
      gas: Config.get("gasLimit"),
    });
  }

  /**
   * Initialize from a newly-migrated instance.
   * This will migrate a new instance of the contract to the net.
   * @returns this
   */
  public async new(...rest: Array<any>): Promise<any> {
    try {
      this.contract = await this.solidityContract.new(...rest)
        .then((contract: any) => contract, (error: any) => { throw error; });
    } catch {
      return undefined;
    }
    return this;
  }

  /**
   * Initialize from a given address on the current network.
   * @param address of the deployed contract
   * @returns this
   */
  public async at(address: string): Promise<any> {
    try {
      this.contract = await this.solidityContract.at(address)
        .then((contract: any) => contract, (error: any) => { throw error; });
    } catch {
      return undefined;
    }
    return this;
  }

  /**
   * Initialize as it was migrated by Arc.js on the current network.
   * @returns this
   */
  public async deployed(): Promise<any> {
    try {
      this.contract = await this.solidityContract.deployed()
        .then((contract: any) => contract, (error: any) => { throw error; });
    } catch {
      return undefined;
    }
    return this;
  }

  /**
   * Call setParameters on this contract.
   * Returns promise of ArcTransactionDataResult<Hash> where Result is the parameters hash.
   *
   * @param {any} params -- object with properties whose names are expected by the scheme to correspond to parameters.
   * Currently all params are required, contract wrappers do not as yet apply default values.
   */
  public async setParams(...args: Array<any>): Promise<ArcTransactionDataResult<Hash>> {
    const parametersHash = await this.contract.getParametersHash(...args);
    const tx = await this.contract.setParameters(...args);
    return new ArcTransactionDataResult<Hash>(tx, parametersHash);
  }

  /**
   * The subclass must override this for there to be any permissions at all, unless caller provides a value.
   */
  public getDefaultPermissions(overrideValue?: string): string {
    return overrideValue || "0x00000000";
  }

  public get address(): Address { return this.contract.address; }

  /**
   * Return a function that creates an EventFetcher<TArgs>.
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
    const eventFetcherFactory = (
      argFilter: any,
      filterObject: FilterObject,
      rootCallback?: EventCallback<TArgs>
    ): EventFetcher<TArgs> => {

      let baseEvent: EventFetcher<TArgs>;

      const eventFetcher = {

        get(callback?: EventCallback<TArgs>): void {
          baseEvent.get((error: any, log: DecodedLogEntryEvent<TArgs> | Array<DecodedLogEntryEvent<TArgs>>) => {
            if (!Array.isArray(log)) {
              log = [log];
            }
            callback(error, log);
          });
        },

        watch(callback?: EventCallback<TArgs>): void {
          baseEvent.watch((error: any, log: DecodedLogEntryEvent<TArgs> | Array<DecodedLogEntryEvent<TArgs>>) => {
            if (!Array.isArray(log)) {
              log = [log];
            }
            callback(error, log);
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
          if (!Array.isArray(log)) {
            log = [log];
          }
          rootCallback(error, log);
        } : undefined;

      baseEvent = that.contract[eventName](argFilter, filterObject, wrapperRootCallback);

      return eventFetcher;
    };

    return eventFetcherFactory;
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
   * Return a value from the transaction logs.
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

interface TransactionReceipt {
  blockHash: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  from: string;
  to: string;
  status: null | string | 0 | 1;
  cumulativeGasUsed: number;
  gasUsed: number;
  contractAddress: string | null;
  logs: Array<LogEntry>;
}

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

export interface FilterObject {
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: string;
  topics?: Array<LogTopic>;
}

export interface LogEntry {
  logIndex: number | null;
  transactionIndex: number | null;
  transactionHash: string;
  blockHash: string | null;
  blockNumber: number | null;
  address: string;
  data: string;
  topics: Array<string>;
}

export interface LogEntryEvent extends LogEntry {
  removed: boolean;
}

export interface DecodedLogEntry<TArgs> extends LogEntryEvent {
  event: string;
  args: TArgs;
}

export interface DecodedLogEntryEvent<TArgs> extends DecodedLogEntry<TArgs> {
  removed: boolean;
}

export interface StandardSchemeParams {
  voteParametersHash: Hash;
  votingMachine: Address;
}
