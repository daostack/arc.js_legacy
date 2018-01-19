import { Organization } from "../lib/organization.js";
import * as helpers from "./helpers";
import { proposeContributionReward } from "./contributionreward.js";
import { getValueFromLogs } from "../lib/utils.js";

describe("Organization", () => {
  let organization;

  it("can be created with 'new' using default settings", async () => {
    organization = await Organization.new({
      orgName: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT"
    });
    // an organization has an avatar
    assert.ok(organization.avatar, "Organization must have an avatar defined");
  });

  it("can be instantiated with 'at' if it was already deployed", async () => {
    // first create an organization
    const org1 = await Organization.new({
      orgName: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT"
    });
    // then instantiate it with .at
    const org2 = await Organization.at(org1.avatar.address);

    // check if the two orgs are indeed the same
    assert.equal(org1.avatar.address, org2.avatar.address);
    assert.equal(org1.orgName, org2.orgName);
    assert.equal(org1.orgToken, org2.orgToken);
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

  it("has a working schemes() function to access its schemes", async () => {
    organization = await helpers.forgeOrganization();
    const contracts = await helpers.contractsForTest();
    // a new organization comes with three known schemes
    assert.equal((await organization.schemes()).length, 3);
    let scheme = await organization.scheme("GlobalConstraintRegistrar");
    assert.equal(
      scheme.address,
      contracts.allContracts.GlobalConstraintRegistrar.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    scheme = await organization.scheme("SchemeRegistrar");
    assert.equal(
      scheme.address,
      contracts.allContracts.SchemeRegistrar.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    scheme = await organization.scheme("UpgradeScheme");
    assert.equal(
      scheme.address,
      contracts.allContracts.UpgradeScheme.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");

    // now we add another known scheme
    await proposeContributionReward(organization);

    assert.equal((await organization.schemes()).length, 4);
  });

  it("has a working globalConstraints() function to access its constraints", async () => {
    const org = await helpers.forgeOrganization();

    assert.equal((await org.globalConstraints()).length, 0);
    assert.equal((await org.controller.globalConstraintsCount(org.avatar.address)).toNumber(), 0);

    const tokenCapGC = await org.scheme("TokenCapGC");

    const globalConstraintParametersHash = await tokenCapGC.getParametersHash(
      org.token.address,
      3141
    );
    await tokenCapGC.setParameters(org.token.address, 3141);

    const votingMachineHash = await org.votingMachine.getParametersHash(
      org.reputation.address,
      50,
      true
    );

    await org.votingMachine.setParameters(
      org.reputation.address,
      50,
      true
    );

    const globalConstraintRegistrar = await org.scheme("GlobalConstraintRegistrar");

    let tx = await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: org.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash: globalConstraintParametersHash,
      votingMachineHash: votingMachineHash
    }
    );

    let proposalId = getValueFromLogs(tx, "_proposalId");
    // several users now cast their vote
    await org.vote(proposalId, 1, { from: web3.eth.accounts[0] });
    // next is decisive vote: the proposal will be executed
    await org.vote(proposalId, 1, { from: web3.eth.accounts[2] });

    const gcs = await org.globalConstraints();
    assert.equal(gcs.length, 1);
    assert.equal(gcs[0].address, tokenCapGC.address);
    assert.equal((await org.controller.globalConstraintsCount(org.avatar.address)).toNumber(), 1);

    tx = await globalConstraintRegistrar.proposeToRemoveGlobalConstraint({
      avatar: org.avatar.address,
      globalConstraint: tokenCapGC.address
    }
    );

    proposalId = getValueFromLogs(tx, "_proposalId");
    // several users now cast their vote
    await org.vote(proposalId, 1, { from: web3.eth.accounts[0] });
    // next is decisive vote: the proposal will be executed
    await org.vote(proposalId, 1, { from: web3.eth.accounts[2] });

    assert.equal((await org.globalConstraints()).length, 0);
    assert.equal((await org.controller.globalConstraintsCount(org.avatar.address)).toNumber(), 0);
  });
});
