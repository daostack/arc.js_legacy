import { assert } from "chai";
import { Address, SchemePermissions } from "../lib/commonTypes";
import { DAO, PerDaoCallback } from "../lib/dao";
import {
  GlobalConstraintRegistrarFactory,
  GlobalConstraintRegistrarWrapper
} from "../lib/wrappers/globalConstraintRegistrar";
import { SchemeRegistrarFactory, SchemeRegistrarWrapper } from "../lib/wrappers/schemeRegistrar";
import { UpgradeSchemeFactory, UpgradeSchemeWrapper } from "../lib/wrappers/upgradeScheme";
import { WrapperService } from "../lib/wrapperService";
import * as helpers from "./helpers";

describe("DAO", () => {

  it("can call getDaos", async () => {
    await DAO.new({
      name: "ArcJsTestDao",
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
    });

    const daos = await DAO.getDaos({});
    assert.isOk(daos, "daos is not set");
    assert(daos.length > 0, "no daos found");
  });

  it("can call getDaos with callback", async () => {
    await DAO.new({
      name: "ArcJsTestDao",
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
    });
    await DAO.new({
      name: "ArcJsTestDao2",
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
    });

    let count = 0;
    const perDaoCallback = (avatarAddress: Address): void => {
      ++count;
    };

    const daos = await DAO.getDaos({ perDaoCallback });
    assert.isOk(daos, "daos is not set");
    assert.equal(daos.length, count, "callback not invoked");
  });

  it("can interrupt getDaos with callback", async () => {
    await DAO.new({
      name: "ArcJsTestDao",
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
    });
    await DAO.new({
      name: "ArcJsTestDao2",
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
    });

    let count = 0;
    const perDaoCallback: PerDaoCallback = (avatarAddress: Address): boolean => {
      ++count;
      return true;
    };

    const daos = await DAO.getDaos({ perDaoCallback });
    assert.isOk(daos, "daos is not set");
    assert(daos.length === 1, "wrong number of daos found");
    assert(count === 1, "wrong number of callbacks");
  });

  it("default config for counting the number of transactions", async () => {
    const dao = await DAO.new({
      founders: [
        {
          address: accounts[0],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40),
        },
      ],
      name: "ArcJsTestDao",
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
        { name: "GlobalConstraintRegistrar" },
      ],
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    const scheme = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrarFactory) as SchemeRegistrarWrapper;
    assert.equal(scheme.getDefaultPermissions(),
      SchemePermissions.fromString(
        await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address)));
  });

  it("can create with non-universal controller", async () => {
    const dao = await DAO.new({
      name: "ArcJsTestDao",
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
      universalController: false,
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    assert.equal(dao.hasUController, false);
  });

  it("can be created with 'new' using default settings", async () => {
    const dao = await DAO.new({
      name: "ArcJsTestDao",
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
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
    const schemeRegistrar1 = await helpers.getDaoScheme(org1, "SchemeRegistrar", SchemeRegistrarFactory);
    const schemeRegistrar2 = await helpers.getDaoScheme(org2, "SchemeRegistrar", SchemeRegistrarFactory);
    assert.equal(schemeRegistrar1.address, schemeRegistrar2.address);
    const upgradeScheme1 = await helpers.getDaoScheme(org1, "UpgradeScheme", UpgradeSchemeFactory);
    const upgradeScheme2 = await helpers.getDaoScheme(org2, "UpgradeScheme", UpgradeSchemeFactory);
    assert.equal(upgradeScheme1.address, upgradeScheme2.address);
    const globalConstraintRegistrar1 =
      await helpers.getDaoScheme(org1, "GlobalConstraintRegistrar", GlobalConstraintRegistrarFactory);
    const globalConstraintRegistrar2 =
      await helpers.getDaoScheme(org2, "GlobalConstraintRegistrar", GlobalConstraintRegistrarFactory);
    assert.equal(
      globalConstraintRegistrar1.address,
      globalConstraintRegistrar2.address
    );
  });

  it("can be created with founders", async () => {
    const dao = await DAO.new({
      founders: [
        {
          address: accounts[0],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40),
        },
        {
          address: accounts[1],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40),
        },
        {
          address: accounts[2],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40),
        },
      ],
      name: "ArcJsTestDao",
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
  });

  it("can be created with schemes and default votingMachineParams", async () => {
    const dao = await DAO.new({
      name: "ArcJsTestDao",
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
        { name: "GlobalConstraintRegistrar" },
      ],
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    const scheme = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrarFactory) as SchemeRegistrarWrapper;
    assert.equal(scheme.getDefaultPermissions(),
      SchemePermissions.fromString(
        await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address)));
  });

  it("can be created with schemes and global votingMachineParams", async () => {
    const dao = await DAO.new({
      name: "ArcJsTestDao",
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
        { name: "GlobalConstraintRegistrar" },
      ],
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
      votingMachineParams: {
        ownerVote: true,
        votePerc: 45,
      },
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    const scheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeSchemeFactory) as UpgradeSchemeWrapper;
    assert.equal(scheme.getDefaultPermissions(),
      SchemePermissions.fromString(await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address)));

    const votingMachineParamsHash = await helpers.getSchemeVotingMachineParametersHash(dao, scheme);
    const votingMachine = await helpers.getSchemeVotingMachine(dao, scheme);
    const votingMachineParams = await helpers.getVotingMachineParameters(votingMachine, votingMachineParamsHash);
    assert.equal(votingMachineParams[1].toNumber(), 45);
  });

  it("can be created with schemes and scheme-specific votingMachineParams", async () => {
    const dao = await DAO.new({
      name: "ArcJsTestDao",
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
        {
          name: "GlobalConstraintRegistrar",
          votingMachineParams: {
            ownerVote: true,
            votePerc: 30,
          },
        },
      ],
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
      votingMachineParams: {
        ownerVote: true,
        votePerc: 45,
      },
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    const gcscheme = await helpers.getDaoScheme(
      dao,
      "GlobalConstraintRegistrar",
      GlobalConstraintRegistrarFactory) as GlobalConstraintRegistrarWrapper;
    assert.equal(gcscheme.getDefaultPermissions(),
      SchemePermissions.fromString(await dao.controller.getSchemePermissions(gcscheme.address, dao.avatar.address)));
    let votingMachineParamsHash = await helpers.getSchemeVotingMachineParametersHash(dao, gcscheme);
    let votingMachine = await helpers.getSchemeVotingMachine(dao, gcscheme);
    let votingMachineParams = await helpers.getVotingMachineParameters(votingMachine, votingMachineParamsHash);
    assert.equal(votingMachineParams[1].toNumber(), 30);

    const upgradeScheme =
      await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeSchemeFactory) as UpgradeSchemeWrapper;
    assert.equal(upgradeScheme.getDefaultPermissions(),
      SchemePermissions.fromString(
        await dao.controller.getSchemePermissions(upgradeScheme.address, dao.avatar.address)));

    votingMachineParamsHash = await helpers.getSchemeVotingMachineParametersHash(dao, upgradeScheme);
    votingMachine = await helpers.getSchemeVotingMachine(dao, upgradeScheme);
    votingMachineParams = await helpers.getVotingMachineParameters(votingMachine, votingMachineParamsHash);
    assert.equal(votingMachineParams[1].toNumber(), 45);
  });

  it("has a working getSchemes() function to access its schemes", async () => {
    const dao = await helpers.forgeDao();
    const wrappers = helpers.contractsForTest();
    // a new dao comes with three known schemes
    assert.equal((await dao.getSchemes()).length, 3);
    let scheme = await helpers.getDaoScheme(dao, "GlobalConstraintRegistrar", GlobalConstraintRegistrarFactory);
    assert.isOk(scheme, "scheme not found");
    assert.equal(
      scheme.address,
      wrappers.GlobalConstraintRegistrar.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    assert.isTrue(!!scheme.address, "address must be set");
    assert.isTrue(scheme instanceof GlobalConstraintRegistrarWrapper);

    scheme = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrarFactory);
    assert.isOk(scheme, "scheme not found");
    assert.equal(
      scheme.address,
      wrappers.SchemeRegistrar.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    assert.isTrue(!!scheme.address, "address must be set");
    assert.isTrue(scheme instanceof SchemeRegistrarWrapper);

    scheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeSchemeFactory);
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
      cap: 3141,
      token: dao.token.address,
    })).result;

    const globalConstraintRegistrar = await helpers.getDaoScheme(
      dao,
      "GlobalConstraintRegistrar",
      GlobalConstraintRegistrarFactory) as GlobalConstraintRegistrarWrapper;

    const votingMachineHash = await helpers.getSchemeVotingMachineParametersHash(dao, globalConstraintRegistrar);
    const votingMachine = await helpers.getSchemeVotingMachine(dao, globalConstraintRegistrar);

    let result = await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash,
      votingMachineHash,
    });

    let proposalId = result.proposalId;

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    const gcs = await dao.getGlobalConstraints();
    assert.equal(gcs.length, 1);
    assert.equal(gcs[0].address, tokenCapGC.address);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 1);

    result = await globalConstraintRegistrar.proposeToRemoveGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
    });

    proposalId = result.proposalId;
    await helpers.vote(votingMachine, proposalId, 1, accounts[2]);

    assert.equal((await dao.getGlobalConstraints()).length, 0);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 0);
  });
});
