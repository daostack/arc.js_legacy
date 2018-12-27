"use strict";
import * as BigNumber from "bignumber.js";
import { promisify } from "es6-promisify";
import { AvatarService } from "../avatarService";
import { Address, Hash, SchemePermissions } from "../commonTypes";
import { ConfigService } from "../configService";
import { ContractWrapperBase } from "../contractWrapperBase";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import {
  ArcTransactionResult,
  IContractWrapperFactory,
  ISchemeWrapper,
  IUniversalSchemeWrapper,
  IVotingMachineWrapper
} from "../iContractWrapperBase";
import { TransactionService, TxGeneratingFunctionOptions } from "../transactionService";
import { Utils } from "../utils";
import { EventFetcherFactory, Web3EventService } from "../web3EventService";
import { WrapperService } from "../wrapperService";

export class DaoCreatorWrapper extends ContractWrapperBase {

  public name: string = "DaoCreator";
  public friendlyName: string = "Dao Creator";
  public factory: IContractWrapperFactory<DaoCreatorWrapper> = DaoCreatorFactory;
  /**
   * Events
   */

  public NewOrg: EventFetcherFactory<NewOrgEventResult>;
  public InitialSchemesSet: EventFetcherFactory<InitialSchemesSetEventResult>;

  /**
   * Create a new DAO
   * @param {ForgeOrgConfig} options
   */
  public async forgeOrg(options: ForgeOrgConfig = {} as ForgeOrgConfig & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    const web3 = await Utils.getWeb3();

    /**
     * See these properties in ForgeOrgConfig
     */
    const defaults = {
      tokenCap: web3.toBigNumber(0),
      universalController: true,
    };

    options = Object.assign({}, defaults, options) as ForgeOrgConfig;

    if (!options.name) {
      throw new Error("DAO name is not defined");
    }

    if (!options.tokenName) {
      throw new Error("DAO token name is not defined");
    }

    if (!options.tokenSymbol) {
      throw new Error("DAO token symbol is not defined");
    }

    if (!options.founders) {
      throw new Error("DAO must have at least one founder");
    }

    let controllerAddress;

    if (options.universalController) {
      const contract = await Utils.requireContract("UController");
      controllerAddress = (await contract.deployed()).address;
    } else {
      controllerAddress = 0;
    }

    const paramsArray = [
      options.name,
      options.tokenName,
      options.tokenSymbol,
      options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.address)),
      options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.tokens)),
      options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.reputation)),
      controllerAddress,
      options.tokenCap];

    /**
     * The default gas limit will be insufficient when using non-universal controller,
     * so we do a proper estimate here.  We're estimating even when universal since
     * the value will be optimial for the user in any case.
     */
    const totalGas = await this.estimateGas(this.contract.forgeOrg, paramsArray);

    this.logContractFunctionCall("DaoCreator.forgeOrg (options)", options);

    this.logContractFunctionCall("DaoCreator.forgeOrg", {
      controllerAddress,
      founderAddresses: options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.address)),
      founderReputation: options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.reputation)),
      founderTokens: options.founders.map((founder: FounderConfig) => web3.toBigNumber(founder.tokens)),
      gas: { gas: totalGas },
      name: options.name,
      tokenCap: options.tokenCap,
      tokenName: options.tokenName,
      tokenSymbol: options.tokenSymbol,
    });

    return this.wrapTransactionInvocation("DaoCreator.forgeOrg",
      options,
      this.contract.forgeOrg,
      paramsArray,
      { gas: totalGas }
    );
  }

  /**
   * Register schemes with newly-created DAO.
   * Can only be invoked by the agent that created the DAO
   * via forgeOrg, and at that, can only be called one time.
   * @param {SetSchemesConfig} options
   */
  public async setSchemes(options: SetSchemesConfig = {} as SetSchemesConfig):
    Promise<ArcTransactionResult> {
    /**
     * See SetSchemesConfig
     */
    const defaults = {
      /**
       * avatar address
       */
      schemes: [],
      votingMachineParams: {},
    };

    options = Object.assign({}, defaults, options) as SetSchemesConfig;

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const functionName = "DaoCreator.setSchemes";

    const payload = TransactionService.publishKickoffEvent(
      functionName,
      options,
      this.setSchemesTransactionsCount(options)
    );

    /**
     * resend sub-events as DaoCreator.setSchemes
     */
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);

    const votingMachineParamsHashes = new Map<Address, Set<Hash>>();
    const paramsHashCacheSet = (address: Address, hash: Hash): void => {
      let hashes = votingMachineParamsHashes.get(address);
      if (!hashes) {
        hashes = new Set<Hash>();
      }
      hashes.add(hash);
    };

    const paramsHashCacheHasHash = (address: Address, hash: Hash): boolean => {
      const hashes = votingMachineParamsHashes.get(address);
      return hashes && hashes.has(hash);
    };

    const configuredVotingMachineName = ConfigService.get("defaultVotingMachine");
    const defaultVotingMachineParams = Object.assign({
      votingMachineName: configuredVotingMachineName,
    }, options.votingMachineParams || {});

    let tx;

    let defaultVotingMachine: IVotingMachineWrapper;
    let defaultVoteParametersHash: Hash;

    /**
     * The default voting machine name can only be missing if the DAO is going to have
     * no universal schemes or each universal scheme has specified its voting machine.
     */
    const hasDefaultVotingMachine = !!defaultVotingMachineParams.votingMachineName;
    if (hasDefaultVotingMachine) {
      /**
       * At this time, if you're going to supply a default voting machine, it has to be an Arc contract,
       * and it must be wrapped.
       */
      defaultVotingMachine = await WrapperService.getContractWrapper(
        defaultVotingMachineParams.votingMachineName,
        defaultVotingMachineParams.votingMachineAddress) as IVotingMachineWrapper;

      if (!defaultVotingMachine) {
        throw new Error(`voting machine ${defaultVotingMachineParams.votingMachineName} was not found`);
      }

      // in case the address wasn't supplied, in order to get the default
      defaultVotingMachineParams.votingMachineAddress = defaultVotingMachine.address;

      /**
       * each wrapped voting machine applies its own default values in `setParameters`
       */
      paramsHashCacheSet(defaultVotingMachine.address, defaultVoteParametersHash);
      const txResult = await defaultVotingMachine.setParameters(
        Object.assign(defaultVotingMachineParams, { txEventContext: eventContext }));

      defaultVoteParametersHash = txResult.result;

      // avoid nonce collisions
      await txResult.watchForTxMined();
    }

    const initialSchemesSchemes = [];
    const initialSchemesParams = [];
    const initialSchemesPermissions = [];

    /**
     * enumerate all the schemes
     */
    for (const schemeOptions of options.schemes) {

      let wrapperFactory;
      let schemeWrapper: ISchemeWrapper | IUniversalSchemeWrapper;
      let truffleContract: any;
      let contractAddress: Address;

      if (schemeOptions.name) {
        wrapperFactory = WrapperService.factories[schemeOptions.name];
      }

      if (wrapperFactory) {

        schemeWrapper = schemeOptions.address ?
          await wrapperFactory.at(schemeOptions.address) :
          WrapperService.wrappers[schemeOptions.name] as IUniversalSchemeWrapper;

        if (!schemeWrapper && schemeOptions.address) {
          throw new Error(`An instance of '${schemeOptions.name}' could not be found at ${schemeOptions.address}`);
        }
        /**
         * Else there is a factory but no address was given and no deployed scheme was found,
         * so the scheme is wrapped but hasn't been deployed by Arc.js.
         * So it must be a wrapped non-universal scheme -- these aren't deployed.
         */
        if (schemeWrapper) {
          truffleContract = schemeWrapper.contract;
          contractAddress = schemeWrapper.address;
        } // else is a wrapped non-universal scheme -- these aren't deployed
      }

      /**
       * If no factory (not wrapped) or couldn't get it from the factory (not deployed),
       * then get the scheme from Truffle.
       */
      if (!schemeWrapper) {

        if (!schemeOptions.address) {
          throw new Error(
            `A scheme that has no contract wrapper or has not been deployed by Arc.js must supply an address`);
        }

        if (schemeOptions.name) {
          const artifactContract = await Utils.requireContract(schemeOptions.name);

          truffleContract = await artifactContract.at(schemeOptions.address) as ISchemeWrapper;

          if (!truffleContract) {
            throw new Error(`An instance of '${schemeOptions.name}' could not be found at ${schemeOptions.address}`);
          }

          contractAddress = truffleContract.address;
        } else {
          /**
           * No name is given, so it is assumed to be a non-Arc scheme;
           * we have not even a truffleContract to work with.
           */
          contractAddress = schemeOptions.address;
        }
      }

      if (!contractAddress) {
        throw new Error("internal error: no contract address");
      }

      const isUniversal = schemeWrapper &&
        !!schemeWrapper.contract.getParametersHash &&
        !!schemeWrapper.contract.setParameters;

      let schemeVotingMachineParams = schemeOptions.votingMachineParams;
      let schemeVoteParametersHash: Hash;
      let schemeVotingMachine: IVotingMachineWrapper;

      let schemeParamsHash = schemeOptions.parametersHash;

      if (isUniversal && !schemeParamsHash && schemeWrapper) {
        /**
         * proceed to set the scheme's parameters, starting with optional voting machine params.
         * Note this requires a wrapper on a universal contract, and that a params hash has not been given.
         */
        if (schemeVotingMachineParams) {
          Object.assign(schemeOptions.votingMachineParams, { txEventContext: eventContext });
          const schemeVotingMachineName = schemeVotingMachineParams.votingMachineName;
          const schemeVotingMachineAddress = schemeVotingMachineParams.votingMachineAddress;

          if (!schemeVotingMachineAddress && !schemeVotingMachineName && !hasDefaultVotingMachine) {
            throw new Error("supplied voting machine parameters are not sufficient");
          }
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
              schemeVotingMachineParams.votingMachineAddress) as IVotingMachineWrapper;

            if (!schemeVotingMachine) {
              throw new Error(`wrapped voting machine '${schemeVotingMachineParams.votingMachineName}' was not found`);
            }

            // in case it wasn't supplied in order to get the default
            schemeVotingMachineParams.votingMachineAddress = schemeVotingMachine.address;
          }

          schemeVotingMachineParams = Object.assign({}, defaultVotingMachineParams, schemeVotingMachineParams);
          /**
           * get the voting machine parameters
           */
          schemeVoteParametersHash = await schemeVotingMachine.getParametersHash(schemeVotingMachineParams);

          // avoid nonce collisions and avoid unnecessary transactions
          if (!paramsHashCacheHasHash(schemeVotingMachine.address, schemeVoteParametersHash)) {
            paramsHashCacheSet(schemeVotingMachine.address, schemeVoteParametersHash);
            const txResult = await schemeVotingMachine.setParameters(schemeVotingMachineParams);
            // avoid nonce collisions
            await txResult.watchForTxMined();
          }
        } else {
          // use the default voting machine params
          schemeVotingMachineParams = Object.assign({}, defaultVotingMachineParams, { txEventContext: eventContext });
          schemeVoteParametersHash = defaultVoteParametersHash;
        }

        /**
         * Set the schemes parameters, merging in any voting machine params we obtained above.
         * Note the scheme may ignore all the voting machine parameters if it doesn't use a voting machine
         */
        const schemeParameters = Object.assign(
          {
            txEventContext: eventContext,
            voteParametersHash: schemeVoteParametersHash,
            votingMachineAddress: schemeVotingMachineParams.votingMachineAddress,
          },
          schemeOptions
        );

        schemeParamsHash = await (schemeWrapper as IUniversalSchemeWrapper).getParametersHash(schemeParameters);

        // avoid nonce collisions and avoid unnecessary transactions
        if (!paramsHashCacheHasHash(schemeWrapper.address, schemeParamsHash)) {
          paramsHashCacheSet(schemeWrapper.address, schemeParamsHash);
          /**
           * This is the set of all possible parameters from which the current scheme
           * will choose just the ones it requires
           */
          const txResult = await (schemeWrapper as IUniversalSchemeWrapper).setParameters(schemeParameters);
          // avoid nonce collisions
          await txResult.watchForTxMined();
        }
      } else {
        /**
         * scheme is not universal || schemeParamsHash is given || there is no wrapper
         *
         * schemeParamsHash can be supplied for non-wrapped schemes, particularly non-Arc schemes.
         * Otherwise NULL_HASH is used, appropriate for non-universal schemes that don't have
         * parameters to be registered against a controller.
         */
        schemeParamsHash = schemeParamsHash || Utils.NULL_HASH;
      }

      initialSchemesSchemes.push(contractAddress);
      initialSchemesParams.push(schemeParamsHash);

      const defaultPermissions = schemeWrapper ? schemeWrapper.getDefaultPermissions() : SchemePermissions.None;
      /* tslint:disable-next-line:no-bitwise */
      initialSchemesPermissions.push(SchemePermissions.toString(defaultPermissions | schemeOptions.permissions));
    }

    this.logContractFunctionCall("DaoCreator.setSchemes (options)", options);

    this.logContractFunctionCall("DaoCreator.setSchemes",
      {
        avatar: options.avatar,
        initialSchemesParams,
        initialSchemesPermissions,
        initialSchemesSchemes,
      });

    // register the schemes with the dao
    tx = await this.sendTransaction(
      eventContext,
      this.contract.setSchemes,
      [options.avatar,
        initialSchemesSchemes,
        initialSchemesParams,
        initialSchemesPermissions]
    );

    if (tx) {
      TransactionService.publishTxLifecycleEvents(eventContext, tx, this.contract);
    }

    return new ArcTransactionResult(tx, this.contract);
  }

  public forgeOrgTransactionsCount(options: ForgeOrgConfig): number {
    return 1;
  }

  public setSchemesTransactionsCount(options: SchemesConfig): number {
    /**
     * one for setSchemes, one for the default votingMachine params,
     * one for each scheme's params, and one for each scheme that is not using the default votingMachine
     */
    const schemes = options.schemes || [];
    const numSchemes = schemes.length;
    const numSchemesWithDefaultParams = schemes.filter((s: SchemeConfig) => !!s.votingMachineParams).length;
    return 2 + numSchemes + numSchemesWithDefaultParams;
  }

  protected hydrated(): void {
    /* tslint:disable:max-line-length */
    this.NewOrg = this.createEventFetcherFactory<NewOrgEventResult>(this.contract.NewOrg);
    this.InitialSchemesSet = this.createEventFetcherFactory<InitialSchemesSetEventResult>(this.contract.InitialSchemesSet);
    /* tslint:enable:max-line-length */
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
  new DaoCreatorFactoryType("DaoCreator", DaoCreatorWrapper, new Web3EventService()) as DaoCreatorFactoryType;

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
   * The name of the Arc scheme.  Omit this only if it is a non-Arc scheme.
   */
  name?: string;
  /**
   * Scheme address if you don't want to use the scheme deployed in this release of Arc.js,
   * or if it is a non-Arc scheme.
   */
  address?: string;
  /**
   * Extra permissions on the scheme.  The minimum permissions for the scheme
   * will be enforced (or'd with anything you supply).
   * See ContractWrapperBase.getDefaultPermissions for what this string
   * should look like.
   */
  permissions?: SchemePermissions;
  /**
   * Optional votingMachine parameters if you have not supplied them in ForgeOrgConfig or want to override them.
   * Note it costs more gas to add them here.
   *
   * New schemes will be created with these voting machine parameters.
   * This is only relevant to schemes that can create proposals upon which there can be a vote.
   * Other schemes will ignore these parameters.
   *
   * Defaults are those of whatever voting machine is the default for DaoCreator.  The default
   * default VotingMachine is AbsoluteVote.
   */
  votingMachineParams?: NewDaoVotingMachineConfig;
  /**
   * You can add other scheme parameters here.
   * For example, ContributionReward requires orgNativeTokenFee.
   * SchemeRegistrar has voteRemoveParametersHash.
   */
  [x: string]: any;
  /**
   * Optional scheme parameters hash for schemes, particularly for schemes that are not wrapped in Arc.js.
   * If this is supplied, then any other parameters (either in x or votingMachineParams) are ignored.
   */
  parametersHash?: Hash;
}

export interface SchemesConfig {
  /**
   * Default votingMachine parameters if you have not configured a scheme that you want to register with the
   * new DAO with its own voting parameters.
   *
   * New schemes will be created these voting machine parameters unless overrideen by the `SchemeConfig`.
   * This is only relevant to schemes that can create proposals upon which there can be a vote.
   * Other schemes will ignore these parameters.
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

export interface SetSchemesConfig extends SchemesConfig, TxGeneratingFunctionOptions {
  /**
   * avatar address
   */
  avatar: Address;
}
