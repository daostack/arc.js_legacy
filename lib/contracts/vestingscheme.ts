"use strict";
import dopts = require("default-options");

import {
  Address,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  ExtendTruffleContract,
  Hash,
} from "../ExtendTruffleContract";
import { Utils } from "../utils";
const SolidityContract = Utils.requireContract("VestingScheme");
import * as BigNumber from "bignumber.js";
import ContractWrapperFactory from "../ContractWrapperFactory";
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
  public ProposalExecuted = this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted");
  public AgreementProposal = this.createEventFetcherFactory<AgreementProposalEventResult>("AgreementProposal");
  public NewVestedAgreement = this.createEventFetcherFactory<NewVestedAgreementEventResult>("NewVestedAgreement");
  public SignToCancelAgreement = this.createEventFetcherFactory<SignToCancelAgreementEventResult>("SignToCancelAgreement");
  public RevokeSignToCancelAgreement = this.createEventFetcherFactory<RevokeSignToCancelAgreementEventResult>("RevokeSignToCancelAgreement");
  public AgreementCancel = this.createEventFetcherFactory<AgreementCancelEventResult>("AgreementCancel");
  public Collect = this.createEventFetcherFactory<CollectEventResult>("Collect");
  /* tslint:enable:max-line-length */

  /**
   * Propose a new vesting agreement
   * @param {ProposeVestingAgreementConfig} opts
   */
  public async propose(opts = {}) {
    /**
     * see ProposeVestingAgreementConfig
     */
    const options = dopts(opts,
      Object.assign({ avatar: undefined }, defaultCreateOptions),
      { allowUnknown: true });

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
      options.avatar,
    );

    return new ArcTransactionProposalResult(tx);
  }

  /**
   * Create a new vesting agreement
   * @param {CreateVestingAgreementConfig} opts
   */
  public async create(opts = {}) {
    /**
     * See these properties in CreateVestingAgreementConfig
     */
    const options = dopts(opts, defaultCreateOptions, { allowUnknown: true });

    await this.validateCreateParams(options);

    if (!options.token) {
      throw new Error("token is not defined");
    }

    const tx = await this.contract.createVestedAgreement(
      options.token,
      options.beneficiary,
      options.returnOnCancelAddress,
      options.startingBlock,
      Utils.getWeb3().toBigNumber(options.amountPerPeriod),
      options.periodLength,
      options.numOfAgreedPeriods,
      options.cliffInPeriods,
      options.signaturesReqToCancel,
      options.signers,
    );

    return new ArcTransactionAgreementResult(tx);
  }

  /**
   * Sign to cancel a vesting agreement
   * @param {SignToCancelVestingAgreementConfig} opts
   */
  public async signToCancel(opts = {}) {
    /**
     * See these properties in SignToCancelVestingAgreementConfig
     */
    const defaults = {
      agreementId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

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
  public async revokeSignToCancel(opts = {}) {
    /**
     * See these properties in RevokeSignToCancelVestingAgreementConfig
     */
    const defaults = {
      agreementId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

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
  public async collect(opts = {}) {
    /**
     * See these properties in CollectVestingAgreementConfig
     */
    const defaults = {
      agreementId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (options.agreementId === null) {
      throw new Error("agreementId is not defined");
    }

    const tx = await this.contract.collect(options.agreementId);

    return new ArcTransactionResult(tx);
  }

  public async setParams(params) {
    return super.setParams(
      params.voteParametersHash,
      params.votingMachine,
    );
  }

  public getDefaultPermissions(overrideValue?: string) {
    return overrideValue || "0x00000001";
  }

  /**
   * Private methods
   */

  private async validateCreateParams(options) {
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
}

export class ArcTransactionAgreementResult extends ArcTransactionResult {

  public agreementId: number;

  constructor(tx) {
    super(tx);
    this.agreementId = this.getValueFromTx("_agreementId").toNumber();
  }
}

const VestingScheme = new ContractWrapperFactory(SolidityContract, VestingSchemeWrapper);
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
