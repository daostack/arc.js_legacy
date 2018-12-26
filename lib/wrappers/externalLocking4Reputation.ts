"use strict";
import BigNumber from "bignumber.js";
import { promisify } from "es6-promisify";
import { Address } from "../commonTypes";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Utils } from "../utils";
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
      return "account has already executed a claim";
    }

    const currentAccount = (await Utils.getDefaultAccount()).toLowerCase();
    let lockerAddress: Address | number = options.lockerAddress;

    if (lockerAddress && (lockerAddress.toLowerCase() === currentAccount)) {
      lockerAddress = 0;
    }

    if (lockerAddress && !(await this.isRegistered(lockerAddress as Address))) {
      throw new Error(`account does not own any MGN tokens`);
    }
  }

  /**
   * Claim the MGN tokens and lock them.  Provide `lockerAddress` to claim on their behalf,
   * otherwise claims on behalf of the caller.
   * @param options
   */
  public async lock(
    options: ExternalLockingClaimOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    const msg = await this.getLockBlocker(options);
    if (msg) {
      throw new Error(msg);
    }

    const currentAccount = (await Utils.getDefaultAccount()).toLowerCase();
    let lockerAddress: Address | number = options.lockerAddress;

    if (lockerAddress && (lockerAddress.toLowerCase() === currentAccount)) {
      lockerAddress = 0;
    }

    this.logContractFunctionCall("ExternalLocking4Reputation.claim", options);

    return this.wrapTransactionInvocation("ExternalLocking4Reputation.claim",
      options,
      this.contract.claim,
      [lockerAddress]
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

  /**
   * Returns promise of whether the given locker has tokens that can be activated in the given MGN token contract.
   * Assumes that MGN token API is:  `lockedTokenBalances(address)`.
   *
   * @param lockerAddress
   * @param mgnTokenAddress
   */
  public async hasMgnToActivate(lockerAddress: Address): Promise<boolean> {

    const web3 = await Utils.getWeb3();

    const mgnTokenAddress = await this.getExternalLockingContract();

    // tslint:disable
    const mgnToken = await web3.eth.contract(
      [
        {
          constant: true,
          inputs: [
            {
              name: "",
              type: "address"
            },
          ],
          name: "lockedTokenBalances",
          outputs: [
            {
              name: "",
              type: "uint256"
            },
          ],
          payable: false,
          stateMutability: "view",
          "type": "function",
        }
      ] as any
    ).at(mgnTokenAddress);
    // tslint:enable

    const balance = await promisify((callback: any): any =>
      mgnToken.lockedTokenBalances(lockerAddress, callback))() as any;

    return balance.gt(0);
  }

  /**
   * Returns promise of a boolean indicating whether the given address has registered
   * to have their tokens claimed for them (see `register`).
   * @param lockerAddress
   */
  public isRegistered(lockerAddress: Address): Promise<boolean> {
    this.logContractFunctionCall("ExternalLocking4Reputation.registrar", { lockerAddress });
    return this.contract.registrar(lockerAddress);
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
