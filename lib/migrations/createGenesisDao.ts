import { Web3 } from "web3";
import { DefaultSchemePermissions, SchemePermissions } from "../commonTypes";
import { Address } from "../commonTypes";
import { Utils } from "../utils";
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
    const orgName = live ? "Genesis" : "Genesis Alpha";
    const tokenName = live ? "Genesis" : "Genesis Alpha";
    const tokenSymbol = "GDT";

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

    /**
     * save info for later steps
     */
    if (live) {
      Utils.sleep(10000); // maximize chances this is ready
    }

    const avatarInst = await Avatar.at(txForgeOrg.logs[0].args._avatar);

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
    const ContributionReward = await Utils.requireContract("ContributionReward");
    const GlobalConstraintRegistrar = await Utils.requireContract("GlobalConstraintRegistrar");
    const SchemeRegistrar = await Utils.requireContract("SchemeRegistrar");
    const UpgradeScheme = await Utils.requireContract("UpgradeScheme");
    const GenesisProtocol = await Utils.requireContract("GenesisProtocol");

    /**
     *  Genesis DAO parameters
     */
    const orgNativeTokenFee = 0;
    const defaultVotingMachineParams = await GetDefaultGenesisProtocolParameters();
    const schemeRegistrarPermissions = SchemePermissions.toString(DefaultSchemePermissions.SchemeRegistrar);
    const globalConstraintRegistrarPermissions = SchemePermissions.toString(DefaultSchemePermissions.GlobalConstraintRegistrar);
    const upgradeSchemePermissions = SchemePermissions.toString(DefaultSchemePermissions.UpgradeScheme);
    const contributionRewardPermissions = SchemePermissions.toString(DefaultSchemePermissions.ContributionReward);
    const genesisProtocolPermissions = SchemePermissions.toString(DefaultSchemePermissions.GenesisProtocol);

    console.log(`Setting schemes for ${forgedDaoInfo.orgName} on ${this.network}...`);

    const genesisProtocolInst = await GenesisProtocol.deployed();
    const schemeRegistrarInst = await SchemeRegistrar.deployed();
    const upgradeSchemeInst = await UpgradeScheme.deployed();
    const globalConstraintRegistrarInst = await GlobalConstraintRegistrar.deployed();
    const contributionRewardInst = await ContributionReward.deployed();
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

    /**
     * Set/get the Genesis DAO's scheme parameters, using the GenesisProtocol voting machine
     * parameters that we just obtained above.
     */
    await schemeRegistrarInst.setParameters(genesisProtocolParams, genesisProtocolParams, genesisProtocolInst.address);
    const schemeRegisterParams = await schemeRegistrarInst.getParametersHash(genesisProtocolParams, genesisProtocolParams, genesisProtocolInst.address);

    await globalConstraintRegistrarInst.setParameters(genesisProtocolParams, genesisProtocolInst.address);
    const schemeGCRegisterParams = await globalConstraintRegistrarInst.getParametersHash(genesisProtocolParams, genesisProtocolInst.address);

    await upgradeSchemeInst.setParameters(genesisProtocolParams, genesisProtocolInst.address);
    const schemeUpgradeParams = await upgradeSchemeInst.getParametersHash(genesisProtocolParams, genesisProtocolInst.address);

    await contributionRewardInst.setParameters(orgNativeTokenFee, genesisProtocolParams, genesisProtocolInst.address);
    const contributionRewardParams = await contributionRewardInst.getParametersHash(orgNativeTokenFee, genesisProtocolParams, genesisProtocolInst.address);

    /**
     * Register the schemes with the Genesis DAO
     */
    const schemesArray = [
      schemeRegistrarInst.address,
      globalConstraintRegistrarInst.address,
      upgradeSchemeInst.address,
      contributionRewardInst.address,
      genesisProtocolInst.address];

    const paramsArray = [
      schemeRegisterParams,
      schemeGCRegisterParams,
      schemeUpgradeParams,
      contributionRewardParams,
      genesisProtocolParams];

    const permissionArray = [
      schemeRegistrarPermissions,
      globalConstraintRegistrarPermissions,
      upgradeSchemePermissions,
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
