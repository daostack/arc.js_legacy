import { assert } from "chai";
import { WrapperService } from "../lib";
import { DefaultSchemePermissions } from "../lib/commonTypes";
import {
  GlobalConstraintRegistrarFactory,
  GlobalConstraintRegistrarWrapper
} from "../lib/wrappers/globalConstraintRegistrar";
import { TokenCapGCFactory } from "../lib/wrappers/tokenCapGC";
import * as helpers from "./helpers";

describe("GlobalConstraintRegistrar", () => {
  it("proposeToAddModifyGlobalConstraint javascript wrapper should work", async () => {
    const dao = await helpers.forgeDao();

    const tokenCapGC = await WrapperService.wrappers.TokenCapGC;

    const globalConstraintParametersHash =
      (await tokenCapGC.setParameters({ token: dao.token.address, cap: 3141 })).result;

    const globalConstraintRegistrar = await helpers.getDaoScheme(
      dao,
      "GlobalConstraintRegistrar",
      GlobalConstraintRegistrarFactory) as GlobalConstraintRegistrarWrapper;

    const votingMachineHash = await helpers.getSchemeVotingMachineParametersHash(dao, globalConstraintRegistrar);

    await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash,
      votingMachineHash,
    });
  });

  it("should satisfy a number of basic checks", async () => {
    const dao = await helpers.forgeDao();

    // do some sanity checks on the globalconstriantregistrar
    const gcr = await helpers.getDaoScheme(
      dao,
      "GlobalConstraintRegistrar",
      GlobalConstraintRegistrarFactory) as GlobalConstraintRegistrarWrapper;
    // check if indeed the registrar is registered as a scheme on  the controller
    assert.equal(await dao.isSchemeRegistered(gcr.address), true);
    // DAO.new standardly registers no global constraints
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 0);

    // create a new global constraint - a TokenCapGC instance
    const tokenCapGC = await TokenCapGCFactory.new();
    // register paramets for setting a cap on the nativeToken of our dao of 21 million
    const tokenCapGCParamsHash = (await tokenCapGC.setParameters({ token: dao.token.address, cap: 21e9 })).result;

    // next line needs some real hash for the conditions for removing this scheme
    const votingMachineHash = tokenCapGCParamsHash;

    // to propose a global constraint we need to make sure the relevant hashes are registered
    // in the right places:
    const parametersForGCR = await dao.controller.getSchemeParameters(gcr.address, dao.avatar.address);
    // parametersForVotingInGCR are (voteRegisterParams (a hash) and boolVote)
    const parametersForVotingInGCR = await gcr.contract.parameters(parametersForGCR);

    // the info we just got consists of paramsHash and permissions
    const gcrPermissionsOnOrg = await dao.controller.getSchemePermissions(gcr.address, dao.avatar.address);
    assert.equal(gcrPermissionsOnOrg, DefaultSchemePermissions.GlobalConstraintRegistrar);

    const votingMachine = await helpers.getSchemeVotingMachine(dao, gcr);

    // the voting machine used in this GCR is the same as the voting machine of the dao
    assert.equal(votingMachine.address, parametersForVotingInGCR[1]);
    // while the voteRegisterParams are known on the voting machine
    // and consist of [reputationSystem address, treshold percentage]
    const voteRegisterParams = await votingMachine.contract.parameters(parametersForVotingInGCR[0]);

    const msg = "These parameters are not known the voting machine...";
    assert.notEqual(voteRegisterParams[0], "0x0000000000000000000000000000000000000000", msg);

    const result = await gcr.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash: tokenCapGCParamsHash,
      votingMachineHash,
    });

    // check if the proposal is known on the GlobalConstraintRegistrar
    const proposalId = result.proposalId;
    // TODO: read the proposal in the contract:
    // const proposal = await gcr.proposals(proposalId);
    // // the proposal looks like gc-address, params, proposaltype, removeParams
    // assert.equal(proposal[0], tokenCapGC.address);

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // at this point, our global constrait has been registered at the dao
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 1);
  });

  it("proposeGlobalConstraint() should accept different parameters [TODO]", async () => {
    const dao = await helpers.forgeDao();

    const tokenCapGC = await WrapperService.wrappers.TokenCapGC;

    let globalConstraintParametersHash =
      (await tokenCapGC.setParameters({ token: dao.token.address, cap: 21e9 })).result;

    const globalConstraintRegistrar = await helpers.getDaoScheme(
      dao,
      "GlobalConstraintRegistrar",
      GlobalConstraintRegistrarFactory) as GlobalConstraintRegistrarWrapper;

    const votingMachineHash = await helpers.getSchemeVotingMachineParametersHash(dao, globalConstraintRegistrar);

    let result = await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash,
      votingMachineHash,
    });

    let proposalId = result.proposalId;

    assert.isOk(proposalId);

    globalConstraintParametersHash = (await tokenCapGC.setParameters({ token: dao.token.address, cap: 1234 })).result;

    result = await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash,
      votingMachineHash,
    });

    proposalId = result.proposalId;

    assert.isOk(proposalId);
  });
});
