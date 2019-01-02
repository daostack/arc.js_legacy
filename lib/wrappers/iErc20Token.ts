"use strict";
import { BigNumber } from "bignumber.js";
import { Address } from "../commonTypes";
import { ArcTransactionResult } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { EventFetcherFactory } from "../web3EventService";

export interface IErc20TokenWrapper  {
  Approval: EventFetcherFactory<ApprovalEventResult>;
  Transfer: EventFetcherFactory<TransferEventResult>;
  /**
   * Returns a promise of the token's total number of tokens.
   */
  getTotalSupply(): Promise<BigNumber>;
  /**
   * Returns a promise of the given account's current token balance.
   * @param account
   */
  getBalanceOf(account: Address): Promise<BigNumber>;
  /**
   * Returns a promise of the number of tokens that the given account "spender" is
   * currently allowed to transfer from the given token holder's account.
   * @param options
   */
  allowance(options: StandardTokenAllowanceOptions): Promise<BigNumber>;
  /**
   * Transfer tokens from the current account to another.
   * @param options
   */
  transfer(options: StandardTokenTransferOptions & TxGeneratingFunctionOptions)
  : Promise<ArcTransactionResult>;
  /**
   * Approve transfer of tokens by msg.sender (or `onBehalfOf`, if given)
   * from the given "spender".
   * @param options
   */
  approve(options: StandardTokenApproveOptions & TxGeneratingFunctionOptions)
  : Promise<ArcTransactionResult>;
  /**
   * Transfer tokens from one address to another.
   * @param options
   */
  transferFrom(options: StandardTokenTransferFromOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult>;
}

export interface StandardTokenApproveOptions {
  /**
   * Amount to approve to transfer.
   */
  amount: BigNumber | string;
  /**
   * The account that has the tokens to spend.
   * Default is msg.sender.
   */
  owner?: Address;
  /**
   * The account that will initiate the transfer of tokens on behalf
   * of the owner.
   */
  spender: Address;
}

export interface ApprovalEventResult {
  /**
   * The account from which the tokens originated.
   * indexed
   */
  owner: Address;
  /**
   * The account that was approved-to and initiated the transfer on behalf of owner.
   * indexed
   */
  spender: Address;
  /**
   * When the event is emitted by `approve`, then this is the amount that was requested
   * for approval from spender by owner by the specific function call.
   * When the event is emitted by `increaseApproval` or `decreaseApproval`, then
   * this is the current net amount approved to transfer from spender by owner.
   */
  value: BigNumber;
}

export interface TransferEventResult {
  /**
   * `msg.sender` for `transfer`, `from` for `transferFrom`
   * indexed
   */
  from: Address;
  /**
   * the recipient of the tokens
   * indexed
   */
  to: Address;
  value: BigNumber;
}

export interface StandardTokenTransferOptions {
  amount: BigNumber | string;
  to: Address;
}

export interface StandardTokenTransferFromOptions {
  amount: BigNumber | string;
  from: Address;
  to: Address;
}

export interface StandardTokenAllowanceOptions {
  /**
   * The account that has the tokens to spend.
   */
  owner: Address;
  /**
   * The account that will initiate the transfer of tokens on behalf
   * of the owner.
   */
  spender: Address;
}

export interface StandardTokenChangeApprovalOptions {
  amount: BigNumber | string;
  /**
   * The account that has the tokens to spend.
   * Default is msg.sender.
   */
  owner?: Address;
  /**
   * The account that will initiate the transfer of tokens on behalf
   * of the owner.
   */
  spender: Address;
}
