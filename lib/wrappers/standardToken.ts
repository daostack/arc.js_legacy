"use strict";
import { Address } from "../commonTypes";
import { ContractWrapperBase } from "../contractWrapperBase";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";

import { BigNumber } from "bignumber.js";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { LoggingService } from "../loggingService";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Utils } from "../utils";
import { EventFetcherFactory, Web3EventService } from "../web3EventService";

export class StandardTokenWrapper extends ContractWrapperBase {
  public name: string = "StandardToken";
  public friendlyName: string = "Standard Token";
  public factory: IContractWrapperFactory<StandardTokenWrapper> = StandardTokenFactory;

  public Approval: EventFetcherFactory<ApprovalEventResult>;

  /**
   * Approve transfer of tokens by msg.sender (or `onBehalfOf`if given)
   * from the given "spender".
   * @param options
   */
  public async approve(options: StandardTokenApproveOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const web3 = await Utils.getWeb3();

    if (!options.amount) {
      throw new Error("amount is not defined");
    }

    if (!options.spender) {
      throw new Error("spender is not defined");
    }
    const amount = web3.toBigNumber(options.amount);

    if (amount.eq(0)) {
      LoggingService.warn("StandardToken.approve: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("StandardToken.approve", options);

    return this.wrapTransactionInvocation("StandardToken.approve",
      options,
      this.contract.approve,
      [options.spender, options.amount],
      options.onBehalfOf ? { from: options.onBehalfOf } : undefined
    );
  }

  protected hydrated(): void {
    /* tslint:disable:max-line-length */
    this.Approval = this.createEventFetcherFactory<ApprovalEventResult>(this.contract.Approval);
    /* tslint:enable:max-line-length */
  }
}

/**
 * defined just to add good type checking
 */
export class StandardTokenFactoryType extends ContractWrapperFactory<StandardTokenWrapper> {
  public async new(
    initialAccount: Address,
    initialBalance: BigNumber): Promise<StandardTokenWrapper> {
    return super.new(initialAccount, initialBalance);
  }
}

export const StandardTokenFactory =
  new StandardTokenFactoryType(
    "StandardToken",
    StandardTokenWrapper,
    new Web3EventService()) as StandardTokenFactoryType;

export interface StandardTokenParams {
  initialAccount: Address;
  initialBalance: BigNumber;
}

export interface StandardTokenApproveOptions extends TxGeneratingFunctionOptions {
  /**
   * Amount to approve to transfer.
   */
  amount: BigNumber | string;
  /**
   * Optional account from which the tokens will be transferred.
   * Default is msg.sender.
   */
  onBehalfOf?: Address;
  /**
   * Approve for this account to perform the token transfer.
   * indexed
   */
  spender: Address;
}

export interface ApprovalEventResult {
  /**
   * The token owner
   * indexed
   */
  owner: Address;
  /**
   * Approved to transfer from this account
   * indexed
   */
  spender: Address;
  /**
   * Amount approved to transfer
   */
  value: BigNumber;
}
