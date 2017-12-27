"use strict";
import { ExtendTruffleContract, requireContract } from '../lib/utils.js';
import * as helpers from './helpers';

const ContributionRewardContract = requireContract("ContributionReward");

class ContributionReward extends ExtendTruffleContract(ContributionRewardContract) {

  foo() {
    // console.log('foo() called');
    return 'bar';
  }

  submitContribution() {
    // console.log('submitContribution() called');
    return 'abc';
  }


  async setParams(params) {
    return await this._setParameters(params.orgNativeTokenFee, params.schemeNativeTokenFee, params.voteParametersHash, params.votingMachine);
  }

  getDefaultPermissions(overrideValue) {
    return overrideValue || '0x00000009';
  }

}


describe('ExtendTruffleContract', () => {

  it("Must have sane inheritance", async () => {
    let x;

    x = await ContributionReward.new();
    assert.isOk(x.nativeToken());
    assert.equal(x.foo(), 'bar');
    assert.equal(x.submitContribution(), 'abc');
    assert.equal(await x.nativeToken(), await x.contract.nativeToken());
    assert.equal(await x.setParams({ orgNativeTokenFee: 0, schemeNativeTokenFee: 0, voteParametersHash: helpers.SOME_HASH, votingMachine: helpers.SOME_ADDRESS }), '0xb6660b30e997e8e19cd58699fbf81c41450f200dbcb9f6a85c07b08483c86ee9');
    assert.equal(x.getDefaultPermissions(), '0x00000009');

    x = await ContributionReward.at((await ContributionRewardContract.deployed()).address);
    assert.isOk(x.nativeToken());
    assert.equal(x.foo(), 'bar');
    assert.equal(x.submitContribution(), 'abc');
    assert.equal(await x.nativeToken(), await x.contract.nativeToken());

    x = await ContributionReward.at((await ContributionRewardContract.deployed()).address);
    assert.isOk(x.nativeToken());
    assert.equal(x.foo(), 'bar');
    assert.equal(x.submitContribution(), 'abc');
    assert.equal(await x.nativeToken(), await x.contract.nativeToken());

  });
});
