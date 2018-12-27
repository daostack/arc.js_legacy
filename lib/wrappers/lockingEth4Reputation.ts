"use strict";
import BigNumber from "bignumber.js";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Utils } from "../utils";
import { Web3EventService } from "../web3EventService";
import { InitializeOptions, Locking4ReputationWrapper, LockingOptions, ReleaseOptions } from "./locking4Reputation";

export class LockingEth4ReputationWrapper extends Locking4ReputationWrapper {
  public name: string = "LockingEth4Reputation";
  public friendlyName: string = "Locking Eth For Reputation";
  public factory: IContractWrapperFactory<LockingEth4ReputationWrapper> = LockingEth4ReputationFactory;

  public async initialize(options: InitializeOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    await super._initialize(options);

    this.logContractFunctionCall("LockingEth4Reputation.initialize", options);

    return this.wrapTransactionInvocation("LockingEth4Reputation.initialize",
      options,
      this.contract.initialize,
      [options.avatarAddress,
      options.reputationReward,
      options.lockingStartTime.getTime() / 1000,
      options.lockingEndTime.getTime() / 1000,
      options.redeemEnableTime.getTime() / 1000,
      options.maxLockingPeriod]
    );
  }

  public async release(options: ReleaseOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    await super._release(options);

    this.logContractFunctionCall("LockingEth4Reputation.release", options);

    return this.wrapTransactionInvocation("LockingEth4Reputation.release",
      options,
      this.contract.release,
      [options.lockerAddress, options.lockId]
    );
  }

  /**
   * Returns reason why can't lock, else null if can lock
   */
  public async getLockBlocker(options: LockingOptions): Promise<string | null> {

    const msg = await super.getLockBlocker(options);
    if (msg) {
      return msg;
    }

    const balance = await Utils.getEthBalance(options.lockerAddress);
    const amount = new BigNumber(options.amount);

    if (balance.lt(amount)) {
      return "the account has insufficient balance";
    }
    return null;
  }

  public async lock(options: LockingOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    const msg = await this.getLockBlocker(options);
    if (msg) {
      throw new Error(msg);
    }

    this.logContractFunctionCall("LockingEth4Reputation.lock", options);

    return this.wrapTransactionInvocation("LockingEth4Reputation.lock",
      options,
      this.contract.lock,
      [options.period],
      { from: options.lockerAddress, value: options.amount }
    );
  }
}

export class LockingEth4ReputationType extends ContractWrapperFactory<LockingEth4ReputationWrapper> {

  public async deployed(): Promise<LockingEth4ReputationWrapper> {
    throw new Error("LockingEth4Reputation has not been deployed");
  }
}

export const LockingEth4ReputationFactory =
  new LockingEth4ReputationType(
    "LockingEth4Reputation",
    LockingEth4ReputationWrapper,
    new Web3EventService()) as LockingEth4ReputationType;
