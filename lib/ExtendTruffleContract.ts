import Utils from "./utils";
import Config from "./config";
/**
 * Abstract base class for all Arc contract wrapper classes
 *
 * Example of how to define a sub class:
 *
 *  export class AbsoluteVote extends ExtendTruffleContract(SolidityAbsoluteVote) {}
 *
 * @param {any} superclass -- TruffleContract
 */
export const ExtendTruffleContract = superclass =>
  class {

    /**
     * The underlying truffle contract object
     */
    public contract: any;

    constructor(contract) {
      // Make sure this contract is configured with the web3 provider and default config values
      superclass.setProvider(Utils.getWeb3().currentProvider);
      superclass.defaults({
        from: Utils.getDefaultAccount(), // Use web3.eth.defaultAccount as the from account for all transactions
        gas: Config.get("gasLimit")
      });
      this.contract = contract;
      for (const i in this.contract) {
        if (this[i] === undefined) {
          this[i] = this.contract[i];
        }
      }
    }

    /**
     * Instantiate the class.  This will migrate a new instance of the contract to the net.
     */
    public static async new() {
      return superclass.new().then(
        contract => {
          return new this(contract);
        },
        ex => {
          throw ex;
        }
      );
    }

    /**
     * Instantiate the class as it was migrated to the given address on
     * the current network.
     * @param address 
     */
    public static async at(address) {
      return superclass.at(address).then(
        contract => {
          return new this(contract);
        },
        ex => {
          throw ex;
        }
      );
    }

    /**
     * Instantiate the class as it was migrated by Arc.js on the given network.
     */
    public static async deployed() {
      return superclass.deployed().then(
        contract => {
          return new this(contract);
        },
        ex => {
          throw ex;
        }
      );
    }

    /**
     * Call setParameters on this contract.
     * Returns promise of ArcTransactionDataResult where Result is the parameters hash.
     * 
     * @param {any} params -- object with properties whose names are expected by the scheme to correspond to parameters.
     * Currently all params are required, contract wrappers do not as yet apply default values.
     */
    public async setParams(...args) {
      const parametersHash = await this.contract.getParametersHash(...args);
      const tx = await this.contract.setParameters(...args);
      return new ArcTransactionDataResult(tx, parametersHash);
    }

    /**
     * The subclass must override this for there to be any permissions at all, unless caller provides a value.
     */
    protected getDefaultPermissions(overrideValue) {
      return overrideValue || "0x00000000";
    }
  };

/**
 * A log as bundled in a TransactionReceipt
 */
export interface TransactionLog {
  address: string;
  blockHash: string;
  blockNumber: number;
  data: string;
  logIndex: number;
  topics: Array<string>;
  transactionHash: string;
  transactionIndex: number;
  type: string;
}

export interface TransactionLogTruffle {
  address: string;
  args: any;
  blockHash: string;
  blockNumber: number;
  event: string;
  logIndex: number;
  transactionHash: string;
  transactionIndex: number;
  type: string;
}

/**
 * TransactionReceipt as bundled in TransactionReceiptTruffle
 */
export interface TransactionReceipt {
  /**
   * hash of the block where this transaction was in.
   */
  blockHash: string;
  /**
   * block number where this transaction was in.
   */
  blockNumber: number;
  /**
   * hash of the transaction.
   */
  transactionHash: string;
  /**
   * transactions index position in the block.
   */
  transactionIndex: number;
  /**
   * address of the sender.
   */
  from: string;
  /**
   * address of the receiver. null when its a contract creation transaction.
   */
  to: string;
  /**
   * The total amount of gas used when this transaction was executed in the block.
   */
  cumulativeGasUsed: number;
  /**
   * The amount of gas used by this specific transaction alone.
   */
  gasUsed: number;
  /**
   * The contract address created, if the transaction was a contract creation, otherwise null.
   */
  contractAddress: string;
  /**
   * Array of log objects, which this transaction generated.
   */
  logs: Array<TransactionLog>;
}

/**
 * The bundle of logs, TransactionReceipt and other information as returned by Truffle after invoking
 * a contract function that causes a transaction.
 */
export interface TransactionReceiptTruffle {
  transactionHash: string;
  logs: Array<TransactionLogTruffle>;
  receipt: TransactionReceipt;
  /**
   * address of the transaction
   */
  tx: string;
}

export class ArcTransactionResult {

  /**
   * the transaction result to be returned
   */
  public tx: TransactionReceiptTruffle;

  constructor(tx) {
    this.tx = tx;
  }

  /**
   * Return a value from the transaction logs.
   * @param valueName - The name of the property whose value we wish to return
   * @param eventName - Name of the event in whose log we are to look for the value
   * @param index - Index of the log in which to look for the value, when eventName is not given.
   * Default is the index of the last log in the transaction.
   */
  public getValueFromTx(valueName, eventName = null, index = 0): string {
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

  constructor(tx) {
    super(tx);
    this.proposalId = Utils.getValueFromLogs(tx, "_proposalId");
  }
}
/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction and any other result.
 */
export class ArcTransactionDataResult extends ArcTransactionResult {
  /**
   * The data result to be returned
   */
  public result: any;

  constructor(tx, result) {
    super(tx);
    this.result = result;
  }
}
