"use strict";
const dopts = require("default-options");

import { ExtendTruffleContract, ArcTransactionProposalResult } from "../ExtendTruffleContract";
import { Utils } from "../utils";
const SolidityContract = Utils.requireContract("VoteInOrganizationScheme");

export class VoteInOrganizationScheme extends ExtendTruffleContract(SolidityContract) {
  static async new() {
    const contract = await SolidityContract.new();
    return new this(contract);
  }

  async proposeVote(opts = {}) {
    /**
     * see VoteInOrganizationProposeVoteConfig
     */
    const defaults = {
      avatar: undefined,
      originalIntVote: undefined,
      originalProposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    if (!options.originalIntVote) {
      throw new Error("originalIntVote is not defined");
    }

    if (!options.originalProposalId) {
      throw new Error("originalProposalId is not defined");
    }

    const tx = await this.contract.proposeVote(
      options.avatar,
      options.originalIntVote,
      options.originalProposalId,
    );

    return new ArcTransactionProposalResult(tx);
  }

  async setParams(params) {
    return super.setParams(
      params.voteParametersHash,
      params.votingMachine
    );
  }

  getDefaultPermissions(overrideValue) {
    return overrideValue || "0x00000001";
  }
}
