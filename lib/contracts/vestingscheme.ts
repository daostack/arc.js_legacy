"use strict";
import * as BigNumber from "bignumber.js";
import dopts = require("default-options");
import { Address, fnVoid, Hash } from "../commonTypes";
import { Config } from "../config";
import ContractWrapperFactory from "../ContractWrapperFactory";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  DecodedLogEntryEvent,
  EventFetcherFactory,
  ExtendTruffleContract,
  StandardSchemeParams,
  TransactionReceiptTruffle,
} from "../ExtendTruffleContract";
import { Utils } from "../utils";
import { ProposalExecutedEventResult } from "./commonEventInterfaces";

/**
 * see CreateVestingAgreementConfig
 */
const defaultCreateOptions = {
  amountPerPeriod: undefined,
  beneficiary: undefined,
  cliffInPeriods: undefined,
  numOfAgreedPeriods: undefined,
  periodLength: undefined,
  returnOnCancelAddress: undefined,
  signaturesReqToCancel: undefined,
  signers: undefined,
  startingBlock: null,
};

export class VestingSchemeWrapper extends ExtendTruffleContract {

  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult> = this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted");
  public AgreementProposal: EventFetcherFactory<AgreementProposalEventResult> = this.createEventFetcherFactory<AgreementProposalEventResult>("AgreementProposal");
  public NewVestedAgreement: EventFetcherFactory<NewVestedAgreementEventResult> = this.createEventFetcherFactory<NewVestedAgreementEventResult>("NewVestedAgreement");
  public SignToCancelAgreement: EventFetcherFactory<SignToCancelAgreementEventResult> = this.createEventFetcherFactory<SignToCancelAgreementEventResult>("SignToCancelAgreement");
  public RevokeSignToCancelAgreement: EventFetcherFactory<RevokeSignToCancelAgreementEventResult> = this.createEventFetcherFactory<RevokeSignToCancelAgreementEventResult>("RevokeSignToCancelAgreement");
  public AgreementCancel: EventFetcherFactory<AgreementCancelEventResult> = this.createEventFetcherFactory<AgreementCancelEventResult>("AgreementCancel");
  public Collect: EventFetcherFactory<CollectEventResult> = this.createEventFetcherFactory<CollectEventResult>("Collect");
  /* tslint:enable:max-line-length */

  /**
   * Propose a new vesting agreement
   * @param {ProposeVestingAgreementConfig} opts
   */
  public async propose(
    opts: ProposeVestingAgreementConfig = {} as ProposeVestingAgreementConfig)
    : Promise<ArcTransactionProposalResult> {
    /**
     * see ProposeVestingAgreementConfig
     */
    const options = dopts(opts,
      Object.assign({ avatar: undefined }, defaultCreateOptions),
      { allowUnknown: true }) as ProposeVestingAgreementConfig;

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    await this.validateCreateParams(options);

    const tx = await this.contract.proposeVestingAgreement(
      options.beneficiary,
      options.returnOnCancelAddress,
      options.startingBlock,
      Utils.getWeb3().toBigNumber(options.amountPerPeriod),
      options.periodLength,
      options.numOfAgreedPeriods,
      options.cliffInPeriods,
      options.signaturesReqToCancel,
      options.signers,
      options.avatar
    );

    return new ArcTransactionProposalResult(tx);
  }

  /**
   * Create a new vesting agreement
   * @param {CreateVestingAgreementConfig} opts
   */
  public async create(
    opts: CreateVestingAgreementConfig = {} as CreateVestingAgreementConfig)
    : Promise<ArcTransactionAgreementResult> {
    /**
     * See these properties in CreateVestingAgreementConfig
     */
    const options = dopts(opts, defaultCreateOptions, { allowUnknown: true }) as CreateVestingAgreementConfig;

    await this.validateCreateParams(options);

    if (!options.token) {
      throw new Error("token is not defined");
    }

    const amountPerPeriod = Utils.getWeb3().toBigNumber(options.amountPerPeriod);

    /**
     * approve immediate transfer of the given tokens from currentAccount to the VestingScheme
     */
    if (Config.get("autoApproveTokenTransfers")) {
      const token = await (await Utils.requireContract("StandardToken")).at(options.token) as any;
      await token.approve(this.address, amountPerPeriod.mul(options.numOfAgreedPeriods));
    }

    const tx = await this.contract.createVestedAgreement(
      options.token,
      options.beneficiary,
      options.returnOnCancelAddress,
      options.startingBlock,
      amountPerPeriod,
      options.periodLength,
      options.numOfAgreedPeriods,
      options.cliffInPeriods,
      options.signaturesReqToCancel,
      options.signers
    );

    return new ArcTransactionAgreementResult(tx);
  }

