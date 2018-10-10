"use strict";
import BigNumber from "bignumber.js";
import { Address } from "../commonTypes";
import { ContractWrapperBase } from "../contractWrapperBase";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { UtilsInternal } from "../utilsInternal";
import { EventFetcherFactory, Web3EventService } from "../web3EventService";

export class FixReputationAllocationWrapper extends ContractWrapperBase {
  public name: string = "FixReputationAllocation";
  public friendlyName: string = "Fixed Reputation Allocation";
  public factory: IContractWrapperFactory<FixReputationAllocationWrapper> = FixReputationAllocationFactory;

  public Redeem: EventFetcherFactory<FixReputationAllocationRedeemEventResult>;
  public BeneficiaryAddressAdded: EventFetcherFactory<BeneficiaryAddressAddedEventResult>;

  public async initialize(options: FixReputationAllocationInitializeOptions): Promise<ArcTransactionResult> {

    const avatar = await this.getAvatar();

    if (!UtilsInternal.isNullAddress(avatar)) {
      throw new Error("you can only call initialize once");
    }

    if (!options.avatarAddress) {
      throw new Error("avatarAddress is not defined");
    }

    // if (!options.redeemEnableTime) {
    //   throw new Error("redeemEnableTime is not defined");
    // }

    if (!options.reputationReward) {
      throw new Error("reputationReward is not defined");
    }

    const reputationReward = new BigNumber(options.reputationReward);

    if (reputationReward.lte(0)) {
      throw new Error("reputationReward must be greater than zero");
    }

    this.logContractFunctionCall("FixReputationAllocation.initialize", options);

    return this.wrapTransactionInvocation("FixReputationAllocation.initialize",
      options,
      this.contract.initialize,
      [options.avatarAddress,
      options.reputationReward,
        // , options.redeemEnableTime.getTime() / 1000
      ]
    );
  }

  public async redeem(options: FixReputationAllocationRedeemOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    await this.validateEnabled(true);

    // const now = new Date();
    // const redeemEnableTime = await this.getRedeemEnableTime();

    // if (now <= redeemEnableTime) {
    //   throw new Error(`nothing can be redeemed until after ${redeemEnableTime}`);
    // }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    this.logContractFunctionCall("FixReputationAllocation.redeem", options);

    return this.wrapTransactionInvocation("FixReputationAllocation.redeem",
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

    this.logContractFunctionCall("FixReputationAllocation.addBeneficiary", options);

    return this.wrapTransactionInvocation("FixReputationAllocation.addBeneficiary",
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

    this.logContractFunctionCall("FixReputationAllocation.addBeneficiaries", options);

    return this.wrapTransactionInvocation("FixReputationAllocation.addBeneficiaries",
      options,
      this.contract.addBeneficiaries,
      [options.beneficiaryAddresses]
    );
  }

  public setEnabled(options: TxGeneratingFunctionOptions = {}): Promise<ArcTransactionResult> {

    this.logContractFunctionCall("FixReputationAllocation.enable", options);

    return this.wrapTransactionInvocation("FixReputationAllocation.enable",
      options,
      this.contract.enable,
      []
    );
  }

  /**
   * Get a promise of the first date/time when anything can be redeemed
   */
  // public async getRedeemEnableTime(): Promise<Date> {
  //   this.logContractFunctionCall("FixReputationAllocation.redeemEnableTime");
  //   const seconds = await this.contract.redeemEnableTime();
  //   return new Date(seconds.toNumber() * 1000);
  // }

  /**
   * Get a promise of the total reputation potentially redeemable
   */
  public getReputationReward(): Promise<BigNumber> {
    this.logContractFunctionCall("FixReputationAllocation.reputationReward");
    return this.contract.reputationReward();
  }
  public getIsEnable(): Promise<boolean> {
    this.logContractFunctionCall("FixReputationAllocation.isEnable");
    return this.contract.isEnable();
  }
  public async getNumberOfBeneficiaries(): Promise<number> {
    this.logContractFunctionCall("FixReputationAllocation.numberOfBeneficiaries");
    const count = await this.contract.numberOfBeneficiaries();
    return count.toNumber();
  }

  /**
   * Get a promise of reputation rewardable per beneficiary
   */
  public async getBeneficiaryReward(): Promise<BigNumber> {
    this.logContractFunctionCall("FixReputationAllocation.beneficiaryReward");
    return this.contract.beneficiaryReward();
  }
  public getAvatar(): Promise<Address> {
    this.logContractFunctionCall("FixReputationAllocation.avatar");
    return this.contract.avatar();
  }

  /**
   * Get a promise of boolean indicating whether the given beneficiary has been added.
   *
   * @param beneficiaryAddress
   */
  public async getBeneficiaryAdded(beneficiaryAddress: Address): Promise<boolean> {
    this.logContractFunctionCall("FixReputationAllocation.beneficiaries", { beneficiaryAddress });
    return this.contract.beneficiaries(beneficiaryAddress);
  }

  protected hydrated(): void {
    super.hydrated();
    /* tslint:disable:max-line-length */
    this.BeneficiaryAddressAdded = this.createEventFetcherFactory<BeneficiaryAddressAddedEventResult>(this.contract.BeneficiaryAddressAdded);
    this.Redeem = this.createEventFetcherFactory<FixReputationAllocationRedeemEventResult>(this.contract.Redeem);
    /* tslint:enable:max-line-length */
  }

  private async validateEnabled(mustBeEnabled: boolean): Promise<void> {
    const enabled = await this.getIsEnable();

    if (enabled !== mustBeEnabled) {
      throw new Error(`${mustBeEnabled} ? "The contract is not enabled" : The contract is enabled`);
    }
  }
}

export class FixReputationAllocationType extends ContractWrapperFactory<FixReputationAllocationWrapper> {

  public async deployed(): Promise<FixReputationAllocationWrapper> {
    throw new Error("FixReputationAllocation has not been deployed");
  }
}

export const FixReputationAllocationFactory =
  new FixReputationAllocationType(
    "FixReputationAllocation",
    FixReputationAllocationWrapper,
    new Web3EventService()) as FixReputationAllocationType;

export interface FixReputationAllocationInitializeOptions {
  avatarAddress: Address;
  /**
   * Reputation cannot be redeemed before this time, even if redeeming has been enabled.
   */
  // redeemEnableTime: Date;
  reputationReward: BigNumber | string;
}

export interface FixReputationAllocationRedeemOptions {
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

export interface FixReputationAllocationRedeemEventResult {
  _amount: BigNumber;
  /**
   * indexed
   */
  _beneficiary: Address;
}
