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
  _decision: BigNumber.BigNumber;
  /**
   * indexed
   */
  _proposalId: Hash;
  /**
   * total reputation in the DAO at the time the proposal is created in the voting machine
   */
  _totalReputation: BigNumber.BigNumber;
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
  _amount: BigNumber.BigNumber;
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
