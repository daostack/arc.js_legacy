"use strict";
import { Address, Hash, VoteConfig } from "../commonTypes";

import {
  ArcTransactionDataResult,
  ArcTransactionResult,
  ContractWrapperBase,
  EventFetcherFactory
} from "../contractWrapperBase";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ExecuteProposalEventResult, NewProposalEventResult, VoteProposalEventResult } from "./commonEventInterfaces";

export class AbsoluteVoteWrapper extends ContractWrapperBase {

  public name: string = "AbsoluteVote";
  public friendlyName: string = "Absolute Vote";
  public factory: ContractWrapperFactory<AbsoluteVoteWrapper> = AbsoluteVoteFactory;

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
   * @param {VoteConfig} options
   * @returns Promise<ArcTransactionResult>
   */
  public async vote(options: VoteConfig = {} as VoteConfig): Promise<ArcTransactionResult> {

    const defaults = {
      onBehalfOf: null,
    };

    options = Object.assign({}, defaults, options) as VoteConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!Number.isInteger(options.vote) || (options.vote < 0) || (options.vote > 2)) {
      throw new Error("vote is not valid");
    }

    const txResult = await this.wrapTransactionInvocation("txReceipts.AbsoluteVoteWrapper.vote",
      options,
      () => {
        return this.contract.vote(
          options.proposalId,
          options.vote,
          options.onBehalfOf ? { from: options.onBehalfOf } : undefined
        );
      });

    return txResult;
  }

  public async setParameters(params: AbsoluteVoteParams): Promise<ArcTransactionDataResult<Hash>> {

    params = Object.assign({},
      {
        ownerVote: true,
        votePerc: 50,
      },
      params);

    if (!params.reputation) {
      throw new Error("reputation must be set");
    }

    return super.setParameters(
      params.reputation,
      params.votePerc,
      params.ownerVote
    );
  }

  public async getParameters(paramsHash: Hash): Promise<AbsoluteVoteParamsResult> {
    const params = await this.getParametersArray(paramsHash);
    return {
      ownerVote: params[2],
      reputation: params[0],
      votePerc: params[1].toNumber(),
    };
  }
}

export const AbsoluteVoteFactory = new ContractWrapperFactory("AbsoluteVote", AbsoluteVoteWrapper);

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

export interface AbsoluteVoteParamsResult {
  ownerVote: boolean;
  reputation: string;
  votePerc: number;
}
