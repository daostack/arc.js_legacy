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
     * Returns promise of parameters hash.
     * If there are any parameters, then this function must be overridden by the subclass to provide them.
     *
     * @param {any} params -- object with properties whose names are expected by the scheme to correspond to parameters.
     * Currently all params are required, contract wrappers do not as yet apply default values.
     */
    async setParams(params) {
      params; // avoid lint error
      return await "";
    }

    async _setParameters(...args) {
      const parametersHash = await this.contract.getParametersHash(...args);
      await this.contract.setParameters(...args);
      return parametersHash;
    }

    /**
     * The subclass must override this for there to be any permissions at all, unless caller provides a value.
     */
    getDefaultPermissions(overrideValue) {
      return overrideValue || "0x00000000";
    }
  };
