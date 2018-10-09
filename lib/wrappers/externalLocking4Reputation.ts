"use strict";
import BigNumber from "bignumber.js";
import { Address } from "../commonTypes";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Web3EventService } from "../web3EventService";
import { Locking4ReputationWrapper } from "./locking4Reputation";

export class ExternalLocking4ReputationWrapper extends Locking4ReputationWrapper {
  public name: string = "ExternalLocking4Reputation";
  public friendlyName: string = "External Locking For Reputation";
  public factory: IContractWrapperFactory<ExternalLocking4ReputationWrapper> = ExternalLocking4ReputationFactory;

  public async initialize(options: ExternalLockingInitializeOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    await super._initialize(options, false);

    if (!options.externalLockingContract) {
      throw new Error("externalLockingContract is not defined");
    }
    if (!options.getBalanceFuncSignature) {
      throw new Error("getBalanceFuncSignature is not defined");
    }

    this.logContractFunctionCall("ExternalLocking4Reputation.initialize", options);

    return this.wrapTransactionInvocation("ExternalLocking4Reputation.initialize",
      options,
      this.contract.initialize,
      [options.avatarAddress,
      options.reputationReward,
      options.lockingStartTime.getTime(),
      options.lockingEndTime.getTime(),
      options.externalLockingContract,
      options.getBalanceFuncSignature]
    );
  }

  public async getLockBlocker(options: ExternalLockingLockOptions): Promise<string | null> {

    /**
     * stub out amount and period -- they aren't relevant to external locking validation.
     */
    const msg = await super.getLockBlocker(Object.assign({}, options, { amount: "1", period: 1 }));
    if (msg) {
      return msg;
    }

    if (!options.lockerAddress) {
      return "lockerAddress is not defined";
    }

    const alreadyLocked = await this.getAccountHasLocked(options.lockerAddress);
    if (alreadyLocked) {
      return "this account has already executed a lock";
    }
  }

  public async lock(options: ExternalLockingLockOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    const msg = await this.getLockBlocker(options);
    if (msg) {
      throw new Error(msg);
    }

    this.logContractFunctionCall("ExternalLocking4Reputation.lock", options);

    return this.wrapTransactionInvocation("ExternalLocking4Reputation.lock",
      options,
      this.contract.lock,
      [],
      { from: options.lockerAddress }
    );
  }

  public getExternalLockingContract(): Promise<Address> {
    this.logContractFunctionCall("ExternalLocking4Reputation.externalLockingContract");
    return this.contract.externalLockingContract();

  }

  public getGetBalanceFuncSignature(): Promise<string> {
    this.logContractFunctionCall("ExternalLocking4Reputation.getBalanceFuncSignature");
    return this.contract.getBalanceFuncSignature();
  }

  /**
   * Promise of `true` if the given account has already executed a lock
   */
  public getAccountHasLocked(lockerAddress: Address): Promise<boolean> {
    if (!lockerAddress) {
      throw new Error("lockerAddress is not defined");
    }
    this.logContractFunctionCall("ExternalLocking4Reputation.externalLockers");
    return this.contract.externalLockers(lockerAddress);
  }

}

export class ExternalLocking4ReputationType extends ContractWrapperFactory<ExternalLocking4ReputationWrapper> {

  public async deployed(): Promise<ExternalLocking4ReputationWrapper> {
    throw new Error("ExternalLocking4Reputation has not been deployed");
  }
}

export const ExternalLocking4ReputationFactory =
  new ExternalLocking4ReputationType(
    "ExternalLocking4Reputation",
    ExternalLocking4ReputationWrapper,
    new Web3EventService()) as ExternalLocking4ReputationType;

export interface ExternalLockingInitializeOptions {
  avatarAddress: Address;
  externalLockingContract: Address;
  getBalanceFuncSignature: string;
  lockingEndTime: Date;
  lockingStartTime: Date;
  reputationReward: BigNumber | string;
}

export interface ExternalLockingLockOptions {
  lockerAddress: Address;
}
