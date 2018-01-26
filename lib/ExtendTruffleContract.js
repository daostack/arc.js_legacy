import { Utils } from "./utils";
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
     * Returns promise of ArcTransactionResultReturnType where Result is the parameters hash.
     * If there are any parameters, then this function must be overridden by the subclass to provide them.
     *
     * @param {any} params -- object with properties whose names are expected by the scheme to correspond to parameters.
     * Currently all params are required, contract wrappers do not as yet apply default values.
     */
    async setParams(params) {
      params; // avoid lint error
      return { Tx: {}, Result: 0 };
    }

    /**
     * Protected method (just for use by subclasses) that sets the parameters.
     * Returns promise of ArcTransactionResultReturnType where Result is the parameters hash.
     * @param {*} args
     */
    async _setParameters(...args) {
      const parametersHash = await this.contract.getParametersHash(...args);
      const tx = await this.contract.setParameters(...args);
      return new ArcTransactionResultReturnType(tx, parametersHash);
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
export class ArcTransactionReturnType {
  constructor(tx) {
    this.tx = tx;
  }
  tx; // : TransactionReceiptTruffle;
}
/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction and initiate a proposal.
 */
export class ArcTransactionProposalReturnType extends ArcTransactionReturnType {
  constructor(tx) {
    super(tx);
    this.proposalId = Utils.getValueFromLogs(tx, "_proposalId");
  }
  proposalId; // : number;
}
/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction and any other result.
 */
export class ArcTransactionResultReturnType extends ArcTransactionReturnType {
  constructor(tx, result) {
    super(tx);
    this.result = result;
  }
  result; // : any;
}
