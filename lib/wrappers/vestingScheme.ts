"use strict";
import * as BigNumber from "bignumber.js";
import { Address, DefaultSchemePermissions, Hash, SchemePermissions } from "../commonTypes";
import { ConfigService } from "../configService";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  DecodedLogEntryEvent,
  IContractWrapperFactory,
  IUniversalSchemeWrapper,
  StandardSchemeParams,
} from "../iContractWrapperBase";
import { ProposalGeneratorBase } from "../proposalGeneratorBase";
import { TransactionService, TxGeneratingFunctionOptions } from "../transactionService";
import { Utils } from "../utils";
import { UtilsInternal } from "../utilsInternal";
import { EntityFetcherFactory, EventFetcherFactory, Web3EventService } from "../web3EventService";
import { SchemeProposalExecuted, SchemeProposalExecutedEventResult } from "./commonEventInterfaces";
import { StandardTokenFactory } from "./standardToken";

export class VestingSchemeWrapper extends ProposalGeneratorBase {

  public name: string = "VestingScheme";
  public friendlyName: string = "Vesting Scheme";
  public factory: IContractWrapperFactory<VestingSchemeWrapper> = VestingSchemeFactory;
  /**
   * Events
   */

  /**
   * fired when a proposal is executed whether an agreement is created or not.
   */
  public ProposalExecuted: EventFetcherFactory<SchemeProposalExecutedEventResult>;
  /**
   * fired when proposal is executed and an agreement is created
   */
  public ProposedVestedAgreement: EventFetcherFactory<ProposedVestedAgreementEventResult>;
  /**
   * fired when a proposal is submitted to create an agreement
   */
  public AgreementProposal: EventFetcherFactory<AgreementProposalEventResult>;
  /**
   * fired when an agreement is created through `create` (not-through a proposal process)
   */
  public NewVestedAgreement: EventFetcherFactory<NewVestedAgreementEventResult>;
  public SignToCancelAgreement: EventFetcherFactory<SignToCancelAgreementEventResult>;
  public RevokeSignToCancelAgreement: EventFetcherFactory<RevokeSignToCancelAgreementEventResult>;
  public AgreementCancel: EventFetcherFactory<AgreementCancelEventResult>;
  public Collect: EventFetcherFactory<CollectEventResult>;

  /**
   * see CreateVestingAgreementConfig
   */
  private defaultCreateOptions: Partial<CommonVestingAgreementConfig> = {
    startingBlock: null,
  };

