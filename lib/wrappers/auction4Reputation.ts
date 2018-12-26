"use strict";
import BigNumber from "bignumber.js";
import { DecodedLogEntry } from "web3";
import { Address, Hash } from "../commonTypes";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { SchemeWrapperBase } from "../schemeWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Utils } from "../utils";
import { UtilsInternal } from "../utilsInternal";
import { EventFetcherFactory, Web3EventService } from "../web3EventService";
import { WrapperService } from "../wrapperService";
import { DaoTokenWrapper } from "./daoToken";
import { StandardTokenWrapper } from "./standardToken";

export class Auction4ReputationWrapper extends SchemeWrapperBase {
  public name: string = "Auction4Reputation";
  public friendlyName: string = "Auction For Reputation";
  public factory: IContractWrapperFactory<Auction4ReputationWrapper> = Auction4ReputationFactory;

  public Bid: EventFetcherFactory<Auction4ReputationBidEventResult>;
  public Redeem: EventFetcherFactory<Auction4ReputationRedeemEventResult>;

  public async initialize(options: Auction4ReputationInitializeOptions): Promise<ArcTransactionResult> {

    const avatar = await this.getAvatar();

    if (!UtilsInternal.isNullAddress(avatar)) {
      throw new Error("you can only call initialize once");
    }

    if (!options.avatarAddress) {
      throw new Error("avatarAddress is not defined");
    }

    if (!options.tokenAddress) {
      throw new Error("tokenAddress is not defined");
    }

    if (!options.walletAddress) {
      throw new Error("walletAddress is not defined");
    }

    if (!options.auctionsEndTime) {
      throw new Error("auctionsEndTime is not defined");
    }

    if (!options.auctionsStartTime) {
      throw new Error("auctionsStartTime is not defined");
    }

    if (options.auctionsEndTime <= options.auctionsStartTime) {
      throw new Error("auctionsEndTime must be greater than auctionsStartTime");
    }

    if (!Number.isInteger(options.numberOfAuctions)) {
      throw new Error("numberOfAuctions is not an integer");
    }

    if (options.numberOfAuctions <= 0) {
      throw new Error("maxLockingPeriod must be greater than zero");
    }

    if (!options.reputationReward) {
      throw new Error("reputationReward is not defined");
    }

    if (!options.redeemEnableTime) {
      throw new Error("redeemEnableTime is not defined");
    }

    const reputationReward = new BigNumber(options.reputationReward);

    if (reputationReward.lte(0)) {
      throw new Error("reputationReward must be greater than zero");
    }

    this.logContractFunctionCall("Auction4Reputation.initialize", options);

    return this.wrapTransactionInvocation("Auction4Reputation.initialize",
      options,
      this.contract.initialize,
      [
        options.avatarAddress,
        options.reputationReward,
        options.auctionsStartTime.getTime() / 1000,
        options.auctionsEndTime.getTime() / 1000,
        options.numberOfAuctions,
        options.redeemEnableTime.getTime() / 1000,
        options.tokenAddress,
        options.walletAddress,
      ]
    );
  }

  public async redeem(options: Auction4ReputationRedeemOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    if (!Number.isInteger(options.auctionId)) {
      throw new Error("auctionId is not an integer");
    }

    if (options.auctionId < 0) {
      throw new Error("auctionId must be greater than or equal to zero");
    }

    const bid = await this.getBid(options.beneficiaryAddress, options.auctionId);
    if (bid.lte(0)) {
      // because the Arc contract will revert in this case
      return Promise.resolve(null);
    }

    const errMsg = await this.getRedeemBlocker(options);

    if (errMsg) {
      throw new Error(errMsg);
    }

    this.logContractFunctionCall("Auction4Reputation.redeem", options);

    return this.wrapTransactionInvocation("Auction4Reputation.redeem",
      options,
      this.contract.redeem,
      [options.beneficiaryAddress, options.auctionId]
    );
  }

  /**
   * Returns reason why can't redeem, or else null if can redeem
   * @param lockerAddress
   */
  public async getRedeemBlocker(options: Auction4ReputationRedeemOptions): Promise<string | null> {

    const redeemEnableTime = await this.getRedeemEnableTime();
    const now = await UtilsInternal.lastBlockDate();

    if (now <= redeemEnableTime) {
      throw new Error(`nothing can be redeemed until after ${redeemEnableTime}`);
    }

    const endTime = await this.getAuctionsEndTime();

    if (now <= endTime) {
      throw new Error("the auction period has not passed");
    }

    return null;
  }

