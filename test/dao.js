import { DAO } from "../lib/dao";
import * as helpers from "./helpers";
import { GlobalConstraintRegistrar } from "../lib/contracts/globalconstraintregistrar";
import { UpgradeScheme } from "../lib/contracts/upgradescheme";
import { SchemeRegistrar } from "../lib/contracts/schemeregistrar";

describe("DAO", () => {
  let dao;

  // it("default config for counting the number of transactions", async () => {
  //   dao = await DAO.new({
  //     name: "Skynet",
  //     tokenName: "Tokens of skynet",
  //     tokenSymbol: "SNT",
  //     founders: [
  //       {
  //         address: accounts[0],
  //         reputation: web3.toWei(1000),
  //         tokens: web3.toWei(40)
  //       }
  //     ],
  //     schemes: [
  //       { name: "SchemeRegistrar" },
  //       { name: "UpgradeScheme" },
  //       { name: "GlobalConstraintRegistrar" }
  //     ]
  //   });
  //   // the dao has an avatar
  //   assert.ok(dao.avatar, "DAO must have an avatar defined");
  //   const scheme = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrar);
  //   assert.equal(scheme.getDefaultPermissions(), await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address));
  // });

  // it("can create with non-universal controller", async () => {
  //   dao = await DAO.new({
  //     name: "Skynet",
  //     tokenName: "Tokens of skynet",
  //     tokenSymbol: "SNT",
  //     universalController: false
  //   });
  //   // the dao has an avatar
  //   assert.ok(dao.avatar, "DAO must have an avatar defined");
  //   assert.equal(dao.hasUController, false);
  // });

  // it("can be created with 'new' using default settings", async () => {
  //   dao = await DAO.new({
  //     name: "Skynet",
  //     tokenName: "Tokens of skynet",
  //     tokenSymbol: "SNT"
  //   });
  //   // the dao has an avatar
  //   assert.ok(dao.avatar, "DAO must have an avatar defined");
  //   assert.equal(dao.hasUController, true);
  // });

  // it("can be instantiated with 'at' if it was already deployed", async () => {
  //   // first create the dao
  //   const org1 = await helpers.forgeDao();
  //   // then instantiate it with .at
  //   const org2 = await DAO.at(org1.avatar.address);

  //   // check if the two orgs are indeed the same
  //   assert.equal(org1.avatar.address, org2.avatar.address);
  //   assert.equal(await org1.getName(), await org2.getName());
  //   assert.equal(await org1.getTokenName(), await org2.getTokenName());
  //   const schemeRegistrar1 = await helpers.getDaoScheme(org1, "SchemeRegistrar", SchemeRegistrar);
  //   const schemeRegistrar2 = await helpers.getDaoScheme(org2, "SchemeRegistrar", SchemeRegistrar);
  //   assert.equal(schemeRegistrar1.address, schemeRegistrar2.address);
  //   const upgradeScheme1 = await helpers.getDaoScheme(org1, "UpgradeScheme", UpgradeScheme);
  //   const upgradeScheme2 = await helpers.getDaoScheme(org2, "UpgradeScheme", UpgradeScheme);
  //   assert.equal(upgradeScheme1.address, upgradeScheme2.address);
  //   const globalConstraintRegistrar1 = await helpers.getDaoScheme(org1, "GlobalConstraintRegistrar", GlobalConstraintRegistrar);
  //   const globalConstraintRegistrar2 = await helpers.getDaoScheme(org2, "GlobalConstraintRegistrar", GlobalConstraintRegistrar);
  //   assert.equal(
  //     globalConstraintRegistrar1.address,
  //     globalConstraintRegistrar2.address
  //   );
  // });

  // it("can be created with founders", async () => {
  //   dao = await DAO.new({
  //     name: "Skynet",
  //     tokenName: "Tokens of skynet",
  //     tokenSymbol: "SNT",
  //     founders: [
  //       {
  //         address: accounts[0],
  //         reputation: web3.toWei(1000),
  //         tokens: web3.toWei(40)
  //       },
  //       {
  //         address: accounts[1],
  //         reputation: web3.toWei(1000),
  //         tokens: web3.toWei(40)
  //       },
  //       {
  //         address: accounts[2],
  //         reputation: web3.toWei(1000),
  //         tokens: web3.toWei(40)
  //       }
  //     ]
  //   });
  //   // the dao has an avatar
  //   assert.ok(dao.avatar, "DAO must have an avatar defined");
  // });

  // it("can be created with schemes and default votingMachineParams", async () => {
  //   dao = await DAO.new({
  //     name: "Skynet",
  //     tokenName: "Tokens of skynet",
  //     tokenSymbol: "SNT",
  //     schemes: [
  //       { name: "SchemeRegistrar" },
  //       { name: "UpgradeScheme" },
  //       { name: "GlobalConstraintRegistrar" }
  //     ]
  //   });
  //   // the dao has an avatar
  //   assert.ok(dao.avatar, "DAO must have an avatar defined");
  //   const scheme = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrar);
  //   assert.equal(scheme.getDefaultPermissions(), await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address));
  // });

  // it("can be created with schemes and global votingMachineParams", async () => {
  //   dao = await DAO.new({
  //     name: "Skynet",
  //     tokenName: "Tokens of skynet",
  //     tokenSymbol: "SNT",
  //     schemes: [
  //       { name: "SchemeRegistrar" },
  //       { name: "UpgradeScheme" },
  //       { name: "GlobalConstraintRegistrar" }
  //     ],
  //     votingMachineParams: {
  //       votePerc: 45,
  //       ownerVote: true
  //     }
  //   });
  //   // the dao has an avatar
  //   assert.ok(dao.avatar, "DAO must have an avatar defined");
  //   const scheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeScheme);
  //   assert.equal(scheme.getDefaultPermissions(), await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address));

  //   const votingMachineParamsHash = await helpers.getSchemeVotingMachineParametersHash(dao, scheme);
  //   const votingMachine = await helpers.getSchemeVotingMachine(dao, scheme);
  //   const votingMachineParams = await helpers.getVotingMachineParameters(votingMachine, votingMachineParamsHash);
  //   assert.equal(votingMachineParams[1].toNumber(), 60);
  // });

  // it("can be created with schemes and scheme-specific votingMachineParams", async () => {
  //   dao = await DAO.new({
  //     name: "Skynet",
  //     tokenName: "Tokens of skynet",
  //     tokenSymbol: "SNT",
  //     schemes: [
  //       { name: "SchemeRegistrar" },
  //       { name: "UpgradeScheme" },
  //       {
  //         name: "GlobalConstraintRegistrar",
  //         votingMachineParams: {
  //           votePerc: 30,
  //           ownerVote: true
  //         }
  //       }
  //     ],
  //     votingMachineParams: {
  //       votePerc: 45,
  //       ownerVote: true
  //     }
  //   });
  //   // the dao has an avatar
  //   assert.ok(dao.avatar, "DAO must have an avatar defined");
  //   let scheme = await helpers.getDaoScheme(dao, "GlobalConstraintRegistrar", GlobalConstraintRegistrar);
  //   assert.equal(scheme.getDefaultPermissions(), await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address));
  //   let votingMachineParamsHash = await helpers.getSchemeVotingMachineParametersHash(dao, scheme);
  //   let votingMachine = await helpers.getSchemeVotingMachine(dao, scheme);
  //   let votingMachineParams = await helpers.getVotingMachineParameters(votingMachine, votingMachineParamsHash);
  //   assert.equal(votingMachineParams[1].toNumber(), 60);

  //   scheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeScheme);
  //   assert.equal(scheme.getDefaultPermissions(), await dao.controller.getSchemePermissions(scheme.address, dao.avatar.address));

  //   votingMachineParamsHash = await helpers.getSchemeVotingMachineParametersHash(dao, scheme);
  //   votingMachine = await helpers.getSchemeVotingMachine(dao, scheme);
  //   votingMachineParams = await helpers.getVotingMachineParameters(votingMachine, votingMachineParamsHash);
  //   assert.equal(votingMachineParams[1].toNumber(), 60);

  // });

  // it("has a working getSchemes() function to access its schemes", async () => {
  //   dao = await helpers.forgeDao();
  //   const contracts = await helpers.contractsForTest();
  //   // a new dao comes with three known schemes
  //   assert.equal((await dao.getSchemes()).length, 4);
  //   let scheme = await helpers.getDaoScheme(dao, "GlobalConstraintRegistrar", GlobalConstraintRegistrar);
  //   assert.equal(
  //     scheme.address,
  //     contracts.allContracts.GlobalConstraintRegistrar.address
  //   );
  //   assert.isTrue(!!scheme.contract, "contract must be set");
  //   assert.isTrue(scheme instanceof GlobalConstraintRegistrar);

  //   scheme = await helpers.getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrar);
  //   assert.equal(
  //     scheme.address,
  //     contracts.allContracts.SchemeRegistrar.address
  //   );
  //   assert.isTrue(!!scheme.contract, "contract must be set");
  //   assert.isTrue(scheme instanceof SchemeRegistrar);

  //   scheme = await helpers.getDaoScheme(dao, "UpgradeScheme", UpgradeScheme);
  //   assert.equal(
  //     scheme.address,
  //     contracts.allContracts.UpgradeScheme.address
  //   );
  //   assert.isTrue(!!scheme.contract, "contract must be set");
  //   assert.isTrue(scheme instanceof UpgradeScheme);

  //   // now we add another known scheme
  //   await helpers.addProposeContributionReward(dao);

  //   assert.equal((await dao.getSchemes()).length, 5);
  // });

  // it("getScheme() function handles bad scheme", async () => {
  //   const dao = await helpers.forgeDao();
  //   const scheme = await dao.getScheme("NoSuchScheme");
  //   assert.equal(scheme, undefined);
  // });

  // it("getScheme() function handles bad address", async () => {
  //   const dao = await helpers.forgeDao();
  //   const scheme = await dao.getScheme("UpgradeScheme", helpers.NULL_ADDRESS);
  //   assert.equal(scheme, undefined);
  // });

  it("has a working getGlobalConstraints() function to access its constraints", async () => {
    const dao = await helpers.forgeDao();

    assert.equal((await dao.getGlobalConstraints()).length, 0);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 0);

    const tokenCapGC = await dao.getScheme("TokenCapGC");

    const globalConstraintParametersHash = (await tokenCapGC.setParams({
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

    await helpers.vote(votingMachine, proposalId, 1, web3.eth.accounts[0]);

    const gcs = await dao.getGlobalConstraints();
    assert.equal(gcs.length, 1);
    assert.equal(gcs[0].address, tokenCapGC.address);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 1);

    result = await globalConstraintRegistrar.proposeToRemoveGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address
    });

    proposalId = result.proposalId;
    await helpers.vote(votingMachine, proposalId, 1, web3.eth.accounts[1]);

    assert.equal((await dao.getGlobalConstraints()).length, 0);
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 0);
  });
});
