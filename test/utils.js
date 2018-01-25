"use strict";
import { requireContract } from "../lib/utils.js";
import { ExtendTruffleContract } from "../lib/ExtendTruffleContract";
import * as helpers from "./helpers";

const ContributionRewardContract = requireContract("ContributionReward");

class ExtendTruffleContractSubclass extends ExtendTruffleContract(
  ContributionRewardContract
) {
  foo() {
    return "bar";
  }

  proposeContributionReward() {
    return "abc";
  }

  async setParams(params) {
    return await this._setParameters(
      params.orgNativeTokenFee,
      params.voteParametersHash,
      params.votingMachine
    );
  }

  getDefaultPermissions(overrideValue) {
    return overrideValue || "0x00000009";
  }
}

describe("ExtendTruffleContract", () => {
  it("Must have sane inheritance", async () => {
    let scheme;

    scheme = await ExtendTruffleContractSubclass.new();
    assert.equal(scheme.foo(), "bar");
    assert.equal(scheme.proposeContributionReward(), "abc");
    assert.equal(
      await scheme.setParams({
        orgNativeTokenFee: 0,
        voteParametersHash: helpers.SOME_HASH,
        votingMachine: helpers.SOME_ADDRESS
      }),
      "0x59af66fa0cefc060220aa22b6d9420988e6037221ca060f3140baa53883138ba"
    );
    assert.equal(scheme.getDefaultPermissions(), "0x00000009");

    scheme = await ExtendTruffleContractSubclass.at(
      (await ContributionRewardContract.deployed()).address
    );
    assert.equal(scheme.foo(), "bar");
    assert.equal(scheme.proposeContributionReward(), "abc");
  });
});
