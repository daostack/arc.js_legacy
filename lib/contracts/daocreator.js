"use strict";
const dopts = require("default-options");

import { Utils } from "../utils";
const Avatar = Utils.requireContract("Avatar");
import { Contracts } from "../contracts.js";
import { config } from "../config.js";
import { ExtendTruffleContract, ArcTransactionResult } from "../ExtendTruffleContract";
const SolidityContract = Utils.requireContract("DaoCreator");

export class DaoCreator extends ExtendTruffleContract(SolidityContract) {
  static async new() {
    const contract = await SolidityContract.new();
    return new this(contract);
  }

  /**
   * Create a new DAO
   * @param {ForgeOrgConfig} opts
   */
  async forgeOrg(opts = {}) {
    /**
       * See these properties in ForgeOrgConfig
     */
    const defaults = {
      name: undefined,
      tokenName: undefined,
      tokenSymbol: undefined,
      founders: [],
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
    let controllerAddress;

    if (options.universalController) {
      const contract = await Utils.requireContract("UController");
      controllerAddress = (await contract.deployed()).address;
    } else {
      controllerAddress = Utils.NULL_ADDRESS;
    }

    const tx = await this.contract.forgeOrg(
      options.name,
      options.tokenName,
      options.tokenSymbol,
      options.founders.map(founder => web3.toBigNumber(founder.address)),
      options.founders.map(founder => web3.toBigNumber(founder.tokens)),
      options.founders.map(founder => web3.toBigNumber(founder.reputation)),
      controllerAddress
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Register schemes with newly-created DAO.
   * Can only be invoked by the agent that created the DAO
   * via forgeOrg, and at that, can only be called one time.
   * @param {SetSchemesConfig} opts
   */
  async setSchemes(opts = {}) {

    /**
     * See SetSchemesConfig
     */
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      votingMachineParams: {},
      schemes: []
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const avatar = Avatar.at(options.avatar);

    const contracts = await Contracts.getDeployedContracts();

    const reputationAddress = await avatar.nativeReputation();
    const configuredVotingMachineName = config.get("defaultVotingMachine");
    const defaultVotingMachineParams = Object.assign({
      // voting machines can't supply reputation as a default -- they don't know what it is
      reputation: reputationAddress,
      votingMachine: contracts.allContracts[configuredVotingMachineName].address,
      // user internally
      votingMachineName: configuredVotingMachineName
    }, options.votingMachineParams || {});


    const defaultVotingMachine = await Contracts.getScheme(defaultVotingMachineParams.votingMachineName, defaultVotingMachineParams.votingMachine);

    /**
     * each voting machine applies its own default values in setParams
    */
    const defaultVoteParametersHash = (await defaultVotingMachine.setParams(defaultVotingMachineParams)).result;

    const initialSchemesSchemes = [];
    const initialSchemesParams = [];
    const initialSchemesPermissions = [];

    for (const schemeOptions of options.schemes) {

      if (!schemeOptions.name) {
        throw new Error("options.schemes[n].name is not defined");
      }

      const arcSchemeInfo = contracts.allContracts[schemeOptions.name];

      if (!arcSchemeInfo) {
        throw new Error("Non-arc schemes are not currently supported here.  You can add them later in your workflow.");
      }

      /**
       * scheme will be a contract wrapper
       */
      const scheme = await arcSchemeInfo.contract.at(
        schemeOptions.address || arcSchemeInfo.address
      );

      let schemeVotingMachineParams = {};
      let schemeVoteParametersHash;

      if (schemeOptions.votingMachineParams && (schemeOptions.votingMachineParams != {})) {
        /**
         * take the scheme-specific voting machine parameters to override the global defaults
         */
        Object.assign(schemeVotingMachineParams, defaultVotingMachineParams, schemeOptions.votingMachineParams);
        /**
         * get the hash of the voting machine params
         */
        if ((schemeVotingMachineParams.votingMachineName === defaultVotingMachine.votingMachineName) &&
          (schemeVotingMachineParams.votingMachine === defaultVotingMachine.votingMachine)) {
          // scheme is using the default voting machine
          schemeVoteParametersHash = (await defaultVotingMachine.setParams(schemeVotingMachineParams)).result;
        } else {
          // scheme has its own voting machine. get it.
          const schemeVotingMachine = await Contracts.getScheme(schemeVotingMachineParams.votingMachineName, schemeVotingMachineParams.votingMachine);
          schemeVotingMachineParams.votingMachine = schemeVotingMachine.address; // in case it wasn't supplied in order to get the default
          schemeVoteParametersHash = (await schemeVotingMachine.setParams(schemeVotingMachineParams)).result;
        }
      } else {
        // using the defaults
        schemeVotingMachineParams = defaultVotingMachineParams;
        schemeVoteParametersHash = defaultVoteParametersHash;
      }

      /**
       * This is the set of all possible parameters from which the current scheme will choose just the ones it requires
       */
      const schemeParamsHash = (await scheme.setParams(
        Object.assign(
          {
            voteParametersHash: schemeVoteParametersHash,
            votingMachine: schemeVotingMachineParams.votingMachine
          },
          schemeOptions.additionalParams || {}
        ))).result;

      initialSchemesSchemes.push(scheme.address);
      initialSchemesParams.push(schemeParamsHash);
      /**
       * Make sure the scheme has at least its required permissions, regardless of what the caller
       * passes in.
       */
      const requiredPermissions = Utils.permissionsStringToNumber(scheme.getDefaultPermissions());
      const additionalPermissions = Utils.permissionsStringToNumber(schemeOptions.permissions);
      initialSchemesPermissions.push(Utils.numberToPermissionsString(requiredPermissions | additionalPermissions));
    }

    // register the schemes with the dao
    const tx = await this.contract.setSchemes(
      options.avatar,
      initialSchemesSchemes,
      initialSchemesParams,
      initialSchemesPermissions
    );

    return new ArcTransactionResult(tx);
  }
}
