"use strict";
import { config } from "../lib/config.js";

describe("Config", () => {

  it("can get and set configuration values", () => {
    assert.equal(config.get("providerUrl"), "http://127.0.0.1:8545");
    config.set("providerUrl", "http://localhost:8545");
    assert.equal(config.get("providerUrl"), "http://localhost:8545");
  });

  it("doesn't reload default values when imported again", () => {
    var config = require("../lib/config.js").config;
    assert.equal(config.get("providerUrl"), "http://localhost:8545");
  });

});
