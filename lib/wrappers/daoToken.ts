"use strict";
import { BigNumber } from "../utils";
import ethereumjs = require("ethereumjs-abi");
import { Address } from "../commonTypes";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { LoggingService } from "../loggingService";
import { TransactionService, TxGeneratingFunctionOptions } from "../transactionService";
import { Utils } from "../utils";
import { EventFetcherFactory, Web3EventService } from "../web3EventService";
import { BurnEventResult, IBurnableTokenWrapper } from "./iBurnableToken";
import {
  ApproveAndCallOptions,
  ChangeApprovalAndCallOptions,
  IErc827TokenWrapper,
  TransferAndCallOptions,
  TransferFromAndCallOptions
} from "./iErc827Token";
import { MintableTokenWrapper } from "./mintableToken";
import {
  StandardTokenApproveOptions,
  StandardTokenChangeApprovalOptions,
  StandardTokenTransferFromOptions,
  StandardTokenTransferOptions
} from "./standardToken";

export class DaoTokenWrapper
  /**
   * In Arc, DAOToken multiply inherits from MintableToken, BurnableToken and ERC827Token.
   * Such a structure not being feasible here, we instead inherit from MintableToken and
   * flatten in the implementations of BurnableToken and ERC827Token.
   */
  extends MintableTokenWrapper
  implements IErc827TokenWrapper, IBurnableTokenWrapper {

  /**
   * Returns promise of DaoTokenWrapper on the global GEN token.
   */
  public static async getGenToken(): Promise<DaoTokenWrapper> {
    const address = await Utils.getGenTokenAddress();
    return DaoTokenFactory.at(address);
  }

  public name: string = "DAOToken";
  public friendlyName: string = "DAO Token";
  public factory: IContractWrapperFactory<DaoTokenWrapper> = DaoTokenFactory;

  public Burn: EventFetcherFactory<BurnEventResult>;

  /**
   * Mint tokens to recipient
   * @param options
   */
  public async mint(options: DaoTokenMintOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.recipient) {
      throw new Error("recipient is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("DaoToken.mint: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("DaoToken.mint", options);

    return this.wrapTransactionInvocation("DaoToken.mint",
      options,
      this.contract.mint,
      [options.recipient, options.amount]
    );
  }

  /**
   * Burn the given number of tokens
   * @param options
   */
  public async burn(options: DaoTokenBurnOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("DaoToken.burn: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("DaoToken.burn", options);

    return this.wrapTransactionInvocation("DaoToken.burn",
      options,
      this.contract.burn,
      [options.amount]
    );
  }

  /**
   * Approve transfer of tokens by msg.sender (or `onBehalfOf`, if given)
   * from the given "spender".  Then call the function specified
   * by `callData`, all in a single transaction.
   * @param options
   */
  public async approveAndCall(options: ApproveAndCallOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.spender) {
      throw new Error("spender is not defined");
    }

    if (!options.callData || !options.callData.length) {
      throw new Error("callData is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("DaoToken.approveAndCall: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("DaoToken.approveAndCall", options);

    return this.wrapTransactionInvocation("DaoToken.approveAndCall",
      options,
      this.contract.approveAndCall,
      [options.spender, options.amount, options.callData],
      options.owner ? { from: options.owner } : undefined
    );
  }

  /**
   * Transfer tokens from the current account to another.  Then call the function specified
   * by `callData`, all in a single transaction.
   * @param options
   */
  public async transferAndCall(options: TransferAndCallOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.amount) {
      throw new Error("amount is not defined");
    }

    if (!options.to) {
      throw new Error("to is not defined");
    }

    if (!options.callData || !options.callData.length) {
      throw new Error("callData is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("DaoToken.transferAndCall: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("DaoToken.transferAndCall", options);

    return this.wrapTransactionInvocation("DaoToken.transferAndCall",
      options,
      this.contract.transferAndCall,
      [options.to, options.amount, options.callData]
    );
  }

  /**
   * Transfer tokens from one address to another.  Then call the function specified
   * by `callData`, all in a single transaction.
   * @param options
   */
  public async transferFromAndCall(options: TransferFromAndCallOptions & TxGeneratingFunctionOptions)
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

    if (!options.callData || !options.callData.length) {
      throw new Error("callData is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("DaoToken.transferFromAndCall: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("DaoToken.transferFromAndCall", options);

    return this.wrapTransactionInvocation("DaoToken.transferFromAndCall",
      options,
      this.contract.transferFromAndCall,
      [options.from, options.to, options.amount, options.callData]
    );
  }

  /**
   * Increase the number of tokens approved that msg.sender (or `onBehalfOf`, if given)
   * may transfer from the given "spender".
   * Then call the function specified by `callData`, all in a single transaction.
   * @param options
   */
  public async increaseApprovalAndCall(options: ChangeApprovalAndCallOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.spender) {
      throw new Error("spender is not defined");
    }

    if (!options.callData || !options.callData.length) {
      throw new Error("callData is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("DaoToken.increaseApprovalAndCall: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("DaoToken.increaseApprovalAndCall", options);

    return this.wrapTransactionInvocation("DaoToken.increaseApprovalAndCall",
      options,
      this.contract.increaseApprovalAndCall,
      [options.spender, options.amount, options.callData],
      options.owner ? { from: options.owner } : undefined
    );
  }

  /**
   * Decrease the number of tokens approved that msg.sender (or `onBehalfOf` if given)
   * may transfer from the given "spender".
   * Then call the function specified by `callData`, all in a single transaction.
   * @param options
   */
  public async decreaseApprovalAndCall(options: ChangeApprovalAndCallOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.spender) {
      throw new Error("spender is not defined");
    }

    if (!options.callData || !options.callData.length) {
      throw new Error("callData is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("DaoToken.decreaseApprovalAndCall: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("DaoToken.decreaseApprovalAndCall", options);

    return this.wrapTransactionInvocation("DaoToken.decreaseApprovalAndCallDaoToken.decreaseApprovalAndCall",
      options,
      this.contract.decreaseApprovalAndCall,
      [options.spender, options.amount, options.callData],
      options.owner ? { from: options.owner } : undefined
    );
  }

  public async getTokenName(): Promise<string> {
    this.logContractFunctionCall("DaoToken.getTokenName");
    return this.contract.name();
  }

  public async getTokenSymbol(): Promise<string> {
    this.logContractFunctionCall("DaoToken.getTokenSymbol");
    return this.contract.symbol();
  }

  public async getTokenCap(): Promise<BigNumber> {
    this.logContractFunctionCall("DaoToken.getTokenCap");
    return this.contract.cap();
  }

  public async approve(options: StandardTokenApproveOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const functionName = "DaoToken.approve";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.approve(Object.assign(options, { txEventContext: eventContext }));
  }

  public async transfer(options: StandardTokenTransferOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const functionName = "DaoToken.transfer";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.transfer(Object.assign(options, { txEventContext: eventContext }));
  }

  public async transferFrom(options: StandardTokenTransferFromOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const functionName = "DaoToken.transferFrom";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.transferFrom(Object.assign(options, { txEventContext: eventContext }));
  }

  public async increaseApproval(options: StandardTokenChangeApprovalOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const functionName = "DaoToken.increaseApproval";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.increaseApproval(Object.assign(options, { txEventContext: eventContext }));
  }

  public async finishMinting(options?: TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const functionName = "DaoToken.finishMinting";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.finishMinting(Object.assign(options, { txEventContext: eventContext }));
  }

  protected hydrated(): void {
    super.hydrated();
    /* tslint:disable:max-line-length */
    this.Burn = this.createEventFetcherFactory<BurnEventResult>(this.contract.Burn);
    /* tslint:enable:max-line-length */
  }
}

/**
 * defined just to add good type checking
 */
export class DaoTokenFactoryType extends ContractWrapperFactory<DaoTokenWrapper> {

  public async deployed(): Promise<DaoTokenWrapper> {
    throw new Error("DAOToken has not been deployed");
  }

  public async new(
    name: string,
    symbol: string,
    cap: BigNumber): Promise<DaoTokenWrapper> {
    return super.new(name, symbol, cap);
  }
}

export const DaoTokenFactory =
  new DaoTokenFactoryType(
    "DAOToken",
    DaoTokenWrapper,
    new Web3EventService()) as DaoTokenFactoryType;

export interface DaoTokenMintOptions {
  /**
   * The token recipient
   */
  recipient: Address;
  /**
   * Amount to mint
   */
  amount: BigNumber | string;
}

export interface DaoTokenBurnOptions {
  /**
   * Amount to burn
   */
  amount: BigNumber | string;
}

export interface AllowanceOptions {
  owner: Address;
  spender: Address;
}
