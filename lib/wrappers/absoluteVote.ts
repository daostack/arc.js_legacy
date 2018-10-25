"use strict";
import { Address, Hash } from "../commonTypes";

import { ContractWrapperFactory } from "../contractWrapperFactory";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  DecodedLogEntryEvent,
  IContractWrapperFactory,
  IVotingMachineWrapper
} from "../iContractWrapperBase";
import { ProposalService, VotableProposal } from "../proposalService";
import { TransactionService, TxGeneratingFunctionOptions } from "../transactionService";
import { EntityFetcherFactory, EventFetcherFactory, Web3EventService } from "../web3EventService";
import {
  NewProposalEventResult,
  OwnerVoteOptions,
  ProposalIdOption,
  ProposeOptions,
  VoteOptions,
  VoteWithSpecifiedAmountsOptions
} from "./iIntVoteInterface";

import { BigNumber } from "../utils";
import { IntVoteInterfaceWrapper } from "./intVoteInterface";

export class AbsoluteVoteWrapper extends IntVoteInterfaceWrapper
  implements IVotingMachineWrapper {

  public name: string = "AbsoluteVote";
  public friendlyName: string = "Absolute Vote";
  public factory: IContractWrapperFactory<AbsoluteVoteWrapper> = AbsoluteVoteFactory;

  /**
   * Events
   */
  public AVVoteProposal: EventFetcherFactory<AVVoteProposalEventResult>;
  public RefreshReputation: EventFetcherFactory<RefreshReputationEventResult>;

  /**
   * EntityFetcherFactory for votable proposals.
   * @param avatarAddress
   */
  public get VotableAbsoluteVoteProposals():
    EntityFetcherFactory<VotableProposal, NewProposalEventResult> {

    const proposalService = new ProposalService(this.web3EventService);

    return proposalService.getProposalEvents({
      proposalsEventFetcher: this.NewProposal,
      transformEventCallback: async (event: DecodedLogEntryEvent<NewProposalEventResult>): Promise<VotableProposal> => {
        return {
          avatarAddress: event.args._organization,
          numOfChoices: event.args._numOfChoices.toNumber(),
          paramsHash: event.args._paramsHash,
          proposalId: event.args._proposalId,
          proposerAddress: event.args._proposer,
        };
      },
      votableOnly: true,
      votingMachine: this,
    });
  }

  public getParametersHash(params: AbsoluteVoteParams): Promise<Hash> {
    params = Object.assign({},
      {
        ownerVote: true,
        votePerc: 50,
      },
      params);

    return this._getParametersHash(
      params.votePerc,
      params.ownerVote);
  }

  public setParameters(
    params: AbsoluteVoteParams & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionDataResult<Hash>> {

    params = Object.assign({},
      {
        ownerVote: true,
        votePerc: 50,
      },
      params);

    return super._setParameters(
      "AbsoluteVote.setParameters",
      params.txEventContext,
      params.votePerc,
      params.ownerVote
    );
  }

  public async getParameters(paramsHash: Hash): Promise<AbsoluteVoteParamsResult> {
    const params = await this.getParametersArray(paramsHash);
    return {
      ownerVote: params[1],
      votePerc: params[0].toNumber(),
    };
  }

  public async propose(options: ProposeOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionProposalResult> {
    const functionName = "AbsoluteVote.propose";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.propose(Object.assign(options, { txEventContext: eventContext }));
  }

  public async vote(options: VoteOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.vote";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.vote(Object.assign(options, { txEventContext: eventContext }));
  }

  public async voteWithSpecifiedAmounts(
    options: VoteWithSpecifiedAmountsOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.voteWithSpecifiedAmounts";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.voteWithSpecifiedAmounts(Object.assign(options, { txEventContext: eventContext }));
  }
  public async execute(options: ProposalIdOption & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.execute";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.execute(Object.assign(options, { txEventContext: eventContext }));
  }
  public async cancelProposal(options: ProposalIdOption & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.execute";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.cancelProposal(Object.assign(options, { txEventContext: eventContext }));
  }
  public async ownerVote(options: OwnerVoteOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.execute";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.ownerVote(Object.assign(options, { txEventContext: eventContext }));
  }
  public async cancelVote(options: ProposalIdOption & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "AbsoluteVote.execute";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.cancelVote(Object.assign(options, { txEventContext: eventContext }));
  }

  protected hydrated(): void {
    super.hydrated();
    /* tslint:disable:max-line-length */
    this.AVVoteProposal = this.createEventFetcherFactory<AVVoteProposalEventResult>(this.contract.events.AVVoteProposal);
    this.RefreshReputation = this.createEventFetcherFactory<RefreshReputationEventResult>(this.contract.events.RefreshReputation);
    /* tslint:enable:max-line-length */
  }
}

export const AbsoluteVoteFactory =
  new ContractWrapperFactory("AbsoluteVote", AbsoluteVoteWrapper, new Web3EventService());

export interface AbsoluteVoteParams {
  ownerVote?: boolean;
  votePerc?: number;
}

export interface AbsoluteVoteParamsResult {
  ownerVote: boolean;
  votePerc: number;
}

export interface AVVoteProposalEventResult {
  /**
   * indexed
   */
  _proposalId: Hash;
  _isOwnerVote: boolean;
}

export interface RefreshReputationEventResult {
  /**
   * indexed
   */
  _proposalId: Hash;
  /**
   * indexed
   */
  _organization: Address;
  /**
   * indexed
   */
  _voter: Address;

  _reputation: BigNumber;
}
