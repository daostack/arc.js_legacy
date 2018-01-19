const helpers = require("./helpers");
import { getValueFromLogs, requireContract } from "../lib/utils.js";

const TokenCapGC = requireContract("TokenCapGC");

describe("GlobalConstraintRegistrar", () => {
  let tx, proposalId;

  it("proposeToAddModifyGlobalConstraint javascript wrapper should work", async () => {
    const organization = await helpers.forgeOrganization();

    const tokenCapGC = await organization.scheme("TokenCapGC");

    const globalConstraintParametersHash = await tokenCapGC.getParametersHash(
      organization.token.address,
      3141
    );
    await tokenCapGC.setParameters(organization.token.address, 3141);

    const votingMachineHash = await organization.votingMachine.getParametersHash(
      organization.reputation.address,
      50,
      true
    );
    await organization.votingMachine.setParameters(
      organization.reputation.address,
      50,
      true
    );

    const globalConstraintRegistrar = await organization.scheme(
      "GlobalConstraintRegistrar"
    );

    await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: organization.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash: globalConstraintParametersHash,
      votingMachineHash: votingMachineHash
    });
  });

  it("should register and enforce a global constraint", async () => {
    const organization = await helpers.forgeOrganization();

    const tokenCapGC = await organization.scheme("TokenCapGC");
    const globalConstraintParametersHash = await tokenCapGC.getParametersHash(
      organization.token.address,
      3141
    );
    await tokenCapGC.setParameters(organization.token.address, 3141);

    const votingMachineHash = await organization.votingMachine.getParametersHash(
      organization.reputation.address,
      50,
      true
    );
    await organization.votingMachine.setParameters(
      organization.reputation.address,
      50,
      true
    );

    const globalConstraintRegistrar = (await organization.scheme("GlobalConstraintRegistrar")).contract;

    const tx = await globalConstraintRegistrar.proposeGlobalConstraint(
      organization.avatar.address,
      tokenCapGC.address,
      globalConstraintParametersHash,
      votingMachineHash
    );

    const proposalId = getValueFromLogs(tx, "_proposalId");


    // serveral users now cast their vote
    await organization.vote(proposalId, 1, { from: web3.eth.accounts[0] });
    // next is decisive vote: the proposal will be executed
    await organization.vote(proposalId, 1, { from: web3.eth.accounts[2] });

    // now the tokencap is enforced: up to 3141 tokens
    // minting 1111 tokens should be fine
    // TODO: this is complex: we must create a proposal to mint these tokens and accept that
    // proposalId = await organization.proposeScheme('ContributionScheme');
    // await organization.vote(proposalId, true, {from: web3.eth.accounts[2]});

    // minting 9999 tokens should be out
  });

  it("should satisfy a number of basic checks", async () => {
    const org = await helpers.forgeOrganization();

    // do some sanity checks on the globalconstriantregistrar
    const gcr = (await org.scheme("GlobalConstraintRegistrar")).contract;
    // check if indeed the registrar is registered as a scheme on  the controller
    assert.equal(await org.controller.isSchemeRegistered(gcr.address, org.avatar.address), true);
    // Organization.new standardly registers no global constraints
    assert.equal((await org.controller.globalConstraintsCount(org.avatar.address)).toNumber(), 0);

    // create a new global constraint - a TokenCapGC instance
    const tokenCapGC = await TokenCapGC.new();
    // register paramets for setting a cap on the nativeToken of our organization of 21 million
    await tokenCapGC.setParameters(org.token.address, 21e9);
    const tokenCapGCParamsHash = await tokenCapGC.getParametersHash(org.token.address, 21e9);

    // next line needs some real hash for the conditions for removing this scheme
    const votingMachineHash = tokenCapGCParamsHash;

    // to propose a global constraint we need to make sure the relevant hashes are registered
    // in the right places:
    const parametersForGCR = await org.controller.getSchemeParameters(gcr.address, org.avatar.address);
    // parametersForVotingInGCR are (voteRegisterParams (a hash) and boolVote)
    const parametersForVotingInGCR = await gcr.parameters(parametersForGCR);

    // the info we just got consists of paramsHash and permissions
    const gcrPermissionsOnOrg = await org.controller.getSchemePermissions(gcr.address, org.avatar.address);
    assert.equal(gcrPermissionsOnOrg, "0x00000007");

    // the voting machine used in this GCR is the same as the voting machine of the organization
    assert.equal(org.votingMachine.address, parametersForVotingInGCR[1]);
    // while the voteRegisterParams are known on the voting machine
    // and consist of [reputationSystem address, treshold percentage]
    const voteRegisterParams = await org.votingMachine.parameters(parametersForVotingInGCR[0]);

    const msg = "These parameters are not known the voting machine...";
    assert.notEqual(voteRegisterParams[0], "0x0000000000000000000000000000000000000000", msg);

    tx = await gcr.proposeGlobalConstraint(
      org.avatar.address,
      tokenCapGC.address,
      tokenCapGCParamsHash,
      votingMachineHash
    );

    // check if the proposal is known on the GlobalConstraintRegistrar
    proposalId = getValueFromLogs(tx, "_proposalId");
    // TODO: read the proposal in the contract:
    // const proposal = await gcr.proposals(proposalId);
    // // the proposal looks like gc-address, params, proposaltype, removeParams
    // assert.equal(proposal[0], tokenCapGC.address);

    // TODO: the voting machine should be taken from the address at parametersForVotingInGCR[1]
    const votingMachine = org.votingMachine;
    // first vote (minority)
    tx = await votingMachine.vote(proposalId, 1, {
      from: web3.eth.accounts[1]
    });

    // at this point, our global constrait has been registered at the organization
    assert.equal((await org.controller.globalConstraintsCount(org.avatar.address)).toNumber(), 1);
    return;
    // // get the first global constraint
    // const gc = await organization.controller.globalConstraints(0);
    // const params = await organization.controller.globalConstraintsParams(0);
    // // see which global constraints are satisfied
    // assert.equal(gc, tokenCapGC.address);
    // assert.equal(params, tokenCapGCParamsHash);
  });


  it("organisation.proposalGlobalConstraint() should accept different parameters [TODO]", async () => {
    const organization = await helpers.forgeOrganization();

    const tokenCapGC = await organization.scheme("TokenCapGC");

    let globalConstraintParametersHash = await tokenCapGC.getParametersHash(
      organization.token.address,
      21e9
    );
    await tokenCapGC.setParameters(organization.token.address, 21e9);

    let votingMachineHash = await organization.votingMachine.getParametersHash(
      organization.reputation.address,
      50,
      true
    );
    await organization.votingMachine.setParameters(
      organization.reputation.address,
      50,
      true
    );

    const globalConstraintRegistrar = (await organization.scheme(
      "GlobalConstraintRegistrar"
    )).contract;

    let tx = await globalConstraintRegistrar.proposeGlobalConstraint(
      organization.avatar.address,
      tokenCapGC.address,
      globalConstraintParametersHash,
      votingMachineHash
    );

    let proposalId = getValueFromLogs(tx, "_proposalId");
    assert.isOk(proposalId);

    // proposalId = await organization.proposeGlobalConstraint({
    //   contract: 'TokenCapGC',
    //   paramsHash: tokenCapGCParamsHash,
    // });
    //
    // assert.isOk(proposalId);

    globalConstraintParametersHash = await tokenCapGC.getParametersHash(
      organization.token.address,
      1234
    );
    await tokenCapGC.setParameters(organization.token.address, 1234);

    votingMachineHash = await organization.votingMachine.getParametersHash(
      organization.reputation.address,
      1,
      false
    );
    await organization.votingMachine.setParameters(
      organization.reputation.address,
      1,
      false
    );

    tx = await globalConstraintRegistrar.proposeGlobalConstraint(
      organization.avatar.address,
      tokenCapGC.address,
      globalConstraintParametersHash,
      votingMachineHash
    );

    proposalId = getValueFromLogs(tx, "_proposalId");

    assert.isOk(proposalId);

    // // we can also register an 'anonymous' constraint
    // const tokenCapGC = await TokenCapGC.new();
    // const tokenCapGCParamsHash = await tokenCapGC.setParameters(organization.token.address, 3000);
    //
    // proposalId = await organization.proposeGlobalConstraint({
    //   address: tokenCapGC.address,
    //   paramsHash: tokenCapGCParamsHash,
    // });
    //
    // assert.isOk(proposalId);
  });
});
