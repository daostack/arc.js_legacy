"use strict";
import { assert } from "chai";
import { ConfigService } from "../lib/configService";
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
});
