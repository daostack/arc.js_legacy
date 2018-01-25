"use strict";
const dopts = require("default-options");

import { Utils } from "../utils.js";
import { ExtendTruffleContract } from "../ExtendTruffleContract";

const SolidityUpgradeScheme = Utils.requireContract("UpgradeScheme");

export class UpgradeScheme extends ExtendTruffleContract(
  SolidityUpgradeScheme
) {
  static async new() {
    const contract = await SolidityUpgradeScheme.new();
    return new this(contract);
  }

  /*******************************************
   * proposeController
   */
  async proposeController(opts = {}) {
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       *  controller address
       */
      controller: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.controller) {
      throw new Error("controller address is not defined");
    }

    const tx = await this.contract.proposeUpgrade(
      options.avatar,
      options.controller
    );

    return tx;
  }

  /********************************************
   * proposeUpgradingScheme
   */
  async proposeUpgradingScheme(opts = {}) {
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
       *  upgrading scheme address
       */
      scheme: undefined,
      /**
       * hash of the parameters of the upgrading scheme. These must be already registered with the new scheme.
       */
      schemeParametersHash: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.scheme) {
      throw new Error("scheme is not defined");
    }

    if (!options.schemeParametersHash) {
      throw new Error("schemeParametersHash is not defined");
    }

    const tx = await this.contract.proposeChangeUpgradingScheme(
      options.avatar,
      options.scheme,
      options.schemeParametersHash
    );

    return tx;
  }

  async setParams(params) {
    return await this._setParameters(
      params.voteParametersHash,
      params.votingMachine
    );
  }

  getDefaultPermissions(overrideValue) {
    return overrideValue || "0x0000000b";
  }
}
