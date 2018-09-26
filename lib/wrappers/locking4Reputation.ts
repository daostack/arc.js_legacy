import { ContractWrapperBase } from '../contractWrapperBase';
import { ContractWrapperFactory } from '../contractWrapperFactory';
import { IContractWrapperFactory, ArcTransactionResult } from '../iContractWrapperBase';
import { Web3EventService, EventFetcherFactory } from '../web3EventService';
import { Hash, Address } from '../commonTypes';
import BigNumber from 'bignumber.js';
import { TxGeneratingFunctionOptions } from '../transactionService';
import { GetDefaultGenesisProtocolParameters } from './genesisProtocol';

"use strict";
export class Locking4ReputationWrapper extends ContractWrapperBase {
  public name: string = "Locking4Reputation";
  public friendlyName: string = "Locking For Reputation";
  public factory: IContractWrapperFactory<Locking4ReputationWrapper> = Locking4ReputationFactory;

  public Redeem: EventFetcherFactory<Locking4ReputationRedeemEventResult>;
  public Release: EventFetcherFactory<Locking4ReputationReleaseEventResult>;
  public Lock: EventFetcherFactory<Locking4ReputationLockEventResult>;

  public async initialize(options: InitializeOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    const avatar = await this.getAvatar();

    if (avatar) {
      throw new Error("you can only call initialize once");
    }

    if (!options.avatarAddress) {
      throw new Error("avatarAddress is not defined");
    }

    if (!options.lockingEndTime) {
      throw new Error("lockingEndTime is not defined");
    }

    if (!options.lockingStartTime) {
      throw new Error("lockingStartTime is not defined");
    }

    if (options.lockingEndTime <= options.lockingStartTime) {
      throw new Error("lockingEndTime must be greater than lockingStartTime");
    }

    if (!options.maxLockingPeriod) {
      throw new Error("maxLockingPeriod is not defined");
    }

    if (!Number.isInteger(options.maxLockingPeriod)) {
      throw new Error("maxLockingPeriod is not an integer");
    }

    if (options.maxLockingPeriod <= 0) {
      throw new Error("maxLockingPeriod must be greater then zero");
    }

    if (!options.reputationReward) {
      throw new Error("reputationReward is not defined");
    }

    const reputationReward = new BigNumber(options.reputationReward);

    if (reputationReward.lte(0)) {
      throw new Error("reputationReward must be greater then zero");
    }

    this.logContractFunctionCall("Locking4Reputation.initialize", options);

    return this.wrapTransactionInvocation("Locking4Reputation.initialize",
      options,
      this.contract.inizialize,
      [options.avatarAddress, options.reputationReward, options.lockingStartTime.getTime(), options.lockingEndTime.getTime(), options.maxLockingPeriod]
    );
  }

  public redeem(options: RedeemOptions): Promise<ArcTransactionResult> {
    if (!options.lockerAddress) {
      throw new Error("lockerAddress is not defined");
    }

    if (!options.lockingId) {
      throw new Error("lockingId is not defined");
    }

    this.logContractFunctionCall("Locking4Reputation.redeem", options);

    return this.wrapTransactionInvocation("Locking4Reputation.redeem",
      options,
      this.contract.redeem,
      [options.lockerAddress, options.lockingId]
    );
  }

  public release(options: ReleaseOptions): Promise<ArcTransactionResult> {
    if (!options.lockerAddress) {
      throw new Error("lockerAddress is not defined");
    }

    if (!options.lockingId) {
      throw new Error("lockingId is not defined");
    }

    this.logContractFunctionCall("Locking4Reputation.release", options);

    return this.wrapTransactionInvocation("Locking4Reputation.release",
      options,
      this.contract.release,
      [options.lockerAddress, options.lockingId]
    );
  }

  public async lock(options: LockingOptions): Promise<ArcTransactionResult> {
    if (!options.lockerAddress) {
      throw new Error("lockerAddress is not defined");
    }

    if (!options.period) {
      throw new Error("lockingId is not defined");
    }

    const amount = new BigNumber(options.amount);

    if (amount.lte(0)) {
      throw new Error("amount must be greater then zero");
    }

    if (!Number.isInteger(options.period)) {
      throw new Error("period is not an integer");
    }

    if (options.period <= 0) {
      throw new Error("period must be greater then zero");
    }

    const maxLockingPeriod = await this.getMaxLockingPeriod();

    if (options.period > maxLockingPeriod) {
      throw new Error("period must be less than or equal to maxLockingPeriod");
    }

    this.logContractFunctionCall("Locking4Reputation.lock", options);

    return this.wrapTransactionInvocation("Locking4Reputation.lock",
      options,
      this.contract.lock,
      [options.amount, options.period, options.lockerAddress]
    );
  }

