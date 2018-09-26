"use strict";
import { assert } from "chai";
import { BinaryVoteResult } from "../lib/commonTypes";
import { UtilsInternal } from "../lib/utilsInternal";
import { ContributionRewardFactory, ContributionRewardWrapper } from "../lib/wrappers/contributionReward";
import { GenesisProtocolWrapper } from "../lib/wrappers/genesisProtocol";
import { WrapperService } from "../lib/wrapperService";
import * as helpers from "./helpers";

describe("Redeemer", () => {

  it("can redeem", async () => {

    const dao = await helpers.forgeDao({
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

    const ethAmount = 0.100000001;
    const repAmount = 1;
    const nativeTokenAmount = 0;
    const externalTokenAmount = 3;
    const externalToken = await dao.token;

    const result = await scheme.proposeContributionReward(Object.assign({
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[1],
      description: "A new contribution",
      ethReward: web3.toWei(ethAmount),
      externalToken: externalToken.address,
      externalTokenReward: web3.toWei(externalTokenAmount),
      nativeTokenReward: web3.toWei(nativeTokenAmount),
      numberOfPeriods: 1,
      periodLength: 0,
      reputationChange: web3.toWei(repAmount),
    }));

    const proposalId = await result.getProposalIdFromMinedTx();

    assert.isOk(proposalId);
    assert.isOk(result.votingMachine);

    const gpAddress = await scheme.getVotingMachineAddress(dao.avatar.address);
    const gp = await WrapperService.factories.GenesisProtocol.at(gpAddress);
    await helpers.vote(result.votingMachine, proposalId, BinaryVoteResult.No, accounts[2]);
    await helpers.vote(result.votingMachine, proposalId, BinaryVoteResult.Yes, accounts[3]);

    const stakeAmount = (await gp.getThreshold(proposalId)).add(web3.toWei(10));

    await (await gp.stakeWithApproval({ amount: stakeAmount, vote: 1, proposalId })).getTxMined();

    await helpers.vote(result.votingMachine, proposalId, BinaryVoteResult.Yes, accounts[1]);

    /**
     * expire out of the GP boosting phase. 259200 is the default boosting phase length.
     */
    await helpers.increaseTime(259200);

    // give the avatar some eth to pay out
    await helpers.transferEthToDao(dao, ethAmount);
    await helpers.transferTokensToDao(dao, externalTokenAmount, accounts[1], externalToken);

    const redeemer = WrapperService.wrappers.Redeemer;

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

    assert.equal(web3.fromWei(redeemable.contributionRewardEther).toNumber(), ethAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardNativeToken).toNumber(), nativeTokenAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardExternalToken).toNumber(), externalTokenAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardReputation).toNumber(), repAmount);
    assert(redeemable.stakerTokenAmount.eq(stakeAmount.div(2)), `wrong stakerTokenAmount`);
    assert.equal(web3.fromWei(redeemable.stakerReputationAmount).toNumber(), 1);
    assert(redeemable.daoStakingBountyPotentialReward.eq(stakeAmount.mul(.75)),
      `wrong daoStakingBountyPotentialReward`);
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

    assert.equal(web3.fromWei(redeemable.contributionRewardEther).toNumber(), ethAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardNativeToken).toNumber(), nativeTokenAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardExternalToken).toNumber(), externalTokenAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardReputation).toNumber(), repAmount);
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

    assert.equal(web3.fromWei(redeemable.contributionRewardEther).toNumber(), ethAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardNativeToken).toNumber(), nativeTokenAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardExternalToken).toNumber(), externalTokenAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardReputation).toNumber(), repAmount);
    assert(redeemable.voterTokenAmount.eq(stakeAmount.mul(.25)), `wrong voterTokenAmount`);
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

    assert.equal(web3.fromWei(redeemable.contributionRewardEther).toNumber(), ethAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardNativeToken).toNumber(), nativeTokenAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardExternalToken).toNumber(), externalTokenAmount);
    assert.equal(web3.fromWei(redeemable.contributionRewardReputation).toNumber(), repAmount);
    assert(redeemable.voterTokenAmount.eq(stakeAmount.mul(.25)), `wrong voterTokenAmount`);
    assert.equal(web3.fromWei(redeemable.voterReputationAmount).toNumber(), 7);

    const latestBlock = await UtilsInternal.lastBlock();

    const redeemed = (await redeemer.redeem({
      avatarAddress: dao.avatar.address,
      beneficiaryAddress: accounts[0],
      proposalId,
    })).getTxMined();

    assert(redeemed);

    const fetcher = gp.Redeem(
      { _beneficiary: accounts[0], _proposalId: proposalId, _avatar: dao.avatar.address },
      { fromBlock: latestBlock });

    const events = await fetcher.get();

    assert.equal(events.length, 1);
    assert(events[0].args._amount.eq(stakeAmount.mul(.5)), `wrong gp _beneficiary redeemed tokens`);
  });
});
