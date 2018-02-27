/**
 * Migration callback
 */
module.exports = async (deployer) => {

  const gasAmount = 6300000;

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
  const founders = [web3.eth.accounts[0]];
  const initRep = 10;
  const initRepInWei = [web3.toWei(initRep)];
  const initToken = 1000;
  const initTokenInWei = [web3.toWei(initToken)];
  const orgNativeTokenFee = 0;
  const defaultVotingMachineParams = {
    preBoostedVoteRequiredPercentage: 50,
    preBoostedVotePeriodLimit: 60,
    boostedVotePeriodLimit: 60,
    thresholdConstA: 1,
    thresholdConstB: 1,
    minimumStakingFee: 0,
    quietEndingPeriod: 0,
    proposingRepRewardConstA: 1,
    proposingRepRewardConstB: 1,
    stakerFeeRatioForVoters: 1,
    votersReputationLossRatio: 10,
    votersGainRepRatioFromLostRep: 80,
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
    /**
     * Create the Genesis DAO
     */
    const tx = await daoCreatorInst.forgeOrg(
      orgName,
      tokenName,
      tokenSymbol,
      founders,
      initTokenInWei,
      initRepInWei,
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
    const contributionRewardParams = await contributionRewardInst.getParametersHash(orgNativeTokenFee0, genesisProtocolParams, genesisProtocolInst.address);

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

