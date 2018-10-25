"use strict";
import { Address } from "../commonTypes";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";

import { ContractWrapperBase } from "../contractWrapperBase";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { LoggingService } from "../loggingService";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { BigNumber } from "../utils";
import { EventFetcherFactory, Web3EventService } from "../web3EventService";

export class ReputationWrapper extends ContractWrapperBase {
  public name: string = "Reputation";
  public friendlyName: string = "Reputation";
  public factory: IContractWrapperFactory<ReputationWrapper> = ReputationFactory;

  public Mint: EventFetcherFactory<ReputationMintEventResult>;
  public Burn: EventFetcherFactory<ReputationBurnEventResult>;

  /**
   * Mint reputation to the given recipient
   * @param options
   */
  public async mint(options: ReputationMintOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.recipient) {
      throw new Error("recipient is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("Reputation.mint: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("Reputation.mint", options);

    return this.wrapTransactionInvocation("Reputation.mint",
      options,
      this.contract.mint,
      [options.recipient, options.amount]
    );
  }

  /**
   * Remove reputation from the given account.
   * @param options
   */
  public async burn(options: ReputationBurnOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.from) {
      throw new Error("'from' is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.eqn(0)) {
      LoggingService.warn("Reputation.burn: amount is zero.  Doing nothing.");
      return new ArcTransactionResult(null, this.contract);
    }

    this.logContractFunctionCall("Reputation.burn", options);

    return this.wrapTransactionInvocation("Reputation.burn",
      options,
      this.contract.burn,
      [options.from, options.amount]
    );
  }

  public getTotalSupply(): Promise<BigNumber> {
    this.logContractFunctionCall("Reputation.totalSupply");
    return this.contract.totalSupply();
  }

  /**
   * Total amount of reputation at the given `blockNumber`.
   */
  public getTotalSupplyAt(blockNumber: number): Promise<BigNumber> {
    this.logContractFunctionCall("Reputation.totalSupplyAt");
    return this.contract.totalSupply();
  }

  public getBalanceOf(accountAddress: Address): Promise<BigNumber> {

    if (!accountAddress) {
      throw new Error("accountAddress is not defined");
    }

    this.logContractFunctionCall("Reputation.balanceOf", accountAddress);

    return this.contract.balanceOf(accountAddress);
  }

  /**
   * Queries the balance of `accountAddress` at the given `blockNumber`
   * @param accountAddress
   * @param blockNumber
   */
  public getBalanceOfAt(accountAddress: Address, blockNumber: number): Promise<BigNumber> {

    if (!accountAddress) {
      throw new Error("accountAddress is not defined");
    }

    if (typeof (blockNumber) === "undefined") {
      throw new Error("blockNumber is not defined");
    }

    this.logContractFunctionCall("Reputation.balanceOfAt", { accountAddress, blockNumber });

    return this.contract.balanceOfAt(accountAddress, blockNumber);
  }

  protected hydrated(): void {
    /* tslint:disable:max-line-length */
    this.Mint = this.createEventFetcherFactory<ReputationMintEventResult>(this.contract.events.Mint);
    this.Burn = this.createEventFetcherFactory<ReputationBurnEventResult>(this.contract.events.Burn);
    /* tslint:enable:max-line-length */
  }
}

export class ReputationFactoryType extends ContractWrapperFactory<ReputationWrapper> {

  public async deployed(): Promise<ReputationWrapper> {
    throw new Error("Reputation has not been deployed");
  }
}

export const ReputationFactory =
  new ReputationFactoryType(
    "Reputation",
    ReputationWrapper,
    new Web3EventService()) as ReputationFactoryType;

export interface ReputationMintOptions {
  /**
   * The token recipient
   */
  recipient: Address;
  /**
   * Amount to mint
   */
  amount: BigNumber;
}

export interface ReputationBurnOptions {
  from: BigNumber;
  /**
   * Amount to mint
   */
  amount: BigNumber;
}

export interface ReputationMintEventResult {
  /**
   * The recipient of reputation
   * indexed
   */
  _to: Address;
  /**
   * Amount minted
   */
  _amount: BigNumber;
}

export interface ReputationBurnEventResult {
  /**
   * Whose reputation was burnt
   * indexed
   */
  _from: Address;
  /**
   * Amount burnt
   */
  _amount: BigNumber;
}
