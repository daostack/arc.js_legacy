"use strict";
import * as BigNumber from "bignumber.js";
import { promisify } from "es6-promisify";
import { Address, DefaultSchemePermissions, fnVoid, Hash, SchemePermissions, SchemeWrapper } from "../commonTypes";
import { ConfigService } from "../configService";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  ContractWrapperBase,
  DecodedLogEntryEvent,
  EventFetcherFactory,
  StandardSchemeParams,
  TransactionReceiptTruffle,
} from "../contractWrapperBase";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { TransactionService } from "../transactionService";
import { Utils } from "../utils";
import { ProposalExecutedEventResult } from "./commonEventInterfaces";

export class VestingSchemeWrapper extends ContractWrapperBase implements SchemeWrapper {

  public name: string = "VestingScheme";
  public friendlyName: string = "Vesting Scheme";
  public factory: ContractWrapperFactory<VestingSchemeWrapper> = VestingSchemeFactory;
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
   * see CreateVestingAgreementConfig
   */
  private defaultCreateOptions: CommonVestingAgreementConfig = {
    amountPerPeriod: undefined,
    beneficiaryAddress: undefined,
    cliffInPeriods: undefined,
    numOfAgreedPeriods: undefined,
    periodLength: undefined,
    returnOnCancelAddress: undefined,
    signaturesReqToCancel: undefined,
    signers: undefined,
    startingBlock: null,
  };

  /**
   * Propose a new vesting agreement
   * @param {ProposeVestingAgreementConfig} options
   */
  public async propose(
    options: ProposeVestingAgreementConfig = {} as ProposeVestingAgreementConfig)
    : Promise<ArcTransactionProposalResult> {
    /**
     * see ProposeVestingAgreementConfig
     */
    options = Object.assign({}, this.defaultCreateOptions, options);

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    await this.validateCreateParams(options);

    this.logContractFunctionCall("VestingScheme.proposeVestingAgreement", options);

    const web3 = await Utils.getWeb3();

    const txResult = await this.wrapTransactionInvocation("VestingScheme.propose",
      options,
      async () => {
        return this.contract.proposeVestingAgreement(
          options.beneficiaryAddress,
          options.returnOnCancelAddress,
          options.startingBlock,
          web3.toBigNumber(options.amountPerPeriod),
          options.periodLength,
          options.numOfAgreedPeriods,
          options.cliffInPeriods,
          options.signaturesReqToCancel,
          options.signers,
          options.avatar
        );
      });

    return new ArcTransactionProposalResult(txResult.tx);
  }

  /**
   * Create a new vesting agreement
   * @param {CreateVestingAgreementConfig} options
   */
  public async create(
    options: CreateVestingAgreementConfig = {} as CreateVestingAgreementConfig)
    : Promise<ArcTransactionAgreementResult> {
    /**
     * See these properties in CreateVestingAgreementConfig
     */
    options = Object.assign({}, this.defaultCreateOptions, options);

    await this.validateCreateParams(options);

    if (!options.token) {
      throw new Error("token is not defined");
    }

    const web3 = await Utils.getWeb3();

    const amountPerPeriod = web3.toBigNumber(options.amountPerPeriod);
    const autoApproveTransfer = ConfigService.get("autoApproveTokenTransfers");
    const eventTopic = "txReceipts.VestingScheme.create";

    const txReceiptEventPayload = TransactionService.publishKickoffEvent(
      eventTopic,
      options,
      1 + (autoApproveTransfer ? 1 : 0));

    let tx;
    /**
     * approve immediate transfer of the given tokens from currentAccount to the VestingScheme
     */
    if (autoApproveTransfer) {
      const token = await (await Utils.requireContract("StandardToken")).at(options.token) as any;
      tx = await token.approve(this.address, amountPerPeriod.mul(options.numOfAgreedPeriods));
      TransactionService.publishTxEvent(eventTopic, txReceiptEventPayload, tx);
    }

    this.logContractFunctionCall("VestingScheme.createVestedAgreement", options);

    tx = await this.contract.createVestedAgreement(
      options.token,
      options.beneficiaryAddress,
      options.returnOnCancelAddress,
      options.startingBlock,
      amountPerPeriod,
      options.periodLength,
      options.numOfAgreedPeriods,
      options.cliffInPeriods,
      options.signaturesReqToCancel,
      options.signers
    );

    TransactionService.publishTxEvent(eventTopic, txReceiptEventPayload, tx);

    return new ArcTransactionAgreementResult(tx);
  }

  /**
   * Sign to cancel a vesting agreement
   * @param {SignToCancelVestingAgreementConfig} options
   */
  public async signToCancel(
    options: SignToCancelVestingAgreementConfig = {} as SignToCancelVestingAgreementConfig)
    : Promise<ArcTransactionResult> {

    if (options.agreementId === null) {
      throw new Error("agreementId is not defined");
    }

    this.logContractFunctionCall("VestingScheme.signToCancelAgreement", options);

    return this.wrapTransactionInvocation("VestingScheme.signToCancel",
      options,
      () => {
        return this.contract.signToCancelAgreement(options.agreementId);
      });
  }

