import BigNumber from "bignumber.js";
import { Address, Hash } from "../commonTypes";
import { ArcTransactionProposalResult, ArcTransactionResult } from "../contractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { EventFetcherFactory } from "../web3EventService";

/**
 * The Arc contract `IntVoteInterface`.
 */
export interface IIntVoteInterface {
  NewProposal: EventFetcherFactory<NewProposalEventResult>;
  CancelProposal: EventFetcherFactory<CancelProposalEventResult>;
  ExecuteProposal: EventFetcherFactory<VotingMachineExecuteProposalEventResult>;
  VoteProposal: EventFetcherFactory<VoteProposalEventResult>;
  CancelVoting: EventFetcherFactory<CancelVotingEventResult>;

  propose(options: ProposeOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionProposalResult>;
  cancelProposal(options: ProposalIdOption & TxGeneratingFunctionOptions): Promise<ArcTransactionResult>;
  ownerVote(options: OwnerVoteOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult>;
  vote(options: VoteOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult>;
  voteWithSpecifiedAmounts(
    options: VoteWithSpecifiedAmountsOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult>;
  cancelVote(options: ProposalIdOption & TxGeneratingFunctionOptions): Promise<ArcTransactionResult>;
  getNumberOfChoices(options: ProposalIdOption): Promise<number>;
  isVotable(options: ProposalIdOption): Promise<boolean>;
  voteStatus(options: VoteStatusOptions): Promise<BigNumber>;
  isAbstainAllow(): Promise<boolean>;
  execute(options: ProposalIdOption & TxGeneratingFunctionOptions): Promise<ArcTransactionResult>;
}

export interface ProposeOptions {
  avatarAddress: Address;
  executable: Address;
  numOfChoices: number;
  proposerAddress?: Address;
  proposalParameters?: Hash;
}

export interface OwnerVoteOptions extends ProposalIdOption {
  vote: number;
  voterAddress: Address;
}

export interface VoteOptions extends ProposalIdOption {
  vote: number;
  /**
   * Optional agent on whose behalf to vote.
   */
  onBehalfOf?: Address;
}

export interface VoteWithSpecifiedAmountsOptions extends ProposalIdOption {
  reputation: BigNumber | string;
  vote: number;
}

export interface VoteStatusOptions extends ProposalIdOption {
  vote: number;
}

export interface ProposalIdOption {
  proposalId: Hash;
}

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

export interface NewProposalEventResult {
  _numOfChoices: BigNumber;
  _paramsHash: Hash;
  /**
   * indexed
   */
  _proposalId: Hash;
  _proposer: Address;
  _avatar: Address;
}

// TODO: include _avatar?
/**
 * fired by voting machines
 */
export interface VotingMachineExecuteProposalEventResult {
  /**
   * the vote choice that won.
   */
  _decision: BigNumber;
  /**
   * indexed
   */
  _proposalId: Hash;
  /**
   * The total reputation in the DAO at the time the proposal was executed
   */
  _totalReputation: BigNumber;
}

// TODO: include _avatar?
export interface VoteProposalEventResult {
  /**
   * indexed
   */
  _proposalId: Hash;
  _reputation: BigNumber;
  /**
   * The choice of vote
   */
  _vote: number;
  /**
   * indexed
   */
  _voter: Address;
}
