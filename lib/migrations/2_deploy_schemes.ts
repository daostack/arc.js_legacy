import { promisify } from "es6-promisify";
import { Web3 } from "web3";
import { Address } from "../commonTypes";
import { Utils } from "../utils";
/* tslint:disable-next-line:no-var-requires */
const computeMaxGasLimit: any = require("../../gasLimits.js").computeMaxGasLimit;
/* tslint:disable-next-line:no-var-requires */
const env = require("env-variable")();

/* tslint:disable:no-console */
/* tslint:disable:max-line-length */

/**
 * Migration callback
 */
export const arcJsDeployer = (
  web3: Web3,
  artifacts: any,
  deployer: any): void => {

  // so Utils.getWeb3 can find it
  (global as any).web3 = web3;

  const network = env.arcjs_network || "ganache";

  /**
   * Pattern for using async/await found here:
   *  https://github.com/trufflesuite/truffle/issues/501#issuecomment-332589663
   */
  deployer.then(async () => {

    /**
     * Truffle Solidity artifact wrappers
     */
    const AbsoluteVote = artifacts.require("AbsoluteVote.sol");
    const ContributionReward = artifacts.require("ContributionReward.sol");
    const ControllerCreator = artifacts.require("ControllerCreator.sol");
    const DaoCreator = artifacts.require("DaoCreator.sol");
    // ExecutableTest is used only by tests
    const ExecutableTest = artifacts.require("ExecutableTest.sol");
    const GenesisProtocol = artifacts.require("GenesisProtocol.sol");
    const GlobalConstraintRegistrar = artifacts.require("GlobalConstraintRegistrar.sol");
    const SchemeRegistrar = artifacts.require("SchemeRegistrar.sol");
    const SimpleICO = artifacts.require("SimpleICO.sol");
    const TokenCapGC = artifacts.require("TokenCapGC.sol");
    const UpgradeScheme = artifacts.require("UpgradeScheme.sol");
    const VestingScheme = artifacts.require("VestingScheme.sol");
    const VoteInOrganizationScheme = artifacts.require("VoteInOrganizationScheme.sol");
    const UController = artifacts.require("UController.sol");

    console.log(`Deploying schemes to ${network}`);

    const DAOToken = await Utils.requireContract("DAOToken");
    const gasLimit = await computeMaxGasLimit(web3);
    let genTokenAddress;

    await DAOToken.at("0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf")
      .then((token: any): void => genTokenAddress = token.address)
      .catch(() => { console.log(`global GEN token does not exist`); });

    if (!genTokenAddress) {
      if (network === "ganache") {
        // then we will create a new token to use for staking
        const genToken = await DAOToken.new("GEN", "GEN", web3.toWei(100000000));
        genTokenAddress = genToken.address;
        // and mint GEN to all of the accounts
        const getAccounts = promisify(web3.eth.getAccounts);
        const accounts = await getAccounts();
        accounts.forEach((account: Address) => {
          // 1000 is an arbitrary number we've always given to founders for tests
          genToken.mint(account, web3.toWei(1000));
        });
      } else {
        throw new Error(`The GEN token must exist for staking on ${network}`);
      }
    }

    console.log(`Using global GEN token for staking on ${network} at: ${genTokenAddress}`);
    console.log(`Deploying schemes on ${network}, gasLimit: ${gasLimit}`);

    await deployer.deploy(ControllerCreator, { gas: gasLimit });
    const controllerCreator = await ControllerCreator.deployed();
    await deployer.deploy(DaoCreator, controllerCreator.address, { gas: gasLimit });
    await deployer.deploy(UController, { gas: gasLimit });
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
