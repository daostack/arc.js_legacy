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
   * The underlying truffle contract object
   */
  public contract: any;

  /**
   * base classes invoke this constructor
   * @param factory - TruffleContract such as is returned by Utils.requireContract()
   */
  constructor(private solidityFactory: any) {
    // Make sure this contract is configured with the web3 provider and default config values
    solidityFactory.setProvider(Utils.getWeb3().currentProvider);
    solidityFactory.defaults({
      // Use web3.eth.defaultAccount as the from account for all transactions
      from: Utils.getDefaultAccount(),
      gas: Config.get("gasLimit"),
    });
  }

  /**
   * Hypdrate from a newly-migrated instance.
   * This will migrate a new instance of the contract to the net.
   * @returns this
   */
  public async new(...rest) {
    try {
      this.contract = await this.solidityFactory.new(...rest)
        .then((contract) => contract, (error) => { throw error; });
    } catch {
      return undefined;
    }
    this.hydrate();
    return this;
  }

  /**
   * Hydrate from a given address on the current network.
   * @param address of the deployed contract
   * @returns this
   */
  public async at(address) {
    try {
      this.contract = await this.solidityFactory.at(address)
        .then((contract) => contract, (error) => { throw error; });
    } catch {
      return undefined;
    }
    this.hydrate();
    return this;
  }

  /**
   * Hydrate as it was migrated by Arc.js on the given network.
   * @returns this
   */
  public async deployed() {
    try {
      this.contract = await this.solidityFactory.deployed()
        .then((contract) => contract, (error) => { throw error; });
    } catch {
      return undefined;
    }
    this.hydrate();
    return this;
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
  public getDefaultPermissions(overrideValue?: string) {
    return overrideValue || "0x00000000";
  }

  public get address() { return this.contract.address; }

  private hydrate() {
    for (const i in this.contract) {
      if (this[i] === undefined) {
        this[i] = this.contract[i];
      }
    }
  }

}

/**
 * A log as bundled in a TransactionReceipt
 */
export interface TransactionLog {
  address: string;
  blockHash: string;
  blockNumber: number;
  data: string;
  logIndex: number;
  topics: string[];
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
  logs: TransactionLog[];
}

/**
 * The bundle of logs, TransactionReceipt and other information as returned by Truffle after invoking
 * a contract function that causes a transaction.
 */
export interface TransactionReceiptTruffle {
  transactionHash: string;
  logs: TransactionLogTruffle[];
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
  public getValueFromTx(valueName, eventName = null, index = 0): any {
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
