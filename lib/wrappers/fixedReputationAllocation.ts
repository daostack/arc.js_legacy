"use strict";
import BigNumber from "bignumber.js";
import { Address } from "../commonTypes";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { SchemeWrapperBase } from "../schemeWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { UtilsInternal } from "../utilsInternal";
import { EventFetcherFactory, Web3EventService } from "../web3EventService";

export class FixedReputationAllocationWrapper extends SchemeWrapperBase {
  public name: string = "FixedReputationAllocation";
  public friendlyName: string = "Fixed Reputation Allocation";
  public factory: IContractWrapperFactory<FixedReputationAllocationWrapper> = FixedReputationAllocationFactory;

  public Redeem: EventFetcherFactory<FixedReputationAllocationRedeemEventResult>;
  public BeneficiaryAddressAdded: EventFetcherFactory<BeneficiaryAddressAddedEventResult>;

  public async initialize(options: FixedReputationAllocationInitializeOptions): Promise<ArcTransactionResult> {

    const avatar = await this.getAvatar();

    if (!UtilsInternal.isNullAddress(avatar)) {
      throw new Error("you can only call initialize once");
    }

    if (!options.avatarAddress) {
      throw new Error("avatarAddress is not defined");
    }

    if (!options.redeemEnableTime) {
      throw new Error("redeemEnableTime is not defined");
    }

    if (!options.reputationReward) {
      throw new Error("reputationReward is not defined");
    }

    const reputationReward = new BigNumber(options.reputationReward);

    if (reputationReward.lte(0)) {
      throw new Error("reputationReward must be greater than zero");
    }

    this.logContractFunctionCall("FixedReputationAllocation.initialize", options);

    return this.wrapTransactionInvocation("FixedReputationAllocation.initialize",
      options,
      this.contract.initialize,
      [
        options.avatarAddress,
        options.reputationReward,
        options.redeemEnableTime.getTime() / 1000,
      ]
    );
  }

  public async redeem(options: FixedReputationAllocationRedeemOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    await this.validateEnabled(true);

    const now = await UtilsInternal.lastBlockDate();

    const redeemEnableTime = await this.getRedeemEnableTime();

    if (now <= redeemEnableTime) {
      throw new Error(`nothing can be redeemed until after ${redeemEnableTime}`);
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    this.logContractFunctionCall("FixedReputationAllocation.redeem", options);

    return this.wrapTransactionInvocation("FixedReputationAllocation.redeem",
      options,
      this.contract.redeem,
      [options.beneficiaryAddress]
    );
  }

  public async addBeneficiary(options: AddBeneficiaryOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    await this.validateEnabled(false);

    this.logContractFunctionCall("FixedReputationAllocation.addBeneficiary", options);

    return this.wrapTransactionInvocation("FixedReputationAllocation.addBeneficiary",
      options,
      this.contract.addBeneficiary,
      [options.beneficiaryAddress]
    );
  }

  public async addBeneficiaries(options: AddBeneficiariesOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.beneficiaryAddresses || !options.beneficiaryAddresses.length) {
      throw new Error("beneficiaryAddresses is empty or not defined");
    }

    await this.validateEnabled(false);

    this.logContractFunctionCall("FixedReputationAllocation.addBeneficiaries", options);

    return this.wrapTransactionInvocation("FixedReputationAllocation.addBeneficiaries",
      options,
      this.contract.addBeneficiaries,
      [options.beneficiaryAddresses]
    );
  }

  public setEnabled(options: TxGeneratingFunctionOptions = {}): Promise<ArcTransactionResult> {

    this.logContractFunctionCall("FixedReputationAllocation.enable", options);

    return this.wrapTransactionInvocation("FixedReputationAllocation.enable",
      options,
      this.contract.enable,
      []
    );
  }

  /**
   * Get a promise of the first date/time when anything can be redeemed
   */
  public async getRedeemEnableTime(): Promise<Date> {
    this.logContractFunctionCall("FixedReputationAllocation.redeemEnableTime");
    const seconds = await this.contract.redeemEnableTime();
    return new Date(seconds.toNumber() * 1000);
  }

  /**
   * Get a promise of the total reputation potentially redeemable
   */
  public getReputationReward(): Promise<BigNumber> {
    this.logContractFunctionCall("FixedReputationAllocation.reputationReward");
    return this.contract.reputationReward();
  }
  public getIsEnable(): Promise<boolean> {
    this.logContractFunctionCall("FixedReputationAllocation.isEnable");
    return this.contract.isEnable();
  }
  public async getNumberOfBeneficiaries(): Promise<number> {
    this.logContractFunctionCall("FixedReputationAllocation.numberOfBeneficiaries");
    const count = await this.contract.numberOfBeneficiaries();
    return count.toNumber();
  }

  /**
   * Get a promise of reputation rewardable per beneficiary
   */
  public async getBeneficiaryReward(): Promise<BigNumber> {
    this.logContractFunctionCall("FixedReputationAllocation.beneficiaryReward");
    return this.contract.beneficiaryReward();
  }
  public getAvatar(): Promise<Address> {
    this.logContractFunctionCall("FixedReputationAllocation.avatar");
    return this.contract.avatar();
  }

  /**
   * Get a promise of boolean indicating whether the given beneficiary has been added.
   *
   * @param beneficiaryAddress
   */
  public async getBeneficiaryAdded(beneficiaryAddress: Address): Promise<boolean> {
    this.logContractFunctionCall("FixedReputationAllocation.beneficiaries", { beneficiaryAddress });
    return this.contract.beneficiaries(beneficiaryAddress);
  }

  protected hydrated(): void {
    super.hydrated();
    /* tslint:disable:max-line-length */
    this.BeneficiaryAddressAdded = this.createEventFetcherFactory<BeneficiaryAddressAddedEventResult>(this.contract.BeneficiaryAddressAdded);
    this.Redeem = this.createEventFetcherFactory<FixedReputationAllocationRedeemEventResult>(this.contract.Redeem);
    /* tslint:enable:max-line-length */
  }

  private async validateEnabled(mustBeEnabled: boolean): Promise<void> {
    const enabled = await this.getIsEnable();

    if (enabled !== mustBeEnabled) {
      throw new Error(`${mustBeEnabled} ? "The contract is not enabled" : The contract is enabled`);
    }
  }
}

export class FixedReputationAllocationType extends ContractWrapperFactory<FixedReputationAllocationWrapper> {

  public async deployed(): Promise<FixedReputationAllocationWrapper> {
    throw new Error("FixedReputationAllocation has not been deployed");
  }
}

export const FixedReputationAllocationFactory =
  new FixedReputationAllocationType(
    "FixedReputationAllocation",
    FixedReputationAllocationWrapper,
    new Web3EventService()) as FixedReputationAllocationType;

export interface FixedReputationAllocationInitializeOptions {
  avatarAddress: Address;
  /**
   * Reputation cannot be redeemed until after this time, even if redeeming has been enabled.
   */
  redeemEnableTime: Date;
  reputationReward: BigNumber | string;
}

export interface FixedReputationAllocationRedeemOptions {
  beneficiaryAddress: Address;
}

export interface AddBeneficiaryOptions {
  beneficiaryAddress: Address;
}

export interface AddBeneficiariesOptions {
  beneficiaryAddresses: Array<Address>;
}

export interface BeneficiaryAddressAddedEventResult {
  /**
   * indexed
   */
  _beneficiary: Address;
}

export interface FixedReputationAllocationRedeemEventResult {
  _amount: BigNumber;
  /**
   * indexed
   */
  _beneficiary: Address;
}
