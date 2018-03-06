import * as helpers from "./helpers";
import { VestingScheme } from "../test-dist/contracts/vestingscheme";

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
    assert.equal(schemeInDao[0].name, "VestingScheme");

    vestingScheme = await VestingScheme.at(schemeInDao[0].address);

    assert.isOk(vestingScheme);

  });

  it("collect on the agreement", async () => {

    const options = {
      token: await dao.token.address,
      beneficiary: accounts[0],
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
      beneficiary: helpers.SOME_ADDRESS,
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
      beneficiary: helpers.SOME_ADDRESS,
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
      beneficiary: helpers.SOME_ADDRESS,
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
      beneficiary: helpers.SOME_ADDRESS,
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
    assert.isOk(result.proposalId);
  });

  it("propose agreement fails when no period is given", async () => {

    const options = {
      beneficiary: helpers.SOME_ADDRESS,
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
