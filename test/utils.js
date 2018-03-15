"use strict";
import "./helpers";
import { AbsoluteVote } from "../test-dist/contracts/absoluteVote";
import { DefaultSchemePermissions } from "../test-dist/commonTypes";
import { LoggingService, LogLevel } from "../test-dist/loggingService";
import { TestWrapper } from "../test-dist/test/contracts/testWrapper";
import { Utils } from "../test-dist/utils";
import * as helpers from "./helpers";

describe("Utils", () => {

  it("can log something", async () => {
    LoggingService.error("this is a message that should appear in red and not crash");
  });

  it("can get a single event in timely manner", async () => {

    const dao = await helpers.forgeDao();

    const uController = await (await Utils.requireContract("UController")).deployed();

    LoggingService.setLogLevel(LogLevel.info);

    let timeEnd;
    let lastSchemeAddress;
    let lastAvatarAddress;
    let timeStart = new Date();

    let event = uController.RegisterScheme({}, { fromBlock: 0, toBlock: "latest" });

    await new Promise((resolve) => {
      event.get((err, log) => {
        if (!Array.isArray(log)) { log = [log]; }
        timeEnd = new Date();
        LoggingService.info(`logs returned: ${log.length}`);
        lastSchemeAddress = log[log.length - 1].args._scheme;
        lastAvatarAddress = log[log.length - 1].args._avatar;
        resolve();
      });
    });

    let elapsedTime = new Date();
    elapsedTime.setTime(timeEnd.getTime() - timeStart.getTime());

    LoggingService.info(`all events, elapsed time: ${elapsedTime.getMilliseconds()}ms`);

    event = uController.RegisterScheme({}, { fromBlock: 0, toBlock: "latest" });

    await new Promise((resolve) => {
      event.get((err, log) => {
        if (!Array.isArray(log)) { log = [log]; }
        for (let i = 0; i < log.length; ++i) {
          const event = log[i].args;
          if ((event._scheme === lastSchemeAddress) &&
            (event._avatar === lastAvatarAddress)) {
            break;
          }
        }
        LoggingService.info(`logs returned: ${log.length}`);
        timeEnd = new Date();
        resolve();
      });
    });

    elapsedTime = new Date();
    elapsedTime.setTime(timeEnd.getTime() - timeStart.getTime());

    LoggingService.info(`filtered events, elapsed time: ${elapsedTime.getMilliseconds()}ms`);

    timeStart = new Date();

    event = uController.RegisterScheme({ "_scheme": lastSchemeAddress, "_avatar": lastAvatarAddress }, { fromBlock: 0, toBlock: "latest" });

    await new Promise((resolve) => {
      event.get((err, log) => {
        if (!Array.isArray(log)) { log = [log]; }
        LoggingService.info(`logs returned: ${log.length}`);
        timeEnd = new Date();
        resolve();
      });
    });

    elapsedTime = new Date();
    elapsedTime.setTime(timeEnd.getTime() - timeStart.getTime());

    LoggingService.info(`one event, elapsed time: ${elapsedTime.getMilliseconds()}ms`);

    LoggingService.setLogLevel(LogLevel.error);
  });

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

    const hashSolidity = (await scheme.setParameters(params)).result;

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

    await scheme.setParameters(params);

    assert.equal(await Utils.parametersHashExists(scheme, types, values),
      true, "parameters hash incorrectly found not to exist");
  });
});
