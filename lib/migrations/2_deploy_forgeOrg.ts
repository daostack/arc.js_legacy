import { promisify } from "es6-promisify";
import { Web3 } from "web3";
import { Utils } from "../utils";
import { MigrationState } from "./migrationTypes";
/* tslint:disable:no-var-requires */
const env = require("env-variable")();

/* tslint:disable:no-console */
/* tslint:disable:max-line-length */
interface FounderSpec {
  /**
   * Founders' address
   */
  address: string;
  /**
   * string | number token amount to be awarded to each founder, in GEN
   */
  tokens: string | number;
  /**
   * string | number reputation amount to be awarded to each founder,
   * in units of the Genesis Reputation system.
   */
  reputation: string | number;
}
/**
 * Migration callback
 */
export const arcJsDeployer = (
  web3: Web3,
  artifacts: any,
  deployer: any,
  production: boolean): void => {

  // so Utils.getWeb3 can find it
  (global as any).web3 = web3;

  const network = env.arcjs_network || "ganache";

  /**
   * Genesis DAO parameters, FOR TESTING PURPOSES ONLY
   */
  const orgName = production ? "Genesis" : "Genesis Alpha";
  const tokenName = production ? "Genesis" : "Genesis Alpha";
  const tokenSymbol = "GDT";

  /**
   * Truffle Solidity artifact wrappers
   */
  const Avatar = artifacts.require("Avatar.sol");
  const DaoCreator = artifacts.require("DaoCreator.sol");
  const UController = artifacts.require("UController.sol");
  const ControllerCreator = artifacts.require("ControllerCreator.sol");

  const internalFoundersConfigLocation = "../../migrations/founders.json";
  const foundersConfig = require(internalFoundersConfigLocation).founders;

  const customFoundersConfigLocation = env.arcjs_foundersConfigurationLocation || internalFoundersConfigLocation;

  if (internalFoundersConfigLocation !== customFoundersConfigLocation) {
    console.log(`merging custom founders from ${customFoundersConfigLocation}`);
    const customFoundersConfig = require(customFoundersConfigLocation).founders;
    // merge the two
    Object.assign(foundersConfig, customFoundersConfig);
  }

  const founders = foundersConfig[network];

  if (!founders || (founders.length === 0)) {
    throw new Error(`no founders were given for the network: ${network}`);
  }

  /**
   * Pattern for using async/await found here:
   *  https://github.com/trufflesuite/truffle/issues/501#issuecomment-332589663
   */
  deployer.then(async () => {

    let gasLimit = (await promisify((callback: any) => web3.eth.getBlock("latest", false, callback))() as any).gasLimit;
    gasLimit -= 50000;

    console.log(`Forging ${orgName} to ${network}, gasLimit: ${gasLimit}`);

    await deployer.deploy(ControllerCreator, { gas: gasLimit });
    const controllerCreator = await ControllerCreator.deployed();
    await deployer.deploy(DaoCreator, controllerCreator.address, { gas: gasLimit });
    const daoCreatorInst = await DaoCreator.deployed(controllerCreator.address);

    await deployer.deploy(UController, { gas: gasLimit });
    const universalControllerInst = await UController.deployed();

    console.log(`Forging ${orgName} with ${founders.length} founders...`);

    /**
     * Create the Genesis DAO
     */
    const txForgeOrg = await daoCreatorInst.forgeOrg(
      orgName,
      tokenName,
      tokenSymbol,
      founders.map((f: FounderSpec) => f.address),
      founders.map((f: FounderSpec) => web3.toWei(f.tokens)),
      founders.map((f: FounderSpec) => web3.toWei(f.reputation)),
      universalControllerInst.address,
      web3.toWei(100000000), // token cap of one hundred million GEN, in Wei
      { gas: gasLimit });

    /**
     * save info for later steps
     */
    if (network === "live") {
      Utils.sleep(10000); // maximize chances this is ready
    }

    const avatarInst = await Avatar.at(txForgeOrg.logs[0].args._avatar);

    (global as any).arcjsMigration = {
      avatarAddress: avatarInst.address,
      daoCreatorAddress: daoCreatorInst.address,
      gasLimit,
      nativeTokenAddress: await avatarInst.nativeToken(),
      network,
      orgName,
    } as MigrationState;
  });
};
