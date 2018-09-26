import { Web3 } from "web3";
import { Utils } from "../utils";
import { UtilsInternal } from "../utilsInternal";
/* tslint:disable-next-line:no-var-requires */
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
    const GenesisProtocol = artifacts.require("GenesisProtocol.sol");
    const GlobalConstraintRegistrar = artifacts.require("GlobalConstraintRegistrar.sol");
    const QuorumVote = artifacts.require("QuorumVote.sol");
    const SchemeRegistrar = artifacts.require("SchemeRegistrar.sol");
    const SimpleICO = artifacts.require("SimpleICO.sol");
    const TokenCapGC = artifacts.require("TokenCapGC.sol");
    const UpgradeScheme = artifacts.require("UpgradeScheme.sol");
    const VestingScheme = artifacts.require("VestingScheme.sol");
    const VoteInOrganizationScheme = artifacts.require("VoteInOrganizationScheme.sol");
    const OrganizationRegister = artifacts.require("OrganizationRegister.sol");
    const Redeemer = artifacts.require("Redeemer.sol");

    const UController = artifacts.require("UController.sol");

    console.log(`Deploying schemes to ${network}`);

    const DAOToken = await Utils.requireContract("DAOToken");
    const gasLimit = await UtilsInternal.computeMaxGasLimit();
    const gasPrice = 10000000000; // 10 Gwei
    let genTokenAddress;

    await DAOToken.at("0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf")
      .then((token: any): void => genTokenAddress = token.address)
      .catch(() => { console.log(`global GEN token does not exist at standard address`); });

    if (!genTokenAddress) {
      if (network === "ganache") {

        await DAOToken.at("0xdcf22b53f327b4f7f3ac42d957834bd962637555")
          .then((token: any): void => genTokenAddress = token.address)
          .catch(() => { console.log(`global GEN token does not exist in ganache`); });

        if (!genTokenAddress) {
          /**
           * Then we will create the token to use for staking.
           * See https://ethereum.stackexchange.com/a/13459/21913
           * This is fragile in that in order to result in a consistent token address
           * the nonce and account address must always be the same when the token is created.
           * Thus we need this to be the first transaction that account[0] attempts after
           * ganache has been fired-up.
           */
          console.log(`Creating global GEN token for ganache`);

          const genToken = await DAOToken.new(
            "DAOstack",
            "GEN",
            web3.toWei(100000000),
            { from: "0xb0c908140fe6fd6fbd4990a5c2e35ca6dc12bfb2" });

          genTokenAddress = genToken.address;
        }
      } else {
        throw new Error(`The GEN token must exist for staking on ${network}`);
      }
    }

    console.log(`Using global GEN token for staking on ${network} at: ${genTokenAddress}`);
    console.log(`Deploying schemes on ${network}, gasLimit: ${gasLimit}`);

    await deployer.deploy(ControllerCreator, { gas: gasLimit, gasPrice: gasPrice * 2 });
    const controllerCreator = await ControllerCreator.deployed();
    await deployer.deploy(DaoCreator, controllerCreator.address, { gas: gasLimit, gasPrice });
    await deployer.deploy(UController, { gas: gasLimit, gasPrice: gasPrice * 2 });
    await deployer.deploy(GenesisProtocol, genTokenAddress, { gas: gasLimit, gasPrice: gasPrice * 2 });
    await deployer.deploy(SchemeRegistrar, { gas: gasLimit, gasPrice });
    await deployer.deploy(UpgradeScheme, { gas: gasLimit, gasPrice });
    await deployer.deploy(GlobalConstraintRegistrar, { gas: gasLimit, gasPrice: gasPrice * 2 });
    await deployer.deploy(ContributionReward, { gas: gasLimit, gasPrice });
    await deployer.deploy(AbsoluteVote, { gas: gasLimit, gasPrice });
    await deployer.deploy(QuorumVote, { gas: gasLimit, gasPrice });
    await deployer.deploy(SimpleICO, { gas: gasLimit, gasPrice });
    await deployer.deploy(TokenCapGC, { gas: gasLimit, gasPrice });
    await deployer.deploy(VestingScheme, { gas: gasLimit, gasPrice });
    await deployer.deploy(VoteInOrganizationScheme, { gas: gasLimit, gasPrice });
    await deployer.deploy(OrganizationRegister, { gas: gasLimit, gasPrice });

    const genesisProtocolInstance = await GenesisProtocol.deployed();
    const contributionRewardInstance = await ContributionReward.deployed();
    await deployer.deploy(Redeemer,
      contributionRewardInstance.address,
      genesisProtocolInstance.address,
      { gas: gasLimit, gasPrice: gasPrice * 2 });
  });
};
