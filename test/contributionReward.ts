import { assert } from "chai";
import { BinaryVoteResult, IntVoteInterfaceWrapper, RedeemEventResult } from "../lib";
import { ArcTransactionProposalResult, DecodedLogEntryEvent } from "../lib/contractWrapperBase";
import { DAO } from "../lib/dao";
import { AbsoluteVoteWrapper } from "../lib/wrappers/absoluteVote";
import {
  ContributionProposal,
  ContributionRewardFactory,
  ContributionRewardWrapper,
  ProposalRewards
} from "../lib/wrappers/contributionReward";
import * as helpers from "./helpers";

describe("ContributionReward scheme", () => {
  let dao: DAO;
  let scheme: ContributionRewardWrapper;
  let votingMachine: IntVoteInterfaceWrapper;

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

    votingMachine = await scheme.getVotingMachine(dao.avatar.address);
  });

  const proposeReward = async (rewardsSpec: any): Promise<ArcTransactionProposalResult> => {
    const result = await scheme.proposeContributionReward(Object.assign({
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[1],
      description: "A new contribution",
      numberOfPeriods: 1,
      periodLength: 1,
    }, rewardsSpec));

    assert.isOk(result.proposalId);
    assert.isOk(result.votingMachine);

    return result;
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

    const rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[1],
      proposalId,
    });

    assert.equal(rewards.length, 1);
    assert(rewards[0].ethAvailableToReward.eq(web3.toWei(".005")),
      `${rewards[0].ethAvailableToReward} should equal ${web3.toWei(".005")}`);

    // now try to redeem some native tokens
    const result = await scheme.redeemEther({
      avatar: dao.avatar.address,
      proposalId,
    });

    assert.isOk(result);

    const eventProposalId = result.getValueFromTx("_proposalId", "RedeemEther");
    const amount = result.getValueFromTx("_amount", "RedeemEther");
    const beneficiary = result.getValueFromTx("_beneficiary", "RedeemEther");

    assert.equal(beneficiary, accounts[1]);
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

    await helpers.transferTokensToDao(dao, 10, accounts[0], externalToken);

    const rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[1],
      proposalId,
    });

    assert.equal(rewards.length, 1);
    assert(rewards[0].externalTokensAvailableToReward.eq(web3.toWei("10")),
      `${rewards[0].externalTokensAvailableToReward} should equal ${web3.toWei("10")}`);

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

  it("can get proposals", async () => {

    dao = await helpers.forgeDao({
      schemes: [
        {
          name: "ContributionReward",
          votingMachineParams: {
            ownerVote: false,
          },
        },
      ],
    });

    let result = await proposeReward({ nativeTokenReward: web3.toWei(10) });

    const proposalId1 = result.proposalId;

    result = await proposeReward({ reputationChange: web3.toWei(10) });

    const proposalId2 = result.proposalId;

    let proposals = await (await scheme.getVotableProposals(dao.avatar.address))({}, { fromBlock: 0 }).get();

    assert.equal(proposals.length, 2, "Should have found 2 votable proposals");
    assert(proposals.filter(
      (p: ContributionProposal) => p.proposalId === proposalId1).length, "proposalId1 not found");
    assert(proposals.filter(
      (p: ContributionProposal) => p.proposalId === proposalId2).length, "proposalId2 not found");

    let proposal = await scheme.getVotableProposal(dao.avatar.address, proposalId2);

    assert(proposal.proposalId === proposalId2, "proposalId2 not found");
    assert.equal(proposal.beneficiaryAddress, accounts[1],
      "beneficiaryAddress not set properly on proposal");

    await votingMachine.vote({ vote: BinaryVoteResult.Yes, proposalId: proposalId2, onBehalfOf: accounts[0] });
    await votingMachine.vote({ vote: BinaryVoteResult.Yes, proposalId: proposalId2, onBehalfOf: accounts[1] });

    proposals = await scheme.getExecutedProposals(dao.avatar.address)(
      { _proposalId: proposalId2 }, { fromBlock: 0 }).get();

    assert.equal(proposals.length, 1, "Executed proposal not found");

    proposal = proposals[0];

    assert(proposal.proposalId === proposalId2, "executed proposalId2 not found");

    assert.equal(proposal.beneficiaryAddress, accounts[1],
      "beneficiaryAddress not set properly on proposal");

    const proposalsFromGet = await scheme.ProposalExecuted({ _avatar: dao.avatar.address }, { fromBlock: 0 }).get();

    // make sure the direct return value of 'get' works
    assert.equal(proposals.length,
      proposalsFromGet.length,
      "direct and indirect calls returned different array lengths");

  });

  it("can get beneficiaryAddress's outstanding rewards", async () => {

    let result = await proposeReward({ nativeTokenReward: web3.toWei(10) });

    const nativeRewardProposalId = result.proposalId;

    result = await proposeReward({ reputationChange: web3.toWei(10) });

    const reputationChangeProposalId = result.proposalId;

    const proposals = await (await scheme.getVotableProposals(dao.avatar.address))({}, { fromBlock: 0 }).get();

    assert.equal(proposals.length, 2, "Should have found 2 votable proposals");
    assert(proposals.filter((p: ContributionProposal) => p.proposalId === nativeRewardProposalId).length,
      "nativeRewardProposalId not found");
    assert(proposals.filter((p: ContributionProposal) => p.proposalId === reputationChangeProposalId).length,
      "reputationChangeProposalId not found");

    await votingMachine.vote({
      onBehalfOf: accounts[1],
      proposalId: nativeRewardProposalId,
      vote: BinaryVoteResult.Yes,
    });
    await votingMachine.vote({
      onBehalfOf: accounts[1],
      proposalId: reputationChangeProposalId,
      vote: BinaryVoteResult.Yes,
    });

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

    const found = (await
      new Promise(async (resolve: (result: boolean) => void, reject: (error: Error) => void): Promise<void> => {
        const event = scheme.RedeemNativeToken(
          { _avatar: dao.avatar.address, _proposalId: nativeRewardProposalId }, { fromBlock: 0 });

        event.get((err: Error, events: Array<DecodedLogEntryEvent<RedeemEventResult>>) => {
          if (err) {
            return reject(err);
          }
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