  /**
   * Submit a proposal to create a vesting agreement.
   * @param {ProposeVestingAgreementConfig} options
   */
  public async proposeVestingAgreement(
    options: ProposeVestingAgreementConfig = {} as ProposeVestingAgreementConfig & TxGeneratingFunctionOptions)
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
      this.contract.proposeVestingAgreement,
      [options.beneficiaryAddress,
      options.returnOnCancelAddress,
      options.startingBlock,
      web3.toBigNumber(options.amountPerPeriod),
      options.periodLength,
      options.numOfAgreedPeriods,
      options.cliffInPeriods,
      options.signaturesReqToCancel,
      options.signers,
      options.avatar]
    );

    return new ArcTransactionProposalResult(txResult.tx, this.contract, await this.getVotingMachine(options.avatar));
  }

  /**
   * Create a new vesting agreement
   * @param {CreateVestingAgreementConfig} options
   */
  public async create(
    options: CreateVestingAgreementConfig = {} as CreateVestingAgreementConfig & TxGeneratingFunctionOptions)
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
    const functionName = "VestingScheme.create";

    const payload = TransactionService.publishKickoffEvent(
      functionName,
      options,
      1 + (autoApproveTransfer ? 1 : 0));

    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);

    /**
     * approve immediate transfer of the given tokens from currentAccount to the VestingScheme
     */
    if (autoApproveTransfer) {
      const token = await StandardTokenFactory.at(options.token) as any;

      const result = await token.approve({
        amount: amountPerPeriod.mul(options.numOfAgreedPeriods),
        spender: this.address,
        txEventContext: eventContext,
      });

      await result.watchForTxMined();
    }

    this.logContractFunctionCall("VestingScheme.createVestedAgreement", options);

    const tx = await this.sendTransaction(
      eventContext,
      this.contract.createVestedAgreement,
      [options.token,
      options.beneficiaryAddress,
      options.returnOnCancelAddress,
      options.startingBlock,
        amountPerPeriod,
      options.periodLength,
      options.numOfAgreedPeriods,
      options.cliffInPeriods,
      options.signaturesReqToCancel,
      options.signers]);

    if (tx) {
      TransactionService.publishTxLifecycleEvents(eventContext, tx, this.contract);
    }

    return new ArcTransactionAgreementResult(tx, this.contract);
  }

  /**
   * Sign to cancel a vesting agreement
   * @param {SignToCancelVestingAgreementConfig} options
   */
  public async signToCancel(
    options: SignToCancelVestingAgreementConfig =
      {} as SignToCancelVestingAgreementConfig & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (options.agreementId === null) {
      throw new Error("agreementId is not defined");
    }

    this.logContractFunctionCall("VestingScheme.signToCancelAgreement", options);

    return this.wrapTransactionInvocation("VestingScheme.signToCancel",
      options,
      this.contract.signToCancelAgreement,
      [options.agreementId]
    );
  }

  /**
   * Revoke vote for cancelling a vesting agreement
   * @param {RevokeSignToCancelVestingAgreementConfig} options
   */
  public async revokeSignToCancel(
    options: RevokeSignToCancelVestingAgreementConfig =
      {} as RevokeSignToCancelVestingAgreementConfig & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (options.agreementId === null) {
      throw new Error("agreementId is not defined");
    }

    this.logContractFunctionCall("VestingScheme.revokeSignToCancelAgreement", options);

    return this.wrapTransactionInvocation("VestingScheme.revokeSignToCancel",
      options,
      this.contract.revokeSignToCancelAgreement,
      [options.agreementId]
    );
  }

  /**
   * Collects for a beneficiary, according to the agreement
   * @param {CollectVestingAgreementConfig} options
   */
  public async collect(
    options: CollectVestingAgreementConfig = {} as CollectVestingAgreementConfig & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (options.agreementId === null) {
      throw new Error("agreementId is not defined");
    }

    this.logContractFunctionCall("VestingScheme.collect", options);

    return this.wrapTransactionInvocation("VestingScheme.collect",
      options,
      this.contract.collect,
      [options.agreementId]
    );
  }

  /**
   * EntityFetcherFactory for votable Agreement.
   * @param avatarAddress
   */
  public async getVotableProposals(avatarAddress: Address):
    Promise<EntityFetcherFactory<AgreementProposal, SchemeProposalExecutedEventResult>> {

    return this.proposalService.getProposalEvents(
      {
        baseArgFilter: { _avatar: avatarAddress },
        proposalsEventFetcher: this.AgreementProposal,
        transformEventCallback:
          async (event: DecodedLogEntryEvent<SchemeProposalExecutedEventResult>): Promise<AgreementProposal> => {
            return this.getVotableProposal(event.args._avatar, event.args._proposalId);
          },
        votableOnly: true,
        votingMachine: await this.getVotingMachine(avatarAddress),
      });
  }

  /**
   * EntityFetcherFactory for executed proposals.
   * @param avatarAddress
   */
  public getExecutedProposals(avatarAddress: Address):
    EntityFetcherFactory<VestingSchemeSchemeProposalExecuted, SchemeProposalExecutedEventResult> {

    return this.proposalService.getProposalEvents(
      {
        baseArgFilter: { _avatar: avatarAddress },
        proposalsEventFetcher: this.ProposalExecuted,
        transformEventCallback:
          async (event: DecodedLogEntryEvent<SchemeProposalExecutedEventResult>)
            : Promise<VestingSchemeSchemeProposalExecuted> => {
            return Promise.resolve({
              agreementId: await this.getProposalAgreementId(event.args._proposalId),
              avatarAddress: event.args._avatar,
              proposalId: event.args._proposalId,
              winningVote: event.args._param,
            });
          },
      });
  }

  /**
   * Returns a promise of the agreementId associated with the given proposal. The result
   * is 0 if the proposal has not been executed or is not found.
   * @param proposalId
   */
  public async getProposalAgreementId(proposalId: Hash): Promise<number> {
    const fetcher = this.ProposedVestedAgreement({ _proposalId: proposalId }, { fromBlock: 0 });
    const events = await fetcher.get();
    return events.length ? events[0].args._agreementId.toNumber() : 0;
  }

  public async getVotableProposal(avatarAddress: Address, proposalId: Hash): Promise<AgreementProposal> {
    const proposalParams = await this.contract.organizationsProposals(avatarAddress, proposalId);
    const agreement = this.convertProposalPropsArrayToObject(proposalParams) as AgreementProposal;
    agreement.proposalId = proposalId;
    return agreement;
  }

  public async getAgreement(agreementId: number): Promise<Agreement> {
    const agreementParams = await this.contract.agreements(agreementId);
    const agreement = this.convertProposalPropsArrayToObject(agreementParams) as Agreement;
    agreement.agreementId = agreementId;
    return agreement;
  }

  public getParametersHash(params: StandardSchemeParams): Promise<Hash> {
    return this._getParametersHash(
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public setParameters(
    params: StandardSchemeParams & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionDataResult<Hash>> {

    this.validateStandardSchemeParams(params);

    return super._setParameters(
      "VestingScheme.setParameters",
      params.txEventContext,
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

  protected hydrated(): void {
    /* tslint:disable:max-line-length */
    this.ProposalExecuted = this.createEventFetcherFactory<SchemeProposalExecutedEventResult>(this.contract.ProposalExecuted);
    this.AgreementProposal = this.createEventFetcherFactory<AgreementProposalEventResult>(this.contract.AgreementProposal);
    this.NewVestedAgreement = this.createEventFetcherFactory<NewVestedAgreementEventResult>(this.contract.NewVestedAgreement);
    this.ProposedVestedAgreement = this.createEventFetcherFactory<ProposedVestedAgreementEventResult>(this.contract.ProposedVestedAgreement);
    this.SignToCancelAgreement = this.createEventFetcherFactory<SignToCancelAgreementEventResult>(this.contract.SignToCancelAgreement);
    this.RevokeSignToCancelAgreement = this.createEventFetcherFactory<RevokeSignToCancelAgreementEventResult>(this.contract.RevokeSignToCancelAgreement);
    this.AgreementCancel = this.createEventFetcherFactory<AgreementCancelEventResult>(this.contract.AgreementCancel);
    this.Collect = this.createEventFetcherFactory<CollectEventResult>(this.contract.Collect);
    /* tslint:enable:max-line-length */
  }

  private async validateCreateParams(options: CommonVestingAgreementConfig): Promise<void> {

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiary address is not set");
    }

    if (!options.returnOnCancelAddress) {
      throw new Error("returnOnCancelAddress is not set");
    }

    if (!Number.isInteger(options.signaturesReqToCancel) || (options.signaturesReqToCancel <= 0)) {
      throw new Error("signaturesReqToCancel must be greater than zero");
    }

    if (!Array.isArray(options.signers)) {
      throw new Error("signers is not set");
    }

    if (options.signers.length < 1) {
      throw new Error("the number of signers must be greater than 0");
    }

    if (options.signaturesReqToCancel > options.signers.length) {
      throw new Error("the number of signatures required to cancel cannpt be greater than the number of signers");
    }

    if (!Number.isInteger(options.periodLength) || (options.periodLength <= 0)) {
      throw new Error("periodLength must be greater than zero");
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
      options.startingBlock = await UtilsInternal.lastBlockNumber();
    }

    if (!Number.isInteger(options.startingBlock) || (options.startingBlock < 0)) {
      throw new Error("startingBlock must be greater than or equal to zero");
    }
  }

  private convertProposalPropsArrayToObject(propsArray: Array<any>): AgreementBase {
    return {
      amountPerPeriod: propsArray[4],
      beneficiaryAddress: propsArray[1],
      cliffInPeriods: propsArray[7],
      collectedPeriods: propsArray[9],
      numOfAgreedPeriods: propsArray[6],
      periodLength: propsArray[5],
      returnOnCancelAddress: propsArray[2],
      signaturesReqToCancel: propsArray[8],
      startingBlock: propsArray[3],
      tokenAddress: propsArray[0],
    };
  }
}

export class ArcTransactionAgreementResult extends ArcTransactionResult {

  constructor(
    tx: Hash,
    contract: any) {
    super(tx, contract);
  }
  /**
   * Returns promise of the agreement id from the logs of the mined transaction. Will watch for the mined tx,
   * so could take a while to return.
   */
  public async getAgreementIdFromMinedTx(): Promise<number> {
    return this.getValueFromMinedTx("_agreementId");
  }
}

export const VestingSchemeFactory =
  new ContractWrapperFactory("VestingScheme", VestingSchemeWrapper, new Web3EventService());

export interface AgreementProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
}

export interface NewVestedAgreementEventResult {
  /**
   * indexed
   */
  _agreementId: BigNumber.BigNumber;
}

export interface ProposedVestedAgreementEventResult {
  /**
   * indexed
   */
  _agreementId: BigNumber.BigNumber;
  /**
   * indexed
   */
  _proposalId: Hash;
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
  returnOnCancelAddress: Address;
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
  signers: Array<Address>;
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

export interface AgreementProposal extends AgreementBase {
  /**
   * indexed
   */
  proposalId: Hash;
}

export interface Agreement extends AgreementBase {
  agreementId: number;
}

export interface AgreementBase {
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

export interface VestingSchemeSchemeProposalExecuted extends SchemeProposalExecuted {
  agreementId: number;
}
