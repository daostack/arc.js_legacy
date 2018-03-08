"use strict";
import { Config } from "../test-dist/config";
import "./helpers";

describe("Config", () => {

  it("can get and set configuration values", () => {
    assert.equal(Config.get("providerUrl"), "http://127.0.0.1");
    Config.set("providerUrl", "http://localhost");
    assert.equal(Config.get("providerUrl"), "http://localhost");
  });

  it("doesn't reload default values when imported again", () => {
    const Config = require("../test-dist/config").Config;
    assert.equal(Config.get("providerUrl"), "http://localhost");
  });

});
