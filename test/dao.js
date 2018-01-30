import { DAO } from "../lib/dao";
import * as helpers from "./helpers";
import { GlobalConstraintRegistrar } from "../lib/contracts/globalconstraintregistrar";
import { UpgradeScheme } from "../lib/contracts/upgradescheme";
import { SchemeRegistrar } from "../lib/contracts/schemeregistrar";
import { AbsoluteVote } from "../lib/contracts/absoluteVote";

describe("DAO", () => {
  let dao;

  it("can be created with 'new' using default settings", async () => {
    dao = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT"
    });
    // the dao has an avatar
    assert.ok(dao.avatar, "DAO must have an avatar defined");
  });

  it("can be instantiated with 'at' if it was already deployed", async () => {
    // first create the dao
    const org1 = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT"
    });
    // then instantiate it with .at
    const org2 = await DAO.at(org1.avatar.address);

    // check if the two orgs are indeed the same
    assert.equal(org1.avatar.address, org2.avatar.address);
    assert.equal(await org1.getName(), await org2.getName());
    assert.equal(await org1.getTokenName(), await org2.getTokenName());
    const schemeRegistrar1 = await org1.getScheme("SchemeRegistrar");
    const schemeRegistrar2 = await org2.getScheme("SchemeRegistrar");
    assert.equal(schemeRegistrar1.address, schemeRegistrar2.address);
    const upgradeScheme1 = await org1.getScheme("UpgradeScheme");
    const upgradeScheme2 = await org2.getScheme("UpgradeScheme");
    assert.equal(upgradeScheme1.address, upgradeScheme2.address);
    const globalConstraintRegistrar1 = await org1.getScheme("GlobalConstraintRegistrar");
    const globalConstraintRegistrar2 = await org2.getScheme("GlobalConstraintRegistrar");
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
          reputation: 1000,
          tokens: web3.toWei(40)
        },
        {
          address: accounts[1],
          reputation: 1000,
          tokens: web3.toWei(40)
        },
        {
          address: accounts[2],
          reputation: 1000,
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
    const scheme = await dao.getScheme("SchemeRegistrar");
    assert.equal(scheme.getDefaultPermissions(), await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address));
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
    const scheme = await dao.getScheme("UpgradeScheme");
    assert.equal(scheme.getDefaultPermissions(), await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address));
    const paramsHash = await dao.controller.getSchemeParameters(scheme.address, dao.avatar.address);
    const schemeParams = await scheme.parameters(paramsHash);
    const votingMachineParamsHash = await schemeParams[0];
    const votingMachineAddress = await schemeParams[1];
    const votingMachine = await AbsoluteVote.at(votingMachineAddress);
    const votingMachineParams = await votingMachine.parameters(votingMachineParamsHash);
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
    let scheme = await dao.getScheme("GlobalConstraintRegistrar");
    assert.equal(scheme.getDefaultPermissions(), await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address));
    let paramsHash = await dao.controller.getSchemeParameters(scheme.address, dao.avatar.address);
    let schemeParams = await scheme.parameters(paramsHash);
    let votingMachineParamsHash = await schemeParams[0];
    let votingMachineAddress = await schemeParams[1];
    let votingMachine = await AbsoluteVote.at(votingMachineAddress);
    let votingMachineParams = await votingMachine.parameters(votingMachineParamsHash);
    assert.equal(votingMachineParams[1].toNumber(), 30);

    scheme = await dao.getScheme("UpgradeScheme");
    assert.equal(scheme.getDefaultPermissions(), await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address));
    paramsHash = await dao.controller.getSchemeParameters(scheme.address, dao.avatar.address);
    schemeParams = await scheme.parameters(paramsHash);
    votingMachineParamsHash = await schemeParams[0];
    votingMachineAddress = await schemeParams[1];
    votingMachine = await AbsoluteVote.at(votingMachineAddress);
    votingMachineParams = await votingMachine.parameters(votingMachineParamsHash);
    assert.equal(votingMachineParams[1].toNumber(), 45);

  });

  it("has a working getSchemes() function to access its schemes", async () => {
    dao = await helpers.forgeDao();
    const contracts = await helpers.contractsForTest();
    // a new dao comes with three known schemes
    assert.equal((await dao.getSchemes()).length, 3);
    let scheme = await dao.getScheme("GlobalConstraintRegistrar");
    assert.equal(
      scheme.address,
      contracts.allContracts.GlobalConstraintRegistrar.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    assert.isTrue(scheme instanceof GlobalConstraintRegistrar);

    scheme = await dao.getScheme("SchemeRegistrar");
    assert.equal(
      scheme.address,
      contracts.allContracts.SchemeRegistrar.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    assert.isTrue(scheme instanceof SchemeRegistrar);

    scheme = await dao.getScheme("UpgradeScheme");
    assert.equal(
      scheme.address,
      contracts.allContracts.UpgradeScheme.address
    );
    assert.isTrue(!!scheme.contract, "contract must be set");
    assert.isTrue(scheme instanceof UpgradeScheme);

    // now we add another known scheme
    await helpers.proposeContributionReward(dao);

    assert.equal((await dao.getSchemes()).length, 4);
  });

  it("getScheme() function handles bad scheme", async () => {
    const dao = await helpers.forgeDao();
    const scheme = await dao.getScheme("NoSuchScheme");
    assert.equal(scheme, undefined);
  });

  it("getScheme() function handles bad address", async () => {
    const dao = await helpers.forgeDao();
    const scheme = await dao.getScheme("UpgradeScheme", helpers.NULL_ADDRESS);
    assert.equal(scheme, undefined);
  });

  it("has a working getGlobalConstraints() function to access its constraints", async () => {
    const dao = await helpers.forgeDao();

    assert.equal((await dao.getGlobalConstraints()).length, 0);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address)).toNumber(), 0);

    const tokenCapGC = await dao.getScheme("TokenCapGC");

    const globalConstraintParametersHash = (await tokenCapGC.setParams({
      token: dao.token.address,
      cap: 3141
    })).result;

    const votingMachineHash = (await dao.votingMachine.setParams({
      reputation: dao.reputation.address,
      votePerc: 50,
      ownerVote: true
    })).result;

    const globalConstraintRegistrar = await dao.getScheme("GlobalConstraintRegistrar");

    let result = await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash: globalConstraintParametersHash,
      votingMachineHash: votingMachineHash
    }
    );

    let proposalId = result.proposalId;
    // several users now cast their vote
    await helpers.vote(dao, proposalId, 1, { from: web3.eth.accounts[0] });
    // next is decisive vote: the proposal will be executed
    await helpers.vote(dao, proposalId, 1, { from: web3.eth.accounts[2] });

    const gcs = await dao.getGlobalConstraints();
    assert.equal(gcs.length, 1);
    assert.equal(gcs[0].address, tokenCapGC.address);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address)).toNumber(), 1);

    result = await globalConstraintRegistrar.proposeToRemoveGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address
    });

    proposalId = result.proposalId;
    // several users now cast their vote
    await helpers.vote(dao, proposalId, 1, { from: web3.eth.accounts[0] });
    // next is decisive vote: the proposal will be executed
    await helpers.vote(dao, proposalId, 1, { from: web3.eth.accounts[2] });

    assert.equal((await dao.getGlobalConstraints()).length, 0);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address)).toNumber(), 0);
  });

  it("getDAOstack() function returns an address", async () => {
    const avatarAddress = await DAO.getDAOstack();
    assert.isOk(avatarAddress);
    const dao = await DAO.at(avatarAddress);
    assert.equal(await dao.getName(), "Genesis");
  });
});
