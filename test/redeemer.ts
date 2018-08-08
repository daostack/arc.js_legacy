"use strict";
import { assert } from "chai";
import { BinaryVoteResult, Hash } from "../lib/commonTypes";
import { ContributionRewardFactory, ContributionRewardWrapper } from "../lib/wrappers/contributionReward";
import { GenesisProtocolWrapper, GenesisProtocolFactory } from "../lib/wrappers/genesisProtocol";
import { WrapperService } from "../lib/wrapperService";
import { UtilsInternal } from "../lib/utilsInternal";
import { RedeemerWrapper } from "../lib/wrappers/redeemer";
import * as helpers from "./helpers";
import { TransactionReceiptTruffle } from '../lib/transactionService';
import { DAO } from '../lib/dao';

describe("Redeemer", () => {

  let redeemer: RedeemerWrapper;
  let dao: DAO;
  let proposalId: Hash;
  let redeemedResult: TransactionReceiptTruffle;
  let genesisProtocol: GenesisProtocolWrapper;
  let contributionReward: ContributionRewardWrapper;
  let preRedeemBlockNumber;
  const ethAmount = 0.000000001;
  const repAmount = 1;
  // const nativeTokenAmount = 2;
  const externalTokenAmount = 3;

  const setupRedeemer = async (): Promise<void> => {
    if (!redeemer) {
      redeemer = await WrapperService.factories.Redeemer.deployed();
    }
  };

  const createProposal = async (): Promise<void> => {
    const externalToken = await dao.token;

    const result = await contributionReward.proposeContributionReward(Object.assign({
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[1],
      description: "A new contribution",
      ethReward: web3.toWei(ethAmount),
      externalToken: externalToken.address,
      externalTokenReward: web3.toWei(externalTokenAmount),
      // nativeTokenReward: web3.toWei(nativeTokenAmount),
      numberOfPeriods: 1,
      periodLength: 1,
      reputationChange: web3.toWei(repAmount),
    }));

    proposalId = await result.getProposalIdFromMinedTx();

    assert.isOk(proposalId);
    assert.isOk(result.votingMachine);

    // give the avatar some eth to pay out
    await helpers.transferEthToDao(dao, ethAmount);
    await helpers.transferTokensToDao(dao, externalTokenAmount, accounts[1], externalToken);
  };

  const redeemProposal = async (): Promise<void> => {
    // at this point the redeem is mined but not confirmed
    preRedeemBlockNumber = await UtilsInternal.lastBlock();

    redeemedResult = await (await redeemer.redeem({
      avatarAddress: dao.avatar.address,
      beneficiaryAddress: accounts[0],
      proposalId,
    })).getTxMined();

    assert.isOk(redeemedResult);
  };

  const voteProposal = async (): Promise<void> => {
    await genesisProtocol.stake({
      amount: web3.toWei(10),
      proposalId,
      vote: BinaryVoteResult.Yes,
    });

    await helpers.vote(genesisProtocol, proposalId, BinaryVoteResult.Yes, accounts[0]);
    await helpers.increaseTime(1);
  };

  const basicSetup = async (): Promise<void> => {
    dao = await helpers.forgeDao({
      founders: [{
        address: accounts[0],
        reputation: web3.toWei(3000),
        tokens: web3.toWei(3000),
      },
      {
        address: accounts[1],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(1000),
      },
      {
        address: accounts[2],
        reputation: web3.toWei(500),
        tokens: web3.toWei(500),
      },
      {
        address: accounts[3],
        reputation: web3.toWei(500),
        tokens: web3.toWei(500),
      }],
      schemes: [
        { name: "GenesisProtocol" },
        {
          name: "ContributionReward",
          votingMachineParams: {
            votingMachineName: "GenesisProtocol",
          },
        },
      ],
    });

    contributionReward = await helpers.getDaoScheme(
      dao,
      "ContributionReward",
      ContributionRewardFactory) as ContributionRewardWrapper;

    genesisProtocol = await GenesisProtocolFactory.at(
      await contributionReward.getVotingMachineAddress(dao.avatar.address));

    await setupRedeemer();

    await createProposal();

    await voteProposal();

    await redeemProposal();
  };

  it("can watch", async () => {

    let redeemerSubscription;
    const events = new Array<RedeemerRewardsEventPayload>();
    const localSubscription = PubSubEventService.subscribe(
      "Redeeming.event",
      (topic: string, event: RedeemerRewardsEventPayload): void => {
        events.push(event);
      });

    try {

      await basicSetup();

      redeemerSubscription = await redeemer.rewardsEvents(
        "Redeeming.event",
        { fromBlock: preRedeemBlockNumber, toBlock: "latest" });

      // console.log(`${await UtilsInternal.lastBlock()}`);
      await helpers.sleep(100);
      // console.log(`${await UtilsInternal.lastBlock()}`);

      assert.isOk(events);
      assert.equal(events.length, 1, "wrong number of events");

      // console.log(`${await UtilsInternal.lastBlock()}`);
      await createProposal();
      await voteProposal();
      await redeemProposal();
      // console.log(`${await UtilsInternal.lastBlock()}`);

    } finally {
      if (redeemerSubscription) {
        await redeemerSubscription.unsubscribe(1000)
          .then(async () => { if (localSubscription) { await localSubscription.unsubscribe(1000); } });
      }
    }
    // console.log(`${await UtilsInternal.lastBlock()}`);
    assert.equal(events.length, 2, "wrong number of events after new proposal");
  });

  it("can get rewardsEvents at requiredDepth", async () => {

    let redeemerSubscription;
    const events = new Array<RedeemerRewardsEventPayload>();
    const localSubscription =
      PubSubEventService.subscribe("Redeeming.event", (topic: string, event: RedeemerRewardsEventPayload): void => {
        events.push(event);
      });

    try {
      await basicSetup();

      await helpers.makeTransactions(4);

      redeemerSubscription = await redeemer.rewardsEvents(
        "Redeeming.event",
        { fromBlock: preRedeemBlockNumber, toBlock: await UtilsInternal.lastBlock() },
        2);

    } finally {
      if (redeemerSubscription) {
        await redeemerSubscription.unsubscribe(1000)
          .then(async () => { if (localSubscription) { await localSubscription.unsubscribe(1000); } });
      }
    }

    assert.isOk(events);
    assert.equal(events.length, 1, "wrong number of events");

    const eventBlockNumber = (await web3.eth.getTransaction(events[0].transactionHash)).blockNumber;
    const currentBlockNumber = await UtilsInternal.lastBlock();

    assert.equal(eventBlockNumber, preRedeemBlockNumber + 1, "wrong number of blocks(1)");
    assert((currentBlockNumber - eventBlockNumber) >= 2, "wrong number of blocks(2)");
  });

  it("can get all rewardsEvents", async () => {

    let redeemerSubscription;
    const events = new Array<RedeemerRewardsEventPayload>();
    const localSubscription =
      PubSubEventService.subscribe("Redeeming.event", (topic: string, event: RedeemerRewardsEventPayload): void => {
        events.push(event);
      });

    try {
      await basicSetup();

      redeemerSubscription = await redeemer.rewardsEvents(
        "Redeeming.event",
        { fromBlock: preRedeemBlockNumber, toBlock: await UtilsInternal.lastBlock() });

    } finally {
      if (redeemerSubscription) {
        await redeemerSubscription.unsubscribe(1000)
          .then(async () => { if (localSubscription) { await localSubscription.unsubscribe(1000); } });
      }
    }

    assert.isOk(events);
    assert.equal(events.length, 1, "wrong number of events");
    const rewardResults = events[0];
    assert.equal(rewardResults.beneficiaryContributionReward, accounts[1]);
    assert.equal(rewardResults.beneficiaryGenesisProtocol, accounts[0]);
    assert.equal(web3.fromWei(rewardResults.rewardContributionEther).toNumber(), ethAmount);
    assert.equal(web3.fromWei(rewardResults.rewardContributionReputation).toNumber(), repAmount);
    assert.equal(web3.fromWei(rewardResults.rewardContributionExternalToken).toNumber(), externalTokenAmount);
    assert.equal(web3.fromWei(rewardResults.rewardContributionNativeToken).toNumber(), 0);
    assert.equal(web3.fromWei(rewardResults.rewardGenesisProtocolTokens).toNumber(), 10);
    assert.equal(web3.fromWei(rewardResults.rewardGenesisProtocolReputation).toNumber(), 10.01);
  });

  it("can redeem", async () => {
    await basicSetup();
  });
});
