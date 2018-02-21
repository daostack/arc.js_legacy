"use strict";

import { ExtendTruffleContract } from "../ExtendTruffleContract";
import { Utils } from "../utils";

const SolidityContract = Utils.requireContract("TokenCapGC");
import ContractWrapperFactory from "../ContractWrapperFactory";

export class TokenCapGCWrapper extends ExtendTruffleContract {
  public async setParams(params) {
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
