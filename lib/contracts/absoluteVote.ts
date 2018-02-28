"use strict";
import dopts = require("default-options");

import {
  Address,
  ArcTransactionResult,
  ExtendTruffleContract,
  Hash,
} from "../ExtendTruffleContract";
import { Utils } from "../utils";
const SolidityContract = Utils.requireContract("AbsoluteVote");
import ContractWrapperFactory from "../ContractWrapperFactory";
import { ExecuteProposalEventResult, NewProposalEventResult, VoteProposalEventResult } from "./commonEventInterfaces";

export class AbsoluteVoteWrapper extends ExtendTruffleContract {

  /**
   * Events
   */

  public NewProposal = this.createEventFetcherFactory<NewProposalEventResult>("NewProposal");
  public CancelProposal = this.createEventFetcherFactory<CancelProposalEventResult>("CancelProposal");
  public ExecuteProposal = this.createEventFetcherFactory<ExecuteProposalEventResult>("ExecuteProposal");
  public VoteProposal = this.createEventFetcherFactory<VoteProposalEventResult>("VoteProposal");
  public CancelVoting = this.createEventFetcherFactory<CancelVotingEventResult>("CancelVoting");

  /**
   * Vote on a proposal
   * @param {VoteConfig} opts
   * @returns Promise<ArcTransactionResult>
   */
  public async vote(opts = {}) {

    const defaults = {
      onBehalfOf: null,
      proposalId: undefined,
      vote: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!Number.isInteger(options.vote) || (options.vote < 0) || (options.vote > 2)) {
      throw new Error("vote is not valid");
    }

    const tx = await this.contract.vote(
      options.proposalId,
      options.vote,
      options.onBehalfOf ? { from: options.onBehalfOf } : undefined
    );

    return new ArcTransactionResult(tx);
  }

  public async setParams(params) {

    params = Object.assign({},
      {
        ownerVote: true,
        votePerc: 50,
      },
      params);

    if (!params.reputation) {
      throw new Error("reputation must be set");
    }

    return super.setParams(
      params.reputation,
      params.votePerc,
      params.ownerVote
    );
  }
}

const AbsoluteVote = new ContractWrapperFactory(SolidityContract, AbsoluteVoteWrapper);
export { AbsoluteVote };

export interface CancelProposalEventResult {
  /**
   * indexed
   */
  _proposalId: Hash;
}

export interface CancelVotingEventResult {
  /**
   * indexed
   */
  _proposalId: Hash;
  _voter: Address;
}
