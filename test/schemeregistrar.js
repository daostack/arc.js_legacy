import { NULL_HASH, getValueFromLogs } from "../lib/utils";
import { forgeOrganization, contractsForTest } from "./helpers";

describe("SchemeRegistrar", () => {
  it("proposeToAddModifyScheme javascript wrapper should add new scheme", async () => {
    const org = await forgeOrganization();
    const contracts = await contractsForTest();

    const schemeRegistrar = await org.scheme("SchemeRegistrar");
    const ContributionReward = await org.schemes("ContributionReward");
    assert.equal(ContributionReward.length, 0, "scheme is already present");

    const contributionRewardAddress =
      contracts.allContracts.ContributionReward.address;

    assert.isFalse(
      await org.controller.isSchemeRegistered(contributionRewardAddress, org.avatar.address),
      "scheme is registered into the controller"
    );

    const tx = await schemeRegistrar.proposeToAddModifyScheme({
      avatar: org.avatar.address,
      scheme: contributionRewardAddress,
      schemeName: "ContributionReward",
      schemeParametersHash: NULL_HASH
    });

    const proposalId = getValueFromLogs(tx, "_proposalId");

    org.vote(proposalId, 1, { from: accounts[2] });

    assert.isTrue(
      await org.controller.isSchemeRegistered(contributionRewardAddress, org.avatar.address),
      "scheme is not registered into the controller"
    );
  });

  it("proposeToAddModifyScheme javascript wrapper should modify existing scheme", async () => {
    const org = await forgeOrganization();

    const schemeRegistrar = await org.scheme("SchemeRegistrar");
    const upgradeScheme = await org.schemes("SchemeRegistrar");
    assert.equal(upgradeScheme.length, 1, "scheme is not present");

    const modifiedSchemeAddress = upgradeScheme[0].address;

    const tx = await schemeRegistrar.proposeToAddModifyScheme({
      avatar: org.avatar.address,
      scheme: modifiedSchemeAddress,
      schemeName: "SchemeRegistrar",
      schemeParametersHash: NULL_HASH
    });

    const proposalId = getValueFromLogs(tx, "_proposalId");

    org.vote(proposalId, 1, { from: accounts[2] });

    assert.isTrue(
      await org.controller.isSchemeRegistered(modifiedSchemeAddress, org.avatar.address),
      "scheme is not registered into the controller"
    );

    const paramsHash = await org.controller.getSchemeParameters(modifiedSchemeAddress, org.avatar.address);

    assert.equal(paramsHash, NULL_HASH, "parameters hash is not correct");
  });

  it("proposeToRemoveScheme javascript wrapper should remove scheme", async () => {
    const org = await forgeOrganization();

    const schemeRegistrar = await org.scheme("SchemeRegistrar");
    const removedScheme = schemeRegistrar;

    const tx = await schemeRegistrar.proposeToRemoveScheme({
      avatar: org.avatar.address,
      scheme: removedScheme.address
    });

    const proposalId = getValueFromLogs(tx, "_proposalId");

    org.vote(proposalId, 1, { from: accounts[2] });

    assert.isFalse(
      await org.controller.isSchemeRegistered(removedScheme.address, org.avatar.address),
      "scheme is still registered into the controller"
    );
  });
});
