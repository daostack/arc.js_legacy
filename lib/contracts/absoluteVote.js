"use strict";
// const dopts = require('default-options');

import { Utils } from "../utils.js";
import { ExtendTruffleContract } from "../ExtendTruffleContract";

const SolidityAbsoluteVote = Utils.requireContract("AbsoluteVote");

export class AbsoluteVote extends ExtendTruffleContract(SolidityAbsoluteVote) {
  static async new() {
    const contract = await SolidityAbsoluteVote.new();
    return new this(contract);
  }

  async setParams(params) {
    return await this._setParameters(
      params.reputation,
      params.votePrec,
      params.ownerVote
    );
  }
}
