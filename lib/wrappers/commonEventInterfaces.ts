import { Address, Hash } from "../commonTypes";
import { BigNumber } from "../utils";

export interface ProposalDeletedEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
}

/**
 * fired by schemes
 */
export interface ProposalExecutedEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  _param: number;
  /**
   * indexed
   */
  _proposalId: Hash;
}

/**
 * fired by schemes
 */
export interface SchemeProposalExecuted {
  avatarAddress: Address;
  winningVote: number;
  proposalId: Hash;
}

/**
 * fired by schemes
 */
export interface SchemeProposalExecutedEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * typically the winning vote
   */
  _param: number;
  /**
   * indexed
   */
  _proposalId: Hash;
}
