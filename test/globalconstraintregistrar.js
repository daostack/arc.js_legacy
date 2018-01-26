const helpers = require("./helpers");
import { Utils } from "../lib/utils";

const TokenCapGC = Utils.requireContract("TokenCapGC");

describe("GlobalConstraintRegistrar", () => {
  it("proposeToAddModifyGlobalConstraint javascript wrapper should work", async () => {
    const dao = await helpers.forgeDao();

    const tokenCapGC = await dao.getScheme("TokenCapGC");

    const globalConstraintParametersHash = (await tokenCapGC.setParams({ token: dao.token.address, cap: 3141 })).result;

    const globalConstraintRegistrar = await dao.getScheme("GlobalConstraintRegistrar");

    await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash: globalConstraintParametersHash,
      votingMachineHash: dao.votingMachine.configHash__
    });
  });

  it("should satisfy a number of basic checks", async () => {
    const dao = await helpers.forgeDao();

    // do some sanity checks on the globalconstriantregistrar
    const gcr = (await dao.getScheme("GlobalConstraintRegistrar")).contract;
    // check if indeed the registrar is registered as a scheme on  the controller
    assert.equal(await dao.isSchemeRegistered(gcr.address), true);
    // DAO.new standardly registers no global constraints
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address)).toNumber(), 0);

    // create a new global constraint - a TokenCapGC instance
    const tokenCapGC = await TokenCapGC.new();
    // register paramets for setting a cap on the nativeToken of our dao of 21 million
    await tokenCapGC.setParameters(dao.token.address, 21e9);
    const tokenCapGCParamsHash = await tokenCapGC.getParametersHash(dao.token.address, 21e9);

    // next line needs some real hash for the conditions for removing this scheme
    const votingMachineHash = tokenCapGCParamsHash;

    // to propose a global constraint we need to make sure the relevant hashes are registered
    // in the right places:
    const parametersForGCR = await dao.controller.getSchemeParameters(gcr.address, dao.avatar.address);
    // parametersForVotingInGCR are (voteRegisterParams (a hash) and boolVote)
    const parametersForVotingInGCR = await gcr.parameters(parametersForGCR);

    // the info we just got consists of paramsHash and permissions
    const gcrPermissionsOnOrg = await dao.controller.getSchemePermissions(gcr.address, dao.avatar.address);
    assert.equal(gcrPermissionsOnOrg, "0x00000007");

    // the voting machine used in this GCR is the same as the voting machine of the dao
    assert.equal(dao.votingMachine.address, parametersForVotingInGCR[1]);
    // while the voteRegisterParams are known on the voting machine
    // and consist of [reputationSystem address, treshold percentage]
    const voteRegisterParams = await dao.votingMachine.parameters(parametersForVotingInGCR[0]);

    const msg = "These parameters are not known the voting machine...";
    assert.notEqual(voteRegisterParams[0], "0x0000000000000000000000000000000000000000", msg);

    const tx = await gcr.proposeGlobalConstraint(
      dao.avatar.address,
      tokenCapGC.address,
      tokenCapGCParamsHash,
      votingMachineHash
    );

    // check if the proposal is known on the GlobalConstraintRegistrar
    const proposalId = Utils.getValueFromLogs(tx, "_proposalId");
    // TODO: read the proposal in the contract:
    // const proposal = await gcr.proposals(proposalId);
    // // the proposal looks like gc-address, params, proposaltype, removeParams
    // assert.equal(proposal[0], tokenCapGC.address);

    // TODO: the voting machine should be taken from the address at parametersForVotingInGCR[1]
    const votingMachine = dao.votingMachine;
    // first vote (minority)
    await votingMachine.vote(proposalId, 1, {
      from: web3.eth.accounts[1]
    });

    // at this point, our global constrait has been registered at the dao
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address)).toNumber(), 1);
  });


  it("proposeGlobalConstraint() should accept different parameters [TODO]", async () => {
    const dao = await helpers.forgeDao();

    const tokenCapGC = await dao.getScheme("TokenCapGC");

    let globalConstraintParametersHash = (await tokenCapGC.setParams({ token: dao.token.address, cap: 21e9 })).result;

    const globalConstraintRegistrar = await dao.getScheme("GlobalConstraintRegistrar");

    let result = await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash: globalConstraintParametersHash,
      votingMachineHash: dao.votingMachine.configHash__
    });

    let proposalId = result.proposalId;

    assert.isOk(proposalId);

    // proposalId = await dao.proposeGlobalConstraint({
    //   contract: 'TokenCapGC',
    //   paramsHash: tokenCapGCParamsHash,
    // });
    //
    // assert.isOk(proposalId);

    globalConstraintParametersHash = (await tokenCapGC.setParams({ token: dao.token.address, cap: 1234 })).result;

    result = await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash: globalConstraintParametersHash,
      votingMachineHash: dao.votingMachine.configHash__
    });

    proposalId = result.proposalId;

    assert.isOk(proposalId);

    // // we can also register an 'anonymous' constraint
    // const tokenCapGC = await TokenCapGC.new();
    // const tokenCapGCParamsHash = await tokenCapGC.setParameters(dao.token.address, 3000);
    //
    // proposalId = await dao.proposeGlobalConstraint({
    //   address: tokenCapGC.address,
    //   paramsHash: tokenCapGCParamsHash,
    // });
    //
    // assert.isOk(proposalId);
  });
});
