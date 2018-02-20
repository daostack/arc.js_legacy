"use strict";

import { ExtendTruffleContract } from "../ExtendTruffleContract";
import { Utils } from "../utils";
const SolidityContract = Utils.requireContract("AbsoluteVote");
import ContractWrapperFactory from "../ContractWrapperFactory";

export class AbsoluteVoteWrapper extends ExtendTruffleContract {

  public async setParams(params) {

    params = Object.assign({},
      {
        ownerVote: true,
        votePerc: 50,
      },
      params);

    if (!params.reputation) {
      throw new Error("reputation must be set");
    }

    return super.setParams(
      params.reputation,
      params.votePerc,
      params.ownerVote,
    );
  }
}

const AbsoluteVote = new ContractWrapperFactory(SolidityContract, AbsoluteVoteWrapper);
export { AbsoluteVote };
