"use strict";
import { BigNumber } from "../utils";
import { Address } from "../commonTypes";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { LoggingService } from "../loggingService";
import { TransactionService, TxGeneratingFunctionOptions } from "../transactionService";
import { EventFetcherFactory, Web3EventService } from "../web3EventService";
import {
  StandardTokenApproveOptions,
  StandardTokenChangeApprovalOptions,
  StandardTokenTransferFromOptions,
  StandardTokenTransferOptions,
  StandardTokenWrapper
} from "./standardToken";

export class MintableTokenWrapper extends StandardTokenWrapper {
  public name: string = "MintableToken";
  public friendlyName: string = "Mintable Token";
  public factory: IContractWrapperFactory<MintableTokenWrapper> = MintableTokenFactory;

  public Mint: EventFetcherFactory<MintEventResult>;
  public MintFinished: EventFetcherFactory<MintFinishedEventResult>;

  /**
   * Mint tokens to recipient
   * @param options
   */
  public async mint(options: MintableTokenMintOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.recipient) {
      throw new Error("recipient is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("MintableToken.mint: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("MintableToken.mint", options);

    return this.wrapTransactionInvocation("MintableToken.mint",
      options,
      this.contract.mint,
      [options.recipient, options.amount]
    );
  }

  /**
   * Terminate the ability to mint tokens
   * @param options
   */
  public async finishMinting(options?: TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    this.logContractFunctionCall("MintableToken.finishMinting", options);

    return this.wrapTransactionInvocation("MintableToken.finishMinting",
      options,
      this.contract.finishMinting,
      []
    );
  }

  public async approve(options: StandardTokenApproveOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const functionName = "MintableToken.approve";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.approve(Object.assign(options, { txEventContext: eventContext }));
  }

  public async transfer(options: StandardTokenTransferOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const functionName = "MintableToken.transfer";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.transfer(Object.assign(options, { txEventContext: eventContext }));
  }

  public async transferFrom(options: StandardTokenTransferFromOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const functionName = "MintableToken.transferFrom";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.transferFrom(Object.assign(options, { txEventContext: eventContext }));
  }

  public async increaseApproval(options: StandardTokenChangeApprovalOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const functionName = "MintableToken.increaseApproval";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.increaseApproval(Object.assign(options, { txEventContext: eventContext }));
  }

  public async decreaseApproval(options: StandardTokenChangeApprovalOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const functionName = "MintableToken.decreaseApproval";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.decreaseApproval(Object.assign(options, { txEventContext: eventContext }));
  }

  protected hydrated(): void {
    super.hydrated();
    /* tslint:disable:max-line-length */
    this.Mint = this.createEventFetcherFactory<MintEventResult>(this.contract.Mint);
    this.MintFinished = this.createEventFetcherFactory<MintFinishedEventResult>(this.contract.MintFinished);
    /* tslint:enable:max-line-length */
  }
}

/**
 * defined just to add good type checking
 */
export class MintableTokenFactoryType extends ContractWrapperFactory<MintableTokenWrapper> {

  public async deployed(): Promise<MintableTokenWrapper> {
    throw new Error("MintableToken has not been deployed");
  }
}

export const MintableTokenFactory =
  new MintableTokenFactoryType(
    "MintableToken",
    MintableTokenWrapper,
    new Web3EventService()) as MintableTokenFactoryType;

export interface MintableTokenMintOptions {
  /**
   * The token recipient
   */
  recipient: Address;
  /**
   * Amount to mint
   */
  amount: BigNumber | string;
}

export interface MintEventResult {
  /**
   * The token recipient
   * indexed
   */
  to: Address;
  /**
   * Amount minted
   */
  amount: BigNumber;
}

/* tslint:disable-next-line:no-empty-interface */
export interface MintFinishedEventResult {
}
