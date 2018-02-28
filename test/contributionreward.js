import * as helpers from "./helpers";
import { ContributionReward } from "../test-dist/contracts/contributionreward";

describe("ContributionReward scheme", () => {
  let dao, scheme, votingMachine;

  beforeEach(async () => {

    dao = await helpers.forgeDao({
      schemes: [
        { name: "ContributionReward" }
      ]
    });

    scheme = await helpers.getDaoScheme(dao, "ContributionReward", ContributionReward);

    votingMachine = await helpers.getSchemeVotingMachine(dao, scheme, 2);

  });

  const proposeReward = async function (rewardsSpec) {
    return await scheme.proposeContributionReward(Object.assign({
      avatar: dao.avatar.address,
      description: "A new contribution",
      beneficiary: accounts[1],
      periodLength: 1,
      numberOfPeriods: 1
    }, rewardsSpec));
  };

  it("can propose, vote and redeem", async () => {

    let result = await proposeReward({
      nativeTokenReward: web3.toWei(10)
    });

    const proposalId = result.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // now try to redeem some native tokens
    result = await scheme.redeemContributionReward({
      proposalId: proposalId,
      avatar: dao.avatar.address,
      nativeTokens: true
    });

    assert.isOk(result);

    const eventProposalId = result.getValueFromTx("_proposalId", "RedeemNativeToken");
    const amount = result.getValueFromTx("_amount", "RedeemNativeToken");
    assert.equal(eventProposalId, proposalId);
    assert.equal(web3.fromWei(amount), 10);
  });

  it("can redeem reputation", async () => {

    let result = await proposeReward({
      reputationChange: web3.toWei(10)
    });

    const proposalId = result.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // now try to redeem some native tokens
    result = await scheme.redeemReputation({
      proposalId: proposalId,
      avatar: dao.avatar.address
    });

    assert.isOk(result);

    const eventProposalId = result.getValueFromTx("_proposalId", "RedeemReputation");
    const amount = result.getValueFromTx("_amount", "RedeemReputation");
    assert.equal(eventProposalId, proposalId);
    assert.equal(web3.fromWei(amount), 10);
  });

  it("can redeem ethers", async () => {

    let result = await proposeReward({
      ethReward: web3.toWei(10)
    });

    const proposalId = result.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // give the avatar some eth to pay out
    await helpers.transferEthToDao(dao, 10);

    // now try to redeem some native tokens
    result = await scheme.redeemEther({
      proposalId: proposalId,
      avatar: dao.avatar.address
    });

    assert.isOk(result);

    const eventProposalId = result.getValueFromTx("_proposalId", "RedeemEther");
    const amount = result.getValueFromTx("_amount", "RedeemEther");
    assert.equal(eventProposalId, proposalId);
    assert.equal(web3.fromWei(amount), 10);
  });


  it("can redeem native tokens", async () => {

    let result = await proposeReward({
      nativeTokenReward: web3.toWei(10)
    });

    const proposalId = result.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // now try to redeem some native tokens
    result = await scheme.redeemNativeToken({
      proposalId: proposalId,
      avatar: dao.avatar.address
    });

    assert.isOk(result);

    const eventProposalId = result.getValueFromTx("_proposalId", "RedeemNativeToken");
    const amount = result.getValueFromTx("_amount", "RedeemNativeToken");
    assert.equal(eventProposalId, proposalId);
    assert.equal(web3.fromWei(amount), 10);
  });

  it("can redeem external tokens", async () => {

    const externalToken = dao.token;  // await Utils.requireContract("DAOToken").new("ExternalRewardToken", "ERT");

    let result = await proposeReward({
      externalTokenReward: web3.toWei(10),
      externalToken: externalToken.address
    });

    const proposalId = result.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    await helpers.transferTokensToDao(dao, 10, undefined, externalToken);
    await helpers.approveDaoTokenWithdrawal(dao, 10, dao.avatar.address, externalToken);

    // now try to redeem some native tokens
    result = await scheme.redeemExternalToken({
      proposalId: proposalId,
      avatar: dao.avatar.address
    });

    assert.isOk(result);

    const eventProposalId = result.getValueFromTx("_proposalId", "RedeemExternalToken");
    const amount = result.getValueFromTx("_amount", "RedeemExternalToken");
    assert.equal(eventProposalId, proposalId);
    assert.equal(web3.fromWei(amount), 10);
  });

  it("can get DAO's proposals", async () => {

    let result = await proposeReward({ nativeTokenReward: web3.toWei(10) });

    const proposalId1 = result.proposalId;

    result = await proposeReward({ reputationChange: web3.toWei(10) });

    const proposalId2 = result.proposalId;

    let proposals = await scheme.getDaoProposals({ avatar: dao.avatar.address });

    assert.equal(proposals.length, 2, "Should have found 2 proposals");
    assert(proposals.filter(p => p.proposalId === proposalId1).length, "proposalId1 not found");
    assert(proposals.filter(p => p.proposalId === proposalId2).length, "proposalId2 not found");

    proposals = await scheme.getDaoProposals({ avatar: dao.avatar.address, proposalId: proposalId2 });

    assert.equal(proposals.length, 1, "Should have found 1 proposals");
    assert(proposals.filter(p => p.proposalId === proposalId2).length, "proposalId2 not found");
    assert.equal(proposals[0].beneficiary, accounts[1], "beneficiary not set properly on proposal");
  });

  it("can get beneficiary's outstanding rewards", async () => {

    let result = await proposeReward({ nativeTokenReward: web3.toWei(10) });

    const nativeRewardProposalId = result.proposalId;

    result = await proposeReward({ reputationChange: web3.toWei(10) });

    const reputationChangeProposalId = result.proposalId;

    const proposals = await scheme.getDaoProposals({ avatar: dao.avatar.address });

    assert.equal(proposals.length, 2, "Should have found 2 proposals");
    assert(proposals.filter(p => p.proposalId === nativeRewardProposalId).length, "nativeRewardProposalId not found");
    assert(proposals.filter(p => p.proposalId === reputationChangeProposalId).length, "reputationChangeProposalId not found");

    let rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiary: accounts[1],
    });

    assert.equal(rewards.length, 2, "Should have found 2 sets of proposal rewards");

    let rewards1 = rewards.filter(p => p.proposalId === nativeRewardProposalId);
    assert(rewards1.length, "nativeReward not found");

    let rewards2 = rewards.filter(p => p.proposalId === reputationChangeProposalId);
    assert(rewards2.length, "reputationChange not found");

    assert.equal(web3.fromWei(rewards1[0].nativeTokenRewardUnredeemed).toNumber(), 10, "incorrect remaining nativeToken amount");
    assert.equal(rewards1[0].nativeTokenRewardUnredeemed.toNumber(), proposals[0].nativeTokenReward.toNumber(), "undereemed should equal total to be redeemed");
    assert.equal(web3.fromWei(rewards2[0].reputationChangeUnredeemed).toNumber(), 10, "incorrect remaining reputationChange amount");

    assert.equal(proposals[0].nativeTokenReward.toNumber(), rewards1[0].nativeTokenReward.toNumber(), "total redeemable should equal total redeemable");

    rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiary: accounts[1],
    });

    /**
     * redeem something
     */
    await helpers.vote(votingMachine, nativeRewardProposalId, 1, accounts[1]);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // now try to redeem some native tokens
    await scheme.redeemNativeToken({
      proposalId: nativeRewardProposalId,
      avatar: dao.avatar.address
    });

    const found = (await new Promise(async (resolve) => {
      const event = scheme.RedeemNativeToken({ "_avatar": dao.avatar.address, "_proposalId": nativeRewardProposalId }, { fromBlock: 0 });
      event.get((err, events) => {
        resolve(events.length === 1);
      });
    }));

    assert(found, "RedeemNativeToken was not fired");

    rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiary: accounts[1],
    });

    assert.equal(rewards.length, 2, "Should have found 2 sets of proposal rewards");

    rewards1 = rewards.filter(p => p.proposalId === nativeRewardProposalId);
    assert(rewards1.length, "nativeReward not found");
    rewards1 = rewards1[0];

    rewards2 = rewards.filter(p => p.proposalId === reputationChangeProposalId);
    assert(rewards2.length, "reputationChange not found");
    rewards2 = rewards2[0];

    assert.equal(web3.fromWei(rewards1.nativeTokenRewardUnredeemed).toNumber(), 0, "incorrect remaining nativeToken amount");
    assert.equal(web3.fromWei(rewards2.reputationChangeUnredeemed).toNumber(), 10, "incorrect remaining reputationChange amount");
  });
});
