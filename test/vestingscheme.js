import { DAO } from "../lib/dao";
import { SOME_ADDRESS } from "./helpers";
import { VestingScheme } from "../lib/contracts/vestingscheme";

describe("VestingScheme scheme", () => {
  let dao;
  let vestingScheme;

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
      signers: [SOME_ADDRESS]
    };

    await dao.token.approve(vestingScheme.address, options.amountPerPeriod * options.numOfAgreedPeriods);

    const result = await vestingScheme.create(options);

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
      signers: [SOME_ADDRESS]
    };

    const result = await vestingScheme.propose(Object.assign({ avatar: dao.avatar.address }, options));

    assert.isOk(result);
    assert.isOk(result.tx);
    assert.isOk(result.proposalId);
    assert.notEqual(result.proposalId, 0);
  });

  it("propose agreement fails on no period", async () => {

    const options = {
      beneficiary: SOME_ADDRESS,
      returnOnCancelAddress: SOME_ADDRESS,
      // startingBlock: null,
      amountPerPeriod: web3.toWei(10),
      // periodLength: 1,
      numOfAgreedPeriods: 1,
      cliffInPeriods: 0,
      signaturesReqToCancel: 1,
      signers: [SOME_ADDRESS]
    };

    try {
      await vestingScheme.propose(Object.assign({ avatar: dao.avatar.address }, options));
      assert(false, "should have thrown an exception");
    } catch (ex) {
      assert.equal(ex, "Error: Missing required properties: periodLength");
    }
  });

});
