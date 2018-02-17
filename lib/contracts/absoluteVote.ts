"use strict";

import { Utils } from "../utils";
import { ExtendTruffleContract } from "../ExtendTruffleContract";
const SolidityContract = Utils.requireContract("AbsoluteVote");
import ContractWrapperFactory from "../ContractWrapperFactory";

export class AbsoluteVoteWrapper extends ExtendTruffleContract {

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

const AbsoluteVote = new ContractWrapperFactory(SolidityContract, AbsoluteVoteWrapper);
export { AbsoluteVote };
