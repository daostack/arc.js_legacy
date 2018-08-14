"use strict";
import { assert } from "chai";
import { BinaryVoteResult, WrapperService, GenesisProtocolWrapper } from "../lib";
import { ContributionRewardFactory, ContributionRewardWrapper } from "../lib/wrappers/contributionReward";
import * as helpers from "./helpers";

describe("Redeemer", () => {

  it("can redeem", async () => {

    const dao = await helpers.forgeDao({
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

    const ethAmount = 0.000000001;
    const repAmount = 1;
    // const nativeTokenAmount = 2;
    const externalTokenAmount = 3;
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
      periodLength: 0,
      reputationChange: web3.toWei(repAmount),
    }));

    const proposalId = await result.getProposalIdFromMinedTx();

    assert.isOk(proposalId);
    assert.isOk(result.votingMachine);

    const gp = (await dao.getSchemes("GenesisProtocol"))[0].wrapper as GenesisProtocolWrapper;
    await (await gp.stakeWithApproval({ amount: web3.toWei(10), vote: 1, proposalId })).getTxMined();

    await helpers.vote(result.votingMachine, proposalId, BinaryVoteResult.Yes, accounts[1]);

    await helpers.increaseTime(10);

    // give the avatar some eth to pay out
    await helpers.transferEthToDao(dao, ethAmount);
    await helpers.transferTokensToDao(dao, externalTokenAmount, accounts[1], externalToken);

    const redeemer = WrapperService.wrappers.Redeemer;

    const redeemable = (await redeemer.redeemables(
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
    assert.equal(web3.fromWei(redeemable.voterReputationAmount).toNumber(), 10);
    assert.equal(web3.fromWei(redeemable.daoBountyPotentialReward).toNumber(), 7.5);

    const redeemed = (await redeemer.redeem({
      avatarAddress: dao.avatar.address,
      beneficiaryAddress: accounts[1],
      proposalId,
    })).getTxMined();

    assert(redeemed);
  });
});
