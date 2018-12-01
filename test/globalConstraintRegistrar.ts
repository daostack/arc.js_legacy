import { assert } from "chai";
import { Address, DefaultSchemePermissions, Hash } from "../lib/commonTypes";
import { DAO } from "../lib/dao";
import { TransactionReceiptTruffle } from "../lib/transactionService";
import {
  GlobalConstraintRegistrarFactory,
  GlobalConstraintRegistrarWrapper
} from "../lib/wrappers/globalConstraintRegistrar";
import { TokenCapGCFactory, TokenCapGCWrapper } from "../lib/wrappers/tokenCapGC";
import { WrapperService } from "../lib/wrapperService";
import * as helpers from "./helpers";

describe("GlobalConstraintRegistrar", () => {

  let dao: DAO;

  beforeEach(async () => {
    dao = await helpers.forgeDao();
  });

  const addGlobalConstraint = async (): Promise<{
    proposalId: Hash,
    gcAddress: Address,
    globalConstraintRegistrar: GlobalConstraintRegistrarWrapper,
    tx: TransactionReceiptTruffle
  }> => {
    const tokenCapGC = WrapperService.wrappers.TokenCapGC;

    const globalConstraintParametersHash =
      (await tokenCapGC.setParameters({ token: dao.token.address, cap: "3141" })).result;

    const globalConstraintRegistrar = await helpers.getDaoScheme(
      dao,
      "GlobalConstraintRegistrar",
      GlobalConstraintRegistrarFactory) as GlobalConstraintRegistrarWrapper;

    const votingMachineHash = await helpers.getSchemeVotingMachineParametersHash(dao, globalConstraintRegistrar);

    const result = await globalConstraintRegistrar.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash,
      votingMachineHash,
    });

    return {
      gcAddress: tokenCapGC.address,
      globalConstraintRegistrar,
      proposalId: await result.getProposalIdFromMinedTx(),
      tx: await result.watchForTxMined(),
    };
  };

  it("can get votable proposals", async () => {

    dao = await helpers.forgeDao({
      votingMachineParams: {
        votePerc: 90,
      },
    });

    const result = await addGlobalConstraint();
    const globalConstraintRegistrar = result.globalConstraintRegistrar;

    const proposalId = result.proposalId;

    const proposals = await (await globalConstraintRegistrar.getVotableAddGcProposals(dao.avatar.address))(
      { _proposalId: proposalId }, { fromBlock: 0 }).get();

    assert.equal(proposals.length, 1);

    const proposal = proposals[0];
    assert.equal(proposal.proposalId, proposalId);
    assert.equal(proposal.constraintAddress, result.gcAddress);
  });

  it("returns the right permission", async () => {

    const gcr = await helpers.getDaoScheme(
      dao,
      "GlobalConstraintRegistrar",
      GlobalConstraintRegistrarFactory) as GlobalConstraintRegistrarWrapper;

    const perms = await gcr.getSchemePermissions(dao.avatar.address);

    assert.equal(perms, DefaultSchemePermissions.GlobalConstraintRegistrar as any);
  });

  it("can get added constraints", async () => {

    const result = await addGlobalConstraint();
    const globalConstraintRegistrar = result.globalConstraintRegistrar;

    const proposalId = result.proposalId;

    const proposals = await globalConstraintRegistrar.NewGlobalConstraintsProposal(
      { _gc: result.gcAddress, _proposalId: proposalId }, { fromBlock: 0 }).get();

    assert.equal(proposals.length, 1);

    const proposal = proposals[0];
    assert.equal(proposal.args._proposalId, proposalId);
  });

  it("can get removed constraints", async () => {

    const result = await addGlobalConstraint();
    const globalConstraintRegistrar = result.globalConstraintRegistrar;

    const votingMachine = await helpers.getSchemeVotingMachine(dao, globalConstraintRegistrar);

    await helpers.vote(votingMachine, result.proposalId, 1, accounts[1]);

    const removeResult = await globalConstraintRegistrar.proposeToRemoveGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraintAddress: result.gcAddress,
    });

    const proposalId = await removeResult.getProposalIdFromMinedTx();

    const proposals = await globalConstraintRegistrar.RemoveGlobalConstraintsProposal(
      { _gc: result.gcAddress, _proposalId: proposalId }, { fromBlock: 0 }).get();

    assert.equal(proposals.length, 1);

    const proposal = proposals[0];
    assert.equal(proposal.args._proposalId, proposalId);
  });

  it("can remove constraints", async () => {

    const result = await addGlobalConstraint();
    const globalConstraintRegistrar = result.globalConstraintRegistrar;

    const votingMachine = await helpers.getSchemeVotingMachine(dao, globalConstraintRegistrar);

    await helpers.vote(votingMachine, result.proposalId, 1, accounts[1]);

    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 1);

    const removeResult = await globalConstraintRegistrar.proposeToRemoveGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraintAddress: result.gcAddress,
    });

    await helpers.vote(votingMachine, await removeResult.getProposalIdFromMinedTx(), 1, accounts[1]);

    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 0);
  });

  it("should satisfy a number of basic checks", async () => {
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
    const tokenCapParams = { token: dao.token.address, cap: "3141" };
    // register paramets for setting a cap on the nativeToken of our dao of 21 million
    const tokenCapGCParamsHash = (await tokenCapGC.setParameters(tokenCapParams)).result;

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
    const voteRegisterParams = await helpers.getVotingMachineParameters(votingMachine, parametersForVotingInGCR[0]);

    const msg = "These parameters are not known the voting machine...";
    assert.notEqual(voteRegisterParams[0], "0x0000000000000000000000000000000000000000", msg);

    const result = await gcr.proposeToAddModifyGlobalConstraint({
      avatar: dao.avatar.address,
      globalConstraint: tokenCapGC.address,
      globalConstraintParametersHash: tokenCapGCParamsHash,
      votingMachineHash,
    });

    // check if the proposal is known on the GlobalConstraintRegistrar
    const proposalId = await result.getProposalIdFromMinedTx();
    // TODO: read the proposal in the contract:
    // const proposal = await gcr.proposals(proposalId);
    // // the proposal looks like gc-address, params, proposaltype, removeParams
    // assert.equal(proposal[0], tokenCapGC.address);

    await helpers.vote(votingMachine, proposalId, 1, accounts[1]);

    // at this point, our global constraint has been registered at the dao
    assert.equal((await dao.controller.globalConstraintsCount(dao.avatar.address))[1].toNumber(), 1);

    const tokenWrapper = await WrapperService.factories.TokenCapGC.at(tokenCapGC.address) as TokenCapGCWrapper;

    const paramsHash = await tokenWrapper.getRegisteredParametersHash(dao.avatar.address);

    assert.equal(paramsHash, tokenCapGCParamsHash);

    const params = await tokenWrapper.getRegisteredParameters(dao.avatar.address);

    assert.equal(params.cap.toString(), tokenCapParams.cap);
    assert.equal(params.token, tokenCapParams.token);
  });
});
