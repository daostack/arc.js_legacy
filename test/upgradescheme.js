import { Utils } from "../test-dist/utils";
import { UpgradeScheme } from "../test-dist/wrappers/upgradescheme";
import * as helpers from "./helpers";

describe("UpgradeScheme", () => {
  let avatar;
  let Controller;
  let DAOToken;
  let Avatar;
  let Reputation;

  beforeEach(async () => {

    Controller = await Utils.requireContract("Controller");
    DAOToken = await Utils.requireContract("DAOToken");
    Avatar = await Utils.requireContract("Avatar");
    Reputation = await Utils.requireContract("Reputation");

    const token = await DAOToken.new("TEST", "TST", 0);
    // set up a reputation system
    const reputation = await Reputation.new();
    avatar = await Avatar.new("name", token.address, reputation.address);
  });

  it("proposeController javascript wrapper should change controller", async () => {
    const dao = await helpers.forgeDao();

    const upgradeScheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeScheme);
    const newController = await Controller.new(avatar.address);

    assert.equal(
      await dao.controller.newControllers(dao.avatar.address),
      helpers.NULL_ADDRESS,
      "there is already a new controller"
    );

    const result = await upgradeScheme.proposeController({
      avatar: dao.avatar.address,
      controller: newController.address
    });

    // newUpgradeScheme.registerDao(dao.avatar.address);

    const proposalId = result.proposalId;

    const votingMachine = await helpers.getSchemeVotingMachine(dao, upgradeScheme);
    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // now the ugprade should have been executed
    assert.equal(await dao.controller.newControllers(dao.avatar.address), newController.address);

    // avatar, token and reputation ownership shold have been transferred to the new controller
    assert.equal(await dao.token.owner(), newController.address);
    assert.equal(await dao.reputation.owner(), newController.address);
    assert.equal(await dao.avatar.owner(), newController.address);
  });

  it("controller upgrade should work as expected", async () => {

    const dao = await helpers.forgeDao();

    const upgradeScheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeScheme);

    // the dao has not been upgraded yet, so newController is the NULL address
    assert.equal(await dao.controller.newControllers(dao.avatar.address), helpers.NULL_ADDRESS);

    // we create a new controller to which to upgrade
    const newController = await Controller.new(avatar.address);

    const result = await upgradeScheme.proposeController({
      avatar: dao.avatar.address,
      controller: newController.address
    }
    );

    const proposalId = result.proposalId;
    // now vote with the majority for the proposal
    const votingMachine = await helpers.getSchemeVotingMachine(dao, upgradeScheme);
    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // now the ugprade should have been executed
    assert.equal(
      await dao.controller.newControllers(dao.avatar.address),
      newController.address
    );

    // avatar, token and reputation ownership shold have been transferred to the new controller
    assert.equal(await dao.token.owner(), newController.address);
    assert.equal(await dao.reputation.owner(), newController.address);
    assert.equal(await dao.avatar.owner(), newController.address);

    // TODO: we also want to reflect this upgrade in our Controller object!
  });

  it("proposeUpgradingScheme javascript wrapper should change upgrade scheme", async () => {
    const dao = await helpers.forgeDao();

    const upgradeScheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeScheme);

    const newUpgradeScheme = await UpgradeScheme.new();

    assert.isFalse(
      await dao.isSchemeRegistered(newUpgradeScheme.address),
      "new scheme is already registered into the controller"
    );
    assert.isTrue(
      await dao.isSchemeRegistered(upgradeScheme.address),
      "original scheme is not registered into the controller"
    );

    const result = await upgradeScheme.proposeUpgradingScheme({
      avatar: dao.avatar.address,
      scheme: newUpgradeScheme.address,
      schemeParametersHash: await dao.controller.getSchemeParameters(upgradeScheme.address, dao.avatar.address)
    });

    const proposalId = result.proposalId;

    const votingMachine = await helpers.getSchemeVotingMachine(dao, upgradeScheme);
    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    assert.isTrue(
      await dao.isSchemeRegistered(newUpgradeScheme.address),
      "new scheme is not registered into the controller"
    );
  });

  it("proposeUpgradingScheme javascript wrapper should modify the modifying scheme", async () => {
    const dao = await helpers.forgeDao();

    const upgradeScheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeScheme);

    assert.isTrue(
      await dao.isSchemeRegistered(upgradeScheme.address),
      "upgrade scheme is not registered into the controller"
    );

    const result = await upgradeScheme.proposeUpgradingScheme({
      avatar: dao.avatar.address,
      scheme: upgradeScheme.address,
      schemeParametersHash: helpers.SOME_HASH
    });

    const proposalId = result.proposalId;

    const votingMachine = await helpers.getSchemeVotingMachine(dao, upgradeScheme);
    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    assert.isTrue(
      await dao.isSchemeRegistered(upgradeScheme.address),
      "upgrade scheme is no longer registered into the controller"
    );

    assert.equal(
      await dao.controller.getSchemeParameters(upgradeScheme.address, dao.avatar.address),
      helpers.SOME_HASH,
      "parameters were not updated"
    );
  });
});
