"use strict";
const dopts = require("default-options");

import { Utils } from "../utils";
import { ExtendTruffleContract, ArcTransactionProposalReturnType } from "../ExtendTruffleContract";

const SolidityGlobalConstraintRegistrar = Utils.requireContract(
  "GlobalConstraintRegistrar"
);

export class GlobalConstraintRegistrar extends ExtendTruffleContract(
  SolidityGlobalConstraintRegistrar
) {
  static async new() {
    const contract = await SolidityGlobalConstraintRegistrar.new();
    return new this(contract);
  }

  async proposeToAddModifyGlobalConstraint(opts = {}) {
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       *  the address of the global constraint to add
       */
      globalConstraint: undefined,
      /**
       * hash of the parameters of the global contraint
       */
      globalConstraintParametersHash: undefined,
      /**
       * voting machine to use when voting to remove the global constraint
       */
      votingMachineHash: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.globalConstraint) {
      throw new Error("avatar globalConstraint is not defined");
    }

    if (!options.globalConstraintParametersHash) {
      throw new Error("avatar globalConstraintParametersHash is not defined");
    }

    if (!options.votingMachineHash) {
      throw new Error("avatar votingMachineHash is not defined");
    }
    // console.log(`****** avatar ${options.avatar} ******`);
    // console.log(`****** globalConstraint ${options.globalConstraint} ******`);
    // console.log(`****** globalConstraintParametersHash ${options.globalConstraintParametersHash} ******`);
    // console.log(`****** votingMachineHash ${options.votingMachineHash} ******`);

    const tx = await this.contract.proposeGlobalConstraint(
      options.avatar,
      options.globalConstraint,
      options.globalConstraintParametersHash,
      options.votingMachineHash
    );

    return new ArcTransactionProposalReturnType(tx);
  }

  async proposeToRemoveGlobalConstraint(opts = {}) {
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       *  the address of the global constraint to remove
       */
      globalConstraint: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.globalConstraint) {
      throw new Error("avatar globalConstraint is not defined");
    }

    const tx = await this.contract.proposeToRemoveGC(
      options.avatar,
      options.globalConstraint
    );

    return new ArcTransactionProposalReturnType(tx);
  }

  async setParams(params) {
    return await this._setParameters(
      params.voteParametersHash,
      params.votingMachine
    );
  }

  getDefaultPermissions(overrideValue) {
    return overrideValue || "0x00000007";
  }
}
