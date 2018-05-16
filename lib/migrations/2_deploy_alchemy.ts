import { Web3 } from "web3";
import { computeGasLimit } from "../../gasLimits.js";
import { DefaultSchemePermissions, SchemePermissions } from "../commonTypes";
import { ConfigService } from "../configService";
import { GetDefaultGenesisProtocolParameters } from "../wrappers/genesisProtocol";

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
export const arcJsDeployer = (web3: Web3, artifacts: any, deployer: any): void => {

  const network = ConfigService.get("network") || "ganache";

  const internalFoundersConfigLocation = "../../migrations/founders.json";
  const foundersConfig = require(internalFoundersConfigLocation).founders;

  const customFoundersConfigLocation = ConfigService.get("foundersConfigurationLocation");

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

  const gasAmount = computeGasLimit(founders.length);

  console.log(`Deploying to ${network}, gasLimit: ${gasAmount},  ${founders.length} founders`);
  /**
   * Truffle Solidity artifact wrappers
   */
  const Avatar = artifacts.require("Avatar.sol");
  const ContributionReward = artifacts.require("ContributionReward.sol");
  const DaoCreator = artifacts.require("DaoCreator.sol");
  // ExecutableTest is used only by tests
  const UController = artifacts.require("UController.sol");
  const GenesisProtocol = artifacts.require("GenesisProtocol.sol");
  const ControllerCreator = artifacts.require("ControllerCreator.sol");

  /**
   * Apparently we must wrap the first deploy call in a `then` to avoid
   * what seems to be race conditions during deployment.
   */
  deployer.deploy(ControllerCreator).then(async () => {
    /**
     *  Genesis DAO parameters,  FOR TESTING PURPOSES ONLY
     */
    const orgName = "Genesis Alpha";
    const tokenName = "Genesis Alpha";
    const tokenSymbol = "GDT";
    const orgNativeTokenFee = 0;
    const defaultVotingMachineParams = await GetDefaultGenesisProtocolParameters();
    const contributionRewardPermissions = SchemePermissions.toString(DefaultSchemePermissions.ContributionReward);
    const genesisProtocolPermissions = SchemePermissions.toString(DefaultSchemePermissions.GenesisProtocol);

    const controllerCreator = await ControllerCreator.deployed();
    await deployer.deploy(DaoCreator, controllerCreator.address);
    const daoCreatorInst = await DaoCreator.deployed(controllerCreator.address);

    await deployer.deploy(UController, { gas: gasAmount });
    const universalControllerInst = await UController.deployed();
    /**
     * Create the Genesis DAO
     */
    const tx = await daoCreatorInst.forgeOrg(
      orgName,
      tokenName,
      tokenSymbol,
      founders.map((f: FounderSpec) => f.address),
      founders.map((f: FounderSpec) => web3.toWei(f.tokens)),
      founders.map((f: FounderSpec) => web3.toWei(f.reputation)),
      universalControllerInst.address,
      web3.toWei(100000000), // token cap of one hundred million GEN, in Wei
      { gas: gasAmount });

    const AvatarInst = await Avatar.at(tx.logs[0].args._avatar);
    let genTokenAddress;

    if (network !== "live") {
      genTokenAddress = await AvatarInst.nativeToken();
      console.log(`using native token for staking on network != "live" at: ${genTokenAddress}`);
    } else {
      // the "real" live ETH GEN token
      genTokenAddress = "0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf";
      console.log(`!! using global GEN token staking on network == "live" at: ${genTokenAddress}`);
    }
    /**
     * The voting machine.  GenesisProtocol must be deployed as a scheme if it is
     * to be used by schemes as a voting machine, which is what all of the
     * Genesis schemes do.
     */
    await deployer.deploy(GenesisProtocol, genTokenAddress);
    const genesisProtocolInst = await GenesisProtocol.deployed();
    /**
     * The rest of the Genesis DAO's schemes
     */
    await deployer.deploy(ContributionReward);
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
      ]
    );
    /**
     * Set/get the Genesis DAO's scheme parameters, using the GenesisProtocol voting machine
     * parameters that we just obtained above.
     */

    await contributionRewardInst.setParameters(orgNativeTokenFee, genesisProtocolParams, genesisProtocolInst.address);
    const contributionRewardParams = await contributionRewardInst.getParametersHash(orgNativeTokenFee, genesisProtocolParams, genesisProtocolInst.address);

    /**
     * Register the schemes with the Genesis DAO
     */
    const schemesArray = [
      contributionRewardInst.address,
      genesisProtocolInst.address];

    const paramsArray = [
      contributionRewardParams,
      genesisProtocolParams];

    const permissionArray = [
      contributionRewardPermissions,
      genesisProtocolPermissions,
    ];

    await daoCreatorInst.setSchemes(
      AvatarInst.address,
      schemesArray,
      paramsArray,
      permissionArray);

  });
};
