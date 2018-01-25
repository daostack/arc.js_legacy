"use strict";
const dopts = require("default-options");

import { Utils } from "../utils.js";
import { ExtendTruffleContract } from "../ExtendTruffleContract";

const SolidityContributionReward = Utils.requireContract("ContributionReward");

class ContributionReward extends ExtendTruffleContract(
  SolidityContributionReward
) {
  static async new() {
    const contract = await SolidityContributionReward.new();
    return new this(contract);
  }

  async proposeContributionReward(opts = {}) {
    /**
     * Note that explicitly supplying any property with a value of undefined will prevent the property
     * from taking on its default value (weird behavior of default-options)
     */
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       * description of the constraint
       */
      description: undefined,
      /**
       * reward in the DAO's native token.  In Wei.
       */
      nativeTokenReward: 0,
      /**
       * reward in the DAO's native reputation.  In Wei.
       */
      reputationReward: 0,
      /**
       * reward in ethers.  In Wei.
       */
      ethReward: 0,
      /**
       * the address of an external token (for externalTokenReward)
       * Only required when externalTokenReward is non-zero.
       */
      externalToken: null,
      /**
       * reward in the given external token.  In Wei.
       */
      externalTokenReward: 0,
      /**
       *  beneficiary address
       */
      beneficiary: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.description) {
      throw new Error("description is not defined");
    }

    /**
     * will thrown Error if not valid numbers
     */
    const web3 = Utils.getWeb3();
    const nativeTokenReward = web3.toBigNumber(options.nativeTokenReward);
    const reputationReward = web3.toBigNumber(options.reputationReward);
    const ethReward = web3.toBigNumber(options.ethReward);
    const externalTokenReward = web3.toBigNumber(options.externalTokenReward);

    if (
      nativeTokenReward < 0 ||
      reputationReward < 0 ||
      ethReward < 0 ||
      externalTokenReward < 0
    ) {
      throw new Error("rewards cannot be less than 0");
    }

    if (
      !(
        nativeTokenReward > 0 ||
        reputationReward > 0 ||
        ethReward > 0 ||
        externalTokenReward > 0
      )
    ) {
      throw new Error("no reward amount was given");
    }

    if (externalTokenReward > 0 && !options.externalToken) {
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
      [nativeTokenReward, reputationReward, ethReward, externalTokenReward],
      options.externalToken,
      options.beneficiary
    );
    return tx;
  }

  async setParams(params) {
    return await this._setParameters(
      params.orgNativeTokenFee,
      params.voteParametersHash,
      params.votingMachine
    );
  }

  getDefaultPermissions(overrideValue) {
    return overrideValue || "0x00000001";
  }
}

export { ContributionReward };
