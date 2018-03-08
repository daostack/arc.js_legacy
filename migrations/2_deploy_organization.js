const founders = require("./founders.kovan.json").founders;
const Config = require("../dist/config").Config;
/**
 * Migration callback
 */
module.exports = async (deployer) => {

  const gasAmount = Config.get("gasLimit_deployment");
  /**
   * Truffle Solidity artifact wrappers
   */
  const AbsoluteVote = artifacts.require("AbsoluteVote.sol");
  const Avatar = artifacts.require("Avatar.sol");
  const ContributionReward = artifacts.require("ContributionReward.sol");
  const Controller = artifacts.require("Controller.sol");
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
  /**
   *  Genesis DAO parameters
   */
  const orgName = "Genesis";
  const tokenName = "Gen";
  const tokenSymbol = "GEN";
  const orgNativeTokenFee = 0;
  const defaultVotingMachineParams = {
    preBoostedVoteRequiredPercentage: 50,
    preBoostedVotePeriodLimit: 5184000, // 2 months
    boostedVotePeriodLimit: 604800, // 1 week
    thresholdConstA: 1, // TODO: how many proposals can be boosted at a time. want about 5, have to read arc to figure out
    thresholdConstB: 1, // TODO: exponent of how hard to get the next one
    minimumStakingFee: 0,
    quietEndingPeriod: 7200, // Two hours
    proposingRepRewardConstA: 5, // baseline rep rewarded TODO: good for now but Adam going to look up what this should be
    proposingRepRewardConstB: 5, // how much to weight strength of yes votes vs no votes in reward TODO: good for now but Adam going to look up what this should be
    stakerFeeRatioForVoters: 1, // 1 percent of staker fee given to voters
    votersReputationLossRatio: 1, // 1 percent of rep lost by voting
    votersGainRepRatioFromLostRep: 80, // percentage of how much rep correct voters get from incorrect voters who lost rep
    governanceFormulasInterface: "0x0000000000000000000000000000000000000000"
  };
  const schemeRegistrarPermissions = "0x00000003";
  const globalConstraintRegistrarPermissions = "0x00000005";
  const upgradeSchemePermissions = "0x00000009";
  const contributionRewardPermissions = "0x00000001";
  const genesisProtocolPermissions = "0x00000001";
  /**
   * Apparently we must wrap the first deploy call in a `then` to avoid
   * what seems to be race conditions during deployment.
   */
  deployer.deploy(DaoCreator, { gas: gasAmount }).then(async () => {

    const daoCreatorInst = await DaoCreator.deployed();

    console.log({
      "orgName": orgName,
      "tokenName": tokenName,
      "tokenSymbol": tokenSymbol,
      "addresses": founders.map((f) => f.address),
      "tokens": founders.map((f) => web3.toWei(f.tokens)),
      "reputation": founders.map((f) => web3.toWei(f.reputation)),
      "UController": 0
    });

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
      // use the universal controller
      0);

    const AvatarInst = await Avatar.at(tx.logs[0].args._avatar);
    const controllerAddress = await AvatarInst.owner();
    const ControllerInst = await Controller.at(controllerAddress);
    const nativeTokenAddress = await ControllerInst.nativeToken();
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
        defaultVotingMachineParams.votersGainRepRatioFromLostRep
      ],
      defaultVotingMachineParams.governanceFormulasInterface
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
        defaultVotingMachineParams.votersGainRepRatioFromLostRep
      ],
      defaultVotingMachineParams.governanceFormulasInterface
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
      genesisProtocolPermissions
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
    await deployer.deploy(UController, { gas: gasAmount });
    await deployer.deploy(VestingScheme);
    await deployer.deploy(VoteInOrganizationScheme);
    await deployer.deploy(ExecutableTest);
  });
};

