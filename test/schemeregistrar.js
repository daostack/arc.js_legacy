import { Utils } from "../test-dist/utils";
import * as helpers from "./helpers";
import { SchemeRegistrar } from "../test-dist/contracts/schemeregistrar";

describe("SchemeRegistrar", () => {
  it("proposeToAddModifyScheme javascript wrapper should add new scheme", async () => {
    const dao = await helpers.forgeDao();
    const contracts = await helpers.contractsForTest();

    const schemeRegistrar = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrar);
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

    const votingMachine = await helpers.getSchemeVotingMachine(dao, schemeRegistrar);
    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    assert.isTrue(
      await dao.isSchemeRegistered(contributionRewardAddress, dao.avatar.address),
      "scheme is not registered into the controller"
    );
  });

  it("proposeToAddModifyScheme javascript wrapper should modify existing scheme", async () => {
    const dao = await helpers.forgeDao();

    const schemeRegistrar = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrar);
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

    const votingMachine = await helpers.getSchemeVotingMachine(dao, schemeRegistrar);
    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    assert.isTrue(
      await dao.isSchemeRegistered(modifiedSchemeAddress),
      "scheme is not registered into the controller"
    );

    const paramsHash = await dao.controller.getSchemeParameters(modifiedSchemeAddress, dao.avatar.address);

    assert.equal(paramsHash, Utils.NULL_HASH, "parameters hash is not correct");
  });

  it("proposeToRemoveScheme javascript wrapper should remove scheme", async () => {
    const dao = await helpers.forgeDao();

    const schemeRegistrar = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrar);
    // schemeRegistrar can't remove a scheme with greater permissions that it has
    const removedScheme = schemeRegistrar;

    const result = await schemeRegistrar.proposeToRemoveScheme({
      avatar: dao.avatar.address,
      scheme: removedScheme.address
    });

    const proposalId = result.proposalId;

    const votingMachine = await helpers.getSchemeVotingMachine(dao, schemeRegistrar);
    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    assert.isFalse(
      await dao.isSchemeRegistered(removedScheme.address),
      "scheme is still registered into the controller"
    );
  });
});
