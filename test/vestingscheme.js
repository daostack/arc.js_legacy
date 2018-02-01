import { DAO } from "../lib/dao";
import { SOME_ADDRESS } from "./helpers";
import { VestingScheme } from "../lib/contracts/vestingscheme";

describe("VestingScheme scheme", () => {
  let dao;
  let vestingScheme;

  const createAgreement = async function (options) {

    await dao.token.approve(vestingScheme.address, options.amountPerPeriod * options.numOfAgreedPeriods);

    return await vestingScheme.create(options);
  };

  beforeEach(async () => {

    dao = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT",
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
      returnOnCancelAddress: SOME_ADDRESS,
      startingBlock: (await web3.eth.blockNumber) - 1,
      amountPerPeriod: web3.toWei(10),
      periodLength: 1,
      numOfAgreedPeriods: 1,
      cliffInPeriods: 0,
      signaturesReqToCancel: 1,
      signers: [accounts[0]]
    };

    let result = await createAgreement(options);
    const agreementId = result.agreementId;

    result = await vestingScheme.collect({ agreementId: agreementId });

    assert.isOk(result);
    assert.isOk(result.tx);
    assert.equal(result.tx.logs.length, 1); // no other event
    // TODO: remove "Log"
    assert.equal(result.tx.logs[0].event, "LogCollect");
  });

  it("revert sign to cancel agreement", async () => {

    const options = {
      token: await dao.token.address,
      beneficiary: SOME_ADDRESS,
      returnOnCancelAddress: SOME_ADDRESS,
      // startingBlock: null,
      amountPerPeriod: web3.toWei(10),
      periodLength: 1,
      numOfAgreedPeriods: 1,
      cliffInPeriods: 0,
      signaturesReqToCancel: 2,
      signers: [accounts[0], accounts[1]]
    };

    let result = await createAgreement(options);
    const agreementId = result.agreementId;

    // approve cancellation return of fees
    await dao.token.approve(vestingScheme.address, options.amountPerPeriod * options.numOfAgreedPeriods);

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
      beneficiary: SOME_ADDRESS,
      returnOnCancelAddress: accounts[0],
      // startingBlock: null,
      amountPerPeriod: web3.toWei(10),
      periodLength: 1,
      numOfAgreedPeriods: 1,
      cliffInPeriods: 0,
      signaturesReqToCancel: 1,
      signers: [accounts[0]]
    };

    let result = await createAgreement(options);
    const agreementId = result.agreementId;

    // approve cancellation return of fees
    await dao.token.approve(vestingScheme.address, options.amountPerPeriod * options.numOfAgreedPeriods);

    result = await vestingScheme.signToCancel({ agreementId: agreementId });

    assert.isOk(result);
    assert.isOk(result.tx);
    assert.equal(result.tx.logs[0].event, "SignToCancelAgreement");
    // TODO will need to change to AgreementCancel
    assert.equal(result.tx.logs[1].event, "LogAgreementCancel");
  });

  it("create agreement", async () => {

    const options = {
      token: await dao.token.address,
      beneficiary: SOME_ADDRESS,
      returnOnCancelAddress: SOME_ADDRESS,
      // startingBlock: null,
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
      beneficiary: SOME_ADDRESS,
      returnOnCancelAddress: SOME_ADDRESS,
      // startingBlock: null,
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
      beneficiary: SOME_ADDRESS,
      returnOnCancelAddress: SOME_ADDRESS,
      // startingBlock: null,
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
