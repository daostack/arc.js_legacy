"use strict";
import BigNumber from "bignumber.js";
import { assert } from "chai";
import { ConfigService } from "../lib/configService";
import { TestWrapperFactory } from "../lib/test/wrappers/testWrapper";
import { AbsoluteVoteParams } from "../lib/wrappers/absoluteVote";
import "./helpers";

describe("ConfigService", () => {
  it("can get and set configuration values", () => {
    assert.equal(ConfigService.get("providerUrl"), "http://127.0.0.1");
    ConfigService.set("providerUrl", "http://localhost");
    assert.equal(ConfigService.get("providerUrl"), "http://localhost");
  });

  it("doesn't reload default values when imported again", () => {
    const newConfigService = require("../lib/configService").ConfigService;
    assert.equal(newConfigService.get("providerUrl"), "http://localhost");
  });

  it("can specify gasPrice", async () => {
    let gasPrice = new BigNumber(web3.toWei(40, "gwei"));

    ConfigService.set("gasPriceAdjustment", (): Promise<BigNumber> => Promise.resolve(gasPrice));

    const testWrapper = await TestWrapperFactory.new();

    let txResult = await testWrapper.setParameters({} as AbsoluteVoteParams);

    let txInfo = await web3.eth.getTransaction(txResult.tx);

    assert(txInfo.gasPrice.eq(gasPrice));

    ConfigService.set("gasPriceAdjustment",
      (defaultGasPrice: BigNumber): Promise<BigNumber> => Promise.resolve(
        gasPrice = defaultGasPrice.mul(1.25).add(web3.toWei(2, "gwei"))));

    txResult = await testWrapper.setParameters({} as AbsoluteVoteParams);

    txInfo = await web3.eth.getTransaction(txResult.tx);

    assert(txInfo.gasPrice.eq(gasPrice));

    ConfigService.set("gasPriceAdjustment", null);
  });
});
