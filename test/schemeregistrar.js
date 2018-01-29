import { Utils } from "../lib/utils";
import { vote, forgeDao, contractsForTest } from "./helpers";

describe("SchemeRegistrar", () => {
  it("proposeToAddModifyScheme javascript wrapper should add new scheme", async () => {
    const dao = await forgeDao();
    const contracts = await contractsForTest();

    const schemeRegistrar = await dao.getScheme("SchemeRegistrar");
    const ContributionReward = await dao.getSchemes("ContributionReward");
    assert.equal(ContributionReward.length, 0, "scheme is already present");

    const contributionRewardAddress =
      contracts.allContracts.ContributionReward.address;

    assert.isFalse(
      await dao.isSchemeRegistered(contributionRewardAddress),
      "scheme is registered into the controller"
    );

    const result = await schemeRegistrar.proposeToAddModifyScheme({
      avatar: dao.avatar.address,
      scheme: contributionRewardAddress,
      schemeName: "ContributionReward",
      schemeParametersHash: Utils.NULL_HASH
    });

    const proposalId = result.proposalId;

    vote(dao, proposalId, 1, { from: accounts[2] });

    assert.isTrue(
      await dao.isSchemeRegistered(contributionRewardAddress, dao.avatar.address),
      "scheme is not registered into the controller"
    );
  });

  it("proposeToAddModifyScheme javascript wrapper should modify existing scheme", async () => {
    const dao = await forgeDao();

    const schemeRegistrar = await dao.getScheme("SchemeRegistrar");
    const upgradeScheme = await dao.getSchemes("SchemeRegistrar");
    assert.equal(upgradeScheme.length, 1, "scheme is not present");

    const modifiedSchemeAddress = upgradeScheme[0].address;

    const result = await schemeRegistrar.proposeToAddModifyScheme({
      avatar: dao.avatar.address,
      scheme: modifiedSchemeAddress,
      schemeName: "SchemeRegistrar",
      schemeParametersHash: Utils.NULL_HASH
    });

    const proposalId = result.proposalId;

    vote(dao, proposalId, 1, { from: accounts[2] });

    assert.isTrue(
      await dao.isSchemeRegistered(modifiedSchemeAddress),
      "scheme is not registered into the controller"
    );

    const paramsHash = await dao.controller.getSchemeParameters(modifiedSchemeAddress, dao.avatar.address);

    assert.equal(paramsHash, Utils.NULL_HASH, "parameters hash is not correct");
  });

  it("proposeToRemoveScheme javascript wrapper should remove scheme", async () => {
    const dao = await forgeDao();

    const schemeRegistrar = await dao.getScheme("SchemeRegistrar");
    const removedScheme = schemeRegistrar;

    const result = await schemeRegistrar.proposeToRemoveScheme({
      avatar: dao.avatar.address,
      scheme: removedScheme.address
    });

    const proposalId = result.proposalId;

    vote(dao, proposalId, 1, { from: accounts[2] });

    assert.isFalse(
      await dao.isSchemeRegistered(removedScheme.address),
      "scheme is still registered into the controller"
    );
  });
});
