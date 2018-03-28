import * as helpers from "./helpers";
import { VestingScheme } from "../test-dist/wrappers/vestingscheme";

describe("VestingScheme scheme", () => {
  let dao;
  let vestingScheme;

  const createAgreement = async (options) => {
    return await vestingScheme.create(options);
  };

  beforeEach(async () => {

    dao = await helpers.forgeDao({
      schemes: [{ name: "VestingScheme" }],
      founders: [{
        address: accounts[0],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(1000)
      }]
    });

    const schemeInDao = await dao.getSchemes("VestingScheme");

    assert.isOk(schemeInDao);
    assert.equal(schemeInDao.length, 1);
    assert.equal(schemeInDao[0].wrapper.name, "VestingScheme");

    vestingScheme = await VestingScheme.at(schemeInDao[0].address);

    assert.isOk(vestingScheme);

  });

  it("can get DAO's agreements", async () => {

    const options = {
      token: await dao.token.address,
      beneficiaryAddress: accounts[0],
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      amountPerPeriod: web3.toWei(10),
      periodLength: 1,
      numOfAgreedPeriods: 1,
      cliffInPeriods: 0,
      signaturesReqToCancel: 1,
      signers: [accounts[0]]
    };

    let result = await createAgreement(options);
    const agreementId1 = result.agreementId;

    result = await createAgreement(options);
    const agreementId2 = result.agreementId;

    let agreements = await vestingScheme.getAgreements({ avatar: dao.avatar.address });

    assert(agreements.length >= 2, "Should have found at least 2 agreements");
    assert(agreements.filter(a => a.agreementId === agreementId1).length, "agreementId1 not found");
    assert(agreements.filter(a => a.agreementId === agreementId2).length, "agreement2 not found");

    agreements = await vestingScheme.getAgreements({ avatar: dao.avatar.address, agreementId: agreementId2 });

    assert.equal(agreements.length, 1, "Should have found 1 agreements");
    assert(agreements.filter(p => p.agreementId === agreementId2).length, "agreement2 not found");
    assert.equal(agreements[0].beneficiaryAddress, accounts[0], "beneficiaryAddress not set properly on agreement");
  });

  it("can collect on the agreement", async () => {

    const options = {
      token: await dao.token.address,
      beneficiaryAddress: accounts[0],
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      amountPerPeriod: web3.toWei(10),
      periodLength: 1,
      numOfAgreedPeriods: 1,
      cliffInPeriods: 0,
      signaturesReqToCancel: 1,
      signers: [accounts[0]]
    };

    let result = await createAgreement(options);
    const agreementId = result.agreementId;

    // this will mine a block, allowing the award to be redeemed
    await helpers.increaseTime(1);

    result = await vestingScheme.collect({ agreementId: agreementId });

    assert.isOk(result);
    assert.isOk(result.tx);
    assert.equal(result.tx.logs.length, 1); // no other event
    assert.equal(result.tx.logs[0].event, "Collect");
  });

  it("revert sign to cancel agreement", async () => {

    const options = {
      token: await dao.token.address,
      beneficiaryAddress: helpers.SOME_ADDRESS,
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      amountPerPeriod: web3.toWei(10),
      periodLength: 1,
      numOfAgreedPeriods: 1,
      cliffInPeriods: 0,
      signaturesReqToCancel: 2,
      signers: [accounts[0], accounts[1]]
    };

    let result = await createAgreement(options);
    const agreementId = result.agreementId;

    result = await vestingScheme.signToCancel({ agreementId: agreementId });

    assert.isOk(result);
    assert.isOk(result.tx);
    assert.equal(result.tx.logs.length, 1); // no cancelled event
    assert.equal(result.tx.logs[0].event, "SignToCancelAgreement");

    result = await vestingScheme.revokeSignToCancel({ agreementId: agreementId });

    assert.isOk(result);
    assert.isOk(result.tx);
    assert.equal(result.tx.logs.length, 1); // no other event
    assert.equal(result.tx.logs[0].event, "RevokeSignToCancelAgreement");
  });


  it("sign to cancel agreement", async () => {

    const options = {
      token: await dao.token.address,
      beneficiaryAddress: helpers.SOME_ADDRESS,
      returnOnCancelAddress: accounts[0],
      amountPerPeriod: web3.toWei(10),
      periodLength: 1,
      numOfAgreedPeriods: 1,
      cliffInPeriods: 0,
      signaturesReqToCancel: 1,
      signers: [accounts[0]]
    };

    let result = await createAgreement(options);
    const agreementId = result.agreementId;

    result = await vestingScheme.signToCancel({ agreementId: agreementId });

    assert.isOk(result);
    assert.isOk(result.tx);
    assert.equal(result.tx.logs[0].event, "SignToCancelAgreement");
    assert.equal(result.tx.logs[1].event, "AgreementCancel");
  });

  it("create agreement", async () => {

    const options = {
      token: await dao.token.address,
      beneficiaryAddress: helpers.SOME_ADDRESS,
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      amountPerPeriod: web3.toWei(10),
      periodLength: 1,
      numOfAgreedPeriods: 1,
      cliffInPeriods: 0,
      signaturesReqToCancel: 1,
      signers: [accounts[0]]
    };

    const result = await createAgreement(options);

    assert.isOk(result);
    assert.isOk(result.tx);
    assert.isOk(result.agreementId);
    assert(result.agreementId >= 0);
  });

  it("propose agreement", async () => {

    const options = {
      beneficiaryAddress: helpers.SOME_ADDRESS,
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      amountPerPeriod: web3.toWei(10),
      periodLength: 1,
      numOfAgreedPeriods: 1,
      cliffInPeriods: 0,
      signaturesReqToCancel: 1,
      signers: [accounts[0]]
    };

    const result = await vestingScheme.propose(Object.assign({ avatar: dao.avatar.address }, options));

    assert.isOk(result);
    assert.isOk(result.tx);
  });

  it("propose agreement fails when no period is given", async () => {

    const options = {
      beneficiaryAddress: helpers.SOME_ADDRESS,
      returnOnCancelAddress: helpers.SOME_ADDRESS,
      amountPerPeriod: web3.toWei(10),
      // periodLength: 1,
      numOfAgreedPeriods: 1,
      cliffInPeriods: 0,
      signaturesReqToCancel: 1,
      signers: [accounts[0]]
    };

    try {
      await vestingScheme.propose(Object.assign({ avatar: dao.avatar.address }, options));
      assert(false, "should have thrown an exception");
    } catch (ex) {
      assert.equal(ex, "Error: Missing required properties: periodLength");
    }
  });

});
