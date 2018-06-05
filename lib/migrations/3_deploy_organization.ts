import { promisify } from "es6-promisify";
import { Web3 } from "web3";
import { DefaultSchemePermissions, SchemePermissions } from "../commonTypes";
<<<<<<< master:lib/migrations/2_deploy_organization.ts
import { UtilsInternal } from "../utilsInternal";
=======
>>>>>>> split migration scripts:lib/migrations/3_deploy_organization.ts
import { GetDefaultGenesisProtocolParameters } from "../wrappers/genesisProtocol";
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
export const arcJsDeployer = (web3: Web3, artifacts: any, deployer: any): void => {

  // so Utils.getWeb3 can find it
  (global as any).web3 = web3;

  const network = env.arcjs_network || "ganache";

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
   * Truffle Solidity artifact wrappers
   */
  const Avatar = artifacts.require("Avatar.sol");
  const ContributionReward = artifacts.require("ContributionReward.sol");
  const DaoCreator = artifacts.require("DaoCreator.sol");
  const GlobalConstraintRegistrar = artifacts.require("GlobalConstraintRegistrar.sol");
  const SchemeRegistrar = artifacts.require("SchemeRegistrar.sol");
  const UController = artifacts.require("UController.sol");
  const UpgradeScheme = artifacts.require("UpgradeScheme.sol");
  const GenesisProtocol = artifacts.require("GenesisProtocol.sol");
  const ControllerCreator = artifacts.require("ControllerCreator.sol");

  /**
   * Pattern for using async/await found here:
   *  https://github.com/trufflesuite/truffle/issues/501#issuecomment-332589663
   */
  deployer.then(async () => {
    /**
     *  Genesis DAO parameters,  FOR TESTING PURPOSES ONLY
     */
    const orgName = "Genesis Alpha";
    const tokenName = "Genesis Alpha";
    const tokenSymbol = "GDT";
    const orgNativeTokenFee = 0;
    const defaultVotingMachineParams = await GetDefaultGenesisProtocolParameters();
    const schemeRegistrarPermissions = SchemePermissions.toString(DefaultSchemePermissions.SchemeRegistrar);
    const globalConstraintRegistrarPermissions = SchemePermissions.toString(DefaultSchemePermissions.GlobalConstraintRegistrar);
    const upgradeSchemePermissions = SchemePermissions.toString(DefaultSchemePermissions.UpgradeScheme);
    const contributionRewardPermissions = SchemePermissions.toString(DefaultSchemePermissions.ContributionReward);
    const genesisProtocolPermissions = SchemePermissions.toString(DefaultSchemePermissions.GenesisProtocol);

    let gasAmount = (await promisify((callback: any) => web3.eth.getBlock("latest", false, callback))() as any).gasLimit;
    gasAmount -= 50000;

    console.log(`Deploying ${orgName} to ${network}, gasLimit: ${gasAmount}`);

    await deployer.deploy(ControllerCreator, { gas: gasAmount });
    const controllerCreator = await ControllerCreator.deployed();
    await deployer.deploy(DaoCreator, controllerCreator.address, { gas: gasAmount });
    const daoCreatorInst = await DaoCreator.deployed(controllerCreator.address);

    await deployer.deploy(UController, { gas: gasAmount });
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
      { gas: gasAmount });

<<<<<<< master:lib/migrations/2_deploy_organization.ts
    // maximize chances that Avatar.at will succeed
    if (network === "live") {
      await UtilsInternal.sleep(60000);
    }

    const AvatarInst = await Avatar.at(tx.logs[0].args._avatar);
    let genTokenAddress;

    if ((network !== "live") && (network !== "kovan")) {
      genTokenAddress = await AvatarInst.nativeToken();
      console.log(`**** using native token for staking on network ${network} at: ${genTokenAddress}`);
    } else {
      // the global GEN token
      genTokenAddress = "0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf";
      console.log(`**** using global GEN token for staking on network ${network} at: ${genTokenAddress}`);
    }
    /**
     * The voting machine.  GenesisProtocol must be deployed as a scheme if it is
     * to be used by schemes as a voting machine, which is what all of the
     * Genesis schemes do.
     */
    await deployer.deploy(GenesisProtocol, genTokenAddress, { gas: gasAmount });
=======
>>>>>>> split migration scripts:lib/migrations/3_deploy_organization.ts
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

    const AvatarInst = await Avatar.at(txForgeOrg.logs[0].args._avatar);

    console.log(`Setting schemes on ${orgName}...`);

    await daoCreatorInst.setSchemes(
      AvatarInst.address,
      schemesArray,
      paramsArray,
      permissionArray);
  });
};
