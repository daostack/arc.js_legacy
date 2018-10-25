import { assert } from "chai";
import { DAO } from "../lib/dao";
import { TransactionService } from "../lib/transactionService";
import { Utils } from "../lib/utils";
import {
  Agreement,
  AgreementProposal,
  ArcTransactionAgreementResult,
  CreateVestingAgreementConfig,
  VestingSchemeFactory,
  VestingSchemeWrapper
} from "../lib/wrappers/vestingScheme";
import * as helpers from "./helpers";

describe("VestingScheme scheme", () => {
  let dao: DAO;
  let vestingScheme: VestingSchemeWrapper;

  const createAgreement = async (options: CreateVestingAgreementConfig): Promise<ArcTransactionAgreementResult> => {
    return await vestingScheme.create(options);
  };

  beforeEach(async () => {

    dao = await helpers.forgeDao({
      founders: [{
        address: accounts[0],
        reputation: web3.utils.toWei(1000),
        tokens: web3.utils.toWei(1000),
      }],
      schemes: [{
        name: "VestingScheme",
        votingMachineParams: {
          ownerVote: false,
        },
      }],
    });

    const schemeInDao = await dao.getSchemes("VestingScheme");

    assert.isOk(schemeInDao);
    assert.equal(schemeInDao.length, 1);
    assert.equal(schemeInDao[0].wrapper.name, "VestingScheme");

    vestingScheme = await VestingSchemeFactory.at(schemeInDao[0].address);

    assert.isOk(vestingScheme);

  });

  it("can get DAO's agreements", async () => {

    const options = {
      amountPerPeriod: web3.utils.toWei(10),
      beneficiaryAddress: accounts[1],
      cliffInPeriods: 0,
      numOfAgreedPeriods: 1,
      periodLength: 1,
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      signaturesReqToCancel: 3,
      signers: [accounts[0], accounts[1], accounts[2], accounts[3]],
    };

    const result = await vestingScheme.proposeVestingAgreement(Object.assign({ avatar: dao.avatar.address }, options));
    const proposalId1 = await result.getProposalIdFromMinedTx();

    const result2 = await vestingScheme.proposeVestingAgreement(Object.assign({ avatar: dao.avatar.address }, options));
    const proposalId2 = await result2.getProposalIdFromMinedTx();

    let agreements = await (await vestingScheme.getVotableProposals(dao.avatar.address))(
      {}, { fromBlock: 0 }).get();

    assert.equal(agreements.length, 2, "Should have found 2 agreements");
    assert(agreements.filter((a: AgreementProposal) => a.proposalId === proposalId1).length, "proposalId1 not found");
    assert(agreements.filter((a: AgreementProposal) => a.proposalId === proposalId2).length, "proposalId2 not found");

    agreements = await (await vestingScheme.getVotableProposals(dao.avatar.address))(
      { _proposalId: proposalId2 }, { fromBlock: 0 }).get();

    assert.equal(agreements.length, 1, "Should have found 1 agreement");
    assert(agreements.filter((p: AgreementProposal) => p.proposalId === proposalId2).length, "proposalId2 not found");
    assert.equal(agreements[0].beneficiaryAddress, accounts[1], "beneficiaryAddress not set properly on agreement");
  });

  it("can collect on the agreement", async () => {

    const options = {
      amountPerPeriod: web3.utils.toWei(10),
      beneficiaryAddress: accounts[0],
      cliffInPeriods: 0,
      numOfAgreedPeriods: 1,
      periodLength: 1,
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      signaturesReqToCancel: 1,
      signers: [accounts[0]],
      token: await dao.token.address,
    };

    const result = await createAgreement(options);
    const agreementId = await result.getAgreementIdFromMinedTx();

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    const result2 = await vestingScheme.collect({ agreementId });

    await result.getAgreementIdFromMinedTx();

    assert.isOk(result2);
    assert.isOk(result2.tx);
    const receipt = await result.watchForTxMined();
    assert.equal(receipt.logs.length, 1); // no other event
    // TODO! assert.equal(receipt.logs[0].event, "Collect");
  });

  it("revert sign to cancel agreement", async () => {

    const options = {
      amountPerPeriod: web3.utils.toWei(10),
      beneficiaryAddress: helpers.SOME_ADDRESS,
      cliffInPeriods: 0,
      numOfAgreedPeriods: 1,
      periodLength: 1,
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      signaturesReqToCancel: 2,
      signers: [accounts[0], accounts[1]],
      token: await dao.token.address,
    };

    const result = await createAgreement(options);
    const agreementId = await result.getAgreementIdFromMinedTx();

    let result2 = await vestingScheme.signToCancel({ agreementId });

    assert.isOk(result2);
    assert.isOk(result2.tx);
    let receipt = await result2.watchForTxMined();
    assert.equal(receipt.logs.length, 1); // no cancelled event
    // TODO! assert.equal(receipt.logs[0].event, "SignToCancelAgreement");

    result2 = await vestingScheme.revokeSignToCancel({ agreementId });

    assert.isOk(result2);
    assert.isOk(result2.tx);
    receipt = await result2.watchForTxMined();
    assert.equal(receipt.logs.length, 1); // no other event
    // TODO! assert.equal(receipt.logs[0].event, "RevokeSignToCancelAgreement");
  });

  it("sign to cancel agreement", async () => {

    const options = {
      amountPerPeriod: web3.utils.toWei(10),
      beneficiaryAddress: helpers.SOME_ADDRESS,
      cliffInPeriods: 0,
      numOfAgreedPeriods: 1,
      periodLength: 1,
      returnOnCancelAddress: accounts[0],
      signaturesReqToCancel: 1,
      signers: [accounts[0]],
      token: await dao.token.address,
    };

    const result = await createAgreement(options);
    const agreementId = await result.getAgreementIdFromMinedTx();

    const result2 = await (await vestingScheme.signToCancel({ agreementId })).watchForTxMined();

    assert.isOk(result2);
    // TODO! assert.equal(result2.logs[0].event, "SignToCancelAgreement");
    // TODO! assert.equal(result2.logs[1].event, "AgreementCancel");
  });

  it("create agreement", async () => {

    const options = {
      amountPerPeriod: web3.utils.toWei(10),
      beneficiaryAddress: helpers.SOME_ADDRESS,
      cliffInPeriods: 0,
      numOfAgreedPeriods: 1,
      periodLength: 1,
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      signaturesReqToCancel: 1,
      signers: [accounts[0]],
      token: await dao.token.address,
    };

    const result = await createAgreement(options);

    assert.isOk(result);
    assert.isOk(result.tx);
    const agreementId = await result.getAgreementIdFromMinedTx();
    assert(agreementId >= 0);
  });

  it("propose agreement", async () => {

    const options = {
      amountPerPeriod: web3.utils.toWei(10),
      avatar: dao.avatar.address,
      beneficiaryAddress: accounts[0],
      cliffInPeriods: 11,
      numOfAgreedPeriods: 3,
      periodLength: 2,
      returnOnCancelAddress: accounts[1],
      signaturesReqToCancel: 3,
      signers: [accounts[0], accounts[1], accounts[2]],
    };

    const result = await vestingScheme.proposeVestingAgreement(options);

    assert.isOk(result);
    assert.isOk(result.tx);
    const tx = await result.watchForTxMined();
    assert.equal(tx.logs.length, 1);
    assert.equal(tx.logs[0].event, "AgreementProposal");
    const avatarAddress = TransactionService.getValueFromLogs(tx, "_avatar", "AgreementProposal", 1);
    assert.equal(avatarAddress, dao.avatar.address);

    const proposalId = TransactionService.getValueFromLogs(tx, "_proposalId", "AgreementProposal", 1);
    const organizationProposal = await vestingScheme.contract.organizationsProposals(dao.avatar.address, proposalId);
    assert.equal(organizationProposal[0], dao.token.address);
    assert.equal(organizationProposal[1], accounts[0]); // beneficiary

    await result.votingMachine.vote({ proposalId, vote: 1 });

    const fetcher = vestingScheme.getExecutedProposals(dao.avatar.address)(
      { _proposalId: proposalId }, { fromBlock: 0 });

    const events = await fetcher.get();

    assert.equal(events.length, 1);
    assert.equal(events[0].proposalId, proposalId);
    assert.equal(typeof events[0].agreementId, "number");
    assert(events[0].agreementId > 0, "agreementId is not set");
  });

  it("propose agreement fails when no period is given", async () => {

    const options = {
      amountPerPeriod: web3.utils.toWei(10),
      beneficiaryAddress: helpers.SOME_ADDRESS,
      cliffInPeriods: 0,
      numOfAgreedPeriods: 1,
      periodLength: undefined,
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      signaturesReqToCancel: 1,
      signers: [accounts[0]],
    };

    try {
      await vestingScheme.proposeVestingAgreement(Object.assign({ avatar: dao.avatar.address }, options));
      assert(false, "should have thrown an exception");
    } catch (ex) {
      assert.equal(ex, "Error: periodLength must be greater than zero");
    }
  });

});