  public getTotalLocked(): Promise<BigNumber> {
    this.logContractFunctionCall("Locking4Reputation.totalLocked");
    return this.contract.totalLocked();
  }
  public getTotalLockedLeft(): Promise<BigNumber> {
    this.logContractFunctionCall("Locking4Reputation.totalLockedLeft");
    return this.contract.totalLockedLeft();
  }
  public getTotalScore(): Promise<BigNumber> {
    this.logContractFunctionCall("Locking4Reputation.totalScore");
    return this.contract.totalScore();
  }
  public getLockingsCounter(): Promise<BigNumber> {
    this.logContractFunctionCall("Locking4Reputation.lockingsCounter");
    return this.contract.lockingsCounter();
  }
  public getReputationReward(): Promise<BigNumber> {
    this.logContractFunctionCall("Locking4Reputation.reputationReward");
    return this.contract.reputationReward();
  }
  public getReputationRewardLeft(): Promise<BigNumber> {
    this.logContractFunctionCall("Locking4Reputation.reputationRewardLeft");
    return this.contract.reputationRewardLeft();
  }
  public async getLockingEndTime(): Promise<Date> {
    this.logContractFunctionCall("Locking4Reputation.lockingEndTime");
    const dt = await this.contract.lockingEndTime();
    return new Date(dt);
  }
  public async getLockingStartTime(): Promise<Date> {
    this.logContractFunctionCall("Locking4Reputation.lockingStartTime");
    const dt = await this.contract.lockingStartTime();
    return new Date(dt);
  }
  public async getMaxLockingPeriod(): Promise<number> {
    this.logContractFunctionCall("Locking4Reputation.maxLockingPeriod");
    // returns milliseconds
    return (await this.contract.maxLockingPeriod()).toNumber();
  }
  public getAvatar(): Promise<Address> {
    this.logContractFunctionCall("Locking4Reputation.avatar");
    return this.contract.avatar();
  }

  /**
   * Returns promise of information about a locked amount for the given locker and lockerId.
   * @param lockerAddress 
   * @param lockerId 
   */
  public async getLockInfo(lockerAddress: Address, lockerId: Hash): Promise<Locker> {
    const lockInfo = await this.contract.lockers(lockerAddress, lockerId);
    return {
      amount: lockInfo.amount,
      releaseTime: new Date(lockInfo.releaseTime)
    }
  }

  /**
   * Returns promise of the score for a given locker.  Score determine the proportion of total reputation
   * that can be redeemed by the locker.
   * 
   * @param lockerAddress 
   */
  public getLockerScore(lockerAddress: Address): Promise<BigNumber> {
    return this.contract.scores(lockerAddress);
  }

  protected hydrated(): void {
    super.hydrated();
    /* tslint:disable:max-line-length */
    this.Redeem = this.createEventFetcherFactory<Locking4ReputationRedeemEventResult>(this.contract.Redeem);
    this.Release = this.createEventFetcherFactory<Locking4ReputationReleaseEventResult>(this.contract.Release);
    this.Lock = this.createEventFetcherFactory<Locking4ReputationLockEventResult>(this.contract.Lock);
    /* tslint:enable:max-line-length */
  }
}

export class Locking4ReputationType extends ContractWrapperFactory<Locking4ReputationWrapper> {

  public async deployed(): Promise<Locking4ReputationWrapper> {
    throw new Error("Locking4Reputation has not been deployed");
  }
}

export const Locking4ReputationFactory =
  new Locking4ReputationType(
    "Locking4Reputation",
    Locking4ReputationWrapper,
    new Web3EventService()) as Locking4ReputationType;

export interface Locking4ReputationRedeemEventResult {
  /**
   * indexed
   */
  _lockingId: Hash;
  /**
   * indexed
   */
  _beneficiary: Address;
  _amount: BigNumber;
}

export interface Locking4ReputationReleaseEventResult {
  /**
   * indexed
   */
  _lockingId: Hash;
  /**
   * indexed
   */
  _beneficiary: Address;
  _amount: BigNumber;
}

export interface Locking4ReputationLockEventResult {
  /**
   * indexed
   */
  _lockingId: Hash;
  _amount: BigNumber;
  _period: BigNumber;
  _locker: Address;
}

export interface InitializeOptions {
  avatarAddress: Address;
  lockingStartTime: Date;
  lockingEndTime: Date;
  /**
   * maximum period length in milliseconds
   */
  maxLockingPeriod: number;
  reputationReward: BigNumber | string;
}

export interface Locker {
  amount: BigNumber;
  releaseTime: Date;
}

export interface RedeemOptions {
  lockerAddress: Address;
  lockingId: Hash;
}

export interface ReleaseOptions {
  lockerAddress: Address;
  lockingId: Hash;
}

export interface LockingOptions {
  amount: BigNumber;
  /**
   * in milliseconds
   */
  period: number;
  lockerAddress: Address;
}
