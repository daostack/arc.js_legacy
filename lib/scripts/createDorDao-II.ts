import { Web3 } from "web3";
import { DefaultSchemePermissions, SchemePermissions } from "../commonTypes";
import { Address } from "../commonTypes";
import { Utils } from "../utils";
import { UtilsInternal } from "../utilsInternal";
import { GetDefaultGenesisProtocolParameters } from "../wrappers/genesisProtocol";

/* tslint:disable-next-line:no-var-requires */
const gasLimits: any = require("../../gasLimits.js");
const computeForgeOrgGasLimit: any = gasLimits.computeForgeOrgGasLimit;
const computeMaxGasLimit: any = gasLimits.computeMaxGasLimit;

/* tslint:disable:no-var-requires */

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

export interface ForgedDaoInfo {
  avatarAddress: Address;
  orgName: string;
  daoCreatorInst: any;
}

/**
 * Migration callback
 */
export class GenesisDaoCreator {

  constructor(
    private web3: Web3,
    private network: string) {
  }

  /**
   * Forge the Genesis DAO.  Note this does not set the schemes.
   */
  public async forge(foundersConfigurationLocation: string): Promise<ForgedDaoInfo> {

    const live = this.network === "live";
    /**
     * Genesis DAO parameters
     */
    const orgName = live ? "Genesis" : "Genesis Doug";
    const tokenName = live ? "Genesis" : "Genesis Doug";
    const tokenSymbol = "GDG";

    /**
     * Truffle Solidity artifact wrappers
     */
    const Avatar = await Utils.requireContract("Avatar");

    const DaoCreator = await Utils.requireContract("DaoCreator");
    const daoCreatorInst = await DaoCreator.deployed();
    const UController = await Utils.requireContract("UController");
    const universalControllerInst = await UController.deployed();

    const internalFoundersConfigLocation = "../../migrations/founders.json";
    const foundersConfig = require(internalFoundersConfigLocation).founders;

    const customFoundersConfigLocation = foundersConfigurationLocation || internalFoundersConfigLocation;

    if (internalFoundersConfigLocation !== customFoundersConfigLocation) {
      console.log(`merging custom founders from ${customFoundersConfigLocation}`);
      const customFoundersConfig = require(customFoundersConfigLocation).founders;
      // merge the two
      Object.assign(foundersConfig, customFoundersConfig);
    }

    const founders = foundersConfig[this.network];

    if (!founders || (founders.length === 0)) {
      throw new Error(`no founders were given for the network: ${this.network}`);
    }

    let gasLimit = computeForgeOrgGasLimit(founders.length);
    const maxGasLimit = await computeMaxGasLimit(this.web3);

    gasLimit = Math.min(gasLimit, maxGasLimit);

    console.log(`Forging ${orgName} to ${this.network}, gasLimit: ${gasLimit} and ${founders.length} founders...`);

    /**
     * Create the Genesis DAO
     */
    const txForgeOrg = await daoCreatorInst.forgeOrg(
      orgName,
      tokenName,
      tokenSymbol,
      founders.map((f: FounderSpec) => f.address),
      founders.map((f: FounderSpec) => this.web3.toWei(f.tokens)),
      founders.map((f: FounderSpec) => this.web3.toWei(f.reputation)),
      universalControllerInst.address,
      this.web3.toWei(100000000), // token cap of one hundred million GEN, in Wei
      { gas: gasLimit });

    let avatarInst;

    /**
     * save info for later steps
     */
    while (!avatarInst) {
      avatarInst = await Avatar.at(txForgeOrg.logs[0].args._avatar);
      console.log("sleeping until Avatar is mined...");
      /**
       * Sleep and retry until avatarInst is ready.
       * This is an unfortunate hack until we better understand
       * why it has been needed when deploying to mainnet.
       */
      UtilsInternal.sleep(1000);
    }

    /** for use by setSchemes */
    return {
      avatarAddress: avatarInst.address,
      daoCreatorInst,
      orgName,
    } as ForgedDaoInfo;
  }

