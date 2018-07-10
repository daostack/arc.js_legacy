import { BigNumber } from "bignumber.js";
import { assert } from "chai";
import { BinaryVoteResult, Hash } from "../lib/commonTypes";
import { DAO } from "../lib/dao";
import { LoggingService } from "../lib/loggingService";
import { TransactionReceiptTruffle, TransactionService } from "../lib/transactionService";
import { Utils, Web3 } from "../lib/utils";
import { ContributionRewardFactory, ContributionRewardWrapper } from "../lib/wrappers/contributionReward";
import { GenesisProtocolWrapper } from "../lib/wrappers/genesisProtocol";
import { WrapperService } from "../lib/wrapperService";
import * as helpers from "./helpers";

describe("estimate gas", () => {

  let dao: DAO;
  let proposalId: Hash;
  let scheme: ContributionRewardWrapper;
  let network;
  let web3: Web3;
  let stakingAmount: BigNumber | string;
  let votingMachine: GenesisProtocolWrapper;

  const setup = async (): Promise<void> => {
    if (!network) {
      network = await Utils.getNetworkName();
      LoggingService.info(`running against network: ${network}`);
    }

    web3 = await Utils.getWeb3();
    stakingAmount = web3.toWei("10");

    if (!dao) {
      if (network !== "Ganache") {
        // keep our costs down by reusing a DAO that we know exists
        // This is the "Native Staking Token" DAO.
        // It uses the DAO's native token as the staking token so founders will be assured to have some.
        // our accounts[0] needs to be a founder
        const daoAddress = network === "Kovan" ? "0xae6ecbf473e550cca70d348c334ff6191d5bfab3" : "???";
        dao = await DAO.at(daoAddress);
      } else {
        // this will use the ganache GEN token as the staking token
        // helpers assures on test startup that the founders (accounts) have some
        dao = await helpers.forgeDao({
          schemes: [
            {
              name: "GenesisProtocol",
            },
            {
              name: "ContributionReward",
              votingMachineParams: {
                votingMachineName: "GenesisProtocol",
              },
            },
          ],
        });
      }
      assert.isOk(dao);
      LoggingService.info(`DAO at: ${dao.avatar.address}`);
    }

    if (!scheme) {
      scheme = await helpers.getDaoScheme(
        dao,
        "ContributionReward",
        ContributionRewardFactory) as ContributionRewardWrapper;

      assert.isOk(scheme);

      votingMachine = await WrapperService.factories.GenesisProtocol.at(
        (await scheme.getSchemeParameters(dao.avatar.address)).votingMachineAddress);

      assert.isOk(votingMachine);
    }
  };

  beforeEach(async () => {
    await setup();
  });

  it("can create a proposal", async () => {
    // 280000

    const gas = await scheme.estimateGas(
      scheme.contract.proposeContributionReward,
      [
        dao.avatar.address,
        helpers.SOME_HASH,
        "0",
        ["1", "0", "0", 1, 1],
        helpers.SOME_ADDRESS,
        accounts[0]],
      { from: accounts[0] });

    LoggingService.info(`estimated gas for creating a proposal: ${gas}`);

    // assert(gas >= 280000, `insufficient gas: ${gas}, should be 280000`);

    // if (network === "Ganache") {
    (scheme.constructor as any).synchronization_timeout = 0;

    const result = await scheme.contract.proposeContributionReward(
      dao.avatar.address,
      helpers.SOME_HASH,
      "0",
      ["1", "0", "0", 1, 1],
      helpers.SOME_ADDRESS,
      accounts[0],
      { gas, from: accounts[0] }
    ) as TransactionReceiptTruffle;

    proposalId = TransactionService.getValueFromLogs(result, "_proposalId");

    LoggingService.info(`Created proposal Id: ${proposalId}`);
  });

  it("can preapprove a stake transaction", async () => {
    // 45204

    LoggingService.info(`accounts[0]: ${accounts[0]}`);

    const stakingToken = await votingMachine.getStakingToken();

    const gas = await scheme.estimateGas(
      stakingToken.approve,
      [votingMachine.address, stakingAmount],
      { from: accounts[0] });

    LoggingService.info(`estimated gas for preapproving token transfer: ${gas}`);

    // assert(gas >= 45204, `insufficient gas: ${gas}, should be 45204`);

    (scheme.constructor as any).synchronization_timeout = 0;

    await stakingToken.approve(votingMachine.address, stakingAmount, { gas, from: accounts[0] });
  });

  it("can stake on a proposal", async () => {
    // 298327

    const gas = await scheme.estimateGas(
      votingMachine.contract.stake,
      [proposalId, 1, stakingAmount],
      { from: accounts[0] });

    LoggingService.info(`estimated gas for staking: ${gas}`);

    // assert(gas >= 235626, `insufficient gas: ${gas}, should be 235626`);

    (scheme.constructor as any).synchronization_timeout = 0;

    await votingMachine.contract.stake(proposalId, 1, stakingAmount, { gas, from: accounts[0] });
  });

  it("can vote on a proposal", async () => {
    // 235626

    const gas = await scheme.estimateGas(
      votingMachine.contract.vote,
      [proposalId, 1],
      { from: accounts[0] });

    LoggingService.info(`estimated gas for voting: ${gas}`);

    // assert(gas >= 235626, `insufficient gas: ${gas}, should be 235626`);

    (scheme.constructor as any).synchronization_timeout = 0;

    await votingMachine.contract.vote(proposalId, 1, { gas, from: accounts[0] });
  });

  it("can execute proposal", async () => {

    const gas = await scheme.estimateGas(
      votingMachine.contract.execute,
      [proposalId],
      { from: accounts[0] });

    LoggingService.info(`estimated gas for executing proposal: ${gas}`);

    // assert(gas >= 235626, `insufficient gas: ${gas}, should be 235626`);

    (scheme.constructor as any).synchronization_timeout = 0;

    await votingMachine.contract.execute(proposalId, { gas, from: accounts[0] });
  });

  it("can redeem proposal", async () => {

    if (network === "Ganache") {
      await helpers.vote(votingMachine, proposalId, BinaryVoteResult.Yes, accounts[1]);
      // await votingMachine.vote({ vote: 1, proposalId, onBehalfOf: accounts[1] });
    }

    // assert(await helpers.voteWasExecuted(votingMachine.contract, proposalId), "vote was not executed");

    if (network === "Ganache") {
      await helpers.increaseTime(1);
    } else {
      await helpers.waitForBlocks(2);
    }

    const gas = await scheme.estimateGas(
      scheme.contract.redeemNativeToken,
      [proposalId, dao.avatar.address],
      { from: accounts[0] });

    LoggingService.info(`estimated gas for redeeming native token: ${gas}`);

    // assert(gas >= 235626, `insufficient gas: ${gas}, should be 235626`);

    (scheme.constructor as any).synchronization_timeout = 0;

    await scheme.contract.redeemNativeToken(proposalId, dao.avatar.address, { gas, from: accounts[0] });
  });
});
