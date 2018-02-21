"use strict";
import dopts = require("default-options");

import { ArcTransactionProposalResult, ExtendTruffleContract } from "../ExtendTruffleContract";
import { Utils } from "../utils";
const SolidityContract = Utils.requireContract("VoteInOrganizationScheme");
import ContractWrapperFactory from "../ContractWrapperFactory";

export class VoteInOrganizationSchemeWrapper extends ExtendTruffleContract {

  public async proposeVote(opts = {}) {
    /**
     * see VoteInOrganizationProposeVoteConfig
     */
    const defaults = {
      avatar: undefined,
      originalIntVote: undefined,
      originalProposalId: undefined,
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

  public async setParams(params) {
    return super.setParams(
      params.voteParametersHash,
      params.votingMachine,
    );
  }

  public getDefaultPermissions(overrideValue?: string) {
    return overrideValue || "0x00000001";
  }
}

const VoteInOrganizationScheme = new ContractWrapperFactory(SolidityContract, VoteInOrganizationSchemeWrapper);
export { VoteInOrganizationScheme };
