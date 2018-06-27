import { BigNumber } from "bignumber.js";
import { Address, Hash } from "../commonTypes";

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

export interface RedeemEventResult {
  /**
   * the amount redeemed
   */
  _amount: BigNumber;
  /**
   * avatar address
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _beneficiary: Address;
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
  _param: number;
  /**
   * indexed
   */
  _proposalId: Hash;
}
