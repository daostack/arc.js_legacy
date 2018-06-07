/* tslint:disable-next-line:no-reference */
/// <reference path="../custom_typings/web3.d.ts" />
export * from "./accountService";
export * from "./avatarService";
export * from "./commonTypes";
export * from "./configService";
export {
  ContractWrappers,
  ContractWrapperFactories,
  ContractWrappersByType,
  ContractWrappersByAddress
} from "./wrapperService";
export * from "./wrapperService";
export * from "./wrappers/absoluteVote";
export * from "./wrappers/commonEventInterfaces";
export * from "./wrappers/contributionReward";
export * from "./wrappers/daoCreator";
export * from "./wrappers/genesisProtocol";
export * from "./wrappers/globalConstraintRegistrar";
export * from "./wrappers/schemeRegistrar";
export * from "./wrappers/tokenCapGC";
export * from "./wrappers/upgradeScheme";
export * from "./wrappers/vestingScheme";
export * from "./wrappers/voteInOrganizationScheme";
export * from "./dao";
export * from "./contractWrapperBase";
export * from "./contractWrapperFactory";
export * from "./eventService";
export * from "./loggingService";
export * from "./transactionService";
export * from "./utils";
/* tslint:disable-next-line:no-var-requires */
export const computeGasLimit: any = require("../gasLimits.js").computeGasLimit;

import { Web3 } from "web3";
import { ConfigService } from "./configService";
import { LoggingService, LogLevel } from "./loggingService";
import { Utils } from "./utils";
import { WrapperService, WrapperServiceInitializeOptions } from "./wrapperService";
import { AccountService } from './accountService';

/* tslint:disable-next-line:no-empty-interface */
export interface InitializeArcOptions extends WrapperServiceInitializeOptions {
  /**
   * Name of the network for which to use the defaults found in Arc.js/truffle.js.
   * Overwrites config settings network, providerUrl and providerPort.
   */
  useNetworkDefaultsFor?: string;
  /**
   * Set to true to watch for changes in the current user account.
   * Default is false.  See [AccountService.AccountChangedEventTopic](api/classes/AccountService#initiateAccountWatch).
   */
  watchForAccountChanges?: boolean;
}
/**
 * initialize() must be called before doing anything with Arc.js.
 */
export async function InitializeArcJs(options?: InitializeArcOptions): Promise<Web3> {
  LoggingService.info("Initializing Arc.js");
  try {

    if (options && options.useNetworkDefaultsFor) {
      const networkDefaults = ConfigService.get("networkDefaults")[options.useNetworkDefaultsFor];
      if (!networkDefaults) {
        throw new Error(`truffle network defaults not found: ${options.useNetworkDefaultsFor}`);
      }

      ConfigService.set("network", options.useNetworkDefaultsFor);
      ConfigService.set("providerPort", networkDefaults.port);
      ConfigService.set("providerUrl", `http://${networkDefaults.host}`);
    }

    const web3 = await Utils.getWeb3();
    await WrapperService.initialize(options);

    if (options.watchForAccountChanges) {
      await AccountService.initiateAccountWatch();
    }

    return web3;
  } catch (ex) {
    /* tslint:disable-next-line:no-bitwise */
    LoggingService.message(`InitializeArcJs failed: ${ex}`, LogLevel.info | LogLevel.error);
    throw new Error(`InitializeArcJs failed: ${ex}`);
  }
}
