"use strict";

import { Utils } from "../utils";
import { ExtendTruffleContract } from "../ExtendTruffleContract";

const SolidityTokenCapGC = Utils.requireContract("TokenCapGC");

export class TokenCapGC extends ExtendTruffleContract(SolidityTokenCapGC) {
  static async new() {
    const contract = await SolidityTokenCapGC.new();
    return new this(contract);
  }

  async setParams(params) {
    if (!params.token) {
      throw new Error("token must be set");
    }
    if (!params.cap) {
      throw new Error("cap must be set");
    }
    return super.setParams(params.token, params.cap);
  }
}
