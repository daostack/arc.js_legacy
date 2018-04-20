import { assert } from "chai";
import { DAO } from "../lib";
import {
  Agreement,
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
        reputation: web3.toWei(1000),
        tokens: web3.toWei(1000),
      }],
      schemes: [{ name: "VestingScheme" }],
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
      amountPerPeriod: web3.toWei(10),
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
    const agreementId1 = result.agreementId;

    const result2 = await createAgreement(options);
    const agreementId2 = result2.agreementId;

    let agreements = await vestingScheme.getAgreements({ avatar: dao.avatar.address });

    assert(agreements.length >= 2, "Should have found at least 2 agreements");
    assert(agreements.filter((a: Agreement) => a.agreementId === agreementId1).length, "agreementId1 not found");
    assert(agreements.filter((a: Agreement) => a.agreementId === agreementId2).length, "agreement2 not found");

    agreements = await vestingScheme.getAgreements({ avatar: dao.avatar.address, agreementId: agreementId2 });

    assert.equal(agreements.length, 1, "Should have found 1 agreements");
    assert(agreements.filter((p: Agreement) => p.agreementId === agreementId2).length, "agreement2 not found");
    assert.equal(agreements[0].beneficiaryAddress, accounts[0], "beneficiaryAddress not set properly on agreement");
  });

  it("can collect on the agreement", async () => {

    const options = {
      amountPerPeriod: web3.toWei(10),
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
    const agreementId = result.agreementId;

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    const result2 = await vestingScheme.collect({ agreementId });

    assert.isOk(result2);
    assert.isOk(result2.tx);
    assert.equal(result2.tx.logs.length, 1); // no other event
    assert.equal(result2.tx.logs[0].event, "Collect");
  });

  it("revert sign to cancel agreement", async () => {

    const options = {
      amountPerPeriod: web3.toWei(10),
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
    const agreementId = result.agreementId;

    let result2 = await vestingScheme.signToCancel({ agreementId });

    assert.isOk(result2);
    assert.isOk(result2.tx);
    assert.equal(result2.tx.logs.length, 1); // no cancelled event
    assert.equal(result2.tx.logs[0].event, "SignToCancelAgreement");

    result2 = await vestingScheme.revokeSignToCancel({ agreementId });

    assert.isOk(result2);
    assert.isOk(result2.tx);
    assert.equal(result2.tx.logs.length, 1); // no other event
    assert.equal(result2.tx.logs[0].event, "RevokeSignToCancelAgreement");
  });

  it("sign to cancel agreement", async () => {

    const options = {
      amountPerPeriod: web3.toWei(10),
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
    const agreementId = result.agreementId;

    const result2 = await vestingScheme.signToCancel({ agreementId });

    assert.isOk(result2);
    assert.isOk(result2.tx);
    assert.equal(result2.tx.logs[0].event, "SignToCancelAgreement");
    assert.equal(result2.tx.logs[1].event, "AgreementCancel");
  });

  it("create agreement", async () => {

    const options = {
      amountPerPeriod: web3.toWei(10),
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
    assert.isOk(result.agreementId);
    assert(result.agreementId >= 0);
  });

  it("propose agreement", async () => {

    const options = {
      amountPerPeriod: web3.toWei(10),
      beneficiaryAddress: helpers.SOME_ADDRESS,
      cliffInPeriods: 0,
      numOfAgreedPeriods: 1,
      periodLength: 1,
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      signaturesReqToCancel: 1,
      signers: [accounts[0]],
    };

    const result = await vestingScheme.propose(Object.assign({ avatar: dao.avatar.address }, options));

    assert.isOk(result);
    assert.isOk(result.tx);
  });

  it("propose agreement fails when no period is given", async () => {

    const options = {
      amountPerPeriod: web3.toWei(10),
      beneficiaryAddress: helpers.SOME_ADDRESS,
      cliffInPeriods: 0,
      numOfAgreedPeriods: 1,
      periodLength: undefined,
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      signaturesReqToCancel: 1,
      signers: [accounts[0]],
    };

    try {
      await vestingScheme.propose(Object.assign({ avatar: dao.avatar.address }, options));
      assert(false, "should have thrown an exception");
    } catch (ex) {
      assert.equal(ex, "Error: periodLength must be an integer greater than zero");
    }
  });

});
