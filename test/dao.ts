import { assert } from "chai";
import { Address, SchemePermissions } from "../lib/commonTypes";
import { DAO, NewDaoConfig, Participant, PerDaoCallback } from "../lib/dao";
import { Utils } from "../lib/utils";
import {
  GlobalConstraintRegistrarFactory,
  GlobalConstraintRegistrarWrapper
} from "../lib/wrappers/globalConstraintRegistrar";
import { SchemeRegistrarFactory, SchemeRegistrarWrapper } from "../lib/wrappers/schemeRegistrar";
import { UpgradeSchemeFactory, UpgradeSchemeWrapper } from "../lib/wrappers/upgradeScheme";
import { WrapperService } from "../lib/wrapperService";
import * as helpers from "./helpers";

describe("DAO", () => {

  const getNewDao = (options: Partial<NewDaoConfig> = {}): Promise<DAO> => {
    return DAO.new(Object.assign({
      founders: [
        {
          address: accounts[0],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(100),
        },
      ],
      name: "ArcJsTestDao",
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
    }, options));
  };

  it("can register non-Arc scheme", async () => {

    const dao = await getNewDao({
      founders: [
        {
          address: accounts[0],
          reputation: web3.toWei(10),
          tokens: web3.toWei(100),
        },
      ],
      schemes: [
        {
          address: helpers.SOME_ADDRESS,
        },
      ],
    });

    const schemes = await dao.getSchemes();
    assert.equal(schemes.length, 1);
    assert.equal(schemes[0].address, helpers.SOME_ADDRESS);
    assert.equal(schemes[0].wrapper, undefined);
  });

  it("can register non-wrapped, non-deployed scheme", async () => {

    const contractName = "Auction4Reputation";

    let truffleContract;
    try {
      truffleContract = await Utils.requireContract(contractName);
    } catch (ex) {
      throw new Error(`can't find '${contractName}': ${ex.message ? ex.message : ex}`);
    }

    const newContract = await truffleContract.new(
      helpers.SOME_HASH,
      10,
      1000,
      2000,
      100,
      "0x4d50fa58b754fdc70feafc8b9dba0bfb27079922",
      "0xb0c908140fe6fd6fbd4990a5c2e35ca6dc12bfb2"
    );

    const dao = await getNewDao({
      founders: [
        {
          address: accounts[0],
          reputation: web3.toWei(10),
          tokens: web3.toWei(100),
        },
      ],
      schemes: [
        {
          address: newContract.address,
          name: contractName,
        },
      ],
    });

    const schemes = await dao.getSchemes();
    assert.equal(schemes.length, 1);
    assert.equal(schemes[0].address, newContract.address);
  });

  it("can get participants", async () => {
    const dao = await getNewDao({
      founders: [
        {
          address: accounts[0],
          reputation: web3.toWei(10),
          tokens: web3.toWei(100),
        },
        {
          address: accounts[1],
          reputation: web3.toWei(100),
          tokens: web3.toWei(100),
        },
        {
          address: accounts[2],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(100),
        },
      ],
    });

    let participants = await dao.getParticipants({
      returnReputations: true,
    });

    assert.equal(participants.length, 3);

    let participantsFound = participants.filter((f: Participant): boolean => f.address === accounts[0]);
    assert.equal(participantsFound.length, 1);
    assert.equal(participantsFound[0].reputation.toString(10), web3.toWei(10));

    participantsFound = participants.filter((f: Participant): boolean => f.address === accounts[1]);
    assert.equal(participantsFound.length, 1);
    assert.equal(participantsFound[0].reputation.toString(10), web3.toWei(100));

    participantsFound = participants.filter((f: Participant): boolean => f.address === accounts[2]);
    assert.equal(participantsFound.length, 1);
    assert.equal(participantsFound[0].reputation.toString(10), web3.toWei(1000));

    participants = await dao.getParticipants({
      participantAddress: accounts[1],
      returnReputations: true,
    });

    assert.equal(participants.length, 1);
    assert.equal(participants[0].address, accounts[1]);
    assert.equal(participants[0].reputation.toString(10), web3.toWei(100));

    participants = await dao.getParticipants();

    assert.equal(participants.length, 3);
    assert(typeof participants[0].address === "string");
    assert(typeof participants[1].address === "string");
    assert(typeof participants[2].address === "string");
    assert(typeof participants[0].reputation === "undefined");
    assert(typeof participants[1].reputation === "undefined");
    assert(typeof participants[2].reputation === "undefined");
  });

  it("founders have a native token balance", async () => {
    const dao = await getNewDao();
    const balance = web3.fromWei(await dao.getTokenBalance(accounts[0]));
    assert(balance.eq(100));
  });

  it("can call getDaos", async () => {

    let daos = await DAO.getDaos();
    assert.isOk(daos, "daos array not returned");
    const originaCountOfDaos = daos.length;
    await getNewDao();
    await getNewDao({ name: "ArcJsTestDao2" });
    daos = await DAO.getDaos();
    assert.isOk(daos, "daos array not returned");
    assert.equal(daos.length, originaCountOfDaos + 2, `Should have found ${originaCountOfDaos + 2} daos`);
  });

  it("can call getDaoCreationEvents", async () => {

    const daoEventFetcherFactory = await DAO.getDaoCreationEvents();
    assert.isOk(daoEventFetcherFactory, "daoEventFetcherFactory is not set");
    let daos = await daoEventFetcherFactory({}, { fromBlock: 0 }).get();
    assert.isOk(daos, "daos array not returned");
    const originaCountOfDaos = daos.length;

    await getNewDao();
    await getNewDao({ name: "ArcJsTestDao2" });

    daos = await daoEventFetcherFactory({}, { fromBlock: 0 }).get();

    assert.equal(daos.length, originaCountOfDaos + 2, `Should have found ${originaCountOfDaos + 2} daos`);
  });

  it("can watch getDaos", async () => {

    const daoEventFetcherFactory = await DAO.getDaoCreationEvents();
    assert.isOk(daoEventFetcherFactory, "daoEventFetcherFactory is not set");

    const daos = await daoEventFetcherFactory({}, { fromBlock: 0 }).get();
    assert.isOk(daos, "daos array not returned");
    const originalCountOfDaos = daos.length;
    let countWatch = 0;
    let countSubscribe = 0;

    const watcher = daoEventFetcherFactory({}, { fromBlock: 0 });

    watcher.watch(
      (error: Error, daoAddress: Address): void => {
        ++countWatch;
      });

    const subscription = watcher.subscribe("getDaos",
      (eventName: string, daoAddress: Address): void => {
        assert.equal(eventName, "getDaos");
        ++countSubscribe;
      });

    await getNewDao();

    await helpers.sleep(1000);
    await watcher.stopWatchingAsync();
    subscription.unsubscribe();
    assert.equal(countWatch, originalCountOfDaos + 1, `Should have watched one new dao`);
    assert.equal(countSubscribe, originalCountOfDaos + 1, `Should have subscribed to one new dao`);
  });

  it("default config for counting the number of transactions", async () => {
    const dao = await getNewDao({
      founders: [
        {
          address: accounts[0],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40),
        },
      ],
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
        { name: "GlobalConstraintRegistrar" },
      ],
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    const scheme = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrarFactory) as SchemeRegistrarWrapper;
    assert.equal(scheme.getDefaultPermissions(),
      SchemePermissions.fromString(
        await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address)));
  });

  it("can create with non-universal controller", async () => {
    const dao = await getNewDao({
      universalController: false,
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    assert.equal(dao.hasUController, false);
  });

  it("can be created with 'new' using default settings", async () => {
    const dao = await getNewDao();
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
    assert.equal(org1.name, org2.name);
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
    const dao = await getNewDao({
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
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
  });

  it("can be created with schemes and default votingMachineParams", async () => {
    const dao = await getNewDao({
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
        { name: "GlobalConstraintRegistrar" },
      ],
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
    const scheme = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrarFactory) as SchemeRegistrarWrapper;
    assert.equal(scheme.getDefaultPermissions(),
      SchemePermissions.fromString(
        await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address)));
  });

  it("can be created with schemes and global votingMachineParams", async () => {
    const dao = await getNewDao({
      schemes: [
        { name: "SchemeRegistrar" },
        { name: "UpgradeScheme" },
        { name: "GlobalConstraintRegistrar" },
      ],
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
    assert.equal(votingMachineParams.votePerc, 45);
  });

  it("can be created with schemes and scheme-specific votingMachineParams", async () => {
    const dao = await getNewDao({
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
    assert.equal(votingMachineParams.votePerc, 30);

    const upgradeScheme =
      await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeSchemeFactory) as UpgradeSchemeWrapper;
    assert.equal(upgradeScheme.getDefaultPermissions(),
      SchemePermissions.fromString(
        await dao.controller.getSchemePermissions(upgradeScheme.address, dao.avatar.address)));

    votingMachineParamsHash = await helpers.getSchemeVotingMachineParametersHash(dao, upgradeScheme);
    votingMachine = await helpers.getSchemeVotingMachine(dao, upgradeScheme);
    votingMachineParams = await helpers.getVotingMachineParameters(votingMachine, votingMachineParamsHash);
    assert.equal(votingMachineParams.votePerc, 45);
  });

  it("has a working getSchemes() function to access its schemes", async () => {
    const dao = await helpers.forgeDao();
    const wrappers = WrapperService.wrappers;
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
      cap: "3141",
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

    let proposalId = await result.getProposalIdFromMinedTx();

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    const gcs = await dao.getGlobalConstraints();
    assert.equal(gcs.length, 1);
    assert.equal(gcs[0].address, tokenCapGC.address);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 1);

    result = await globalConstraintRegistrar.proposeToRemoveGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraintAddress: tokenCapGC.address,
    });

    proposalId = await result.getProposalIdFromMinedTx();
    await helpers.vote(votingMachine, proposalId, 1, accounts[2]);

    assert.equal((await dao.getGlobalConstraints()).length, 0);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 0);
  });
});
