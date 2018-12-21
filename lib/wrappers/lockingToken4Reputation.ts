"use strict";
import BigNumber from "bignumber.js";
import { Address, Hash } from "../commonTypes";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Utils } from "../utils";
import { EventFetcherFactory, Web3EventService } from "../web3EventService";
import { WrapperService } from "../wrapperService";
import { InitializeOptions, Locking4ReputationWrapper, LockingOptions, ReleaseOptions } from "./locking4Reputation";
import { StandardTokenFactory, StandardTokenWrapper } from "./standardToken";

export class LockingToken4ReputationWrapper extends Locking4ReputationWrapper {
  public name: string = "LockingToken4Reputation";
  public friendlyName: string = "Locking Token For Reputation";
  public factory: IContractWrapperFactory<LockingToken4ReputationWrapper> = LockingToken4ReputationFactory;

  public LockToken: EventFetcherFactory<LockingToken4ReputationLockEventResult>;

  public async initialize(options: LockTokenInitializeOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    await super._initialize(options);

    if (!options.priceOracleContract) {
      throw new Error(`priceOracleContract not supplied`);
    }

    this.logContractFunctionCall("LockingToken4Reputation.initialize", options);

    return this.wrapTransactionInvocation("LockingToken4Reputation.initialize",
      options,
      this.contract.initialize,
      [options.avatarAddress,
      options.reputationReward,
      options.lockingStartTime.getTime() / 1000,
      options.lockingEndTime.getTime() / 1000,
      options.redeemEnableTime.getTime() / 1000,
      options.maxLockingPeriod,
      options.priceOracleContract]
    );
  }

  public async release(options: ReleaseOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    await super._release(options);

    this.logContractFunctionCall("LockingToken4Reputation.release", options);

    return this.wrapTransactionInvocation("LockingToken4Reputation.release",
      options,
      this.contract.release,
      [options.lockerAddress, options.lockId]
    );
  }

  /**
   * Returns reason why can't lock, else null if can lock
   */
  public async getLockBlocker(options: TokenLockingOptions): Promise<string | null> {

    const msg = await super.getLockBlocker(options);
    if (msg) {
      return msg;
    }

    if (!options.tokenAddress) {
      return "tokenAddress was not supplied";
    }

    const token = await StandardTokenFactory.at(options.tokenAddress);
    const balance = await Utils.getTokenBalance(options.lockerAddress, token.address);
    const amount = new BigNumber(options.amount);

    if (balance.lt(amount)) {
      return "the account has insufficient balance";
    }

    return null;
  }

  public async lock(options: TokenLockingOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    const msg = await this.getLockBlocker(options);
    if (msg) {
      throw new Error(msg);
    }

    this.logContractFunctionCall("LockingToken4Reputation.lock", options);

    return this.wrapTransactionInvocation("LockingToken4Reputation.lock",
      options,
      this.contract.lock,
      [options.amount, options.period, options.tokenAddress],
      { from: options.lockerAddress }
    );
  }

  public async getTokenForLock(lockingId: Hash): Promise<StandardTokenWrapper> {
    this.logContractFunctionCall("LockingToken4Reputation.lockedTokens");
    const address = await this.contract.lockedTokens(lockingId);
    return WrapperService.factories.StandardToken.at(address);
  }
}

export class LockingToken4ReputationType extends ContractWrapperFactory<LockingToken4ReputationWrapper> {

  public async deployed(): Promise<LockingToken4ReputationWrapper> {
    throw new Error("LockingToken4Reputation has not been deployed");
  }
}

export const LockingToken4ReputationFactory =
  new LockingToken4ReputationType(
    "LockingToken4Reputation",
    LockingToken4ReputationWrapper,
    new Web3EventService()) as LockingToken4ReputationType;

export interface LockTokenInitializeOptions extends InitializeOptions {
  priceOracleContract: Address;
}

export interface LockingToken4ReputationLockEventResult {
  /**
   * indexed
   */
  _lockingId: BigNumber;
  /**
   * indexed
   */
  _token: Address;
  /**
   * number/denominator is the price of the token at the time the token is locked
   */
  _numerator: BigNumber;
  /**
   * number/denominator is the price of the token at the time the token is locked
   */
  _denominator: BigNumber;
}

export interface TokenLockingOptions extends LockingOptions {
  tokenAddress: Address;
}
