"use strict";

import { Utils } from "../utils";
import { ExtendTruffleContract } from "../ExtendTruffleContract";

const SolidityContract = Utils.requireContract("TokenCapGC");
import ContractWrapperFactory from "../ContractWrapperFactory";

export class TokenCapGCWrapper extends ExtendTruffleContract {
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

const TokenCapGC = new ContractWrapperFactory(SolidityContract, TokenCapGCWrapper);
export { TokenCapGC };
