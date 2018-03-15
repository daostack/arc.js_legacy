"use strict";
import "./helpers";
import { AbsoluteVote } from "../test-dist/contracts/absoluteVote";
import { DefaultSchemePermissions } from "../test-dist/commonTypes";
import { TestWrapper } from "../test-dist/test/contracts/testWrapper";
import { Utils } from "../test-dist/utils";

describe("ExtendTruffleContract", () => {
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
});
