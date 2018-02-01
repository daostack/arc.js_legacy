// Imports:
const Avatar = artifacts.require("Avatar.sol");
const Controller = artifacts.require("Controller.sol");
const UController = artifacts.require("UController.sol");

const GlobalConstraintRegistrar = artifacts.require("GlobalConstraintRegistrar.sol");
const TokenCapGC = artifacts.require("TokenCapGC.sol");

const GenesisScheme = artifacts.require("GenesisScheme.sol");
const SchemeRegistrar = artifacts.require("SchemeRegistrar.sol");
const ContributionReward = artifacts.require("ContributionReward.sol");
const UpgradeScheme = artifacts.require("UpgradeScheme.sol");
const VestingScheme = artifacts.require("VestingScheme.sol");
const VoteInOrganizationScheme = artifacts.require("VoteInOrganizationScheme.sol");
const SimpleICO = artifacts.require("SimpleICO.sol");

const AbsoluteVote = artifacts.require("AbsoluteVote.sol");

// Instances:
let AbsoluteVoteInst;
let schemeRegistrarInst;
let globalConstraintRegistrarInst;
let upgradeSchemeInst;
let ControllerInst;
let AvatarInst;

// DAOstack ORG parameters:
const orgName = "Genesis";
const tokenName = "Genes";
const tokenSymbol = "GEN";
const founders = [web3.eth.accounts[0]];
const initRep = 10;
const initRepInWei = [web3.toWei(initRep)];
const initToken = 1000;
const initTokenInWei = [web3.toWei(initToken)];
let reputationAddress;
let controllerAddress;

// DAOstack parameters for universal schemes:
let voteParametersHash;
const votePerc = 50;
let schemeRegisterParams;
let schemeGCRegisterParams;
let schemeUpgradeParams;

module.exports = async function (deployer) {
  // Deploy GenesisScheme:
  // apparently we must wrap the first deploy call in a then to avoid
  // what seem to be race conditions during deployment
  // await deployer.deploy(GenesisScheme)
  deployer.deploy(GenesisScheme, { gas: 6015000 }).then(async () => {
    genesisSchemeInst = await GenesisScheme.deployed();
    // Create Genesis (DAOstack):
    returnedParams = await genesisSchemeInst.forgeOrg(orgName, tokenName, tokenSymbol, founders,
      initTokenInWei, initRepInWei, 0);
    AvatarInst = await Avatar.at(returnedParams.logs[0].args._avatar);
    controllerAddress = await AvatarInst.owner();
    ControllerInst = await Controller.at(controllerAddress);
    reputationAddress = await ControllerInst.nativeReputation();
    await deployer.deploy(AbsoluteVote);
    // Deploy AbsoluteVote:
    AbsoluteVoteInst = await AbsoluteVote.deployed();
    // Deploy SchemeRegistrar:
    await deployer.deploy(SchemeRegistrar);
    schemeRegistrarInst = await SchemeRegistrar.deployed();
    // Deploy UniversalUpgrade:
    await deployer.deploy(UpgradeScheme);
    upgradeSchemeInst = await UpgradeScheme.deployed();
    // Deploy UniversalGCScheme register:
    await deployer.deploy(GlobalConstraintRegistrar);
    globalConstraintRegistrarInst = await GlobalConstraintRegistrar.deployed();

    // Voting parameters and schemes params:
    voteParametersHash = await AbsoluteVoteInst.getParametersHash(reputationAddress, votePerc, true);

    await schemeRegistrarInst.setParameters(voteParametersHash, voteParametersHash, AbsoluteVoteInst.address);
    schemeRegisterParams = await schemeRegistrarInst.getParametersHash(voteParametersHash, voteParametersHash, AbsoluteVoteInst.address);

    await globalConstraintRegistrarInst.setParameters(reputationAddress, votePerc);
    schemeGCRegisterParams = await globalConstraintRegistrarInst.getParametersHash(reputationAddress, votePerc);

    await upgradeSchemeInst.setParameters(voteParametersHash, AbsoluteVoteInst.address);
    schemeUpgradeParams = await upgradeSchemeInst.getParametersHash(voteParametersHash, AbsoluteVoteInst.address);

    const schemesArray = [schemeRegistrarInst.address, globalConstraintRegistrarInst.address, upgradeSchemeInst.address];
    const paramsArray = [schemeRegisterParams, schemeGCRegisterParams, schemeUpgradeParams];
    const permissionArray = ["0x00000003", "0x00000005", "0x00000009"];

    // set DAOstack initial schmes:
    await genesisSchemeInst.setSchemes(
      AvatarInst.address,
      schemesArray,
      paramsArray,
      permissionArray);

    await deployer.deploy(SimpleICO);
    await deployer.deploy(ContributionReward);
    await deployer.deploy(TokenCapGC);
    await deployer.deploy(UController);
    await deployer.deploy(VestingScheme);
    await deployer.deploy(VoteInOrganizationScheme);
  });
};

