import { promisify } from "es6-promisify";
import { Web3 } from "web3";
/* tslint:disable:no-var-requires */
const env = require("env-variable")();

/* tslint:disable:no-console */

/**
 * Migration callback
 */
export const arcJsDeployer = (web3: Web3, artifacts: any, deployer: any): void => {

  // so Utils.getWeb3 can find it
  (global as any).web3 = web3;

  const network = env.arcjs_network || "ganache";

  /**
   * Truffle Solidity artifact wrappers
   */
  const AbsoluteVote = artifacts.require("AbsoluteVote.sol");
  const ContributionReward = artifacts.require("ContributionReward.sol");
  const DAOToken = artifacts.require("DAOToken.sol");
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
    let gasAmount =
      (await promisify((callback: any) => web3.eth.getBlock("latest", false, callback))() as any).gasLimit;
    gasAmount -= 50000;

    console.log(`Deploying schemes to ${network}, gasLimit: ${gasAmount}`);

    let genTokenAddress;

    if ((network !== "live") && (network !== "kovan")) {
      genTokenAddress = (await DAOToken.new("GENISIS", "GEN", 0)).address;
      console.log(`Using new GEN token for staking on network ${network} at: ${genTokenAddress}`);
    } else {
      // the global GEN token
      genTokenAddress = "0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf";
      console.log(`Using global GEN token for staking on network ${network} at: ${genTokenAddress}`);
    }
    await deployer.deploy(GenesisProtocol, genTokenAddress, { gas: gasAmount });
    await deployer.deploy(SchemeRegistrar, { gas: gasAmount });
    await deployer.deploy(UpgradeScheme, { gas: gasAmount });
    await deployer.deploy(GlobalConstraintRegistrar, { gas: gasAmount });
    await deployer.deploy(ContributionReward, { gas: gasAmount });
    await deployer.deploy(AbsoluteVote, { gas: gasAmount });
    await deployer.deploy(SimpleICO, { gas: gasAmount });
    await deployer.deploy(TokenCapGC, { gas: gasAmount });
    await deployer.deploy(VestingScheme, { gas: gasAmount });
    await deployer.deploy(VoteInOrganizationScheme, { gas: gasAmount });
    if (network !== "live") {
      await deployer.deploy(ExecutableTest, { gas: gasAmount });
    }
  });
};
