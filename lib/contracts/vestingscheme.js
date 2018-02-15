"use strict";
const dopts = require("default-options");

import { ExtendTruffleContract, ArcTransactionResult, ArcTransactionProposalResult } from "../ExtendTruffleContract";
import Utils from "../utils";
const SolidityContract = Utils.requireContract("VestingScheme");

/**
 * see CreateVestingAgreementConfig
 */
const _defaultCreateOptions = {
  beneficiary: undefined,
  returnOnCancelAddress: undefined,
  startingBlock: null,
  amountPerPeriod: undefined,
  periodLength: undefined,
  numOfAgreedPeriods: undefined,
  cliffInPeriods: undefined,
  signaturesReqToCancel: undefined,
  signers: undefined
};

export class VestingScheme extends ExtendTruffleContract(SolidityContract) {
  static async new() {
    const contract = await SolidityContract.new();
    return new this(contract);
  }

  async _validateCreateParams(options) {
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
  /**
   * Propose a new vesting agreement
   * @param {ProposeVestingAgreementConfig} opts
   */
  async propose(opts = {}) {
    /**
     * see ProposeVestingAgreementConfig
     */
    const options = dopts(opts,
      Object.assign({ avatar: undefined }, _defaultCreateOptions),
      { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    await this._validateCreateParams(options);

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
  async create(opts = {}) {
    /**
      * See these properties in CreateVestingAgreementConfig
     */
    const options = dopts(opts, _defaultCreateOptions, { allowUnknown: true });

    await this._validateCreateParams(options);

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
      options.signers
    );

    return new ArcTransactionAgreementResult(tx);
  }

  /**
   * Sign to cancel a vesting agreement
   * @param {SignToCancelVestingAgreementConfig} opts
   */
  async signToCancel(opts = {}) {
    /**
      * See these properties in SignToCancelVestingAgreementConfig
     */
    const defaults = {
      agreementId: undefined
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
  async revokeSignToCancel(opts = {}) {
    /**
      * See these properties in RevokeSignToCancelVestingAgreementConfig
     */
    const defaults = {
      agreementId: undefined
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
  async collect(opts = {}) {
    /**
      * See these properties in CollectVestingAgreementConfig
     */
    const defaults = {
      agreementId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (options.agreementId === null) {
      throw new Error("agreementId is not defined");
    }

    const tx = await this.contract.collect(options.agreementId);

    return new ArcTransactionResult(tx);
  }

  async setParams(params) {
    return super.setParams(
      params.voteParametersHash,
      params.votingMachine
    );
  }

  getDefaultPermissions(overrideValue) {
    return overrideValue || "0x00000001";
  }
}

export class ArcTransactionAgreementResult extends ArcTransactionResult {
  constructor(tx) {
    super(tx);
    this.agreementId = this.getValueFromTx("_agreementId").toNumber();
  }
}
