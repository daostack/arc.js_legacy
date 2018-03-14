"use strict";
import dopts = require("default-options");

import * as BigNumber from "bignumber.js";
import { AvatarService } from "../avatarService";
import { Address, DefaultSchemePermissions, SchemePermissions } from "../commonTypes";
import { Config } from "../config";
import { Contracts } from "../contracts.js";
import ContractWrapperFactory from "../ContractWrapperFactory";
import {
  ArcTransactionResult,
  EventFetcherFactory,
  ExtendTruffleContract,
} from "../ExtendTruffleContract";
import { Utils } from "../utils";

export class DaoCreatorWrapper extends ExtendTruffleContract {

  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public NewOrg: EventFetcherFactory<NewOrgEventResult> = this.createEventFetcherFactory<NewOrgEventResult>("NewOrg");
  public InitialSchemesSet: EventFetcherFactory<InitialSchemesSetEventResult> = this.createEventFetcherFactory<InitialSchemesSetEventResult>("InitialSchemesSet");
  /* tslint:enable:max-line-length */

  /**
   * Create a new DAO
   * @param {ForgeOrgConfig} opts
   */
  public async forgeOrg(opts: ForgeOrgConfig = {} as ForgeOrgConfig)
    : Promise<ArcTransactionResult> {
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

    const options = dopts(opts, defaults, { allowUnknown: true }) as ForgeOrgConfig;

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
      controllerAddress = 0;
    }

    const tx = await this.contract.forgeOrg(
      options.name,
      options.tokenName,
      options.tokenSymbol,
      options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.address)),
      options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.tokens)),
      options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.reputation)),
      controllerAddress,
      /**
       * We need to increase the gas limit when creating for a non-universal controller,
       * or it will revert.  MetaMask will probably complain that our gas exceeds the block limit,
       * but there is no choice (except the TODO below).
       * 
       * But the universal controller requires less gas and requires no change in the gas
       * limit. So to make things easier with MetaMask, we will not set the gas in this case.
       * 
       * TODO:  Dynamically compute the gas requirement for both cases.
       */
      controllerAddress ? undefined : { gas: Config.get("gasLimit_deployment") }
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Register schemes with newly-created DAO.
   * Can only be invoked by the agent that created the DAO
   * via forgeOrg, and at that, can only be called one time.
   * @param {SetSchemesConfig} opts
   */
  public async setSchemes(opts: SetSchemesConfig = {} as SetSchemesConfig):
    Promise<ArcTransactionResult> {

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

    const options = dopts(opts, defaults, { allowUnknown: true }) as SetSchemesConfig;

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const avatarService = new AvatarService(options.avatar);
    const reputationAddress = await avatarService.getNativeReputationAddress();
    const configuredVotingMachineName = Config.get("defaultVotingMachine");
    const defaultVotingMachineParams = Object.assign({
      // voting machines can't supply reputation as a default -- they don't know what it is
      reputation: reputationAddress,
      votingMachineName: configuredVotingMachineName,
    }, options.votingMachineParams || {});

    const defaultVotingMachine = await Contracts.getContractWrapper(
      defaultVotingMachineParams.votingMachineName,
      defaultVotingMachineParams.votingMachineAddress);

    // in case it wasn't supplied in order to get the default
    defaultVotingMachineParams.votingMachineAddress = defaultVotingMachine.address;

    /**
     * each voting machine applies its own default values in setParameters
     */
    const defaultVoteParametersHash = (await defaultVotingMachine.setParameters(defaultVotingMachineParams)).result;

    const initialSchemesSchemes = [];
    const initialSchemesParams = [];
    const initialSchemesPermissions = [];

    for (const schemeOptions of options.schemes) {

      if (!schemeOptions.name) {
        throw new Error("options.schemes[n].name is not defined");
      }

      const contracts = await Contracts.getDeployedContracts();
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
        const schemeVotingMachineAddress = schemeVotingMachineParams.votingMachineAddress;
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
          schemeVotingMachine = await Contracts.getContractWrapper(
            schemeVotingMachineParams.votingMachineName,
            schemeVotingMachineParams.votingMachineAddress);

          // in case it wasn't supplied in order to get the default
          schemeVotingMachineParams.votingMachineAddress = schemeVotingMachine.address;
        }

        schemeVotingMachineParams = Object.assign(defaultVotingMachineParams, schemeVotingMachineParams);
        /**
         * get the voting machine parameters
         */
        schemeVoteParametersHash = (await schemeVotingMachine.setParameters(schemeVotingMachineParams)).result;

      } else {
        // using the defaults
        schemeVotingMachineParams = defaultVotingMachineParams;
        schemeVoteParametersHash = defaultVoteParametersHash;
      }

      /**
       * This is the set of all possible parameters from which the current scheme will choose just the ones it requires
       */
      const schemeParamsHash = (await scheme.setParameters(
        Object.assign(
          {
            voteParametersHash: schemeVoteParametersHash,
            votingMachineAddress: schemeVotingMachineParams.votingMachineAddress,
          },
          schemeOptions.additionalParams || {}
        ))).result;

      initialSchemesSchemes.push(scheme.address);
      initialSchemesParams.push(schemeParamsHash);
      /**
       * Make sure the scheme has at least its required permissions, regardless of what the caller
       * passes in.
       */
      const requiredPermissions = scheme.getDefaultPermissions();
      const additionalPermissions = schemeOptions.permissions;
      /* tslint:disable-next-line:no-bitwise */
      initialSchemesPermissions.push(SchemePermissions.toString(requiredPermissions | additionalPermissions));
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

const DaoCreator = new ContractWrapperFactory("DaoCreator", DaoCreatorWrapper);
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
  votingMachineAddress?: string;
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
  permissions?: SchemePermissions | DefaultSchemePermissions;
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
