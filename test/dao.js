import { DAO } from "../lib/dao.js";
import * as helpers from "./helpers";
import { proposeContributionReward } from "./contributionreward.js";
import { getValueFromLogs } from "../lib/utils.js";

describe("DAO", () => {
  let dao;

  it("can be created with 'new' using default settings", async () => {
    dao = await DAO.new({
      orgName: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT"
    });
    // an dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
  });

  it("can be instantiated with 'at' if it was already deployed", async () => {
    // first create an dao
    const org1 = await DAO.new({
      orgName: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT"
    });
    // then instantiate it with .at
    const org2 = await DAO.at(org1.avatar.address);

    // check if the two orgs are indeed the same
    assert.equal(org1.avatar.address, org2.avatar.address);
    assert.equal(await org1.getName(), await org2.getName());
    assert.equal(await org1.getTokenName(), await org2.getTokenName());
    const schemeRegistrar1 = await org1.scheme("SchemeRegistrar");
    const schemeRegistrar2 = await org2.scheme("SchemeRegistrar");
    assert.equal(schemeRegistrar1.address, schemeRegistrar2.address);
    const upgradeScheme1 = await org1.scheme("UpgradeScheme");
    const upgradeScheme2 = await org2.scheme("UpgradeScheme");
    assert.equal(upgradeScheme1.address, upgradeScheme2.address);
    const globalConstraintRegistrar1 = await org1.scheme(
      "GlobalConstraintRegistrar"
    );
    const globalConstraintRegistrar2 = await org2.scheme(
      "GlobalConstraintRegistrar"
    );
    assert.equal(
      globalConstraintRegistrar1.address,
      globalConstraintRegistrar2.address
    );
  });

  it("has a working getSchemes() function to access its schemes", async () => {
    dao = await helpers.forgeDao();
    const contracts = await helpers.contractsForTest();
    // a new dao comes with three known schemes
    assert.equal((await dao.getSchemes()).length, 3);
    let scheme = await dao.scheme("GlobalConstraintRegistrar");
    assert.equal(
      scheme.address,
      contracts.allContracts.GlobalConstraintRegistrar.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    scheme = await dao.scheme("SchemeRegistrar");
    assert.equal(
      scheme.address,
      contracts.allContracts.SchemeRegistrar.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    scheme = await dao.scheme("UpgradeScheme");
    assert.equal(
      scheme.address,
      contracts.allContracts.UpgradeScheme.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");

    // now we add another known scheme
    await proposeContributionReward(dao);

    assert.equal((await dao.getSchemes()).length, 4);
  });

  it("has a working getGlobalConstraints() function to access its constraints", async () => {
    const dao = await helpers.forgeDao();

    assert.equal((await dao.getGlobalConstraints()).length, 0);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address)).toNumber(), 0);

    const tokenCapGC = await dao.scheme("TokenCapGC");

    const globalConstraintParametersHash = await tokenCapGC.getParametersHash(
      dao.token.address,
      3141
    );
    await tokenCapGC.setParameters(dao.token.address, 3141);

    const votingMachineHash = await dao.votingMachine.getParametersHash(
      dao.reputation.address,
      50,
      true
    );

    await dao.votingMachine.setParameters(
      dao.reputation.address,
      50,
      true
    );

    const globalConstraintRegistrar = await dao.scheme("GlobalConstraintRegistrar");

    let tx = await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash: globalConstraintParametersHash,
      votingMachineHash: votingMachineHash
    }
    );

    let proposalId = getValueFromLogs(tx, "_proposalId");
    // several users now cast their vote
    await dao.vote(proposalId, 1, { from: web3.eth.accounts[0] });
    // next is decisive vote: the proposal will be executed
    await dao.vote(proposalId, 1, { from: web3.eth.accounts[2] });

    const gcs = await dao.getGlobalConstraints();
    assert.equal(gcs.length, 1);
    assert.equal(gcs[0].address, tokenCapGC.address);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address)).toNumber(), 1);

    tx = await globalConstraintRegistrar.proposeToRemoveGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address
    }
    );

    proposalId = getValueFromLogs(tx, "_proposalId");
    // several users now cast their vote
    await dao.vote(proposalId, 1, { from: web3.eth.accounts[0] });
    // next is decisive vote: the proposal will be executed
    await dao.vote(proposalId, 1, { from: web3.eth.accounts[2] });

    assert.equal((await dao.getGlobalConstraints()).length, 0);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address)).toNumber(), 0);
  });
});
