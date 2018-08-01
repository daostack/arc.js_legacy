"use strict";
import { assert } from "chai";
import {
  BinaryVoteResult,
  DAO,
  GenesisProtocolFactory,
  GenesisProtocolWrapper,
  Hash,
  TransactionReceiptTruffle,
  WrapperService
} from "../lib";
import { UtilsInternal } from "../lib/utilsInternal";
import { ContributionRewardFactory, ContributionRewardWrapper } from "../lib/wrappers/contributionReward";
import { RedeemerRewardEventsResult, RedeemerWrapper } from "../lib/wrappers/redeemer";
import * as helpers from "./helpers";

describe("Redeemer", () => {

  let redeemer: RedeemerWrapper;
  let dao: DAO;
  let proposalId: Hash;
  let redeemedResult: TransactionReceiptTruffle;
  let genesisProtocol: GenesisProtocolWrapper;
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
  const basicSetup = async (): Promise<void> => {
    dao = await helpers.forgeDao({
      founders: [{
        address: accounts[0],
        reputation: web3.toWei(1001),
        tokens: web3.toWei(1000),
      },
      {
        address: accounts[1],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(1000),
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

    const scheme = await helpers.getDaoScheme(
      dao,
      "ContributionReward",
      ContributionRewardFactory) as ContributionRewardWrapper;

    const externalToken = await dao.token;

    const result = await scheme.proposeContributionReward(Object.assign({
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

    genesisProtocol = await GenesisProtocolFactory.at(await scheme.getVotingMachineAddress(dao.avatar.address));
    await genesisProtocol.stake({
      amount: web3.toWei(10),
      proposalId,
      vote: BinaryVoteResult.Yes,
    });

    await helpers.vote(result.votingMachine, proposalId, BinaryVoteResult.Yes, accounts[0]);

    await helpers.increaseTime(1);

    // give the avatar some eth to pay out
    await helpers.transferEthToDao(dao, ethAmount);
    await helpers.transferTokensToDao(dao, externalTokenAmount, accounts[1], externalToken);

    await setupRedeemer();

    // at this point the redeem is mined but not confirmed
    preRedeemBlockNumber = await UtilsInternal.lastBlock();

    redeemedResult = await (await redeemer.redeem({
      avatarAddress: dao.avatar.address,
      beneficiaryAddress: accounts[0],
      proposalId,
    })).getTxMined();

    assert.isOk(redeemedResult);
  };

  it("can get rewardsEvents at requiredDepth", async () => {

    const events = new Array<RedeemerRewardEventsResult>();

    await setupRedeemer();

    const rewardsFetcher = redeemer.rewardsEvents(2)();

    rewardsFetcher.watch((error: Error, event: RedeemerRewardEventsResult): void => {
      events.push(event);
    });

    await basicSetup();

    await helpers.makeTransactions(4);

    await helpers.sleep(1000);

    rewardsFetcher.stopWatching();

    assert.isOk(events);
    assert.equal(events.length, 1, "wrong number of events");

    const eventBlockNumber = (await web3.eth.getTransaction(events[0].transactionHash)).blockNumber;
    const currentBlockNumber = await UtilsInternal.lastBlock();

    assert.equal(eventBlockNumber, preRedeemBlockNumber + 1, "wrong number of blocks(1)");
    assert((currentBlockNumber - eventBlockNumber) >= 2, "wrong number of blocks(2)");
  });

  it("can get all rewardsEvents", async () => {

    await basicSetup();

    const rewardsFetcher = redeemer.rewardsEvents();

    const events = await rewardsFetcher().get();

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