  /**
   * Returns reason why can't bid, else null if can bid
   */
  public async getBidBlocker(options: Auction4ReputationBidOptions): Promise<string | null> {
    const amount = new BigNumber(options.amount);

    if (amount.lte(0)) {
      return "amount to bid must be greater than zero";
    }

    const startTime = await this.getAuctionsStartTime();
    const endTime = await this.getAuctionsEndTime();
    const now = await UtilsInternal.lastBlockDate();

    if ((now > endTime) || (now < startTime)) {
      return "bidding is not within the allowed bidding period";
    }

    const balance = await DaoTokenWrapper.getGenTokenBalance(await Utils.getDefaultAccount());

    if (balance.lt(amount)) {
      return "the account has insufficient GEN to bid the requested amount";
    }

    return null;
  }

  /**
   * Bid on behalf of the current account
   * @param options
   */
  public async bid(options: Auction4ReputationBidOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    const msg = await this.getBidBlocker(options);
    if (msg) {
      throw new Error(msg);
    }

    this.logContractFunctionCall("Auction4Reputation.bid", options);

    return this.wrapTransactionInvocation("Auction4Reputation.bid",
      options,
      this.contract.bid,
      [options.amount]
    );
  }

  /**
   * transfer bidded tokens to the wallet
   * @param options
   */
  public async transferToWallet(options: TxGeneratingFunctionOptions = {})
    : Promise<ArcTransactionResult> {

    const endTime = await this.getAuctionsEndTime();
    const now = await UtilsInternal.lastBlockDate();

    if (now <= endTime) {
      throw new Error("the bidding period has not yet expired");
    }

    this.logContractFunctionCall("Auction4Reputation.transferToWallet", options);

    return this.wrapTransactionInvocation("Auction4Reputation.transferToWallet",
      options,
      this.contract.transferToWallet,
      []
    );
  }

  /**
   * get promise of the amount the account has bid on the given auction.
   * @param bidderAddress
   * @param auctionId
   */
  public getBid(bidderAddress: Address, auctionId: number): Promise<BigNumber> {

    if (!bidderAddress) {
      throw new Error("bidderAddress is not defined");
    }

    if (!Number.isInteger(auctionId)) {
      throw new Error("auctionId is not an integer");
    }

    if (auctionId < 0) {
      throw new Error("auctionId must be greater than or equal to zero");
    }

    this.validateAuctionId(auctionId);

    this.logContractFunctionCall("Auction4Reputation.getBid", { bidderAddress, auctionId });
    return this.contract.getBid(bidderAddress, auctionId);
  }

  public async getUserEarnedReputation(options: Auction4ReputationRedeemOptions): Promise<BigNumber> {
    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    if (!Number.isInteger(options.auctionId)) {
      throw new Error("auctionId is not an integer");
    }

    if (options.auctionId < 0) {
      throw new Error("auctionId must be greater than or equal to zero");
    }

    const bid = await this.getBid(options.beneficiaryAddress, options.auctionId);
    // because the Arc contract will revert in this case
    if (bid.eq(0)) {
      return Promise.resolve(new BigNumber(0));
    }

    const errMsg = await this.getRedeemBlocker(options);

    if (errMsg) {
      throw new Error(errMsg);
    }

    this.logContractFunctionCall("Auction4Reputation.redeem.call", options);

    return this.contract.redeem.call(options.beneficiaryAddress, options.auctionId);
  }

  /**
   * get a promise of an array of auction ids and amounts in which the given account has placed a bid,
   * or all auctions if beneficiaryAddressis not supplied
   * @param beneficiaryAddress optional
   */
  public async getBids(beneficiaryAddress?: Address): Promise<Array<GetBidAuctionIdsResult>> {

    const filter = beneficiaryAddress ? { _bidder: beneficiaryAddress } : {};

    const bids = await this.Bid(filter, { fromBlock: 0 }).get();

    return bids.map((bid: DecodedLogEntry<Auction4ReputationBidEventResult>): GetBidAuctionIdsResult => {
      return {
        amount: bid.args._amount,
        auctionId: bid.args._auctionId.toNumber(),
      };
    });
  }

  /**
   * Get a promise of the first date/time when anything can be redeemed
   */
  public async getRedeemEnableTime(): Promise<Date> {
    this.logContractFunctionCall("Auction4Reputation.redeemEnableTime");
    const seconds = await this.contract.redeemEnableTime();
    return new Date(seconds.toNumber() * 1000);
  }
  /**
   * Get a promise of the total reputation rewardable across all the auctions
   */
  public async getReputationReward(): Promise<BigNumber> {
    this.logContractFunctionCall("Auction4Reputation.reputationReward");
    const auctionReputationReward = await this.contract.auctionReputationReward();
    const numAuctions = await this.getNumberOfAuctions();
    return auctionReputationReward.mul(numAuctions);
  }
  public getReputationRewardLeft(): Promise<BigNumber> {
    this.logContractFunctionCall("Auction4Reputation.reputationRewardLeft");
    return this.contract.reputationRewardLeft();
  }
  public async getAuctionsEndTime(): Promise<Date> {
    this.logContractFunctionCall("Auction4Reputation.auctionsEndTime");
    const dt = await this.contract.auctionsEndTime();
    return new Date(dt.toNumber() * 1000);
  }
  public async getAuctionsStartTime(): Promise<Date> {
    this.logContractFunctionCall("Auction4Reputation.auctionsStartTime");
    const dt = await this.contract.auctionsStartTime();
    return new Date(dt.toNumber() * 1000);
  }
  public async getNumberOfAuctions(): Promise<number> {
    this.logContractFunctionCall("Auction4Reputation.numberOfAuctions");
    return (await this.contract.numberOfAuctions()).toNumber();
  }
  /**
   * Get a promise of  the reputation reward of a single auction
   */
  public auctionReputationReward(): Promise<BigNumber> {
    this.logContractFunctionCall("Auction4Reputation.auctionReputationReward");
    return this.contract.auctionReputationReward();
  }

