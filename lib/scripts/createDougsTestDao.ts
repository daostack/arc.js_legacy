/* tslint:disable:max-line-length */
/* tslint:disable:no-console */
/* tslint:disable:no-var-requires */
const env = require("env-variable")();
import { Utils } from "../utils";
// import { GetDefaultGenesisProtocolParameters } from "../wrappers/genesisProtocol";
import { DAO } from '../dao';
import { InitializeArcJs } from '../index';

/* tslint:disable-next-line:no-var-requires */
const gasLimits: any = require("../../gasLimits.js");
const computeForgeOrgGasLimit: any = gasLimits.computeForgeOrgGasLimit;
const computeMaxGasLimit: any = gasLimits.computeMaxGasLimit;

/**
 * Migration callback
 */
export class DaoCreator {

  /**
   * Forge the Genesis DAO.  Note this does not set the schemes.
   */
  public async createDao(): Promise<void> {

    const network = (env.arcjs_network || "ganache").toLowerCase();

    const foundersConfigurationLocation = env.arcjs_foundersConfigurationLocation

    const live = network === "live";
    if (live) { return; }

    const web3 = await InitializeArcJs();
    /**
     * Genesis DAO parameters
     */
    const orgName = "Dougs Test";
    const tokenName = "DougsTestDaoToken";
    const tokenSymbol = "DTDT";

    /**
     * Truffle Solidity artifact wrappers
     */
    const internalFoundersConfigLocation = "../../migrations/founders.json";
    const foundersConfig = require(internalFoundersConfigLocation).founders;

    const customFoundersConfigLocation = foundersConfigurationLocation || internalFoundersConfigLocation;

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

    let gasLimit = computeForgeOrgGasLimit(founders.length);
    const maxGasLimit = await computeMaxGasLimit(web3);

    gasLimit = Math.min(gasLimit, maxGasLimit);

    console.log(`Forging ${orgName} to ${network}, gasLimit: ${gasLimit} and ${founders.length} founders...`);

    const GenesisProtocol = await Utils.requireContract("GenesisProtocol");

    const genesisProtocolInst = await GenesisProtocol.new(
      network === "ganache" ? "0xdcf22b53f327b4f7f3ac42d957834bd962637555" : "0x240481418e44558cf9c4b87cd0497a34771749e7",
      { gas: maxGasLimit });

    console.log(`GenesisProtocolAddress: ${genesisProtocolInst.address}`);

    /**
     * Create a DAO where the GP is using a GEN token over which we have control,
     * ContributionReward is using the custom GP,
     * SchemeRegistrar is using AbsoluteVote.
     */
    const dao = await DAO.new({
      name: orgName,
      founders: founders,
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
      schemes: [
        { name: "GenesisProtocol" },
        {
          name: "ContributionReward"
          , votingMachineParams: { votingMachineName: "GenesisProtocol", votingMachineAddress: genesisProtocolInst.address }
        },
        { name: "SchemeRegistrar" },
      ],
    });
    console.log(`Created DAO at: ${dao.avatar.address}`);
  }
}

