"use strict";
// const dopts = require('default-options');

import { requireContract } from "../utils.js";
import { ExtendTruffleContract } from "../ExtendTruffleContract";

const SolidityAbsoluteVote = requireContract("AbsoluteVote");

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
