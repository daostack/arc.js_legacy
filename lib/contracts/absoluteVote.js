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

    params = Object.assign({},
      {
        votePerc: 50,
        ownerVote: true
      },
      params);

    if (!params.reputation) {
      throw new Error("reputation must be set");
    }

    return super.setParams(
      params.reputation,
      params.votePerc,
      params.ownerVote
    );
  }
}
