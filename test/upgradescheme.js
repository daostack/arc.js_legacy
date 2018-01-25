import { Utils } from "../lib/utils";
import { vote } from "./helpers.js";
const Controller = Utils.requireContract("Controller");
const AbsoluteVote = Utils.requireContract("AbsoluteVote");
const DAOToken = Utils.requireContract("DAOToken");
const Avatar = Utils.requireContract("Avatar");
const Reputation = Utils.requireContract("Reputation");
const UpgradeScheme = Utils.requireContract("UpgradeScheme");
import {
  forgeDao,
  contractsForTest,
  SOME_HASH,
  NULL_ADDRESS
} from "./helpers";

describe("UpgradeScheme", () => {
  let avatar;

  beforeEach(async () => {
    // let accounts = web3.eth.accounts;
    const token = await DAOToken.new("TEST", "TST");
    // set up a reputaiton system
    const reputation = await Reputation.new();
    avatar = await Avatar.new("name", token.address, reputation.address);
  });

  it("proposeController javascript wrapper should change controller", async () => {
    const dao = await forgeDao();

    const upgradeScheme = await dao.getScheme("UpgradeScheme");
    const newController = await Controller.new(avatar.address);

    assert.equal(
      await dao.controller.newController(),
      NULL_ADDRESS,
      "there is already a new controller"
    );

    const tx = await upgradeScheme.proposeController({
      avatar: dao.avatar.address,
      controller: newController.address
    });

    // newUpgradeScheme.registerDao(dao.avatar.address);

    const proposalId = Utils.getValueFromLogs(tx, "_proposalId");

    vote(dao, proposalId, 1, { from: accounts[2] });

    // now the ugprade should have been executed
    assert.equal(await dao.controller.newController(), newController.address);

    // avatar, token and reputation ownership shold have been transferred to the new controller
    assert.equal(await dao.token.owner(), newController.address);
    assert.equal(await dao.reputation.owner(), newController.address);
    assert.equal(await dao.avatar.owner(), newController.address);
  });

  it("controller upgrade should work as expected", async () => {

    const dao = await forgeDao();

    const upgradeScheme = await dao.getScheme("UpgradeScheme");
    const contracts = await contractsForTest();
    const votingMachine = await AbsoluteVote.at(contracts.defaultVotingMachine.address);

    // the dao has not bene upgraded yet, so newController is the NULL address
    assert.equal(await dao.controller.newController(), NULL_ADDRESS);

    // we create a new controller to which to upgrade
    const newController = await Controller.new(avatar.address);

    let tx = await upgradeScheme.proposeUpgrade(
      dao.avatar.address,
      newController.address
    );

    const proposalId = Utils.getValueFromLogs(tx, "_proposalId");
    // now vote with the majority for the proposal
    tx = await votingMachine.vote(proposalId, 1, { from: accounts[1] });

    // now the ugprade should have been executed
    assert.equal(
      await dao.controller.newController(),
      newController.address
    );

    // avatar, token and reputation ownership shold have been transferred to the new controller
    assert.equal(await dao.token.owner(), newController.address);
    assert.equal(await dao.reputation.owner(), newController.address);
    assert.equal(await dao.avatar.owner(), newController.address);

    // TODO: we also want to reflect this upgrade in our Controller object!
  });

  it("proposeUpgradingScheme javascript wrapper should change upgrade scheme", async () => {
    const dao = await forgeDao();

    const upgradeScheme = await dao.getScheme("UpgradeScheme");

    const newUpgradeScheme = await UpgradeScheme.new();

    assert.isFalse(
      await dao.isSchemeRegistered(newUpgradeScheme.address),
      "new scheme is already registered into the controller"
    );
    assert.isTrue(
      await dao.isSchemeRegistered(upgradeScheme.address),
      "original scheme is not registered into the controller"
    );

    const tx = await upgradeScheme.proposeUpgradingScheme({
      avatar: dao.avatar.address,
      scheme: newUpgradeScheme.address,
      schemeParametersHash: await dao.controller.getSchemeParameters(upgradeScheme.address, dao.avatar.address)
    });

    // newUpgradeScheme.registerDao(dao.avatar.address);

    const proposalId = Utils.getValueFromLogs(tx, "_proposalId");

    vote(dao, proposalId, 1, { from: accounts[2] });

    assert.isTrue(
      await dao.isSchemeRegistered(newUpgradeScheme.address),
      "new scheme is not registered into the controller"
    );
  });

  it("proposeUpgradingScheme javascript wrapper should modify the modifying scheme", async () => {
    const dao = await forgeDao();

    const upgradeScheme = await dao.getScheme("UpgradeScheme");

    assert.isTrue(
      await dao.isSchemeRegistered(upgradeScheme.address),
      "upgrade scheme is not registered into the controller"
    );

    const tx = await upgradeScheme.proposeUpgradingScheme({
      avatar: dao.avatar.address,
      scheme: upgradeScheme.address,
      schemeParametersHash: SOME_HASH
    });

    // newUpgradeScheme.registerDao(dao.avatar.address);

    const proposalId = Utils.getValueFromLogs(tx, "_proposalId");

    vote(dao, proposalId, 1, { from: accounts[2] });

    assert.isTrue(
      await dao.isSchemeRegistered(upgradeScheme.address),
      "upgrade scheme is no longer registered into the controller"
    );

    assert.equal(
      await dao.controller.getSchemeParameters(upgradeScheme.address, dao.avatar.address),
      SOME_HASH,
      "parameters were not updated"
    );
  });
});
