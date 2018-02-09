"use strict";
const dopts = require("default-options");

import { ExtendTruffleContract, ArcTransactionProposalResult } from "../ExtendTruffleContract";
const SolidityContributionReward = Utils.requireContract("ContributionReward");
import { Utils } from "../utils";


export class ContributionReward extends ExtendTruffleContract(
  SolidityContributionReward
) {
  static async new() {
    const contract = await SolidityContributionReward.new();
    return new this(contract);
  }

  /**
   * Submit a proposal for a reward for a contribution
   * @param {ProposeContributionParams} opts 
   */
  async proposeContributionReward(opts = {}) {
    /**
     * Note that explicitly supplying any property with a value of undefined will prevent the property
     * from taking on its default value (weird behavior of default-options)
     */
    const defaults = {
      avatar: undefined,
      description: undefined,
      reputationChange: 0,
      nativeTokenReward: 0,
      ethReward: 0,
      externalTokenReward: 0,
      externalToken: null,
      periodLength: undefined,
      numberOfPeriods: undefined,
      beneficiary: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.description) {
      throw new Error("description is not defined");
    }

    if (!Number.isInteger(options.numberOfPeriods) || (options.numberOfPeriods <= 0)) {
      throw new Error("numberOfPeriods must be greater than zero");
    }

    if (!Number.isInteger(options.periodLength) || (options.periodLength <= 0)) {
      throw new Error("periodLength must be greater than zero");
    }

    /**
     * will thrown Error if not valid numbers
     */
    const web3 = Utils.getWeb3();
    const nativeTokenReward = web3.toBigNumber(options.nativeTokenReward);
    const reputationChange = web3.toBigNumber(options.reputationChange);
    const ethReward = web3.toBigNumber(options.ethReward);
    const externalTokenReward = web3.toBigNumber(options.externalTokenReward);

    if (
      (nativeTokenReward < 0) ||
      (ethReward < 0) ||
      (externalTokenReward < 0)
    ) {
      throw new Error("rewards must be greaater than or equal to zero");
    }

    if (
      !(
        (nativeTokenReward > 0) ||
        (reputationChange > 0) ||
        (ethReward > 0) ||
        (externalTokenReward > 0)
      )
    ) {
      throw new Error("no reward amount was given");
    }

    if ((externalTokenReward > 0) && !options.externalToken) {
      throw new Error(
        "external token reward is proposed but externalToken is not defined"
      );
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const tx = await this.contract.proposeContributionReward(
      options.avatar,
      Utils.SHA3(options.description),
      reputationChange,
      [nativeTokenReward, ethReward, externalTokenReward, options.periodLength, options.numberOfPeriods],
      options.externalToken,
      options.beneficiary
    );
    return new ArcTransactionProposalResult(tx);
  }

  async setParams(params) {
    return await super.setParams(
      params.orgNativeTokenFee,
      params.voteParametersHash,
      params.votingMachine
    );
  }

  getDefaultPermissions(overrideValue) {
    return overrideValue || "0x00000001";
  }
}
