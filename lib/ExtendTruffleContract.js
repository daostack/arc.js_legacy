import { Utils } from "./utils";
import { config } from "./config.js";
/**
 * Abstract base class for all Arc contract wrapper classes
 *
 * Example of how to define a sub class:
 *
 *  export class AbsoluteVote extends ExtendTruffleContract(SolidityAbsoluteVote) {}
 *
 * @param {TruffleContract} superclass
 */
export const ExtendTruffleContract = superclass =>
  class {
    constructor(contract) {
      // Make sure this contract is configured with the web3 provider and default config values
      superclass.setProvider(Utils.getWeb3().currentProvider);
      superclass.defaults({
        from: Utils.getDefaultAccount(), // Use web3.eth.defaultAccount as the from account for all transactions
        gas: config.get("gasLimit")
      });
      this.contract = contract;
      for (const i in this.contract) {
        if (this[i] === undefined) {
          this[i] = this.contract[i];
        }
      }
    }

    static async new() {
      return superclass.new().then(
        contract => {
          return new this(contract);
        },
        ex => {
          throw ex;
        }
      );
    }

    static async at(address) {
      return superclass.at(address).then(
        contract => {
          return new this(contract);
        },
        ex => {
          throw ex;
        }
      );
    }

    static async deployed() {
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
     * Call setParameters on this scheme.
     * Returns promise of ArcTransactionDataResult where Result is the parameters hash.
     * If there are any parameters, then this function must be overridden by the subclass to provide them.
     *
     * @param {any} params -- object with properties whose names are expected by the scheme to correspond to parameters.
     * Currently all params are required, contract wrappers do not as yet apply default values.
     */
    async setParams(...args) {
      const parametersHash = await this.contract.getParametersHash(...args);
      const tx = await this.contract.setParameters(...args);
      return new ArcTransactionDataResult(tx, parametersHash);
    }

    /**
     * The subclass must override this for there to be any permissions at all, unless caller provides a value.
     */
    getDefaultPermissions(overrideValue) {
      return overrideValue || "0x00000000";
    }
  };

/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction.
 */
export class ArcTransactionResult {
  constructor(tx) {
    this.tx = tx;
  }
  tx; // : TransactionReceiptTruffle;

  /**
   * Return a value from the transaction logs.
   * @param valueName - The name of the property whose value we wish to return
   * @param eventName - Name of the event in whose log we are to look for the value
   * @param index - Index of the log in which to look for the value, when eventName is not given.
   * Default is the index of the last log in the transaction.
   */
  getValueFromTx(valueName, eventName, index = 0) {
    return Utils.getValueFromLogs(this.tx, valueName, eventName, index);
  }
}
/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction and initiate a proposal.
 */
export class ArcTransactionProposalResult extends ArcTransactionResult {
  constructor(tx) {
    super(tx);
    this.proposalId = Utils.getValueFromLogs(tx, "_proposalId");
  }
  proposalId; // : number;
}
/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction and any other result.
 */
export class ArcTransactionDataResult extends ArcTransactionResult {
  constructor(tx, result) {
    super(tx);
    this.result = result;
  }
  result; // : any;
}
