"use strict";
// const dopts = require('default-options');

import { requireContract } from "../utils.js";
import { ExtendTruffleContract } from "../ExtendTruffleContract";

const SolidityTokenCapGC = requireContract("TokenCapGC");

export class TokenCapGC extends ExtendTruffleContract(SolidityTokenCapGC) {
  static async new() {
    const contract = await SolidityTokenCapGC.new();
    return new this(contract);
  }

  async setParams(params) {
    return await this._setParameters(params.token, params.cap);
  }
}
