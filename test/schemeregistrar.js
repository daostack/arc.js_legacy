import { NULL_HASH, getValueFromLogs } from "../lib/utils";
import { forgeDao, contractsForTest } from "./helpers";

describe("SchemeRegistrar", () => {
  it("proposeToAddModifyScheme javascript wrapper should add new scheme", async () => {
    const dao = await forgeDao();
    const contracts = await contractsForTest();

    const schemeRegistrar = await dao.scheme("SchemeRegistrar");
    const ContributionReward = await dao.schemes("ContributionReward");
    assert.equal(ContributionReward.length, 0, "scheme is already present");

    const contributionRewardAddress =
      contracts.allContracts.ContributionReward.address;

    assert.isFalse(
      await dao.controller.isSchemeRegistered(contributionRewardAddress, dao.avatar.address),
      "scheme is registered into the controller"
    );

    const tx = await schemeRegistrar.proposeToAddModifyScheme({
      avatar: dao.avatar.address,
      scheme: contributionRewardAddress,
      schemeName: "ContributionReward",
      schemeParametersHash: NULL_HASH
    });

    const proposalId = getValueFromLogs(tx, "_proposalId");

    dao.vote(proposalId, 1, { from: accounts[2] });

    assert.isTrue(
      await dao.controller.isSchemeRegistered(contributionRewardAddress, dao.avatar.address),
      "scheme is not registered into the controller"
    );
  });

  it("proposeToAddModifyScheme javascript wrapper should modify existing scheme", async () => {
    const dao = await forgeDao();

    const schemeRegistrar = await dao.scheme("SchemeRegistrar");
    const upgradeScheme = await dao.schemes("SchemeRegistrar");
    assert.equal(upgradeScheme.length, 1, "scheme is not present");

    const modifiedSchemeAddress = upgradeScheme[0].address;

    const tx = await schemeRegistrar.proposeToAddModifyScheme({
      avatar: dao.avatar.address,
      scheme: modifiedSchemeAddress,
      schemeName: "SchemeRegistrar",
      schemeParametersHash: NULL_HASH
    });

    const proposalId = getValueFromLogs(tx, "_proposalId");

    dao.vote(proposalId, 1, { from: accounts[2] });

    assert.isTrue(
      await dao.controller.isSchemeRegistered(modifiedSchemeAddress, dao.avatar.address),
      "scheme is not registered into the controller"
    );

    const paramsHash = await dao.controller.getSchemeParameters(modifiedSchemeAddress, dao.avatar.address);

    assert.equal(paramsHash, NULL_HASH, "parameters hash is not correct");
  });

  it("proposeToRemoveScheme javascript wrapper should remove scheme", async () => {
    const dao = await forgeDao();

    const schemeRegistrar = await dao.scheme("SchemeRegistrar");
    const removedScheme = schemeRegistrar;

    const tx = await schemeRegistrar.proposeToRemoveScheme({
      avatar: dao.avatar.address,
      scheme: removedScheme.address
    });

    const proposalId = getValueFromLogs(tx, "_proposalId");

    dao.vote(proposalId, 1, { from: accounts[2] });

    assert.isFalse(
      await dao.controller.isSchemeRegistered(removedScheme.address, dao.avatar.address),
      "scheme is still registered into the controller"
    );
  });
});
