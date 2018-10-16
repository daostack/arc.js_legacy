import BigNumber from "bignumber.js";
import { Address, Hash } from "../commonTypes";
import { ArcTransactionProposalResult, ArcTransactionResult } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { EventFetcherFactory } from "../web3EventService";

/**
 * The Arc contract `IntVoteInterface`.
 */
export interface IIntVoteInterface {
  NewProposal: EventFetcherFactory<NewProposalEventResult>;
  CancelProposal: EventFetcherFactory<CancelProposalEventResult>;
  ExecuteProposal: EventFetcherFactory<ExecuteProposalEventResult>;
  VoteProposal: EventFetcherFactory<VoteProposalEventResult>;
  CancelVoting: EventFetcherFactory<CancelVotingEventResult>;

  address: Address;

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
  numOfChoices: number;
  /**
   * Typically this is the avatar address, but you can pass any address here
   * (a common use case can be the address of a contract that is functioning
   * outside the context of an avatar).
   */
  organizationAddress: Address;
  proposerAddress?: Address;
  proposalParameters: Hash;
}

export interface OwnerVoteOptions extends ProposalIdOption {
  vote: number;
  voterAddress: Address;
}

export interface VoteOptions extends ProposalIdOption {
  vote: number;
  voterAddress?: Address;
}

export interface VoteWithSpecifiedAmountsOptions extends ProposalIdOption {
  reputation: BigNumber | string;
  vote: number;
  voterAddress?: Address;
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
  _organization: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
}

export interface CancelVotingEventResult {
  /**
   * indexed
   */
  _organization: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
  /**
   * indexed
   */
  _voter: Address;
}

export interface NewProposalEventResult {
  /**
   * indexed
   */
  _organization: Address;
  _numOfChoices: BigNumber;
  _paramsHash: Hash;
  /**
   * indexed
   */
  _proposalId: Hash;
  _proposer: Address;
}

/**
 * fired by voting machines
 */
export interface ExecuteProposalEventResult {
  /**
   * indexed
   */
  _organization: Address;
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

export interface VoteProposalEventResult {
  /**
   * indexed
   */
  _organization: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
  _reputation: BigNumber;
  /**
   * The choice of vote
   */
  _vote: BigNumber;
  /**
   * indexed
   */
  _voter: Address;
}

export interface GetAllowedRangeOfChoicesResult {
  minVote: number;
  maxVote: number;
}
