"use strict";
import "./helpers";
import { AbsoluteVote } from "../test-dist/contracts/absoluteVote";
import { DefaultSchemePermissions } from "../test-dist/commonTypes";
import { TestWrapper } from "../test-dist/test/contracts/testWrapper";
import { Utils } from "../test-dist/utils";

describe("ContractWrapperBase", () => {
  it("can call getDefaultAccount", async () => {
    const defaultAccount = accounts[0];
    const defaultAccountAsync = await Utils.getDefaultAccount();
    assert(defaultAccount === defaultAccountAsync);
  });

  it("Must have sane inheritance", async () => {
    let scheme;

    assert.isOk(TestWrapper, "TestWrapperWrapper is not defined");
    assert.isOk(TestWrapper.deployed, "TestWrapperWrapper.deployed is not defined");
    scheme = await TestWrapper.deployed();
    assert.equal(scheme.foo(), "bar");
    assert.equal(scheme.aMethod(), "abc");
    assert.equal(
      (await scheme.setParameters({})).result,
      "0xfc844154428d1b1c6806ceacdd3ed0974cc02c30983036bc5db6b5aed2fa394b"
    );
    assert.equal(scheme.getDefaultPermissions(), DefaultSchemePermissions.MinimumPermissions);

    scheme = await TestWrapper.at((await AbsoluteVote.deployed()).address);
    assert.equal(scheme.foo(), "bar");
    assert.equal(scheme.aMethod(), "abc");
  });

  it("Must hash like solidity", async () => {
    const scheme = await TestWrapper.deployed();

    const params = {
      ownerVote: false,
      reputation: "0x1000000000000067bd0000000000000000000000",
      votePerc: Math.floor(Math.random() * Math.floor(100))
    };

    const values = [params.reputation, params.votePerc, params.ownerVote];

    const types = ["address", "uint", "bool"];

    const hashUtils = Utils.keccak256(types, values);

    const hashSolidity = (await scheme.setParams(params)).result;

    assert.equal(hashUtils, hashSolidity, "hashed values are not equal");
  });

  it("Must correctly check for existing parameters hash", async () => {
    const scheme = await TestWrapper.deployed();

    const params = {
      ownerVote: false,
      reputation: "0x1000000000000067bd0000000000000000000000",
      votePerc: Math.floor(Math.random() * Math.floor(100))
    };

    const values = [params.reputation, params.votePerc, params.ownerVote];

    const types = ["address", "uint", "bool"];

    assert.equal(await Utils.parametersHashExists(scheme, types, values),
      false, "parameters hash incorrectly found to exist");

    await scheme.setParams(params);

    assert.equal(await Utils.parametersHashExists(scheme, types, values),
      true, "parameters hash incorrectly found not to exist");
  });
});
