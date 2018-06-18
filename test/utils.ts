"use strict";
import { assert } from "chai";
import { DefaultSchemePermissions } from "../lib/commonTypes";
import { ConfigService } from "../lib/configService";
import { InitializeArcJs } from "../lib/index";
import { LoggingService } from "../lib/loggingService";
import { TestWrapperFactory } from "../lib/test/wrappers/testWrapper";
import { Utils } from "../lib/utils";
import { WrapperService } from "../lib/wrapperService";
import * as helpers from "./helpers";

describe("Misc", () => {
  it("can get global GEN token", async () => {
    const token = await Utils.getGenToken();
    const address = token.address;
    // assumes running in ganache and that ganache was started by arc.js (with the correct network id)
    assert.equal(address, "0xdcf22b53f327b4f7f3ac42d957834bd962637555");
    assert.isOk(token);
    assert.equal(await token.name(), "DAOstack");
    assert.equal(await token.symbol(), "GEN");
  });

  it("LoggingService can stringify circular object", async () => {
    const objA: any = {};
    const objB: any = { objA };
    objA.objB = objB; // objB ends up referencing itself via objA

    // should not throw exception
    LoggingService.stringifyObject(objA);
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
    assert.equal(ConfigService.get("network"), "kovan");
    assert.equal(ConfigService.get("providerUrl"), "http://127.0.0.1");
    assert.equal(ConfigService.get("providerPort"), 8547);
  });
});

describe("ContractWrapperBase", () => {
  it("can call getDefaultAccount", async () => {
    const defaultAccount = accounts[0];
    const defaultAccountAsync = await Utils.getDefaultAccount();
    assert(defaultAccount === defaultAccountAsync);
  });

  it("Must have sane inheritance", async () => {
    let scheme;

    assert.isOk(TestWrapperFactory, "TestWrapperWrapper is not defined");
    assert.isOk(TestWrapperFactory.deployed, "TestWrapperWrapper.deployed is not defined");
    scheme = await TestWrapperFactory.deployed();
    assert.equal(scheme.foo(), "bar");
    assert.equal(scheme.aMethod(), "abc");
    assert.equal(
      (await scheme.setParameters({})).result,
      "0xfc844154428d1b1c6806ceacdd3ed0974cc02c30983036bc5db6b5aed2fa394b"
    );
    assert.equal(scheme.getDefaultPermissions(), DefaultSchemePermissions.MinimumPermissions as number);

    scheme = await TestWrapperFactory.at(WrapperService.wrappers.AbsoluteVote.address);
    assert.equal(scheme.foo(), "bar");
    assert.equal(scheme.aMethod(), "abc");

    assert.isOk(scheme.factory);
    assert.isOk(scheme.factory.at);

    const newScheme = await scheme.factory.new();
    assert(newScheme);
    assert(newScheme.name === "AbsoluteVote");
    assert(newScheme.address !== scheme.address);
  });
});
