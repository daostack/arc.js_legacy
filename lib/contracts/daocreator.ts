"use strict";
import dopts = require("default-options");

import { Utils } from "../utils";
const Avatar = Utils.requireContract("Avatar");
import { Address } from "../commonTypes";
import { Config } from "../config";
import { Contracts } from "../contracts.js";
import {
  ArcTransactionResult,
  EventFetcherFactory,
  ExtendTruffleContract,
} from "../ExtendTruffleContract";
const SolidityContract = Utils.requireContract("DaoCreator");
import ContractWrapperFactory from "../ContractWrapperFactory";
import * as BigNumber from "bignumber.js";

export class DaoCreatorWrapper extends ExtendTruffleContract {

  /**
   * Events
   */

  public NewOrg: EventFetcherFactory<NewOrgEventResult> = this.createEventFetcherFactory<NewOrgEventResult>("NewOrg");
  public InitialSchemesSet: EventFetcherFactory<InitialSchemesSetEventResult> = this.createEventFetcherFactory<InitialSchemesSetEventResult>("InitialSchemesSet");

  /**
   * Create a new DAO
   * @param {ForgeOrgConfig} opts
   */
  public async forgeOrg(opts = {}) {
    /**
     * See these properties in ForgeOrgConfig
     */
    const defaults = {
      founders: [],
      name: undefined,
      tokenName: undefined,
      tokenSymbol: undefined,
      universalController: true,
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
      options.founders.map((founder) => web3.toBigNumber(founder.address)),
      options.founders.map((founder) => web3.toBigNumber(founder.tokens)),
      options.founders.map((founder) => web3.toBigNumber(founder.reputation)),
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
  public async setSchemes(opts = {}) {

    /**
     * See SetSchemesConfig
     */
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      schemes: [],
      votingMachineParams: {},
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const avatar = Avatar.at(options.avatar);

    const contracts = await Contracts.getDeployedContracts();

    const reputationAddress = await avatar.nativeReputation();
    const configuredVotingMachineName = Config.get("defaultVotingMachine");
    const defaultVotingMachineParams = Object.assign({
      // voting machines can't supply reputation as a default -- they don't know what it is
      reputation: reputationAddress,
      votingMachineName: configuredVotingMachineName,
    }, options.votingMachineParams || {});

    const defaultVotingMachine = await Contracts.getScheme(
      defaultVotingMachineParams.votingMachineName,
      defaultVotingMachineParams.votingMachine);

    // in case it wasn't supplied in order to get the default
    defaultVotingMachineParams.votingMachine = defaultVotingMachine.address;

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

      let schemeVotingMachineParams = schemeOptions.votingMachineParams;
      let schemeVoteParametersHash;
      let schemeVotingMachine;

      if (schemeVotingMachineParams) {
        const schemeVotingMachineName = schemeVotingMachineParams.votingMachineName;
        const schemeVotingMachineAddress = schemeVotingMachineParams.votingMachine;
        /**
         * get the voting machine contract
         */
        if (!schemeVotingMachineAddress &&
          (!schemeVotingMachineName ||
            (schemeVotingMachineName === defaultVotingMachineParams.votingMachineName))) {
          /**
           *  scheme is using the default voting machine
           */
          schemeVotingMachine = defaultVotingMachine;
        } else {
          /**
           * scheme has its own voting machine. Go get it.
           */
          if (!schemeVotingMachineName) {
            schemeVotingMachineParams.votingMachineName = defaultVotingMachineParams.votingMachineName;
          }
          schemeVotingMachine = await Contracts.getScheme(
            schemeVotingMachineParams.votingMachineName,
            schemeVotingMachineParams.votingMachine);

          // in case it wasn't supplied in order to get the default
          schemeVotingMachineParams.votingMachine = schemeVotingMachine.address;
        }

        schemeVotingMachineParams = Object.assign(defaultVotingMachineParams, schemeVotingMachineParams);
        /**
         * get the voting machine parameters
         */
        schemeVoteParametersHash = (await schemeVotingMachine.setParams(schemeVotingMachineParams)).result;

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
            votingMachine: schemeVotingMachineParams.votingMachine,
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
      /* tslint:disable-next-line:no-bitwise */
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

const DaoCreator = new ContractWrapperFactory(SolidityContract, DaoCreatorWrapper);
export { DaoCreator };

export interface NewOrgEventResult {
  _avatar: Address;
}
export interface InitialSchemesSetEventResult {
  _avatar: Address;
}

export interface FounderConfig {
  /**
   * Founders' address
   */
  address: string;
  /**
   * string | BigNumber array of token amounts to be awarded to each founder.
   * Should be given in Wei.
   */
  tokens: string | BigNumber.BigNumber;
  /**
   * string | BigNumber array of reputation amounts to be awarded to each founder.
   * Should be given in Wei.
   */
  reputation: string | BigNumber.BigNumber;
}

export interface NewDaoVotingMachineConfig {
  /**
   * Optional Reputation address.
   * Default is the new DAO's native reputation.
   */
  reputation?: string;
  /**
   * Optional VotingMachine name
   * Default is AbsoluteVote
   */
  votingMachineName?: string;
  /**
   * Optional VotingMachine address
   * Default is that of AbsoluteVote
   */
  votingMachine?: string;
  /**
   * You can add your voting-machine-specific parameters here, like ownerVote, votePerc, etc
   */
  [x: string]: any;
}

/**
 * options for DaoCreator.forgeOrg
 */
export interface ForgeOrgConfig {
  /**
   * The name of the new DAO.
   */
  name: string;
  /**
   * The name of the token to be associated with the DAO
   */
  tokenName: string;
  /**
   * The symbol of the token to be associated with the DAO
   */
  tokenSymbol: string;
  /**
   * Optional array describing founders.
   * Default is [].
   */
  founders: Array<FounderConfig>;
  /**
   * true to use the UniversalController contract, false to instantiate and use a new Controller contract.
   * The default is true.
   */
  universalController?: boolean;
}

/**
 * Configuration of an Arc scheme that you want to automatically register with a new DAO.
 */
export interface SchemeConfig {
  /**
   * The name of the Arc scheme.  It must be an Arc scheme.
   */
  name: string;
  /**
   * Scheme address if you don't want to use the scheme supplied in this release of Arc.js.
   */
  address?: string;
  /**
   * Extra permissions on the scheme.  The minimum permissions for the scheme
   * will be enforced (or'd with anything you supply).
   * See ExtendTruffleContract.getDefaultPermissions for what this string
   * should look like.
   */
  permissions?: string;
  /**
   * Optional votingMachine parameters if you have not supplied them in NewDaoConfig or want to override them.
   * Note it costs more gas to add them here.
   *
   * New schemes will be created with these parameters and the DAO's native reputation contract.
   *
   * Defaults are the Arc.js-deployed AbsoluteVote, the Arc.js-deployed Reputation, votePerc 50%, ownerVote true
   */
  votingMachineParams?: NewDaoVotingMachineConfig;
  /**
   * Other scheme parameters, any params besides those already provided in votingMachineParams.
   * For example, ContributionReward requires orgNativeTokenFee.
   *
   * Default is {}
   */
  additionalParams?: any;
}

export interface SchemesConfig {
  /**
   * default votingMachine parameters if you have not configured a scheme that you want to register with the
   * new DAO with its own voting parameters.
   *
   * New schemes will be created these parameters.
   *
   * Defaults are described in NewDaoVotingMachineConfig.
   */
  votingMachineParams?: NewDaoVotingMachineConfig;
  /**
   * Any Arc schemes you would like to automatically register with the new DAO.
   * Non-Arc schemes are not allowed here.  You may add them later in your application's workflow
   * using SchemeRegistrar.
   */
  schemes?: Array<SchemeConfig>;
}

export interface SetSchemesConfig extends SchemesConfig {
  /**
   * avatar address
   */
  avatar: string;
}