  /**
   * Revoke vote for cancelling a vesting agreement
   * @param {RevokeSignToCancelVestingAgreementConfig} options
   */
  public async revokeSignToCancel(
    options: RevokeSignToCancelVestingAgreementConfig = {} as RevokeSignToCancelVestingAgreementConfig)
    : Promise<ArcTransactionResult> {

    if (options.agreementId === null) {
      throw new Error("agreementId is not defined");
    }

    this.logContractFunctionCall("VestingScheme.revokeSignToCancelAgreement", options);

    return this.wrapTransactionInvocation("VestingScheme.revokeSignToCancel",
      options,
      () => {
        return this.contract.revokeSignToCancelAgreement(options.agreementId);
      });
  }

  /**
   * Collects for a beneficiary, according to the agreement
   * @param {CollectVestingAgreementConfig} options
   */
  public async collect(
    options: CollectVestingAgreementConfig = {} as CollectVestingAgreementConfig)
    : Promise<ArcTransactionResult> {

    if (options.agreementId === null) {
      throw new Error("agreementId is not defined");
    }

    this.logContractFunctionCall("VestingScheme.collect", options);

    return this.wrapTransactionInvocation("VestingScheme.collect",
      options,
      () => {
        return this.contract.collect(options.agreementId);
      });
  }

  /**
   * Return all agreements ever created by this scheme
   * Filter by the optional agreementId.
   */
  public async getAgreements(
    options: GetAgreementParams = {} as GetAgreementParams): Promise<Array<Agreement>> {

    const defaults = {
      agreementId: null,
    };

    options = Object.assign({}, defaults, options);

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

  public async setParameters(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>> {

    this.validateStandardSchemeParams(params);

    return super._setParameters(
      "VestingScheme.setParameters",
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public getDefaultPermissions(): SchemePermissions {
    return DefaultSchemePermissions.VestingScheme as number;
  }

  public async getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions> {
    return this._getSchemePermissions(avatarAddress);
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<StandardSchemeParams> {
    return this._getSchemeParameters(avatarAddress);
  }

  public async getParameters(paramsHash: Hash): Promise<StandardSchemeParams> {
    const params = await this.getParametersArray(paramsHash);
    return {
      voteParametersHash: params[0],
      votingMachineAddress: params[1],
    };
  }

  private async validateCreateParams(options: CommonVestingAgreementConfig): Promise<void> {
    if (!Number.isInteger(options.periodLength) || (options.periodLength <= 0)) {
      throw new Error("periodLength must be an integer greater than zero");
    }

    const web3 = await Utils.getWeb3();

    if (await web3.toBigNumber(options.amountPerPeriod).lte(0)) {
      throw new Error("amountPerPeriod must be greater than zero");
    }

    if (!Number.isInteger(options.numOfAgreedPeriods) || (options.numOfAgreedPeriods <= 0)) {
      throw new Error("numOfAgreedPeriods must be greater than zero");
    }

    if (!Number.isInteger(options.cliffInPeriods) || (options.cliffInPeriods < 0)) {
      throw new Error("cliffInPeriods must be greater than or equal to zero");
    }

    if ((typeof options.startingBlock === "undefined") || (options.startingBlock === null)) {
      options.startingBlock = await promisify(web3.eth.getBlockNumber)().then((bn: number) => bn);
    }

    if (!Number.isInteger(options.startingBlock) || (options.startingBlock < 0)) {
      throw new Error("startingBlock must be greater than or equal to zero");
    }
  }

  private schemeAgreementToAgreement(schemeAgreement: Array<any>, agreementId: number): Agreement {
    return {
      agreementId,
      amountPerPeriod: schemeAgreement[4],
      beneficiaryAddress: schemeAgreement[1],
      cliffInPeriods: schemeAgreement[7],
      collectedPeriods: schemeAgreement[9],
      numOfAgreedPeriods: schemeAgreement[6],
      periodLength: schemeAgreement[5],
      returnOnCancelAddress: schemeAgreement[2],
      signaturesReqToCancel: schemeAgreement[8],
      startingBlock: schemeAgreement[3],
      tokenAddress: schemeAgreement[0],
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

export const VestingSchemeFactory = new ContractWrapperFactory("VestingScheme", VestingSchemeWrapper);

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
  beneficiaryAddress: Address;
  /**
   * Where to send the tokens in case of cancellation
   */
  returnOnCancelAddress: string;
  /**
   * Optional ethereum block number at which the agreement starts.
   * Default is the current block number.
   * Must be greater than or equal to zero.
   */
  startingBlock?: number;
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
  avatar: Address;
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
  avatar: Address;
  /**
   * Optional agreement Id
   */
  agreementId?: number;
}

export interface Agreement {
  agreementId: number;
  amountPerPeriod: BigNumber.BigNumber;
  beneficiaryAddress: Address;
  cliffInPeriods: BigNumber.BigNumber;
  collectedPeriods: BigNumber.BigNumber;
  numOfAgreedPeriods: BigNumber.BigNumber;
  periodLength: BigNumber.BigNumber;
  returnOnCancelAddress: Address;
  signaturesReqToCancel: BigNumber.BigNumber;
  startingBlock: BigNumber.BigNumber;
  tokenAddress: Address;
}
