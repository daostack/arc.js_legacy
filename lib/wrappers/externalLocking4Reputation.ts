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
      options.lockingStartTime.getTime() / 1000,
      options.lockingEndTime.getTime() / 1000,
      options.redeemEnableTime.getTime() / 1000,
      options.externalLockingContract,
      options.getBalanceFuncSignature]
    );
  }

  public async getLockBlocker(options: ExternalLockingClaimOptions): Promise<string | null> {
    /**
     * stub out lockerAddress, amount and period -- they aren't relevant to external locking validation.
     */
    const msg = await super.getLockBlocker(Object.assign({},
      { lockerAddress: "0x", amount: "1", period: 1 }
    ));

    if (msg) {
      return msg;
    }

    const alreadyLocked = await this.getAccountHasLocked(options.lockerAddress);
    if (alreadyLocked) {
      return "this account has already executed a lock";
    }
  }

  /**
   * Claim the MGN tokens and lock them.  Provide `lockerAddress` to claim on their behalf,
   * otherwise claims on behalf of the caller.
   * @param options
   */
  public async claim(
    options: ExternalLockingClaimOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    const msg = await this.getLockBlocker(options);
    if (msg) {
      throw new Error(msg);
    }

    this.logContractFunctionCall("ExternalLocking4Reputation.claim", options);

    return this.wrapTransactionInvocation("ExternalLocking4Reputation.claim",
      options,
      this.contract.claim,
      [options.lockerAddress]
    );
  }

  /**
   * The caller is giving permission to the contract to allow someone else to claim
   * on their behalf.
   */
  public async register(): Promise<ArcTransactionResult> {

    this.logContractFunctionCall("ExternalLocking4Reputation.register");

    return this.wrapTransactionInvocation("ExternalLocking4Reputation.register",
      {},
      this.contract.register,
      []
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
  /**
   * Reputation cannot be redeemed until after this time, even if redeeming has been enabled.
   */
  redeemEnableTime: Date;
  reputationReward: BigNumber | string;
}

export interface ExternalLockingClaimOptions {
  lockerAddress?: Address;
}
