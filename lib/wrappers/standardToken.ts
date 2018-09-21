"use strict";
import { BigNumber } from "../utils";
import { Address } from "../commonTypes";
import { ContractWrapperBase } from "../contractWrapperBase";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { LoggingService } from "../loggingService";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { EventFetcherFactory, Web3EventService } from "../web3EventService";

export class StandardTokenWrapper extends ContractWrapperBase {
  public name: string = "StandardToken";
  public friendlyName: string = "Standard Token";
  public factory: IContractWrapperFactory<StandardTokenWrapper> = StandardTokenFactory;

  public Approval: EventFetcherFactory<ApprovalEventResult>;
  public Transfer: EventFetcherFactory<TransferEventResult>;

  /**
   * Approve transfer of tokens by msg.sender (or `onBehalfOf`, if given)
   * from the given "spender".
   * @param options
   */
  public async approve(options: StandardTokenApproveOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.spender) {
      throw new Error("spender is not defined");
    }
    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("StandardToken.approve: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("StandardToken.approve", options);

    return this.wrapTransactionInvocation("StandardToken.approve",
      options,
      this.contract.approve,
      [options.spender, options.amount],
      options.owner ? { from: options.owner } : undefined
    );
  }

  /**
   * Transfer tokens from the current account to another.
   * @param options
   */
  public async transfer(options: StandardTokenTransferOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.amount) {
      throw new Error("amount is not defined");
    }

    if (!options.to) {
      throw new Error("to is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("StandardToken.transfer: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("StandardToken.transfer", options);

    return this.wrapTransactionInvocation("StandardToken.transfer",
      options,
      this.contract.transfer,
      [options.to, options.amount]
    );
  }

  /**
   * Transfer tokens from one address to another.
   * @param options
   */
  public async transferFrom(options: StandardTokenTransferFromOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.amount) {
      throw new Error("amount is not defined");
    }

    if (!options.to) {
      throw new Error("to is not defined");
    }

    if (!options.from) {
      throw new Error("from is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("StandardToken.transferFrom: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("StandardToken.transferFrom", options);

    return this.wrapTransactionInvocation("StandardToken.transferFrom",
      options,
      this.contract.transferFrom,
      [options.from, options.to, options.amount]
    );
  }

  /**
   * Increase the number of tokens approved that msg.sender (or `onBehalfOf`, if given)
   * may transfer from the given "spender".
   * @param options
   */
  public async increaseApproval(options: StandardTokenChangeApprovalOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.spender) {
      throw new Error("spender is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("StandardToken.increaseApproval: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("StandardToken.increaseApproval", options);

    return this.wrapTransactionInvocation("StandardToken.increaseApproval",
      options,
      this.contract.increaseApproval,
      [options.spender, options.amount],
      options.owner ? { from: options.owner } : undefined
    );
  }

  /**
   * Decrease the number of tokens approved that msg.sender (or `onBehalfOf` if given)
   * may transfer from the given "spender".
   * @param options
   */
  public async decreaseApproval(options: StandardTokenChangeApprovalOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.spender) {
      throw new Error("spender is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("StandardToken.decreaseApproval: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("StandardToken.decreaseApproval", options);

    return this.wrapTransactionInvocation("StandardToken.decreaseApproval",
      options,
      this.contract.decreaseApproval,
      [options.spender, options.amount],
      options.owner ? { from: options.owner } : undefined
    );
  }

  /**
   * Returns a promise of the given account's current token balance.
   * @param account
   */
  public async getBalanceOf(account: Address)
    : Promise<BigNumber> {
    if (!account) {
      throw new Error("account is not defined");
    }
    this.logContractFunctionCall("StandardToken.getBalanceOf", account);
    return this.contract.balanceOf(account);
  }

  /**
   * Returns a promise of the token's total number of tokens.
   */
  public async getTotalSupply()
    : Promise<BigNumber> {
    this.logContractFunctionCall("StandardToken.getTotalSupply");
    return this.contract.totalSupply();
  }

  /**
   * Returns a promise of the number of tokens that the given account "spender" is
   * currently allowed to transfer from the given token holder's account.
   * @param options
   */
  public async allowance(options: StandardTokenAllowanceOptions)
    : Promise<BigNumber> {
    if (!options.owner) {
      throw new Error("owner is not defined");
    }
    if (!options.spender) {
      throw new Error("spender is not defined");
    }
    this.logContractFunctionCall("StandardToken.allowance", options);
    return this.contract.allowance(options.owner, options.spender);
  }

  protected hydrated(): void {
    /* tslint:disable:max-line-length */
    this.Approval = this.createEventFetcherFactory<ApprovalEventResult>(this.contract.Approval);
    this.Transfer = this.createEventFetcherFactory<TransferEventResult>(this.contract.Transfer);
    /* tslint:enable:max-line-length */
  }
}

/**
 * defined just to add good type checking
 */
export class StandardTokenFactoryType extends ContractWrapperFactory<StandardTokenWrapper> {
  public async deployed(): Promise<StandardTokenWrapper> {
    throw new Error("StandardToken has not been deployed");
  }
}

export const StandardTokenFactory =
  new StandardTokenFactoryType(
    "StandardToken",
    StandardTokenWrapper,
    new Web3EventService()) as StandardTokenFactoryType;

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