  public async setSchemes(forgedDaoInfo: ForgedDaoInfo): Promise<void> {

    /**
     * Truffle Solidity artifact wrappers
     */
    const SchemeRegistrar = await Utils.requireContract("SchemeRegistrar");
    const ContributionReward = await Utils.requireContract("ContributionReward");
    const GenesisProtocol = await Utils.requireContract("GenesisProtocol");

    /**
     *  Genesis DAO parameters
     */
    const orgNativeTokenFee = 0;
    const defaultVotingMachineParams = await GetDefaultGenesisProtocolParameters();
    const contributionRewardPermissions = SchemePermissions.toString(DefaultSchemePermissions.ContributionReward);
    const genesisProtocolPermissions = SchemePermissions.toString(DefaultSchemePermissions.GenesisProtocol);
    const schemeRegistrarPermissions = SchemePermissions.toString(DefaultSchemePermissions.SchemeRegistrar);

    console.log(`Setting schemes for ${forgedDaoInfo.orgName} on ${this.network}...`);

    const maxGasLimit = await computeMaxGasLimit(this.web3);

    const genesisProtocolInst = await GenesisProtocol.new("0x772fa003715e3304209a3f08f3ca9b1daaf74973", { gas: maxGasLimit });
    const contributionRewardInst = await ContributionReward.deployed();
    const schemeRegistrarInst = await SchemeRegistrar.deployed();
    /**
     * Set/get the GenesisProtocol voting parameters that will be used as defaults
     * for the schemes' voting machine as we add the schemes to the Genesis DAO, below.
     */
    const genesisProtocolParams = await genesisProtocolInst.getParametersHash(
      [
        defaultVotingMachineParams.preBoostedVoteRequiredPercentage,
        defaultVotingMachineParams.preBoostedVotePeriodLimit,
        defaultVotingMachineParams.boostedVotePeriodLimit,
        defaultVotingMachineParams.thresholdConstA,
        defaultVotingMachineParams.thresholdConstB,
        defaultVotingMachineParams.minimumStakingFee,
        defaultVotingMachineParams.quietEndingPeriod,
        defaultVotingMachineParams.proposingRepRewardConstA,
        defaultVotingMachineParams.proposingRepRewardConstB,
        defaultVotingMachineParams.stakerFeeRatioForVoters,
        defaultVotingMachineParams.votersReputationLossRatio,
        defaultVotingMachineParams.votersGainRepRatioFromLostRep,
        defaultVotingMachineParams.daoBountyConst,
        defaultVotingMachineParams.daoBountyLimit,
      ]
    );

    await genesisProtocolInst.setParameters(
      [
        defaultVotingMachineParams.preBoostedVoteRequiredPercentage,
        defaultVotingMachineParams.preBoostedVotePeriodLimit,
        defaultVotingMachineParams.boostedVotePeriodLimit,
        defaultVotingMachineParams.thresholdConstA,
        defaultVotingMachineParams.thresholdConstB,
        defaultVotingMachineParams.minimumStakingFee,
        defaultVotingMachineParams.quietEndingPeriod,
        defaultVotingMachineParams.proposingRepRewardConstA,
        defaultVotingMachineParams.proposingRepRewardConstB,
        defaultVotingMachineParams.stakerFeeRatioForVoters,
        defaultVotingMachineParams.votersReputationLossRatio,
        defaultVotingMachineParams.votersGainRepRatioFromLostRep,
        defaultVotingMachineParams.daoBountyConst,
        defaultVotingMachineParams.daoBountyLimit,
      ]
    );

    console.log(`GenesisProtocolAddress: ${genesisProtocolInst.address}`);
    console.log(`GenesisProtocolParamsHash: ${genesisProtocolParams}`);

    /**
     * Set/get the Genesis DAO's scheme parameters, using the GenesisProtocol voting machine
     * parameters that we just obtained above.
     */
    // await contributionRewardInst.setParameters(orgNativeTokenFee, genesisProtocolParams, genesisProtocolInst.address);
    const contributionRewardParams = await contributionRewardInst.getParametersHash(orgNativeTokenFee, genesisProtocolParams, genesisProtocolInst.address);

    // await schemeRegistrarInst.setParameters(genesisProtocolParams, genesisProtocolParams, genesisProtocolInst.address);
    const schemeRegistrarParams = await schemeRegistrarInst.getParametersHash(genesisProtocolParams, genesisProtocolParams, genesisProtocolInst.address);

    /**
     * Register the schemes with the Genesis DAO
     */
    const schemesArray = [
      schemeRegistrarInst.address,
      contributionRewardInst.address,
      genesisProtocolInst.address];

    const paramsArray = [
      schemeRegistrarParams,
      contributionRewardParams,
      genesisProtocolParams];

    const permissionArray = [
      schemeRegistrarPermissions,
      contributionRewardPermissions,
      genesisProtocolPermissions,
    ];

    const daoCreatorInst = forgedDaoInfo.daoCreatorInst;

    return daoCreatorInst.setSchemes(
      forgedDaoInfo.avatarAddress,
      schemesArray,
      paramsArray,
      permissionArray);
  }
}
