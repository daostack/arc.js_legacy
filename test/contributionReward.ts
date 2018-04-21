import { assert } from "chai";
import { AbsoluteVoteWrapper, ArcTransactionProposalResult, DAO, DecodedLogEntryEvent } from "../lib";
import {
  ContributionProposal,
  ContributionRewardFactory,
  ContributionRewardWrapper,
  ProposalRewards,
  RedeemNativeTokenEventResult
} from "../lib/wrappers/contributionReward";
import * as helpers from "./helpers";

describe("ContributionReward scheme", () => {
  let dao: DAO;
  let scheme: ContributionRewardWrapper;
  let votingMachine: AbsoluteVoteWrapper;

  beforeEach(async () => {

    dao = await helpers.forgeDao({
      schemes: [
        { name: "ContributionReward" },
      ],
    });

    scheme = await helpers.getDaoScheme(
      dao,
      "ContributionReward",
      ContributionRewardFactory) as ContributionRewardWrapper;

    votingMachine = await helpers.getSchemeVotingMachine(dao, scheme) as AbsoluteVoteWrapper;
  });

  const proposeReward = (rewardsSpec: any): Promise<ArcTransactionProposalResult> => {
    return scheme.proposeContributionReward(Object.assign({
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[1],
      description: "A new contribution",
      numberOfPeriods: 1,
      periodLength: 1,
    }, rewardsSpec));
  };

  it("can create and propose with orgNativeTokenFee", async () => {

    dao = await helpers.forgeDao({
      schemes: [
        { name: "ContributionReward", additionalParams: { orgNativeTokenFee: web3.toWei(10) } },
      ],
    });

    scheme = await helpers.getDaoScheme(
      dao,
      "ContributionReward",
      ContributionRewardFactory) as ContributionRewardWrapper;

    /**
     * should not revert
     */
    await proposeReward({
      nativeTokenReward: web3.toWei(10),
    });
  });

  it("can propose, vote and redeem", async () => {

    const proposalResult = await proposeReward({
      nativeTokenReward: web3.toWei(10),
    });

    const proposalId = proposalResult.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // now try to redeem some native tokens
    const result = await scheme.redeemContributionReward({
      avatar: dao.avatar.address,
      nativeTokens: true,
      proposalId,
    });

    assert.isOk(result);

    const eventProposalId = result.getValueFromTx("_proposalId", "RedeemNativeToken");
    const amount = result.getValueFromTx("_amount", "RedeemNativeToken");
    assert.equal(eventProposalId, proposalId);
    assert(helpers.fromWei(amount).eq(10));
  });

  it("can redeem reputation", async () => {

    const proposalResult = await proposeReward({
      reputationChange: web3.toWei(10),
    });

    const proposalId = proposalResult.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // now try to redeem some native tokens
    const result = await scheme.redeemReputation({
      avatar: dao.avatar.address,
      proposalId,
    });

    assert.isOk(result);

    const eventProposalId = result.getValueFromTx("_proposalId", "RedeemReputation");
    const amount = result.getValueFromTx("_amount", "RedeemReputation");
    assert.equal(eventProposalId, proposalId);
    assert(helpers.fromWei(amount).eq(10));
  });

  it("can redeem ethers", async () => {

    const proposalResult = await proposeReward({
      ethReward: web3.toWei(.005),
    });

    const proposalId = proposalResult.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // give the avatar some eth to pay out
    await helpers.transferEthToDao(dao, .005);

    // now try to redeem some native tokens
    const result = await scheme.redeemEther({
      avatar: dao.avatar.address,
      proposalId,
    });

    assert.isOk(result);

    const eventProposalId = result.getValueFromTx("_proposalId", "RedeemEther");
    const amount = result.getValueFromTx("_amount", "RedeemEther");
    assert.equal(eventProposalId, proposalId);
    assert(helpers.fromWei(amount).eq(.005));
  });

  it("can redeem native tokens", async () => {

    const proposalResult = await proposeReward({
      nativeTokenReward: web3.toWei(10),
    });

    const proposalId = proposalResult.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // now try to redeem some native tokens
    const result = await scheme.redeemNativeToken({
      avatar: dao.avatar.address,
      proposalId,
    });

    assert.isOk(result);

    const eventProposalId = result.getValueFromTx("_proposalId", "RedeemNativeToken");
    const amount = result.getValueFromTx("_amount", "RedeemNativeToken");
    assert.equal(eventProposalId, proposalId);
    assert(helpers.fromWei(amount).eq(10));
  });

  it("can redeem external tokens", async () => {

    const externalToken = await dao.token;

    const proposalResult = await proposeReward({
      externalToken: externalToken.address,
      externalTokenReward: web3.toWei(10),
    });

    const proposalId = proposalResult.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    await helpers.transferTokensToDao(dao, 10, undefined, externalToken);

    // now try to redeem some native tokens
    const result = await scheme.redeemExternalToken({
      avatar: dao.avatar.address,
      proposalId,
    });

    assert.isOk(result);

    const eventProposalId = result.getValueFromTx("_proposalId", "RedeemExternalToken");
    const amount = result.getValueFromTx("_amount", "RedeemExternalToken");
    assert.equal(eventProposalId, proposalId);
    assert(helpers.fromWei(amount).eq(10));
  });

  it("can get DAO's proposals", async () => {

    let result = await proposeReward({ nativeTokenReward: web3.toWei(10) });

    const proposalId1 = result.proposalId;

    result = await proposeReward({ reputationChange: web3.toWei(10) });

    const proposalId2 = result.proposalId;

    let proposals = await scheme.getDaoProposals({ avatar: dao.avatar.address });

    assert.equal(proposals.length, 2, "Should have found 2 proposals");
    assert(proposals.filter((p: ContributionProposal) => p.proposalId === proposalId1).length, "proposalId1 not found");
    assert(proposals.filter((p: ContributionProposal) => p.proposalId === proposalId2).length, "proposalId2 not found");

    proposals = await scheme.getDaoProposals({ avatar: dao.avatar.address, proposalId: proposalId2 });

    assert.equal(proposals.length, 1, "Should have found 1 proposals");
    assert(proposals.filter((p: ContributionProposal) => p.proposalId === proposalId2).length, "proposalId2 not found");
    assert.equal(proposals[0].beneficiaryAddress, accounts[1],
      "benebeneficiaryAddressficiary not set properly on proposal");
  });

  it("can get beneficiaryAddress's outstanding rewards", async () => {

    let result = await proposeReward({ nativeTokenReward: web3.toWei(10) });

    const nativeRewardProposalId = result.proposalId;

    result = await proposeReward({ reputationChange: web3.toWei(10) });

    const reputationChangeProposalId = result.proposalId;

    const proposals = await scheme.getDaoProposals({ avatar: dao.avatar.address });

    assert.equal(proposals.length, 2, "Should have found 2 proposals");
    assert(proposals.filter((p: ContributionProposal) => p.proposalId === nativeRewardProposalId).length,
      "nativeRewardProposalId not found");
    assert(proposals.filter((p: ContributionProposal) => p.proposalId === reputationChangeProposalId).length,
      "reputationChangeProposalId not found");

    let rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[1],
    });

    assert.equal(rewards.length, 2, "Should have found 2 sets of proposal rewards");

    let rewards1 = rewards.filter((p: ProposalRewards) => p.proposalId === nativeRewardProposalId);
    assert(rewards1.length, "nativeReward not found");

    let rewards2 = rewards.filter((p: ProposalRewards) => p.proposalId === reputationChangeProposalId);
    assert(rewards2.length, "reputationChange not found");

    assert.equal(helpers.fromWei(rewards1[0].nativeTokenRewardUnredeemed).toNumber(),
      10, "incorrect remaining nativeToken amount");
    assert.equal(rewards1[0].nativeTokenRewardUnredeemed.toNumber(),
      proposals[0].nativeTokenReward.toNumber(), "undereemed should equal total to be redeemed");
    assert.equal(helpers.fromWei(rewards2[0].reputationChangeUnredeemed).toNumber(),
      10, "incorrect remaining reputationChange amount");

    assert.equal(proposals[0].nativeTokenReward.toNumber(),
      rewards1[0].nativeTokenReward.toNumber(), "total redeemable should equal total redeemable");

    rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[1],
    });

    /**
     * redeem something
     */
    await helpers.vote(votingMachine, nativeRewardProposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    const nativeTokenRewardsAfterVote = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[1],
      proposalId: nativeRewardProposalId,
    });

    assert.equal(helpers.fromWei(nativeTokenRewardsAfterVote[0].nativeTokenRewardRedeemable).toNumber(),
      10, "native tokens should be redeemable");

    // now try to redeem some native tokens
    await scheme.redeemNativeToken({
      avatar: dao.avatar.address,
      proposalId: nativeRewardProposalId,
    });

    const found = (await new Promise(async (resolve: (result: boolean) => void): Promise<void> => {
      const event = scheme.RedeemNativeToken(
        { _avatar: dao.avatar.address, _proposalId: nativeRewardProposalId }, { fromBlock: 0 });

      event.get((err: Error, events: Array<DecodedLogEntryEvent<RedeemNativeTokenEventResult>>) => {
        resolve(events.length === 1);
      });
    }));

    assert(found, "RedeemNativeToken was not fired");

    rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[1],
    });

    assert.equal(rewards.length, 2, "Should have found 2 sets of proposal rewards");

    rewards1 = rewards.filter((p: ProposalRewards) => p.proposalId === nativeRewardProposalId);
    assert(rewards1.length, "nativeReward not found");
    const reward1 = rewards1[0];

    rewards2 = rewards.filter((p: ProposalRewards) => p.proposalId === reputationChangeProposalId);
    assert(rewards2.length, "reputationChange not found");
    const reward2 = rewards2[0];

    assert.equal(helpers.fromWei(reward1.nativeTokenRewardUnredeemed).toNumber(),
      0, "incorrect remaining nativeToken amount");
    assert.equal(helpers.fromWei(reward2.reputationChangeUnredeemed).toNumber(),
      10, "incorrect remaining reputationChange amount");
  });
});
