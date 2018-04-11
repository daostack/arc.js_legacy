"use strict";
import dopts = require("default-options");

import * as BigNumber from "bignumber.js";
import { computeGasLimit } from "../../gasLimits.js";
import { AvatarService } from "../avatarService";
import { Address, DefaultSchemePermissions, SchemePermissions } from "../commonTypes";
import { ConfigService } from "../configService";
import {
  ArcTransactionResult,
  ContractWrapperBase,
  EventFetcherFactory,
} from "../contractWrapperBase";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { Utils } from "../utils";
import { WrapperService } from "../wrapperService";

export class DaoCreatorWrapper extends ContractWrapperBase {

  public name: string = "DaoCreator";
  public friendlyName: string = "Dao Creator";
  public factory: ContractWrapperFactory<DaoCreatorWrapper> = DaoCreatorFactory;
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

    const web3 = Utils.getWeb3();

    /**
     * See these properties in ForgeOrgConfig
     */
    const defaults = {
      founders: [],
      name: undefined,
      tokenCap: web3.toBigNumber(0),
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

    let controllerAddress;

    if (options.universalController) {
      const contract = await Utils.requireContract("UController");
      controllerAddress = (await contract.deployed()).address;
    } else {
      controllerAddress = 0;
    }

    const totalGas = computeGasLimit(options.founders.length);

    const tx = await this.contract.forgeOrg(
      options.name,
      options.tokenName,
      options.tokenSymbol,
      options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.address)),
      options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.tokens)),
      options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.reputation)),
      controllerAddress,
      options.tokenCap,
      { gas: totalGas }
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
    const configuredVotingMachineName = ConfigService.get("defaultVotingMachine");
    const defaultVotingMachineParams = Object.assign({
      // voting machines can't supply reputation as a default -- they don't know what it is
      reputation: reputationAddress,
      votingMachineName: configuredVotingMachineName,
    }, options.votingMachineParams || {});

    const defaultVotingMachine = await WrapperService.getContractWrapper(
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

      const wrapperFactory = WrapperService.factories[schemeOptions.name];

      if (!wrapperFactory) {
        throw new Error("Non-arc schemes are not currently supported here.  You can add them later in your workflow.");
      }

      /**
       * scheme will be a contract wrapper
       */
      const scheme = schemeOptions.address ?
        await wrapperFactory.at(schemeOptions.address) : WrapperService.wrappers[schemeOptions.name];

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
          /**
           * Note we are not supporting non-Arc voting machines here, and it must have a wrapper class.
           */
          schemeVotingMachine = await WrapperService.getContractWrapper(
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

/**
 * defined just to add good type checking
 */
export class DaoCreatorFactoryType extends ContractWrapperFactory<DaoCreatorWrapper> {
  /**
   *
   * @param controllerCreatorAddress The ControllerCreator that Arc will use when migrating
   * a new non-universal controller in `forgeOrg`.
   * Typically is `ControllerCreator` from Arc.
   */
  public async new(controllerCreatorAddress?: Address): Promise<DaoCreatorWrapper> {
    if (!controllerCreatorAddress) {
      controllerCreatorAddress = (await (await Utils.requireContract("ControllerCreator")).deployed()).address;
    }
    return super.new(controllerCreatorAddress);
  }
}

export const DaoCreatorFactory =
  new DaoCreatorFactoryType("DaoCreator", DaoCreatorWrapper) as DaoCreatorFactoryType;

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
   * string | BigNumber token amount to be awarded to each founder.
   * Should be given in Wei.
   */
  tokens: string | BigNumber.BigNumber;
  /**
   * string | BigNumber reputation amount to be awarded to each founder.
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
   * Optional cap on the number of tokens, in the DAO's token.  Default is zero, which means no cap.
   */
  tokenCap?: BigNumber.BigNumber | string;
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
  founders?: Array<FounderConfig>;
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
   * See ContractWrapperBase.getDefaultPermissions for what this string
   * should look like.
   */
  permissions?: SchemePermissions | DefaultSchemePermissions;
  /**
   * Optional votingMachine parameters if you have not supplied them in ForgeOrgConfig or want to override them.
   * Note it costs more gas to add them here.
   *
   * New schemes will be created with these parameters and the DAO's native reputation contract.
   *
   * !!! note
   *     This is only relevant to schemes that can create proposals upon which
   * there can be a vote.  Other schemes will ignore these parameters.
   *
   * Defaults are those of whatever voting machine is the default for DaoCreator.  The default
   * default VotingMachine is AbsoluteVote.
   */
  votingMachineParams?: NewDaoVotingMachineConfig;
  /**
   * Other scheme parameters, any params besides those already provided in votingMachineParams.
   * For example, ContributionReward requires orgNativeTokenFee.  SchemeRegistrar has voteRemoveParametersHash.
   *
   * Default is {}
   */
  additionalParams?: any;
}

export interface SchemesConfig {
  /**
   * Default votingMachine parameters if you have not configured a scheme that you want to register with the
   * new DAO with its own voting parameters.
   *
   * New schemes will be created these parameters.
   *
   * !!! note
   *     This is only relevant to schemes that can create proposals upon which
   * there can be a vote.  Other schemes will ignore these parameters.
   *
   * Defaults are described in [[NewDaoVotingMachineConfig]].
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
  avatar: Address;
}
