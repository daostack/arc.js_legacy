"use strict";
const dopts = require("default-options");

import { getDeployedContracts } from "../contracts.js";
import { Utils } from "../utils";
import { ExtendTruffleContract, ArcTransactionProposalResult } from "../ExtendTruffleContract";

const SolidityContract = Utils.requireContract("GenesisScheme");

export class GenesisScheme extends ExtendTruffleContract(SolidityContract) {
  static async new() {
    const contract = await SolidityContract.new();
    return new this(contract);
  }

  /**
   * Create a new DAO
   */
  async forgeOrg(opts = {}) {
    /**
     * See DaoConfig
     */
    const defaults = {
      name: undefined,
      tokenName: undefined,
      tokenSymbol: undefined,
      founders: [], // see FounderConfig
      votingMachineParams: {}, // see NewDaoVotingMachineConfig
      schemes: [], // see NewDaoSchemeConfig
      universalController: true
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.name) {
      throw new Error("DAO name is not defined");
    }

    if (!options.tokenName) {
      throw new Error("DAO token name is not defined");
    }

    if (!options.tokenSymbol) {
      throw new Error("DAO token symbol is not defined");
    }

    const web3 = Utils.getWeb3();
    const controllerAddress = options.universalController ? (await Utils.requireContract("UController")).address : Utils.NULL_ADDRESS;

    const tx = await this.contract.forgeOrg(
      options.name,
      options.tokenName,
      options.tokenSymbol,
      options.founders,
      options.founderTokenAmounts.map(amount => web3.toBigNumber(amount)),
      options.founderReputationAmounts.map(amount => web3.toBigNumber(amount)),
      controllerAddress
    );

    return new ArcTransactionProposalResult(tx);
  }

  async setSchemes(opts = {}) {

    /**
     * See NewDaoConfig
     */
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       * Optional array of NewDaoSchemeConfig describing schemes to be registered with the avatar's controller.
       * See NewDaoSchemeConfig.
       */
      schemes: [],
      /**
       * Optional parameter hashes for each scheme in schemes.
       * There should be one array item for each scheme in schemes.
       */
      paramHashes: [],
      /**
       * Optional extra permissions for each scheme in schemes, represented as strings.
       * 
       * See ExtendTruffleContract.getDefaultPermissions for what this string
       * should look like.
       * 
       * You may supply null or an empty string when you don't wish to add any permissions
       * beyond the one required by the scheme. The minimum permissions for the scheme
       * will be enforced (or'd with anything you supply).
       * 
       * There should be one array item for each scheme in schemes.
       */
      permissions: []
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.scheme) {
      throw new Error("scheme address is not defined");
    }

    Utils.numberToPermissionsString(requiredPermissions | additionalPermissions)

    const tx = await this.contract.setSchemes(
      options.avatar,
      options.scheme
    );

    return new ArcTransactionProposalResult(tx);
  }
}
