import { Web3 } from "web3";
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
  const AbsoluteVote = artifacts.require("AbsoluteVote.sol");
  const ContributionReward = artifacts.require("ContributionReward.sol");
  // ExecutableTest is used only by tests
  const ExecutableTest = artifacts.require("ExecutableTest.sol");
  const GlobalConstraintRegistrar = artifacts.require("GlobalConstraintRegistrar.sol");
  const SchemeRegistrar = artifacts.require("SchemeRegistrar.sol");
  const SimpleICO = artifacts.require("SimpleICO.sol");
  const TokenCapGC = artifacts.require("TokenCapGC.sol");
  const UpgradeScheme = artifacts.require("UpgradeScheme.sol");
  const VestingScheme = artifacts.require("VestingScheme.sol");
  const VoteInOrganizationScheme = artifacts.require("VoteInOrganizationScheme.sol");
  const GenesisProtocol = artifacts.require("GenesisProtocol.sol");

  /**
   * Pattern for using async/await found here:
   *  https://github.com/trufflesuite/truffle/issues/501#issuecomment-332589663
   */
  deployer.then(async () => {

    console.log(`Deploying schemes to ${network}, gasLimit: ${gasLimit}`);

    let genTokenAddress;

    if ((network !== "live") && (network !== "kovan")) {
      genTokenAddress = migrationState.nativeTokenAddress;
      console.log(`Using Genesis native token from ${migrationState.orgName} for staking on network ${network} at: ${genTokenAddress}`);
    } else {
      // the global GEN token
      genTokenAddress = "0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf";
      console.log(`Using global GEN token for staking on network ${network} at: ${genTokenAddress}`);
    }
    await deployer.deploy(GenesisProtocol, genTokenAddress, { gas: gasLimit });
    await deployer.deploy(SchemeRegistrar, { gas: gasLimit });
    await deployer.deploy(UpgradeScheme, { gas: gasLimit });
    await deployer.deploy(GlobalConstraintRegistrar, { gas: gasLimit });
    await deployer.deploy(ContributionReward, { gas: gasLimit });
    await deployer.deploy(AbsoluteVote, { gas: gasLimit });
    await deployer.deploy(SimpleICO, { gas: gasLimit });
    await deployer.deploy(TokenCapGC, { gas: gasLimit });
    await deployer.deploy(VestingScheme, { gas: gasLimit });
    await deployer.deploy(VoteInOrganizationScheme, { gas: gasLimit });
    if (network !== "live") {
      await deployer.deploy(ExecutableTest, { gas: gasLimit });
    }
  });
};
