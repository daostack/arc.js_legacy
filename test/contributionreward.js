import * as helpers from "./helpers";
import { ContributionReward } from "../lib/contracts/contributionreward";

describe("ContributionReward scheme", () => {

  it("can propose, vote and redeem", async () => {

    const dao = await helpers.forgeDao({
      schemes: [
        { name: "ContributionReward" }
        , { name: "GenesisProtocol" }
      ]
    });

    const scheme = await helpers.getDaoScheme(dao, "ContributionReward", ContributionReward);

    let result = await scheme.proposeContributionReward({
      avatar: dao.avatar.address,
      description: "A new contribution",
      beneficiary: accounts[1],
      nativeTokenReward: web3.toWei(10),
      periodLength: 1,
      numberOfPeriods: 1
    });

    const proposalId = result.proposalId;

    const votingMachine = await helpers.getSchemeVotingMachine(dao, scheme, 2);

    // now helpers.vote with a majority account and accept this contribution
    await helpers.vote(votingMachine, proposalId, 1, accounts[0]);

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
});
