"use strict";
import { assert } from "chai";
import { ConfigService } from "../lib/configService";
import { InitializeArcJs } from "../lib/index";
import { LoggingService } from "../lib/loggingService";
import { PubSubEventService } from "../lib/pubSubEventService";
import { Utils } from "../lib/utils";
import { WrapperService } from "../lib/wrapperService";
import * as helpers from "./helpers";

describe("Misc", () => {

  it("can set/get txDepthRequiredForConfirmation", async () => {

    let setting = ConfigService.get("logLevel");
    assert.equal(setting, 9);

    setting = ConfigService.get("txDepthRequiredForConfirmation.live");
    assert.equal(setting, 20);

    setting = ConfigService.set("txDepthRequiredForConfirmation.live", 10);

    setting = ConfigService.get("txDepthRequiredForConfirmation.live");
    assert.equal(setting, 10);
  });

  it("can update logLevel via config", async () => {
    assert.equal(LoggingService.logLevel, 9);
    ConfigService.set("logLevel", 5);
    await helpers.sleep(50);
    assert.equal(LoggingService.logLevel, 5);
    ConfigService.set("logLevel", helpers.DefaultLogLevel);
  });

  it("can check correct wrapper", async () => {

    await InitializeArcJs({
      filter: {
        AbsoluteVote: true,
        GenesisProtocol: true,
      },
    });

    const contractNameShouldBe = "GenesisProtocol";
    const contractNameDontWant = "AbsoluteVote";
    /**
     * We know there is a contract at the given address, but it is an AV, not a GP that
     * we're asking for.
     */
    let wrapperFound = await WrapperService.factories[contractNameShouldBe]
      .at(WrapperService.wrappers[contractNameDontWant].address);

    let confirmed = await WrapperService.confirmContractType(wrapperFound);

    assert(!confirmed);

    wrapperFound = await WrapperService.factories[contractNameShouldBe]
      .at(WrapperService.wrappers[contractNameShouldBe].address);

    confirmed = await WrapperService.confirmContractType(wrapperFound);

    assert(confirmed);

  });

  it("has GEN token balance", async () => {
    const balance = web3.utils.fromWei(await Utils.getGenTokenBalance(accounts[0]));
    assert(balance.gtn(0));
  });

  it("LoggingService can stringify circular object", async () => {
    const objA: any = {};
    const objB: any = { objA };
    objA.objB = objB; // objB ends up referencing itself via objA

    // should not throw exception
    LoggingService.stringifyObject(objA);
  });
});

describe("PubSub events", () => {
  it("topicSubsumes works", async () => {
    let testId = 0;

    /* tslint:disable:max-line-length */
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy("*", "foo"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["*"], "foo"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy([], ""), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy([""], ""), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("", ""), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("", "foo"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foobar", "foo"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy("foo", "foo"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy("foo.bar", "foo.bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy("foo", "foo.bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy("foo", "foo.bar.test"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo", "foobar.test"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foobar", "foo.bar"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo.bar", "foo"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo.bar.test", "foo"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo.bar.", "foo"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo.bar.", "foo."), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo.bar", "foo."), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["flank", "foo"], "bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["foo", "bar"], "bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["bar", "foo"], "bar"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["barn", "foo.bar", "flank"], "bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["barn", "foo", "flank"], "foo.bar"), `test failed: ${++testId}`);
    /* tslint:enable:max-line-length */
  });

  it("isTopicSpecifiedBy works", async () => {
    let testId = 0;

    /* tslint:disable:max-line-length */
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy("*", "foo"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["*"], "foo"), `test failed: ${++testId}`);

    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["*.foo"], "foo"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["foo.*"], "foo.bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["foo.*"], "foo.bar.flank"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["foo.*.flank"], "foo.bar.flank"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["foo.*.flank"], "far.bar.flarg"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["*.foo"], "foo.bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["*.foo"], "bar.foo"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["*.foo"], "bar.foo.flank"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["foo.bar.*"], "foo.bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["foo.bar.*"], "foo.bar.flank"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["foo.flank.*"], "foo.bar.flank"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["far.bar.*"], "foo.bar.flank"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["far.bar.*", "foo.*"], "foo.bar.flank"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["foo.*", "far.bar.*"], "foo.bar.flank"), `test failed: ${++testId}`);

    assert.isFalse(PubSubEventService.isTopicSpecifiedBy([], ""), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["."], "foo"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["...."], "foo"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy([".foo"], "foo"), `test failed: ${++testId}`);

    assert.isFalse(PubSubEventService.isTopicSpecifiedBy([""], ""), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("", ""), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("", "foo"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foobar", "foo"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy("foo", "foo"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy("foo.bar", "foo.bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy("foo", "foo.bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy("foo", "foo.bar.test"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo", "foobar.test"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foobar", "foo.bar"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo.bar", "foo"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo.bar.test", "foo"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo.bar.", "foo"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo.bar.", "foo."), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy("foo.bar", "foo."), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["flank", "foo"], "bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["foo", "bar"], "bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["bar", "foo"], "bar"), `test failed: ${++testId}`);
    assert.isFalse(PubSubEventService.isTopicSpecifiedBy(["barn", "foo.bar", "flank"], "bar"), `test failed: ${++testId}`);
    assert.isTrue(PubSubEventService.isTopicSpecifiedBy(["barn", "foo", "flank"], "foo.bar"), `test failed: ${++testId}`);
    /* tslint:enable:max-line-length */
  });
});

describe("InitializeArcJs", () => {
  it("initializes subset of schemes and can create a DAO", async () => {
    await InitializeArcJs({
      filter: {
        AbsoluteVote: true,
        DaoCreator: true,
      },
    });
    await helpers.forgeDao({
      name: "ArcJsTestDao",
      schemes: [],
      tokenName: "Tokens of ArcJsTestDao",
      tokenSymbol: "ATD",
    });
  });

  it("Proper error when no web3", async () => {

    const web3 = await Utils.getWeb3();
    const providerUrl = ConfigService.get("providerUrl");
    let exceptionRaised = false;
    try {
      (Utils as any).web3 = undefined;
      (global as any).web3 = undefined;
      ConfigService.set("providerUrl", "sdfkjh");
      await InitializeArcJs();
    } catch (ex) {
      exceptionRaised = ex.message.includes("Utils.getWeb3: web3 is not connected to a net");
    }
    (global as any).web3 = web3;
    ConfigService.set("providerUrl", providerUrl);
    assert(exceptionRaised, "proper exception was not raised");
  });

  it("initializes default network params", async () => {
    await InitializeArcJs({ useNetworkDefaultsFor: "kovan" });
    assert.equal(ConfigService.get("providerUrl"), "127.0.0.1");
    assert.equal(ConfigService.get("providerPort"), 8547);
  });
});

describe("ContractWrapperBase", () => {
  it("can call getDefaultAccount", async () => {
    const defaultAccount = accounts[0];
    const defaultAccountAsync = await Utils.getDefaultAccount();
    assert(defaultAccount === defaultAccountAsync);
  });
});
