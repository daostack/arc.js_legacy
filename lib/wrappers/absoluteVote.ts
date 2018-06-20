"use strict";
import { Address, Hash } from "../commonTypes";

import {
  ArcTransactionDataResult
} from "../contractWrapperBase";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ProposalService, VotableProposal } from "../proposalService";
import { EntityFetcherFactory, EventFetcherFactory, Web3EventService } from "../web3EventService";
import {
  NewProposalEventResult,
  VoteProposalEventResult,
  VotingMachineExecuteProposalEventResult
} from "./commonEventInterfaces";
import { IntVoteInterfaceWrapper } from "./intVoteInterface";

export class AbsoluteVoteWrapper extends IntVoteInterfaceWrapper {

  public name: string = "AbsoluteVote";
  public friendlyName: string = "Absolute Vote";
  public factory: ContractWrapperFactory<AbsoluteVoteWrapper> = AbsoluteVoteFactory;

  /**
   * Events
   */

  public NewProposal: EventFetcherFactory<NewProposalEventResult>;
  public CancelProposal: EventFetcherFactory<CancelProposalEventResult>;
  public ExecuteProposal: EventFetcherFactory<VotingMachineExecuteProposalEventResult>;
  public VoteProposal: EventFetcherFactory<VoteProposalEventResult>;
  public CancelVoting: EventFetcherFactory<CancelVotingEventResult>;

  /**
   * EntityFetcherFactory for votable proposals.
   * @param avatarAddress
   */
  public get VotableAbsoluteVoteProposals():
    EntityFetcherFactory<VotableProposal, NewProposalEventResult> {

    const proposalService = new ProposalService(this.web3EventService);

    return proposalService.getProposalEvents({
      proposalsEventFetcher: this.NewProposal,
      transformEventCallback: async (args: NewProposalEventResult): Promise<VotableProposal> => {
        return {
          avatarAddress: args._avatar,
          numOfChoices: args._numOfChoices.toNumber(),
          paramsHash: args._paramsHash,
          proposalId: args._proposalId,
          proposerAddress: args._proposer,
        };
      },
      votableOnly: true,
      votingMachine: this,
    });
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

    return super._setParameters(
      "AbsoluteVote.setParameters",
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

  protected hydrated(): void {
    /* tslint:disable:max-line-length */
    this.NewProposal = this.createEventFetcherFactory<NewProposalEventResult>(this.contract.NewProposal);
    this.CancelProposal = this.createEventFetcherFactory<CancelProposalEventResult>(this.contract.CancelProposal);
    this.ExecuteProposal = this.createEventFetcherFactory<VotingMachineExecuteProposalEventResult>(this.contract.ExecuteProposal);
    this.VoteProposal = this.createEventFetcherFactory<VoteProposalEventResult>(this.contract.VoteProposal);
    this.CancelVoting = this.createEventFetcherFactory<CancelVotingEventResult>(this.contract.CancelVoting);
    /* tslint:enable:max-line-length */
  }
}

export const AbsoluteVoteFactory =
  new ContractWrapperFactory("AbsoluteVote", AbsoluteVoteWrapper, new Web3EventService());

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
