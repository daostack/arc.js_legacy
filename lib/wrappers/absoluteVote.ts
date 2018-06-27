"use strict";
import { Hash } from "../commonTypes";

import { ContractWrapperFactory } from "../contractWrapperFactory";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  IContractWrapperFactory
} from "../iContractWrapperBase";
import { ProposalService, VotableProposal } from "../proposalService";
import { TransactionService, TxGeneratingFunctionOptions } from "../transactionService";
import { EntityFetcherFactory, EventFetcherFactory, Web3EventService } from "../web3EventService";
import {
  CancelProposalEventResult,
  CancelVotingEventResult,
  NewProposalEventResult,
  OwnerVoteOptions,
  ProposalIdOption,
  ProposeOptions,
  VoteOptions,
  VoteProposalEventResult,
  VoteWithSpecifiedAmountsOptions,
  VotingMachineExecuteProposalEventResult
} from "./iIntVoteInterface";

import { IntVoteInterfaceWrapper } from "./intVoteInterface";

export class AbsoluteVoteWrapper extends IntVoteInterfaceWrapper {

  public name: string = "AbsoluteVote";
  public friendlyName: string = "Absolute Vote";
  public factory: IContractWrapperFactory<AbsoluteVoteWrapper> = AbsoluteVoteFactory;

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
      params.txEventStack,
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

  public async propose(options: ProposeOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionProposalResult> {
    const functionName = "AbsoluteVote.propose";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.propose(Object.assign(options, { txEventStack: eventContext }));
  }

  public async vote(options: VoteOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.vote";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.vote(Object.assign(options, { txEventStack: eventContext }));
  }

  public async voteWithSpecifiedAmounts(
    options: VoteWithSpecifiedAmountsOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.voteWithSpecifiedAmounts";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.voteWithSpecifiedAmounts(Object.assign(options, { txEventStack: eventContext }));
  }
  public async execute(options: ProposalIdOption & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.execute";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.execute(Object.assign(options, { txEventStack: eventContext }));
  }
  public async cancelProposal(options: ProposalIdOption & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.execute";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.cancelProposal(Object.assign(options, { txEventStack: eventContext }));
  }
  public async ownerVote(options: OwnerVoteOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.execute";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.ownerVote(Object.assign(options, { txEventStack: eventContext }));
  }
  public async cancelVote(options: ProposalIdOption & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.execute";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.cancelVote(Object.assign(options, { txEventStack: eventContext }));
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

export interface AbsoluteVoteParams extends TxGeneratingFunctionOptions {
  ownerVote?: boolean;
  reputation: string;
  votePerc?: number;
}

export interface AbsoluteVoteParamsResult {
  ownerVote: boolean;
  reputation: string;
  votePerc: number;
}
