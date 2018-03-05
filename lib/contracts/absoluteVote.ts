"use strict";
import dopts = require("default-options");
import { Address, Hash, VoteConfig } from "../commonTypes";

import {
  ArcTransactionDataResult,
  ArcTransactionResult,
  EventFetcherFactory,
  ExtendTruffleContract
} from "../ExtendTruffleContract";
import { Utils } from "../utils";
const SolidityContract = Utils.requireContract("AbsoluteVote");
import ContractWrapperFactory from "../ContractWrapperFactory";
import { ExecuteProposalEventResult, NewProposalEventResult, VoteProposalEventResult } from "./commonEventInterfaces";

export class AbsoluteVoteWrapper extends ExtendTruffleContract {

  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public NewProposal: EventFetcherFactory<NewProposalEventResult> = this.createEventFetcherFactory<NewProposalEventResult>("NewProposal");
  public CancelProposal: EventFetcherFactory<CancelProposalEventResult> = this.createEventFetcherFactory<CancelProposalEventResult>("CancelProposal");
  public ExecuteProposal: EventFetcherFactory<ExecuteProposalEventResult> = this.createEventFetcherFactory<ExecuteProposalEventResult>("ExecuteProposal");
  public VoteProposal: EventFetcherFactory<VoteProposalEventResult> = this.createEventFetcherFactory<VoteProposalEventResult>("VoteProposal");
  public CancelVoting: EventFetcherFactory<CancelVotingEventResult> = this.createEventFetcherFactory<CancelVotingEventResult>("CancelVoting");
  /* tslint:enable:max-line-length */

  /**
   * Vote on a proposal
   * @param {VoteConfig} opts
   * @returns Promise<ArcTransactionResult>
   */
  public async vote(opts: VoteConfig = {} as VoteConfig): Promise<ArcTransactionResult> {

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

  public async setParams(params: AbsoluteVoteParams): Promise<ArcTransactionDataResult<Hash>> {

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

export interface AbsoluteVoteParams {
  ownerVote?: boolean;
  reputation: string;
  votePerc?: number;
}
