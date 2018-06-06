import { Web3 } from "web3";
import { DefaultSchemePermissions, SchemePermissions } from "../commonTypes";
<<<<<<< master:lib/migrations/2_deploy_organization.ts
import { UtilsInternal } from "../utilsInternal";
=======
>>>>>>> split migration scripts:lib/migrations/3_deploy_organization.ts
import { GetDefaultGenesisProtocolParameters } from "../wrappers/genesisProtocol";
import { MigrationState } from "./migrationTypes";

/* tslint:disable:no-console */
/* tslint:disable:max-line-length */

/**
 * Migration callback
 */
export const arcJsDeployer = (
  web3: Web3,
  artifacts: any,
  deployer: any,
  migrationState: MigrationState): void => {

  // so Utils.getWeb3 can find it
  (global as any).web3 = web3;

  const network = migrationState.network;
  const gasLimit = migrationState.gasLimit;

  /**
   * Truffle Solidity artifact wrappers
   */
  const ContributionReward = artifacts.require("ContributionReward.sol");
  const GlobalConstraintRegistrar = artifacts.require("GlobalConstraintRegistrar.sol");
  const SchemeRegistrar = artifacts.require("SchemeRegistrar.sol");
  const UpgradeScheme = artifacts.require("UpgradeScheme.sol");
  const GenesisProtocol = artifacts.require("GenesisProtocol.sol");
  const DaoCreator = artifacts.require("DaoCreator.sol");

  /**
   * Pattern for using async/await found here:
   *  https://github.com/trufflesuite/truffle/issues/501#issuecomment-332589663
   */
  deployer.then(async () => {
    /**
     *  Genesis DAO parameters,  FOR TESTING PURPOSES ONLY
     */
    const orgNativeTokenFee = 0;
    const defaultVotingMachineParams = await GetDefaultGenesisProtocolParameters();
    const schemeRegistrarPermissions = SchemePermissions.toString(DefaultSchemePermissions.SchemeRegistrar);
    const globalConstraintRegistrarPermissions = SchemePermissions.toString(DefaultSchemePermissions.GlobalConstraintRegistrar);
    const upgradeSchemePermissions = SchemePermissions.toString(DefaultSchemePermissions.UpgradeScheme);
    const contributionRewardPermissions = SchemePermissions.toString(DefaultSchemePermissions.ContributionReward);
    const genesisProtocolPermissions = SchemePermissions.toString(DefaultSchemePermissions.GenesisProtocol);

    console.log(`Setting schemes for ${migrationState.orgName} to ${network}, gasLimit: ${gasLimit}`);

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

    const daoCreatorInst = await DaoCreator.at(migrationState.daoCreatorAddress);

    await daoCreatorInst.setSchemes(
      migrationState.avatarAddress,
      schemesArray,
      paramsArray,
      permissionArray);
  });
};
