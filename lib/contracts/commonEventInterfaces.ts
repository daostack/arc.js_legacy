import * as BigNumber from "bignumber.js";
import { Address, Hash } from "../commonTypes";

export interface NewProposalEventResult {
  _numOfChoices: number;
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
  _decision: number;
  /**
   * indexed
   */
  _proposalId: Hash;
}

export interface VoteProposalEventResult {
  /**
   * indexed
   */
  _proposalId: Hash;
  _reputation: BigNumber.BigNumber;
  _vote: number;
  /**
   * indexed
   */
  _voter: Address;
}

export interface RedeemReputationEventResult {
  _amount: BigNumber.BigNumber;
  /**
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