  /**
   * Sign to cancel a vesting agreement
   * @param {SignToCancelVestingAgreementConfig} opts
   */
  public async signToCancel(
    opts: SignToCancelVestingAgreementConfig = {} as SignToCancelVestingAgreementConfig)
    : Promise<ArcTransactionResult> {
    /**
     * See these properties in SignToCancelVestingAgreementConfig
     */
    const defaults = {
      agreementId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as SignToCancelVestingAgreementConfig;

    if (options.agreementId === null) {
      throw new Error("agreementId is not defined");
    }

    const tx = await this.contract.signToCancelAgreement(options.agreementId);

    return new ArcTransactionResult(tx);
  }

  /**
   * Revoke vote for cancelling a vesting agreement
   * @param {RevokeSignToCancelVestingAgreementConfig} opts
   */
  public async revokeSignToCancel(
    opts: RevokeSignToCancelVestingAgreementConfig = {} as RevokeSignToCancelVestingAgreementConfig)
    : Promise<ArcTransactionResult> {
    /**
     * See these properties in RevokeSignToCancelVestingAgreementConfig
     */
    const defaults = {
      agreementId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as RevokeSignToCancelVestingAgreementConfig;

    if (options.agreementId === null) {
      throw new Error("agreementId is not defined");
    }

    const tx = await this.contract.revokeSignToCancelAgreement(options.agreementId);

    return new ArcTransactionResult(tx);
  }

  /**
   * Collects for a beneficiary, according to the agreement
   * @param {CollectVestingAgreementConfig} opts
   */
  public async collect(
    opts: CollectVestingAgreementConfig = {} as CollectVestingAgreementConfig)
    : Promise<ArcTransactionResult> {
    /**
     * See these properties in CollectVestingAgreementConfig
     */
    const defaults = {
      agreementId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as CollectVestingAgreementConfig;

    if (options.agreementId === null) {
      throw new Error("agreementId is not defined");
    }

    const tx = await this.contract.collect(options.agreementId);

    return new ArcTransactionResult(tx);
  }

  /**
   * Return all agreements ever created by this scheme
   * Filter by the optional agreementId.
   */
  public async getAgreements(
    opts: GetAgreementParams = {} as GetAgreementParams): Promise<Array<Agreement>> {

    const defaults: GetAgreementParams = {
      agreementId: null,
      avatar: undefined,
    };

    const options: GetAgreementParams = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const agreements = new Array<Agreement>();

    if (options.agreementId) {
      const agreement = this.schemeAgreementToAgreement(
        await this.contract.agreements(options.agreementId), options.agreementId);
      agreements.push(agreement);
    } else {
      const eventFetcher = this.NewVestedAgreement({}, { fromBlock: 0 });
      await new Promise((resolve: fnVoid): void => {
        eventFetcher.get(async (err: any, log: Array<DecodedLogEntryEvent<NewVestedAgreementEventResult>>) => {
          for (const event of log) {
            const agreementId = event.args._agreementId.toNumber();
            const agreement = this.schemeAgreementToAgreement(
              await this.contract.agreements(agreementId), agreementId);
            agreements.push(agreement);
          }
          resolve();
        });
      });
    }

    return agreements;
  }

  public async setParams(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>> {
    return super.setParams(
      params.voteParametersHash,
      params.votingMachine
    );
  }

  public getDefaultPermissions(overrideValue?: string): string {
    return overrideValue || "0x00000001";
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<StandardSchemeParams> {
    return this._getSchemeParameters(avatarAddress);
  }

  public async getParameters(paramsHash: Hash): Promise<StandardSchemeParams> {
    const params = await this.getParametersArray(paramsHash);
    return {
      voteParametersHash: params[0],
      votingMachine: params[1],
    };
  }

  /**
   * Private methods
   */

  private async validateCreateParams(options: CommonVestingAgreementConfig): Promise<void> {
    if (!Number.isInteger(options.periodLength) || (options.periodLength <= 0)) {
      throw new Error("periodLength must be greater than zero");
    }

    if (Utils.getWeb3().toBigNumber(options.amountPerPeriod) <= 0) {
      throw new Error("amountPerPeriod must be greater than zero");
    }

    if (!Number.isInteger(options.numOfAgreedPeriods) || (options.numOfAgreedPeriods <= 0)) {
      throw new Error("numOfAgreedPeriods must be greater than zero");
    }

    if (!Number.isInteger(options.cliffInPeriods) || (options.cliffInPeriods < 0)) {
      throw new Error("cliffInPeriods must be greater than or equal to zero");
    }

    const web3 = Utils.getWeb3();

    if ((typeof options.startingBlock === "undefined") || (options.startingBlock === null)) {
      options.startingBlock = await web3.eth.blockNumber;
    }

    if (!Number.isInteger(options.startingBlock) || (options.startingBlock < 0)) {
      throw new Error("startingBlock must be greater than or equal to zero");
    }
  }

  private schemeAgreementToAgreement(schemeAgreement: Array<any>, agreementId: number): Agreement {
    return {
      agreementId,
      amountPerPeriod: schemeAgreement[4],
      beneficiary: schemeAgreement[1],
      cliffInPeriods: schemeAgreement[7],
      collectedPeriods: schemeAgreement[9],
      numOfAgreedPeriods: schemeAgreement[6],
      periodLength: schemeAgreement[5],
      returnOnCancelAddress: schemeAgreement[2],
      signaturesReqToCancel: schemeAgreement[8],
      startingBlock: schemeAgreement[3],
      token: schemeAgreement[0],
    };
  }
}

export class ArcTransactionAgreementResult extends ArcTransactionResult {

  public agreementId: number;

  constructor(tx: TransactionReceiptTruffle) {
    super(tx);
    this.agreementId = this.getValueFromTx("_agreementId").toNumber();
  }
}

const VestingScheme = new ContractWrapperFactory("VestingScheme", VestingSchemeWrapper);
export { VestingScheme };

export interface AgreementProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  _proposalId: Hash;
}

export interface NewVestedAgreementEventResult {
  /**
   * indexed
   */
  _agreementId: BigNumber.BigNumber;
}

export interface SignToCancelAgreementEventResult {
  /**
   * indexed
   */
  _agreementId: BigNumber.BigNumber;
  /**
   * indexed
   */
  _signer: Address;
}

export interface RevokeSignToCancelAgreementEventResult {
  /**
   * indexed
   */
  _agreementId: BigNumber.BigNumber;
  /**
   * indexed
   */
  _signer: Address;
}

export interface AgreementCancelEventResult {
  /**
   * indexed
   */
  _agreementId: BigNumber.BigNumber;
}

export interface CollectEventResult {
  /**
   * indexed
   */
  _agreementId: BigNumber.BigNumber;
}

export interface CommonVestingAgreementConfig {
  /**
   * Address of the recipient of the proposed agreement.
   */
  beneficiary: string;
  /**
   * Where to send the tokens in case of cancellation
   */
  returnOnCancelAddress: string;
  /**
   * Optional ethereum block number at which the agreement starts.
   * Default is the current block number.
   * Must be greater than or equal to zero.
   */
  startingBlock: number;
  /**
   * The number of tokens to pay per period.
   * Period is calculated as (number of blocks / periodLength).
   * Should be expressed in Wei.
   * Must be greater than zero.
   */
  amountPerPeriod: BigNumber.BigNumber | string;
  /**
   * number of blocks in a period.
   * Must be greater than zero.
   */
  periodLength: number;
  /**
   * maximum number of periods that can be paid out.
   * Must be greater than zero.
   */
  numOfAgreedPeriods: number;
  /**
   * The minimum number of periods that must pass before the beneficiary
   * may collect tokens under the agreement.
   * Must be greater than or equal to zero.
   */
  cliffInPeriods: number;
  /**
   * The number of signatures required to cancel agreement.
   * See signToCancel.
   */
  signaturesReqToCancel: number;
  /**
   * An array of addresses of those who will be allowed to sign to cancel an agreement.
   * The length of this array must be greater than or equal to signaturesReqToCancel.
   */
  signers: Array<string>;
}

export interface CreateVestingAgreementConfig extends CommonVestingAgreementConfig {
  /**
   * The address of the token that will be used to pay for the creation of the agreement.
   * The caller (msg.Sender) must have the funds to pay in that token.
   */
  token: string;
}

export interface ProposeVestingAgreementConfig extends CommonVestingAgreementConfig {
  /**
   * The address of the avatar in which the proposal is being be made.
   */
  avatar: string;
}

export interface SignToCancelVestingAgreementConfig {
  /**
   * the agreementId
   */
  agreementId: number;
}

export interface RevokeSignToCancelVestingAgreementConfig {
  /**
   * the agreementId
   */
  agreementId: number;
}

export interface CollectVestingAgreementConfig {
  /**
   * the agreementId
   */
  agreementId: number;
}

export interface GetAgreementParams {
  /**
   * The address of the avatar
   */
  avatar: string;
  /**
   * the agreementId
   */
  agreementId: number;
}

export interface Agreement {
  agreementId: number;
  amountPerPeriod: BigNumber.BigNumber;
  beneficiary: Address;
  cliffInPeriods: BigNumber.BigNumber;
  collectedPeriods: BigNumber.BigNumber;
  numOfAgreedPeriods: BigNumber.BigNumber;
  periodLength: BigNumber.BigNumber;
  returnOnCancelAddress: Address;
  signaturesReqToCancel: BigNumber.BigNumber;
  startingBlock: BigNumber.BigNumber;
  token: Address;
}
