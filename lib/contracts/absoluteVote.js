"use strict";

import { Utils } from "../utils";
import { ExtendTruffleContract } from "../ExtendTruffleContract";

const SolidityAbsoluteVote = Utils.requireContract("AbsoluteVote");

export class AbsoluteVote extends ExtendTruffleContract(SolidityAbsoluteVote) {
  static async new() {
    const contract = await SolidityAbsoluteVote.new();
    return new this(contract);
  }

  async setParams(params) {
    return super.setParams(
      params.reputation,
      params.votePerc,
      params.ownerVote
    );
  }
}
