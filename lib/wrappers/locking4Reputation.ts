"use strict";
import BigNumber from "bignumber.js";
import { Address, Hash } from "../commonTypes";
import { ArcTransactionResult, DecodedLogEntryEvent, IContractWrapperFactory } from "../iContractWrapperBase";
import { SchemeWrapperBase } from "../schemeWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { UtilsInternal } from "../utilsInternal";
import {
  EntityFetcherFactory,
  EventFetcherFactory,
  EventFetcherFilterObject,
  Web3EventService
} from "../web3EventService";

export abstract class Locking4ReputationWrapper extends SchemeWrapperBase {
  public name: string = "Locking4Reputation";
  public friendlyName: string = "Locking For Reputation";
  public factory: IContractWrapperFactory<Locking4ReputationWrapper> = null;

  public Redeem: EventFetcherFactory<Locking4ReputationRedeemEventResult>;
  public Release: EventFetcherFactory<Locking4ReputationReleaseEventResult>;
  public Lock: EventFetcherFactory<Locking4ReputationLockEventResult>;

  /**
   * Redeem reputation
   * @param options
   * @returns null ArcTransactionResult if there is nothing to redeem due to locker having no score
   */
  public async redeem(options: RedeemOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    if (!options.lockerAddress) {
      throw new Error("lockerAddress is not defined");
    }

    const hasLocked = await this.lockerHasLocked(options.lockerAddress);
    if (!hasLocked) {
      // because the Arc contract will revert in this case
      return Promise.resolve(null);
    }

    const errMsg = await this.getRedeemBlocker(options.lockerAddress);

    if (errMsg) {
      throw new Error(errMsg);
    }

    this.logContractFunctionCall("Locking4Reputation.redeem", options);

    return this.wrapTransactionInvocation("Locking4Reputation.redeem",
      options,
      this.contract.redeem,
      [options.lockerAddress]
    );
  }

  /**
   * Returns reason why can't redeem, or else null if can redeem
   * @param lockerAddress
   */
  public async getRedeemBlocker(lockerAddress: Address): Promise<string | null> {

    const lockingEndTime = await this.getLockingEndTime();
    const now = await UtilsInternal.lastBlockDate();

    if (now <= lockingEndTime) {
      return "the locking period has not ended";
    }

    const redeemEnableTime = await this.getRedeemEnableTime();

    if (now <= redeemEnableTime) {
      throw new Error(`nothing can be redeemed until after ${redeemEnableTime}`);
    }

    return null;
  }

  /**
   * Returns error message else null if can release
   * @param lockerAddress
   * @param lockId
   */
  public async getReleaseBlocker(lockerAddress: Address, lockId: Hash): Promise<string | null> {
    const lockInfo = await this.getLockInfo(lockerAddress, lockId);
    const now = await UtilsInternal.lastBlockDate();
    const amount = new BigNumber(lockInfo.amount);

    if (amount.lte(0)) {
      return "current locked amount must be greater than zero";
    }

    if (now <= lockInfo.releaseTime) {
      return "the lock period has not ended";
    }

    if (lockInfo.released) {
      return "lock is already released";
    }

    return null;
  }

  /**
   * Returns reason why can't lock, else null if can lock
   */
  public async getLockBlocker(options: LockingOptions): Promise<string | null> {

    if (!options.lockerAddress) {
      return "lockerAddress is not defined";
    }

    const amount = new BigNumber(options.amount);

    if (amount.isNaN()) {
      return "amount does not represent a number";
    }

    if (amount.lte(0)) {
      return "amount to lock must be greater than zero";
    }

    if (!Number.isInteger(options.period)) {
      return "period does not represent a number";
    }

    if (options.period <= 0) {
      return "period must be greater than zero";
    }

    const now = await UtilsInternal.lastBlockDate();

    const maxLockingPeriod = await this.getMaxLockingPeriod();

    if (options.period > maxLockingPeriod) {
      return "the locking period exceeds the maximum locking period";
    }

    const lockingStartTime = await this.getLockingStartTime();
    const lockingEndTime = await this.getLockingEndTime();

    if ((now < lockingStartTime) || (now > lockingEndTime)) {
      return "the locking period has not started or has expired";
    }

    return null;
  }

  public async getUserEarnedReputation(options: RedeemOptions): Promise<BigNumber> {

    if (!options.lockerAddress) {
      throw new Error("lockerAddress is not defined");
    }

    const hasLocked = await this.lockerHasLocked(options.lockerAddress);
    if (!hasLocked) {
      // because the Arc contract will revert in this case
      return new BigNumber(0);
    }

    const errMsg = await this.getRedeemBlocker(options.lockerAddress);

    if (errMsg) {
      throw new Error(errMsg);
    }

    this.logContractFunctionCall("Locking4Reputation.redeem.call", options);

    return this.contract.redeem.call(options.lockerAddress);
  }

