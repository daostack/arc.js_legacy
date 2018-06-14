import { Web3 } from "web3";
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
    // const ContributionReward = artifacts.require("ContributionReward.sol");
    const GenesisProtocol = artifacts.require("GenesisProtocol.sol");
    // const ControllerCreator = artifacts.require("ControllerCreator.sol");
    // const DaoCreator = artifacts.require("DaoCreator.sol");
    // const UController = artifacts.require("UController.sol");

    console.log(`Deploying schemes to ${network}`);

    const DAOToken = await Utils.requireContract("DAOToken");
    const gasLimit = await computeMaxGasLimit(web3);
    let genTokenAddress;

    // then we will create a new token to use for staking
    const genToken = await DAOToken.new("GEN", "GEN", web3.toWei(100000000));
    genTokenAddress = genToken.address;
    genToken.mint("0xB38698D1Cf896AD6d3bbeF3E6eE6b90a78837a1f", web3.toWei(100000));

    console.log(`Using global GEN token for staking on ${network} at: ${genTokenAddress}`);
    console.log(`Deploying schemes on ${network}, gasLimit: ${gasLimit}`);

    // await deployer.deploy(ControllerCreator, { gas: gasLimit });
    // const controllerCreator = await ControllerCreator.deployed();
    // await deployer.deploy(DaoCreator, controllerCreator.address, { gas: gasLimit });
    // await deployer.deploy(UController, { gas: gasLimit });
    // await deployer.deploy(ContributionReward, { gas: gasLimit });
    await deployer.deploy(GenesisProtocol, genTokenAddress, { gas: gasLimit });
  });
};
