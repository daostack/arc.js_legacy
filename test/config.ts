"use strict";
import { BigNumber } from "../lib/utils";
import { assert } from "chai";
import { ConfigService } from "../lib/configService";
import { TestWrapperFactory } from "../lib/test/wrappers/testWrapper";
import { AbsoluteVoteParams } from "../lib/wrappers/absoluteVote";
import "./helpers";

describe("ConfigService", () => {
  it("can get and set configuration values", () => {
    assert.equal(ConfigService.get("providerUrl"), "127.0.0.1");
    ConfigService.set("providerUrl", "localhost");
    assert.equal(ConfigService.get("providerUrl"), "localhost");
  });

  it("doesn't reload default values when imported again", () => {
    const newConfigService = require("../lib/configService").ConfigService;
    assert.equal(newConfigService.get("providerUrl"), "localhost");
    ConfigService.set("providerUrl", "127.0.0.1");
  });

  it("can specify gasPrice", async () => {
    let gasPrice = new BigNumber(web3.utils.toWei(40, "gwei"));

    ConfigService.set("gasPriceAdjustment", (): Promise<BigNumber> => Promise.resolve(gasPrice));

    const testWrapper = await TestWrapperFactory.new();

    let txResult = await testWrapper.setParameters({} as AbsoluteVoteParams);

    let txInfo = await web3.eth.getTransaction(txResult.tx);

    assert(new BigNumber(txInfo.gasPrice).eq(gasPrice));

    ConfigService.set("gasPriceAdjustment",
      (defaultGasPrice: BigNumber): Promise<BigNumber> => Promise.resolve(
        gasPrice = defaultGasPrice.muln(1.25).add(web3.utils.toWei(new BigNumber(2), "gwei"))));

    txResult = await testWrapper.setParameters({} as AbsoluteVoteParams);

    txInfo = await web3.eth.getTransaction(txResult.tx);

    assert(new BigNumber(txInfo.gasPrice).eq(gasPrice));

    ConfigService.set("gasPriceAdjustment", null);
  });
});