  public async getLockerScore(lockerAddress: Address): Promise<BigNumber> {
    if (!lockerAddress) {
      throw new Error("lockerAddress is not defined");
    }
    const lockerInfo = await this.getLockerInfo(lockerAddress);
    return lockerInfo ? lockerInfo.score : new BigNumber(0);
  }

  public async lockerHasLocked(lockerAddress: Address): Promise<boolean> {
    if (!lockerAddress) {
      throw new Error("lockerAddress is not defined");
    }
    return (await this.getLockerScore(lockerAddress)).gt(0);
  }

  /**
   * Get a promise of the first date/time when anything can be redeemed
   */
  public async getRedeemEnableTime(): Promise<Date> {
    this.logContractFunctionCall("Locking4Reputation.redeemEnableTime");
    const seconds = await this.contract.redeemEnableTime();
    return new Date(seconds.toNumber() * 1000);
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
  /**
   * get total number of locks
   */
  public async getLockCount(): Promise<number> {
    this.logContractFunctionCall("Locking4Reputation.lockingsCounter");
    return (await this.contract.lockingsCounter()).toNumber();
  }

  /**
   * get the total reputation this contract will reward
   */
  public getReputationReward(): Promise<BigNumber> {
    this.logContractFunctionCall("Locking4Reputation.reputationReward");
    return this.contract.reputationReward();
  }
  /**
   * get the total reputation this contract has not yet rewarded
   */
  public getReputationRewardLeft(): Promise<BigNumber> {
    this.logContractFunctionCall("Locking4Reputation.reputationRewardLeft");
    return this.contract.reputationRewardLeft();
  }
  public async getLockingEndTime(): Promise<Date> {
    this.logContractFunctionCall("Locking4Reputation.lockingEndTime");
    const dt = await this.contract.lockingEndTime();
    return new Date(dt.toNumber() * 1000);
  }
  public async getLockingStartTime(): Promise<Date> {
    this.logContractFunctionCall("Locking4Reputation.lockingStartTime");
    const dt = await this.contract.lockingStartTime();
    return new Date(dt.toNumber() * 1000);
  }
  public async getMaxLockingPeriod(): Promise<number> {
    this.logContractFunctionCall("Locking4Reputation.maxLockingPeriod");
    // returns seconds
    return (await this.contract.maxLockingPeriod()).toNumber();
  }
  public getAvatar(): Promise<Address> {
    this.logContractFunctionCall("Locking4Reputation.avatar");
    return this.contract.avatar();
  }

  /**
   * Returns promise of information about a locked amount for the given locker and lockerId.
   * @param lockerAddress
   * @param lockId
   */
  public async getLockInfo(lockerAddress: Address, lockId: Hash): Promise<LockInfo> {
    this.logContractFunctionCall("Locking4Reputation.lockers", { lockerAddress, lockId });
    const lockInfo = await this.contract.lockers(lockerAddress, lockId);
    let amount = lockInfo[0];
    let released = false;

    if (amount.eq(0)) {
      amount = await this.getReleasedAmount(lockerAddress, lockId);
      released = amount.gt(0);  // should always be true!
    }

    return {
      amount,
      lockId,
      lockerAddress,
      releaseTime: new Date(lockInfo[1].toNumber() * 1000),
      released,
    };
  }

  /**
   * Returns the amount originally locked (which one can't obtain other than via
   * Release events once the lock is released).  Returns 0 if not released or event otherwise
   * not found.
   * @param lockerAddress
   * @param lockId
   */
  public async getReleasedAmount(lockerAddress: Address, lockId: Hash): Promise<BigNumber> {

    let amount = new BigNumber(0);
    const releasesFetcher = this.getReleases();
    const releases = await releasesFetcher(
      { _beneficiary: lockerAddress, _lockingId: lockId },
      { fromBlock: 0 }).get();

    if (releases.length) {
      amount = releases[0].amount;
    }
    return amount;
  }

  /**
   * Returns promise of information about the given locker, including the locker's score.
   * Score determines the proportion of total reputation that can be redeemed by the locker.
   *
   * @param lockerAddress
   */
  public async getLockerInfo(lockerAddress: Address): Promise<LockerInfo> {
    this.logContractFunctionCall("Locking4Reputation.scores", { lockerAddress });
    const score = await this.contract.scores(lockerAddress);
    return {
      lockerAddress,
      score,
    };
  }

  /**
   * Returns EntityEventFetcher that returns `LockInfo` for each `Lock` event.
   * Note this includes released locks.
   */
  public getLocks():
    EntityFetcherFactory<LockInfo, Locking4ReputationLockEventResult> {

    const web3EventService = new Web3EventService();
    return web3EventService.createEntityFetcherFactory(
      this.Lock,
      async (event: DecodedLogEntryEvent<Locking4ReputationLockEventResult>): Promise<LockInfo> => {
        return this.getLockInfo(event.args._locker, event.args._lockingId);
      });
  }

  /**
   * Returns EntityEventFetcher that returns `ReleaseInfo` for each `Release` event.
   */
  public getReleases():
    EntityFetcherFactory<ReleaseInfo, Locking4ReputationReleaseEventResult> {

    const web3EventService = new Web3EventService();
    return web3EventService.createEntityFetcherFactory(
      this.Release,
      async (event: DecodedLogEntryEvent<Locking4ReputationReleaseEventResult>): Promise<ReleaseInfo> => {
        return Promise.resolve({
          amount: event.args._amount,
          lockId: event.args._lockingId,
          lockerAddress: event.args._beneficiary,
        });
      });
  }

  /**
   * Returns EntityEventFetcher that returns `LockerInfo` for each account that has created a lock.
   * It is fired for an account whenever a `Lock`, `Redeem` or `Release` event is emitted.
   */
  public async getLockers(options: GetLockersOptions = {}): Promise<Array<LockerInfo>> {

    const filter: any = {};

    if (options.lockerAddress) {
      filter._locker = options.lockerAddress;
    }

    if (options.lockingId) {
      filter._lockingId = options.lockingId;
    }

    const fetcher = this.getLocks()(filter, options.filterObject);

    const lockInfos = await fetcher.get();
    const foundAddresses = new Set<Address>();

    const lockers = new Array<LockerInfo>();

    for (const lockInfo of lockInfos) {
      if (!foundAddresses.has(lockInfo.lockerAddress)) {
        foundAddresses.add(lockInfo.lockerAddress);
        const lockerInfo = await this.getLockerInfo(lockInfo.lockerAddress);
        lockers.push(lockerInfo);
      }
    }
    return lockers;
  }

  protected async _initialize(options: Partial<InitializeOptions>, checkmaxLockingPeriod: boolean = true)
    : Promise<void> {

    const avatar = await this.getAvatar();

    if (!UtilsInternal.isNullAddress(avatar)) {
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

    if (!options.redeemEnableTime) {
      throw new Error("redeemEnableTime is not defined");
    }

    if (options.lockingEndTime <= options.lockingStartTime) {
      throw new Error("lockingEndTime must be greater than lockingStartTime");
    }

    if (checkmaxLockingPeriod) {
      if (!Number.isInteger(options.maxLockingPeriod)) {
        throw new Error("maxLockingPeriod is not an integer");
      }

      if (options.maxLockingPeriod <= 0) {
        throw new Error("maxLockingPeriod must be greater than zero");
      }
    }

    if (!options.reputationReward) {
      throw new Error("reputationReward is not defined");
    }

    const reputationReward = new BigNumber(options.reputationReward);

    if (reputationReward.lte(0)) {
      throw new Error("reputationReward must be greater than zero");
    }
  }

  protected async _release(options: ReleaseOptions): Promise<void> {

    if (!options.lockerAddress) {
      throw new Error("lockerAddress is not defined");
    }

    if (!options.lockId) {
      throw new Error("lockId is not defined");
    }

    const errMsg = await this.getReleaseBlocker(options.lockerAddress, options.lockId);

    if (errMsg) {
      throw new Error(errMsg);
    }
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

export interface Locking4ReputationRedeemEventResult {
  /**
   * indexed
   */
  _lockingId: Hash;
  /**
   * indexed
   */
  _beneficiary: Address;
  /**
   * in Wei
   */
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
  /**
   * in Wei
   */
  _amount: BigNumber;
}

export interface Locking4ReputationLockEventResult {
  /**
   * indexed
   */
  _lockingId: Hash;
  /**
   * in Wei
   */
  _amount: BigNumber;
  _period: BigNumber;
  /**
   * indexed
   */
  _locker: Address;
}

export interface InitializeOptions {
  avatarAddress: Address;
  lockingEndTime: Date;
  lockingStartTime: Date;
  /**
   * maximum period length in seconds
   */
  maxLockingPeriod: number;
  /**
   * Reputation cannot be redeemed until after this time, even if redeeming has been enabled.
   */
  redeemEnableTime: Date;
  reputationReward: BigNumber | string;
}

export interface LockInfo {
  lockerAddress: Address;
  /**
   * in Wei
   */
  amount: BigNumber;
  lockId: Hash;
  released: boolean;
  releaseTime: Date;
}

export interface ReleaseInfo {
  lockerAddress: Address;
  /**
   * in Wei
   */
  amount: BigNumber;
  lockId: Hash;
}

export interface LockerInfo {
  lockerAddress: Address;
  score: BigNumber;
}

export interface RedeemOptions {
  lockerAddress: Address;
}

export interface ReleaseOptions {
  lockerAddress: Address;
  lockId: Hash;
}

export interface LockingOptions {
  /**
   * in Wei
   */
  amount: BigNumber | string;
  /**
   * the number of seconds the amount should be locked
   */
  period: number;
  lockerAddress: Address;
}

export interface GetLockersOptions {
  lockerAddress?: Address;
  lockingId?: Hash;
  /**
   * Web3 event filter options.  Typically something like `{ fromBlock: 0 }`.
   * Note if you don't want Arc.js to suppress duplicate events, set `suppressDups` to false.
   */
  filterObject?: EventFetcherFilterObject;
}
