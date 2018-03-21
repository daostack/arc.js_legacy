"use strict";
import { ConfigService } from "../test-dist/configService";
import "./helpers";

describe("ConfigService", () => {

  it("can get and set configuration values", () => {
    assert.equal(ConfigService.get("providerUrl"), "http://127.0.0.1");
    ConfigService.set("providerUrl", "http://localhost");
    assert.equal(ConfigService.get("providerUrl"), "http://localhost");
  });

  it("doesn't reload default values when imported again", () => {
    const ConfigService = require("../test-dist/configService").ConfigService;
    assert.equal(ConfigService.get("providerUrl"), "http://localhost");
  });

});
