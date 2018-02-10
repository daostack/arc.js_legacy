import { proposeContributionReward, vote, forgeDao, increaseTime } from "./helpers";
import { Utils } from "../lib/utils";

describe("ContributionReward scheme", () => {

  it("can propose, vote and redeem", async () => {

    /* note this will give accounts[0,1,2] enough tokens to register some schemes */
    const dao = await forgeDao();

    const scheme = await proposeContributionReward(dao);

    let result = await scheme.proposeContributionReward({
      avatar: dao.avatar.address,
      description: "A new contribution",
      beneficiary: accounts[1],
      nativeTokenReward: web3.toWei(10),
      periodLength: 1,
      numberOfPeriods: 1
    });

    const proposalId = result.proposalId;

    // now vote with a majority account and accept this contribution
    await vote(dao, proposalId, 1, { from: accounts[2] });

    // this will mine a block, allowing the award to be redeemed
    await increaseTime(1);

    // now try to redeem some native tokens
    result = await scheme.redeemContributionReward({
      proposalId: proposalId,
      avatar: dao.avatar.address,
      nativeTokens: true
    });

    assert.isOk(result);

    const eventProposalId = Utils.getValueFromLogs(result.tx, "_proposalId", "RedeemNativeToken");
    const amount = Utils.getValueFromLogs(result.tx, "_amount", "RedeemNativeToken");
    assert.equal(eventProposalId, proposalId);
    assert.equal(web3.fromWei(amount), 10);
  });
});
