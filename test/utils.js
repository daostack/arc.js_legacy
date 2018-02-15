"use strict";
import Utils from "../dist/utils";
import { ExtendTruffleContract } from "../dist/ExtendTruffleContract";
import * as helpers from "./helpers";

const ContributionRewardContract = Utils.requireContract("ContributionReward");

class ExtendTruffleContractSubclass extends ExtendTruffleContract(
  ContributionRewardContract
) {
  foo() {
    return "bar";
  }

  aMethod() {
    return "abc";
  }

  async setParams(params) {
    params = Object.assign({},
      {
        orgNativeTokenFee: 0
      },
      params);

    return super.setParams(
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
    assert.equal(scheme.aMethod(), "abc");
    assert.equal(
      (await scheme.setParams({
        orgNativeTokenFee: 0,
        voteParametersHash: helpers.SOME_HASH,
        votingMachine: helpers.SOME_ADDRESS
      })).result,
      "0x59af66fa0cefc060220aa22b6d9420988e6037221ca060f3140baa53883138ba"
    );
    assert.equal(scheme.getDefaultPermissions(), "0x00000009");

    scheme = await ExtendTruffleContractSubclass.at(
      (await ContributionRewardContract.deployed()).address // an address will do
    );
    assert.equal(scheme.foo(), "bar");
    assert.equal(scheme.aMethod(), "abc");
  });
});
