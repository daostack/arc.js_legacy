import { DefaultSchemePermissions, SchemePermissions } from "../commonTypes";
import { ConfigService } from "../configService";
import { GetDefaultGenesisProtocolParameters } from "../wrappers/genesisProtocol";
const computeGasLimit = require("../../gasLimits.js").computeGasLimit;

/**
 * Migration callback
 */
export const arcJsDeployer = (web3, artifacts, deployer) => {

  const network = ConfigService.get("network") || "ganache";

  const internalFoundersConfigLocation = "../../migrations/founders.json";
  const foundersConfig = require(internalFoundersConfigLocation).founders;

  const customFoundersConfigLocation = ConfigService.get("foundersConfigurationLocation");

  if (internalFoundersConfigLocation !== customFoundersConfigLocation) {
    console.log(`merging custom founders from ${customFoundersConfigLocation}`);
    const customFoundersConfig = require(customFoundersConfigLocation).founders;
    // merge the two
    Object.assign(foundersConfig, customFoundersConfig)
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
  const AbsoluteVote = artifacts.require("AbsoluteVote.sol");
  const Avatar = artifacts.require("Avatar.sol");
  const ContributionReward = artifacts.require("ContributionReward.sol");
  const DaoCreator = artifacts.require("DaoCreator.sol");
  // ExecutableTest is used only by tests
  const ExecutableTest = artifacts.require("ExecutableTest.sol");
  const GlobalConstraintRegistrar = artifacts.require("GlobalConstraintRegistrar.sol");
  const SchemeRegistrar = artifacts.require("SchemeRegistrar.sol");
  const SimpleICO = artifacts.require("SimpleICO.sol");
  const TokenCapGC = artifacts.require("TokenCapGC.sol");
  const UController = artifacts.require("UController.sol");
  const UpgradeScheme = artifacts.require("UpgradeScheme.sol");
  const VestingScheme = artifacts.require("VestingScheme.sol");
  const VoteInOrganizationScheme = artifacts.require("VoteInOrganizationScheme.sol");
  const GenesisProtocol = artifacts.require("GenesisProtocol.sol");
  const ControllerCreator = artifacts.require("ControllerCreator.sol");
  /**
   *  Genesis DAO parameters,  FOR TESTING PURPOSES ONLY
   */
  const orgName = "Genesis";
  const tokenName = "Gen";
  const tokenSymbol = "GEN";
  const orgNativeTokenFee = 0;
  const defaultVotingMachineParams = GetDefaultGenesisProtocolParameters();
  const schemeRegistrarPermissions = SchemePermissions.toString(DefaultSchemePermissions.SchemeRegistrar);
  const globalConstraintRegistrarPermissions = SchemePermissions.toString(DefaultSchemePermissions.GlobalConstraintRegistrar);
  const upgradeSchemePermissions = SchemePermissions.toString(DefaultSchemePermissions.UpgradeScheme);
  const contributionRewardPermissions = SchemePermissions.toString(DefaultSchemePermissions.ContributionReward);
  const genesisProtocolPermissions = SchemePermissions.toString(DefaultSchemePermissions.GenesisProtocol);

  /**
   * Apparently we must wrap the first deploy call in a `then` to avoid
   * what seems to be race conditions during deployment.
   */
  deployer.deploy(ControllerCreator).then(async () => {
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
      founders.map((f) => f.address),
      founders.map((f) => web3.toWei(f.tokens)),
      founders.map((f) => web3.toWei(f.reputation)),
      universalControllerInst.address,
      web3.toWei(100000000), // token cap of one hundred million GEN, in Wei
      { gas: gasAmount });

    const AvatarInst = await Avatar.at(tx.logs[0].args._avatar);
    const nativeTokenAddress = await AvatarInst.nativeToken();
    /**
     * The voting machine.  GenesisProtocol must be deployed as a scheme if it is
     * to be used by schemes as a voting machine, which is what all of the
     * Genesis schemes do.
     */
    await deployer.deploy(GenesisProtocol, nativeTokenAddress);
    const genesisProtocolInst = await GenesisProtocol.deployed();
    /**
     * The rest of the Genesis DAO's schemes
     */
    await deployer.deploy(SchemeRegistrar);
    const schemeRegistrarInst = await SchemeRegistrar.deployed();

    await deployer.deploy(UpgradeScheme);
    const upgradeSchemeInst = await UpgradeScheme.deployed();

    await deployer.deploy(GlobalConstraintRegistrar);
    const globalConstraintRegistrarInst = await GlobalConstraintRegistrar.deployed();

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

    await daoCreatorInst.setSchemes(
      AvatarInst.address,
      schemesArray,
      paramsArray,
      permissionArray);

    /**
     * Deploy the other universal schemes, voting machines and global constraints
     */
    await deployer.deploy(AbsoluteVote);
    await deployer.deploy(SimpleICO);
    await deployer.deploy(TokenCapGC);
    await deployer.deploy(VestingScheme);
    await deployer.deploy(VoteInOrganizationScheme);
    await deployer.deploy(ExecutableTest);
  });
};
