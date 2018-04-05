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
export * from "./wrappers/contributionreward";
export * from "./wrappers/daocreator";
export * from "./wrappers/genesisProtocol";
export * from "./wrappers/globalconstraintregistrar";
export * from "./wrappers/schemeregistrar";
export * from "./wrappers/tokenCapGC";
export * from "./wrappers/upgradescheme";
export * from "./wrappers/vestingscheme";
export * from "./wrappers/voteInOrganizationScheme";
export * from "./dao";
export * from "./contractWrapperBase";
export * from "./contractWrapperFactory";
export * from "./loggingService";
export * from "./utils";

import Web3 = require("web3");
import { LoggingService } from "./loggingService";
import { Utils } from "./utils";
import { WrapperService } from "./wrapperService";

/**
 * initialize() must be called before doing anything with Arc.js
 */
export async function InitializeArc(): Promise<Web3> {
  LoggingService.info("Initializing Arc.js");
  const web3 = Utils.getWeb3();
  await WrapperService.initialize();
  return web3;
}
