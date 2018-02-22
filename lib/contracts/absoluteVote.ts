"use strict";

import {
  Address,
  ExtendTruffleContract,
  Hash,
} from "../ExtendTruffleContract";
import { Utils } from "../utils";
const SolidityContract = Utils.requireContract("AbsoluteVote");
import * as BigNumber from "bignumber.js";
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
      params.ownerVote,
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
