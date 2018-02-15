"use strict";
const dopts = require("default-options");

import { ExtendTruffleContract, ArcTransactionProposalResult, ArcTransactionResult } from "../ExtendTruffleContract";
import Utils from "../utils";
const SolidityContributionReward = Utils.requireContract("ContributionReward");

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
    const reputationChange = web3.toBigNumber(options.reputationChange);
    const nativeTokenReward = web3.toBigNumber(options.nativeTokenReward);
    const ethReward = web3.toBigNumber(options.ethReward);
    const externalTokenReward = web3.toBigNumber(options.externalTokenReward);

    if (
      (nativeTokenReward < 0) ||
      (ethReward < 0) ||
      (externalTokenReward < 0)
    ) {
      throw new Error("rewards must be greater than or equal to zero");
    }

    if (
      !(
        (reputationChange != 0) ||
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

  /**
   * Redeem reward for proposal
   * @param {ContributionRewardRedeemParams} opts
   */
  async redeemContributionReward(opts = {}) {
    const defaults = {
      proposalId: undefined,
      avatar: undefined,
      reputation: false,
      nativeTokens: false,
      ethers: false,
      externalTokens: false,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const tx = await this.contract.redeem(
      options.proposalId,
      options.avatar,
      [options.reputation, options.nativeTokens, options.ethers, options.externalTokens]
    );

    return new ArcTransactionResult(tx);
  }

  async setParams(params) {

    params = Object.assign({},
      {
        orgNativeTokenFee: 0
      },
      params);

    return super.setParams(
      params.orgNativeTokenFee,
      params.voteParametersHash,
      params.votingMachine
    );
  }

  getDefaultPermissions(overrideValue) {
    return overrideValue || "0x00000001";
  }
}
