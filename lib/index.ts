/* tslint:disable:no-var-requires */
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
export * from "./wrappers/intVoteInterface";
export * from "./iContractWrapperBase";
export * from "./wrappers/iIntVoteInterface";
export * from "./wrappers/schemeRegistrar";
export * from "./wrappers/tokenCapGC";
export * from "./wrappers/upgradeScheme";
export * from "./wrappers/vestingScheme";
export * from "./wrappers/voteInOrganizationScheme";
export * from "./dao";
export * from "./contractWrapperBase";
export * from "./contractWrapperFactory";
export * from "./pubSubEventService";
export * from "./web3EventService";
export * from "./proposalService";
export * from "./proposalGeneratorBase";
export * from "./loggingService";
export * from "./transactionService";
export * from "./utils";
export const computeForgeOrgGasLimit: any = require("../gasLimits.js").computeForgeOrgGasLimit;

import { Web3 } from "web3";
import { AccountService } from "./accountService";
import { ConfigService } from "./configService";
import { LoggingService, LogLevel } from "./loggingService";
import { Utils } from "./utils";
import { WrapperService, WrapperServiceInitializeOptions } from "./wrapperService";

/**
 * Options for [InitializeArcJs](/api/README/#initializearcjs)
 */
export interface InitializeArcOptions extends WrapperServiceInitializeOptions {
  /**
   * Name of the network for which to use the defaults found in Arc.js/truffle.js.
   * Overwrites config settings network, providerUrl and providerPort.
   */
  useNetworkDefaultsFor?: string;
  /**
   * Set to true to watch for changes in the current user account.
   * Default is false.  See [AccountService.initiateAccountWatch](/api/classes/AccountService#initiateAccountWatch).
   */
  watchForAccountChanges?: boolean;
}
/**
 * You must call `InitializeArcJs` before doing anything else with Arc.js.
 * Call it again whenever the current chain changes.
 * @returns Promise of the `Web3` object for the current chain.
 */
export async function InitializeArcJs(options?: InitializeArcOptions): Promise<Web3> {
  LoggingService.info("Initializing Arc.js");
  try {

    if (options && options.useNetworkDefaultsFor) {
      const networkDefaults = ConfigService.get("networkDefaults")[options.useNetworkDefaultsFor];
      if (!networkDefaults) {
        throw new Error(`truffle network defaults not found: ${options.useNetworkDefaultsFor}`);
      }

      ConfigService.set("providerPort", networkDefaults.port);
      ConfigService.set("providerUrl", `http://${networkDefaults.host}`);
    }

    const web3 = await Utils.getWeb3();
    await WrapperService.initialize(options);

    if (options && options.watchForAccountChanges) {
      await AccountService.initiateAccountWatch();
    }

    return web3;
  } catch (ex) {
    /* tslint:disable-next-line:no-bitwise */
    LoggingService.message(`InitializeArcJs failed: ${ex}`, LogLevel.info | LogLevel.error);
    throw new Error(`InitializeArcJs failed: ${ex}`);
  }
}
