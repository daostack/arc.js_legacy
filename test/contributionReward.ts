import { assert } from "chai";
import { BinaryVoteResult, IntVoteInterfaceWrapper, RedeemEventResult, Utils } from "../lib";
import { DAO } from "../lib/dao";
import { ArcTransactionProposalResult, DecodedLogEntryEvent } from "../lib/iContractWrapperBase";
import { UtilsInternal } from "../lib/utilsInternal";
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
  let account0;
  let account1;
  let network;

  beforeEach(async () => {
    if (!dao) {
      await setupDao();
    }
  });

  const setupDao = async (): Promise<void> => {
    if (!network) {
      network = await Utils.getNetworkName();
    }

    dao = await helpers.forgeDao({
      schemes: [
        { name: "ContributionReward" },
      ],
    });

    account0 = accounts[0];
    account1 = accounts[1];

    scheme = await helpers.getDaoScheme(
      dao,
      "ContributionReward",
      ContributionRewardFactory) as ContributionRewardWrapper;

    votingMachine = await scheme.getVotingMachine(dao.avatar.address);
  };

  const proposeReward = async (
    rewardsSpec: any,
    customScheme: ContributionRewardWrapper = scheme,
    customDao: DAO = dao): Promise<ArcTransactionProposalResult> => {
    const result = await customScheme.proposeContributionReward(Object.assign({
      avatar: customDao.avatar.address,
      beneficiaryAddress: account1,
      description: "A new contribution",
      numberOfPeriods: 1,
      periodLength: 1,
    }, rewardsSpec));

    assert.isOk(await result.getProposalIdFromMinedTx());
    assert.isOk(result.votingMachine);

    return result;
  };

  it("can get NewContributionProposal event with rewards", async () => {

    const result = await proposeReward({
      nativeTokenReward: web3.toWei(1),
    });

    // const proposal = await result.getTxConfirmed();

    const eventFactory = scheme.NewContributionProposal(
      { _proposalId: await result.getProposalIdFromMinedTx() });

    const events = await eventFactory.get();
    assert(events.length === 1);
    const event = events[0];
    assert.equal(event.transactionHash, result.tx);
    assert(Array.isArray(event.args._rewards));
  });

  it("can create and propose with orgNativeTokenFee", async () => {

    const localDao = await helpers.forgeDao({
      schemes: [
        {
          name: "ContributionReward",
          orgNativeTokenFee: web3.toWei(1),
        },
      ],
    });

    const localScheme = await helpers.getDaoScheme(
      localDao,
      "ContributionReward",
      ContributionRewardFactory) as ContributionRewardWrapper;

    const params = await scheme.getSchemeParameters(localDao.avatar.address);
    assert.equal(params.orgNativeTokenFee.toString(), web3.toWei(1), "parameter was not persisted");

    const currentBalance = await localDao.getTokenBalance(accounts[0]);

    await localDao.token.approve(scheme.address, web3.toWei(1), { from: accounts[0] });
    /**
     * should not revert
     */
    await proposeReward({
      reputationChange: web3.toWei(1),
    }, localScheme, localDao);

    const newBalance = await localDao.getTokenBalance(accounts[0]);
    assert(currentBalance.sub(newBalance).toString() === web3.toWei(1), "fee was not extracted");
  });

  it("can propose, vote and redeem", async () => {

    const proposalResult = await proposeReward({
      nativeTokenReward: web3.toWei(1),
    });

    const proposalId = await proposalResult.getProposalIdFromMinedTx();

    await helpers.vote(votingMachine, proposalId, 1, account1);
    assert(await helpers.voteWasExecuted(votingMachine, proposalId), "vote was not executed");

    if (network === "Ganache") {
      // this will mine a block, allowing the award to be redeemed
      await helpers.increaseTime(1);
    } else {
      await helpers.waitForBlocks(1);
    }

    // now try to redeem some native tokens
    const result = await scheme.redeemContributionReward({
      avatar: dao.avatar.address,
      nativeTokens: true,
      proposalId,
    });

    assert.isOk(result);

    const eventProposalId = await result.getValueFromMinedTx("_proposalId", "RedeemNativeToken");
    const amount = await result.getValueFromMinedTx("_amount", "RedeemNativeToken");
    assert.equal(eventProposalId, proposalId);
    assert(helpers.fromWei(amount).eq(1));
  });

  it("can redeem reputation", async () => {

    const proposalResult = await proposeReward({
      reputationChange: web3.toWei(1),
    });

    const proposalId = await proposalResult.getProposalIdFromMinedTx();

    await helpers.vote(votingMachine, proposalId, 1, account1);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // now try to redeem some native tokens
    const result = await scheme.redeemReputation({
      avatar: dao.avatar.address,
      proposalId,
    });

    assert.isOk(result);

    const eventProposalId = await result.getValueFromMinedTx("_proposalId", "RedeemReputation");
    const amount = await result.getValueFromMinedTx("_amount", "RedeemReputation");
    assert.equal(eventProposalId, proposalId);
    assert(helpers.fromWei(amount).eq(1));
  });

  it("can redeem ethers", async () => {
    const ethAmount = 0.000000001;
    const proposalResult = await proposeReward({
      ethReward: web3.toWei(ethAmount),
    });

    const proposalId = await proposalResult.getProposalIdFromMinedTx();

    await helpers.vote(votingMachine, proposalId, 1, account1);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // give the avatar some eth to pay out
    await helpers.transferEthToDao(dao, ethAmount);

    const rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiaryAddress: account1,
      proposalId,
    });

    assert.equal(rewards.length, 1);
    assert(rewards[0].ethAvailableToReward.eq(web3.toWei(ethAmount)),
      `${rewards[0].ethAvailableToReward} should equal ${web3.toWei(ethAmount)}`);

    // now try to redeem some native tokens
    const result = await scheme.redeemEther({
      avatar: dao.avatar.address,
      proposalId,
    });

    assert.isOk(result);

    const eventProposalId = await result.getValueFromMinedTx("_proposalId", "RedeemEther");
    const amount = await result.getValueFromMinedTx("_amount", "RedeemEther");
    const beneficiary = await result.getValueFromMinedTx("_beneficiary", "RedeemEther");

    assert.equal(beneficiary, account1);
    assert.equal(eventProposalId, proposalId);
    assert(helpers.fromWei(amount).eq(ethAmount));
  });

  it("can redeem native tokens", async () => {

    const proposalResult = await proposeReward({
      nativeTokenReward: web3.toWei(1),
    });

    const proposalId = await proposalResult.getProposalIdFromMinedTx();

    await helpers.vote(votingMachine, proposalId, 1, account1);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    // now try to redeem some native tokens
    const result = await scheme.redeemNativeToken({
      avatar: dao.avatar.address,
      proposalId,
    });

    assert.isOk(result);

    const eventProposalId = await result.getValueFromMinedTx("_proposalId", "RedeemNativeToken");
    const amount = await result.getValueFromMinedTx("_amount", "RedeemNativeToken");
    assert.equal(eventProposalId, proposalId);
    assert(helpers.fromWei(amount).eq(1));
  });

  it("can redeem external tokens", async () => {

    const externalToken = await dao.token;

    const proposalResult = await proposeReward({
      externalToken: externalToken.address,
      externalTokenReward: web3.toWei(1),
    });

    const proposalId = await proposalResult.getProposalIdFromMinedTx();

    await helpers.vote(votingMachine, proposalId, 1, account1);

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    await helpers.transferTokensToDao(dao, 1, account1, externalToken);

    const rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiaryAddress: account1,
      proposalId,
    });

    assert.equal(rewards.length, 1);
    assert(rewards[0].externalTokensAvailableToReward.eq(web3.toWei("1")),
      `${rewards[0].externalTokensAvailableToReward} should equal ${web3.toWei("1")}`);

    // now try to redeem some native tokens
    const result = await scheme.redeemExternalToken({
      avatar: dao.avatar.address,
      proposalId,
    });

    assert.isOk(result);

    const eventProposalId = await result.getValueFromMinedTx("_proposalId", "RedeemExternalToken");
    const amount = await result.getValueFromMinedTx("_amount", "RedeemExternalToken");
    assert.equal(eventProposalId, proposalId);
    assert(helpers.fromWei(amount).eq(1));
  });

  it("can get proposals", async () => {

    if (network === "Ganache") {

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

      let result = await proposeReward({ nativeTokenReward: web3.toWei(1) });

      const proposalId1 = await result.getProposalIdFromMinedTx();

      result = await proposeReward({ reputationChange: web3.toWei(1) });

      const proposalId2 = await result.getProposalIdFromMinedTx();

      let proposals = await (await scheme.getVotableProposals(dao.avatar.address))({}, { fromBlock: 0 }).get();

      assert.equal(proposals.length, 2, "Should have found 2 votable proposals");
      assert(proposals.filter(
        (p: ContributionProposal) => p.proposalId === proposalId1).length, "proposalId1 not found");
      assert(proposals.filter(
        (p: ContributionProposal) => p.proposalId === proposalId2).length, "proposalId2 not found");

      let proposal = await scheme.getProposal(dao.avatar.address, proposalId2);

      assert(proposal.proposalId === proposalId2, "proposalId2 not found");
      assert.equal(proposal.beneficiaryAddress, account1,
        "beneficiaryAddress not set properly on proposal");

      await helpers.vote(votingMachine, proposalId2, BinaryVoteResult.Yes, account0);
      await helpers.vote(votingMachine, proposalId2, BinaryVoteResult.Yes, account1);

      proposals = await scheme.getExecutedProposals(dao.avatar.address)(
        { _proposalId: proposalId2 }, { fromBlock: 0 }).get();

      assert.equal(proposals.length, 1, "Executed proposal not found");

      proposal = proposals[0];

      assert(proposal.proposalId === proposalId2, "executed proposalId2 not found");

      assert.equal(proposal.beneficiaryAddress, account1,
        "beneficiaryAddress not set properly on proposal");

      const proposalsFromGet = await scheme.ProposalExecuted({ _avatar: dao.avatar.address }, { fromBlock: 0 }).get();

      // make sure the direct return value of 'get' works
      assert.equal(proposals.length,
        proposalsFromGet.length,
        "direct and indirect calls returned different array lengths");
    }
  });

  it("can get beneficiaryAddress's outstanding rewards", async () => {

    await setupDao();

    let result = await proposeReward({ nativeTokenReward: web3.toWei(1) });

    const nativeRewardProposalId = await result.getProposalIdFromMinedTx();

    result = await proposeReward({ reputationChange: web3.toWei(1) });

    const reputationChangeProposalId = await result.getProposalIdFromMinedTx();

    const proposals = await (await scheme.getVotableProposals(dao.avatar.address))({}, { fromBlock: 0 }).get();

    assert.equal(proposals.length, 2, "Should have found 2 votable proposals");
    assert(proposals.filter((p: ContributionProposal) => p.proposalId === nativeRewardProposalId).length,
      "nativeRewardProposalId not found");
    assert(proposals.filter((p: ContributionProposal) => p.proposalId === reputationChangeProposalId).length,
      "reputationChangeProposalId not found");

    await helpers.vote(votingMachine, nativeRewardProposalId, BinaryVoteResult.Yes, account1);
    await helpers.vote(votingMachine, reputationChangeProposalId, BinaryVoteResult.Yes, account1);

    let rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiaryAddress: account1,
    });

    assert.equal(rewards.length, 2, "Should have found 2 sets of proposal rewards");

    let rewards1 = rewards.filter((p: ProposalRewards) => p.proposalId === nativeRewardProposalId);
    assert(rewards1.length, "nativeReward not found");

    let rewards2 = rewards.filter((p: ProposalRewards) => p.proposalId === reputationChangeProposalId);
    assert(rewards2.length, "reputationChange not found");

    assert.equal(helpers.fromWei(rewards1[0].nativeTokenRewardUnredeemed).toNumber(),
      1, "incorrect remaining nativeToken amount");
    assert.equal(rewards1[0].nativeTokenRewardUnredeemed.toNumber(),
      proposals[0].nativeTokenReward.toNumber(), "undereemed should equal total to be redeemed");
    assert.equal(helpers.fromWei(rewards2[0].reputationChangeUnredeemed).toNumber(),
      1, "incorrect remaining reputationChange amount");

    assert.equal(proposals[0].nativeTokenReward.toNumber(),
      rewards1[0].nativeTokenReward.toNumber(), "total redeemable should equal total redeemable");

    rewards = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiaryAddress: account1,
    });

    /**
     * redeem something
     */
    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    const nativeTokenRewardsAfterVote = await scheme.getBeneficiaryRewards({
      avatar: dao.avatar.address,
      beneficiaryAddress: account1,
      proposalId: nativeRewardProposalId,
    });

    assert.equal(helpers.fromWei(nativeTokenRewardsAfterVote[0].nativeTokenRewardRedeemable).toNumber(),
      1, "native tokens should be redeemable");

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
      beneficiaryAddress: account1,
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
      1, "incorrect remaining reputationChange amount");
  });
});
