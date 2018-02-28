// Imports:
const Avatar = artifacts.require("Avatar.sol");
const Controller = artifacts.require("Controller.sol");
const UController = artifacts.require("UController.sol");

const GlobalConstraintRegistrar = artifacts.require("GlobalConstraintRegistrar.sol");
const TokenCapGC = artifacts.require("TokenCapGC.sol");

const DaoCreator = artifacts.require("DaoCreator.sol");
const SchemeRegistrar = artifacts.require("SchemeRegistrar.sol");
const ContributionReward = artifacts.require("ContributionReward.sol");
const UpgradeScheme = artifacts.require("UpgradeScheme.sol");
const VestingScheme = artifacts.require("VestingScheme.sol");
const VoteInOrganizationScheme = artifacts.require("VoteInOrganizationScheme.sol");
const SimpleICO = artifacts.require("SimpleICO.sol");

const AbsoluteVote = artifacts.require("AbsoluteVote.sol");
const GenesisProtocol = artifacts.require("GenesisProtocol.sol");
const ExecutableTest = artifacts.require("ExecutableTest.sol");

// Instances:
let schemeRegistrarInst;
let globalConstraintRegistrarInst;
let upgradeSchemeInst;
let ControllerInst;
let AvatarInst;
let genesisProtocolInst;
let contributionRewardInst;

// DAOstack ORG parameters:
const orgName = "Genesis";
const tokenName = "Gen";
const tokenSymbol = "GEN";
const founders = [web3.eth.accounts[0]];
const initRep = 10;
const initRepInWei = [web3.toWei(initRep)];
const initToken = 1000;
const initTokenInWei = [web3.toWei(initToken)];
let controllerAddress;
let nativeTokenAddress;

// DAOstack parameters for universal schemes:
let genesisProtocolParams;
let schemeRegisterParams;
let schemeGCRegisterParams;
let schemeUpgradeParams;
let contributionRewardParams;
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

module.exports = async (deployer) => {
  // Deploy DaoCreator:
  // apparently we must wrap the first deploy call in a then to avoid
  // what seem to be race conditions during deployment
  deployer.deploy(DaoCreator, { gas: 6300000 }).then(async () => {
    daoCreatorInst = await DaoCreator.deployed();
    // Create Genesis (DAOstack):
    returnedParams = await daoCreatorInst.forgeOrg(orgName, tokenName, tokenSymbol, founders,
      initTokenInWei, initRepInWei, 0);
    AvatarInst = await Avatar.at(returnedParams.logs[0].args._avatar);
    controllerAddress = await AvatarInst.owner();
    ControllerInst = await Controller.at(controllerAddress);
    nativeTokenAddress = await ControllerInst.nativeToken();

    await deployer.deploy(GenesisProtocol, nativeTokenAddress);
    genesisProtocolInst = await GenesisProtocol.deployed();

    // Deploy SchemeRegistrar:
    await deployer.deploy(SchemeRegistrar);
    schemeRegistrarInst = await SchemeRegistrar.deployed();
    // Deploy UniversalUpgrade:
    await deployer.deploy(UpgradeScheme);
    upgradeSchemeInst = await UpgradeScheme.deployed();
    // Deploy UniversalGCScheme register:
    await deployer.deploy(GlobalConstraintRegistrar);
    globalConstraintRegistrarInst = await GlobalConstraintRegistrar.deployed();

    await deployer.deploy(ContributionReward);
    contributionRewardInst = await ContributionReward.deployed();

    genesisProtocolParams = await genesisProtocolInst.getParametersHash(
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

    await schemeRegistrarInst.setParameters(genesisProtocolParams, genesisProtocolParams, genesisProtocolInst.address);
    schemeRegisterParams = await schemeRegistrarInst.getParametersHash(genesisProtocolParams, genesisProtocolParams, genesisProtocolInst.address);

    await globalConstraintRegistrarInst.setParameters(genesisProtocolParams, genesisProtocolInst.address);
    schemeGCRegisterParams = await globalConstraintRegistrarInst.getParametersHash(genesisProtocolParams, genesisProtocolInst.address);

    await upgradeSchemeInst.setParameters(genesisProtocolParams, genesisProtocolInst.address);
    schemeUpgradeParams = await upgradeSchemeInst.getParametersHash(genesisProtocolParams, genesisProtocolInst.address);

    await contributionRewardInst.setParameters(0, genesisProtocolParams, genesisProtocolInst.address);
    contributionRewardParams = await contributionRewardInst.getParametersHash(0, genesisProtocolParams, genesisProtocolInst.address);

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

    const permissionArray = ["0x00000003", "0x00000005", "0x00000009", "0x00000001", "0x00000001"];

    // set DAOstack initial schmes:
    await daoCreatorInst.setSchemes(
      AvatarInst.address,
      schemesArray,
      paramsArray,
      permissionArray);

    await deployer.deploy(AbsoluteVote);
    await deployer.deploy(SimpleICO);
    await deployer.deploy(TokenCapGC);
    await deployer.deploy(UController, { gas: 6300000 });
    await deployer.deploy(VestingScheme);
    await deployer.deploy(VoteInOrganizationScheme);
    await deployer.deploy(ExecutableTest);
  });
};

