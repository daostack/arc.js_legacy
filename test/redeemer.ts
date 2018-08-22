"use strict";
import { assert } from "chai";
import { DaoTokenWrapper } from "../lib";
import { BinaryVoteResult, Hash } from "../lib/commonTypes";
import { DAO } from "../lib/dao";
import { PubSubEventService } from "../lib/pubSubEventService";
import { TransactionReceiptTruffle } from "../lib/transactionService";
import { UtilsInternal } from "../lib/utilsInternal";
import { ContributionRewardFactory, ContributionRewardWrapper } from "../lib/wrappers/contributionReward";
import { GenesisProtocolFactory, GenesisProtocolWrapper } from "../lib/wrappers/genesisProtocol";
import { RedeemerRewardsEventPayload, RedeemerWrapper } from "../lib/wrappers/redeemer";
import { WrapperService } from "../lib/wrapperService";
import * as helpers from "./helpers";

describe("Redeemer", () => {

  let redeemer: RedeemerWrapper;
  let dao: DAO;
  let proposalId: Hash;
  let redeemedResult: TransactionReceiptTruffle;
  let genesisProtocol: GenesisProtocolWrapper;
  let contributionReward: ContributionRewardWrapper;
  let preRedeemBlockNumber;
  let externalToken: DaoTokenWrapper;
  const ethAmount = 0.000000001;
  const repAmount = 1;
  // const nativeTokenAmount = 2;
  const externalTokenAmount = 3;

  const setupRedeemer = async (): Promise<void> => {
    if (!redeemer) {
      redeemer = await WrapperService.factories.Redeemer.deployed();
    }
  };

  const createProposal = async (periodLength: number = 1): Promise<void> => {

    const result = await contributionReward.proposeContributionReward(Object.assign({
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[1],
      description: "A new contribution",
      ethReward: web3.toWei(ethAmount),
      externalToken: externalToken.address,
      externalTokenReward: web3.toWei(externalTokenAmount),
      // nativeTokenReward: web3.toWei(nativeTokenAmount),
      numberOfPeriods: 1,
      periodLength,
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

  const stakeAndVoteProposal = async (): Promise<void> => {
    await genesisProtocol.stake({
      amount: web3.toWei(10),
      proposalId,
      vote: BinaryVoteResult.Yes,
    });

    await helpers.vote(genesisProtocol, proposalId, BinaryVoteResult.Yes, accounts[0]);
    await helpers.increaseTime(1);
  };

  const createDao = async (): Promise<void> => {
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

    externalToken = await dao.token;

    genesisProtocol = await GenesisProtocolFactory.at(
      await contributionReward.getVotingMachineAddress(dao.avatar.address));

  };

  const basicSetup = async (): Promise<void> => {

    await createDao();

    await setupRedeemer();

    await createProposal();

    await stakeAndVoteProposal();

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
      await stakeAndVoteProposal();
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
    assert.equal(web3.fromWei(rewardResults.rewardGenesisProtocolTokens).toNumber(), 5);
    assert.equal(web3.fromWei(rewardResults.rewardGenesisProtocolReputation).toNumber(), 30);
  });

  it("can redeem", async () => {

    await createDao();

    await setupRedeemer();

    await createProposal(0);

    await helpers.vote(genesisProtocol, proposalId, BinaryVoteResult.No, accounts[2]);
    await helpers.vote(genesisProtocol, proposalId, BinaryVoteResult.Yes, accounts[3]);

    await (await genesisProtocol.stakeWithApproval({ amount: web3.toWei(10), vote: 1, proposalId })).getTxMined();

    await helpers.vote(genesisProtocol, proposalId, BinaryVoteResult.Yes, accounts[1]);

    /**
     * expire out of the GP boosting phase. 259200 is the default boosting phase length.
     */
    await helpers.increaseTime(259200);

    // give the avatar some eth to pay out
    await helpers.transferEthToDao(dao, ethAmount);
    await helpers.transferTokensToDao(dao, externalTokenAmount, accounts[1], externalToken);

    /**
     * staker
     */
    let redeemable = (await redeemer.redeemables(
      {
        avatarAddress: dao.avatar.address,
        beneficiaryAddress: accounts[0],
        proposalId,
      }
    ));

    assert.equal(redeemable.contributionRewardEther, true);
    assert.equal(redeemable.contributionRewardNativeToken, false);
    assert.equal(redeemable.contributionRewardExternalToken, true);
    assert.equal(redeemable.contributionRewardReputation, true);
    assert.equal(web3.fromWei(redeemable.stakerTokenAmount).toNumber(), 5);
    assert.equal(web3.fromWei(redeemable.stakerReputationAmount).toNumber(), 1);
    assert.equal(web3.fromWei(redeemable.daoStakingBountyPotentialReward).toNumber(), 7.5);
    assert.equal(web3.fromWei(redeemable.voterReputationAmount).toNumber(), 0);
    assert.equal(web3.fromWei(redeemable.proposerReputationAmount).toNumber(), 15);

    /**
     * winning boosted voter
     */
    redeemable = (await redeemer.redeemables(
      {
        avatarAddress: dao.avatar.address,
        beneficiaryAddress: accounts[1],
        proposalId,
      }
    ));

    assert.equal(redeemable.contributionRewardEther, true);
    assert.equal(redeemable.contributionRewardNativeToken, false);
    assert.equal(redeemable.contributionRewardExternalToken, true);
    assert.equal(redeemable.contributionRewardReputation, true);
    assert.equal(web3.fromWei(redeemable.stakerTokenAmount).toNumber(), 0);
    assert.equal(web3.fromWei(redeemable.stakerReputationAmount).toNumber(), 0);
    assert.equal(web3.fromWei(redeemable.voterReputationAmount).toNumber(), 0);
    assert.equal(web3.fromWei(redeemable.voterTokenAmount).toNumber(), 0);

    /**
     * losing preboosted voter
     */
    redeemable = (await redeemer.redeemables(
      {
        avatarAddress: dao.avatar.address,
        beneficiaryAddress: accounts[2],
        proposalId,
      }
    ));

    assert.equal(redeemable.contributionRewardEther, true);
    assert.equal(redeemable.contributionRewardNativeToken, false);
    assert.equal(redeemable.contributionRewardExternalToken, true);
    assert.equal(redeemable.contributionRewardReputation, true);
    assert.equal(web3.fromWei(redeemable.voterTokenAmount).toNumber(), 2.5);
    assert.equal(web3.fromWei(redeemable.voterReputationAmount).toNumber(), 0);

    /**
     * winning preboosted voter
     */
    redeemable = (await redeemer.redeemables(
      {
        avatarAddress: dao.avatar.address,
        beneficiaryAddress: accounts[3],
        proposalId,
      }
    ));

    assert.equal(redeemable.contributionRewardEther, true);
    assert.equal(redeemable.contributionRewardNativeToken, false);
    assert.equal(redeemable.contributionRewardExternalToken, true);
    assert.equal(redeemable.contributionRewardReputation, true);
    assert.equal(web3.fromWei(redeemable.voterTokenAmount).toNumber(), 2.5);
    assert.equal(web3.fromWei(redeemable.voterReputationAmount).toNumber(), 7);

    const latestBlock = await UtilsInternal.lastBlock();

    const redeemed = (await redeemer.redeem({
      avatarAddress: dao.avatar.address,
      beneficiaryAddress: accounts[0],
      proposalId,
    })).getTxMined();

    assert(redeemed);

    const fetcher = genesisProtocol.Redeem(
      { _beneficiary: accounts[0], _proposalId: proposalId, _avatar: dao.avatar.address },
      { fromBlock: latestBlock });

    const events = await fetcher.get();

    assert.equal(events.length, 1);
    assert.equal(web3.fromWei(events[0].args._amount).toNumber(), 5);
  });
});
