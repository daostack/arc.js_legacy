import { DAO } from "../test-dist/dao";
import * as helpers from "./helpers";
import { GlobalConstraintRegistrar, GlobalConstraintRegistrarWrapper } from "../test-dist/wrappers/globalconstraintregistrar";
import { UpgradeScheme, UpgradeSchemeWrapper } from "../test-dist/wrappers/upgradescheme";
import { SchemeRegistrar, SchemeRegistrarWrapper } from "../test-dist/wrappers/schemeregistrar";
import { SchemePermissions } from "../test-dist/commonTypes";
import { WrapperService } from "../test-dist/wrapperService";

describe("DAO", () => {
  let dao;

  it("default config for counting the number of transactions", async () => {
    dao = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT",
      founders: [
        {
          address: accounts[0],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40)
        }
      ],
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
        { name: "GlobalConstraintRegistrar" }
      ]
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    const scheme = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrar);
    assert.equal(scheme.getDefaultPermissions(), SchemePermissions.fromString(await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address)));
  });

  it("can create with non-universal controller", async () => {
    dao = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT",
      universalController: false
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    assert.equal(dao.hasUController, false);
  });

  it("can be created with 'new' using default settings", async () => {
    dao = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT"
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    assert.equal(dao.hasUController, true);
  });

  it("can be instantiated with 'at' if it was already deployed", async () => {
    // first create the dao
    const org1 = await helpers.forgeDao();
    // then instantiate it with .at
    const org2 = await DAO.at(org1.avatar.address);

    // check if the two orgs are indeed the same
    assert.equal(org1.avatar.address, org2.avatar.address);
    assert.equal(await org1.getName(), await org2.getName());
    assert.equal(await org1.getTokenName(), await org2.getTokenName());
    const schemeRegistrar1 = await helpers.getDaoScheme(org1, "SchemeRegistrar", SchemeRegistrar);
    const schemeRegistrar2 = await helpers.getDaoScheme(org2, "SchemeRegistrar", SchemeRegistrar);
    assert.equal(schemeRegistrar1.address, schemeRegistrar2.address);
    const upgradeScheme1 = await helpers.getDaoScheme(org1, "UpgradeScheme", UpgradeScheme);
    const upgradeScheme2 = await helpers.getDaoScheme(org2, "UpgradeScheme", UpgradeScheme);
    assert.equal(upgradeScheme1.address, upgradeScheme2.address);
    const globalConstraintRegistrar1 = await helpers.getDaoScheme(org1, "GlobalConstraintRegistrar", GlobalConstraintRegistrar);
    const globalConstraintRegistrar2 = await helpers.getDaoScheme(org2, "GlobalConstraintRegistrar", GlobalConstraintRegistrar);
    assert.equal(
      globalConstraintRegistrar1.address,
      globalConstraintRegistrar2.address
    );
  });

  it("can be created with founders", async () => {
    dao = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT",
      founders: [
        {
          address: accounts[0],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40)
        },
        {
          address: accounts[1],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40)
        },
        {
          address: accounts[2],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40)
        }
      ]
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
  });

  it("can be created with schemes and default votingMachineParams", async () => {
    dao = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT",
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
        { name: "GlobalConstraintRegistrar" }
      ]
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    const scheme = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrar);
    assert.equal(scheme.getDefaultPermissions(), SchemePermissions.fromString(await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address)));
  });

  it("can be created with schemes and global votingMachineParams", async () => {
    dao = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT",
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
        { name: "GlobalConstraintRegistrar" }
      ],
      votingMachineParams: {
        votePerc: 45,
        ownerVote: true
      }
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    const scheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeScheme);
    assert.equal(scheme.getDefaultPermissions(), SchemePermissions.fromString(await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address)));

    const votingMachineParamsHash = await helpers.getSchemeVotingMachineParametersHash(dao, scheme);
    const votingMachine = await helpers.getSchemeVotingMachine(dao, scheme);
    const votingMachineParams = await helpers.getVotingMachineParameters(votingMachine, votingMachineParamsHash);
    assert.equal(votingMachineParams[1].toNumber(), 45);
  });

  it("can be created with schemes and scheme-specific votingMachineParams", async () => {
    dao = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT",
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
        {
          name: "GlobalConstraintRegistrar",
          votingMachineParams: {
            votePerc: 30,
            ownerVote: true
          }
        }
      ],
      votingMachineParams: {
        votePerc: 45,
        ownerVote: true
      }
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    let scheme = await helpers.getDaoScheme(dao, "GlobalConstraintRegistrar", GlobalConstraintRegistrar);
    assert.equal(scheme.getDefaultPermissions(), SchemePermissions.fromString(await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address)));
    let votingMachineParamsHash = await helpers.getSchemeVotingMachineParametersHash(dao, scheme);
    let votingMachine = await helpers.getSchemeVotingMachine(dao, scheme);
    let votingMachineParams = await helpers.getVotingMachineParameters(votingMachine, votingMachineParamsHash);
    assert.equal(votingMachineParams[1].toNumber(), 30);

    scheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeScheme);
    assert.equal(scheme.getDefaultPermissions(), SchemePermissions.fromString(await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address)));

    votingMachineParamsHash = await helpers.getSchemeVotingMachineParametersHash(dao, scheme);
    votingMachine = await helpers.getSchemeVotingMachine(dao, scheme);
    votingMachineParams = await helpers.getVotingMachineParameters(votingMachine, votingMachineParamsHash);
    assert.equal(votingMachineParams[1].toNumber(), 45);
  });

  it("has a working getSchemes() function to access its schemes", async () => {
    dao = await helpers.forgeDao();
    const wrappers = helpers.contractsForTest();
    // a new dao comes with three known schemes
    assert.equal((await dao.getSchemes()).length, 3);
    let scheme = await helpers.getDaoScheme(dao, "GlobalConstraintRegistrar", GlobalConstraintRegistrar);
    assert.isOk(scheme, "scheme not found");
    assert.equal(
      scheme.address,
      wrappers.GlobalConstraintRegistrar.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    assert.isTrue(!!scheme.address, "address must be set");
    assert.isTrue(scheme instanceof GlobalConstraintRegistrarWrapper);

    scheme = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrar);
    assert.isOk(scheme, "scheme not found");
    assert.equal(
      scheme.address,
      wrappers.SchemeRegistrar.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    assert.isTrue(!!scheme.address, "address must be set");
    assert.isTrue(scheme instanceof SchemeRegistrarWrapper);

    scheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeScheme);
    assert.isOk(scheme, "scheme not found");
    assert.equal(
      scheme.address,
      wrappers.UpgradeScheme.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    assert.isTrue(!!scheme.address, "address must be set");
    assert.isTrue(scheme instanceof UpgradeSchemeWrapper);

    // now we add another known scheme
    await helpers.addProposeContributionReward(dao);

    assert.equal((await dao.getSchemes()).length, 4);
  });

  it("has a working getGlobalConstraints() function to access its constraints", async () => {
    const dao = await helpers.forgeDao();

    assert.equal((await dao.getGlobalConstraints()).length, 0);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 0);

    const tokenCapGC = await WrapperService.wrappers.TokenCapGC;

    const globalConstraintParametersHash = (await tokenCapGC.setParameters({
      token: dao.token.address,
      cap: 3141
    })).result;

    const globalConstraintRegistrar = await helpers.getDaoScheme(dao, "GlobalConstraintRegistrar", GlobalConstraintRegistrar);

    const votingMachineHash = await helpers.getSchemeVotingMachineParametersHash(dao, globalConstraintRegistrar);
    const votingMachine = await helpers.getSchemeVotingMachine(dao, globalConstraintRegistrar);

    let result = await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash: globalConstraintParametersHash,
      votingMachineHash: votingMachineHash
    });

    let proposalId = result.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    const gcs = await dao.getGlobalConstraints();
    assert.equal(gcs.length, 1);
    assert.equal(gcs[0].address, tokenCapGC.address);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 1);

    result = await globalConstraintRegistrar.proposeToRemoveGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address
    });

    proposalId = result.proposalId;
    await helpers.vote(votingMachine, proposalId, 1, accounts[2]);

    assert.equal((await dao.getGlobalConstraints()).length, 0);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 0);
  });
});