  /**
   * Return promise of 0-based id of the current auction.  Returns a negative number if the auction
   * has not yet begun.  If auction is over then may return an id for an auction that doesn't exist.
   */
  public async getCurrentAuctionId(): Promise<number> {
    const auctionPeriod = (await this.getAuctionPeriod()) * 1000;
    const auctionsStartTime = (await this.getAuctionsStartTime()).getTime();
    return Math.floor((Date.now() - auctionsStartTime) / auctionPeriod);
  }
  /**
   * Get a promise of the number of seconds in a single auction
   */
  public async getAuctionPeriod(): Promise<number> {
    this.logContractFunctionCall("Auction4Reputation.auctionPeriod");
    return (await this.contract.auctionPeriod()).toNumber();
  }
  public async getToken(): Promise<StandardTokenWrapper> {
    this.logContractFunctionCall("Auction4Reputation.token");
    const address = await this.contract.token();
    return WrapperService.factories.StandardToken.at(address);
  }
  public async getWallet(): Promise<Address> {
    this.logContractFunctionCall("Auction4Reputation.wallet");
    return await this.contract.wallet();
  }
  public getAvatar(): Promise<Address> {
    this.logContractFunctionCall("Auction4Reputation.avatar");
    return this.contract.avatar();
  }

  /**
   * Get a promise of the total amount bid for a given auction.
   */
  public async getAuctionTotalBid(auctionId: number): Promise<BigNumber> {
    this.validateAuctionId(auctionId);
    this.logContractFunctionCall("Auction4Reputation.auctions", { auctionId });
    return this.contract.auctions(new BigNumber(auctionId));
  }

  protected hydrated(): void {
    super.hydrated();
    /* tslint:disable:max-line-length */
    this.Bid = this.createEventFetcherFactory<Auction4ReputationBidEventResult>(this.contract.Bid);
    this.Redeem = this.createEventFetcherFactory<Auction4ReputationRedeemEventResult>(this.contract.Redeem);
    /* tslint:enable:max-line-length */
  }

  private validateAuctionId(auctionId: number): void {

    if (typeof (auctionId) === "undefined") {
      throw new Error("auctionId is not defined");
    }

    if (auctionId < 0) {
      throw new Error("auctionId must be greater or equal to 0");
    }

    if (!Number.isInteger(auctionId)) {
      throw new Error("auctionId must be an integer number");
    }
  }
}

export class Auction4ReputationType extends ContractWrapperFactory<Auction4ReputationWrapper> {

  public async deployed(): Promise<Auction4ReputationWrapper> {
    throw new Error("Auction4Reputation has not been deployed");
  }
}

export const Auction4ReputationFactory =
  new Auction4ReputationType(
    "Auction4Reputation",
    Auction4ReputationWrapper,
    new Web3EventService()) as Auction4ReputationType;

export interface Auction4ReputationRedeemEventResult {
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

export interface Auction4ReputationReleaseEventResult {
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

export interface Auction4ReputationInitializeOptions {
  avatarAddress: Address;
  auctionsEndTime: Date;
  auctionsStartTime: Date;
  numberOfAuctions: number;
  /**
   * Reputation cannot be redeemed until after this time, even if redeeming has been enabled.
   */
  redeemEnableTime: Date;
  reputationReward: BigNumber | string;
  tokenAddress: Address;
  walletAddress: Address;
}

export interface Auction4ReputationRedeemOptions {
  /**
   * 0-based index of the auction.
   */
  auctionId: number;
  beneficiaryAddress: Address;
}

export interface Auction4ReputationBidOptions {
  amount: BigNumber | string;
}

export interface Auction4ReputationBidEventResult {
  _amount: BigNumber;
  /**
   * 0-based index of the auction.
   * indexed
   */
  _auctionId: BigNumber;
  /**
   * indexed
   */
  _bidder: Address;
}

export interface Auction4ReputationRedeemEventResult {
  _amount: BigNumber;
  /**
   * 0-based index of the auction.
   * indexed
   */
  _auctionId: BigNumber;
  /**
   * indexed
   */
  _beneficiary: Address;
}

export interface GetBidAuctionIdsResult {
  auctionId: number;
  amount: BigNumber;
}
