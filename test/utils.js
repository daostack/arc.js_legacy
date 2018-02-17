"use strict";
import "./helpers";
import { TestWrapper } from "../test-dist/contracts/testWrapper";
import { AbsoluteVote } from "../test-dist/contracts/AbsoluteVote";

describe("ExtendTruffleContract", () => {
  it("Must have sane inheritance", async () => {
    let scheme;

    assert.isOk(TestWrapper, "TestWrapperWrapper is not defined");
    assert.isOk(TestWrapper.deployed, "TestWrapperWrapper.deployed is not defined");
    scheme = await TestWrapper.deployed();
    assert.equal(scheme.foo(), "bar");
    assert.equal(scheme.aMethod(), "abc");
    assert.equal(
      (await scheme.setParams({})).result,
      "0xfc844154428d1b1c6806ceacdd3ed0974cc02c30983036bc5db6b5aed2fa394b"
    );
    assert.equal(scheme.getDefaultPermissions(), "0x00000009");

    scheme = await TestWrapper.at((await AbsoluteVote.deployed()).address);
    assert.equal(scheme.foo(), "bar");
    assert.equal(scheme.aMethod(), "abc");
  });
});
