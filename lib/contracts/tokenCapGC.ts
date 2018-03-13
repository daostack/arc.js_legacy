"use strict";
import { Address, Hash } from "../commonTypes";
import {
  ArcTransactionDataResult,
  ContractWrapperBase,
} from "../contractWrapperBase";

import ContractWrapperFactory from "../contractWrapperFactory";

export class TokenCapGCWrapper extends ContractWrapperBase {
  public async setParameters(params: TokenCapGcParams): Promise<ArcTransactionDataResult<Hash>> {

    if (!params.token) {
      throw new Error("token must be set");
    }

    if (((typeof params.cap !== "number") &&
      ((typeof params.cap !== "string") ||
        (isNaN(parseInt(params.cap, undefined)))))) {
      throw new Error("cap must be set and represent a number");
    }

    return super._setParams(
      ["address", "uint"],
      [params.token, params.cap]);
  }
}

const TokenCapGC = new ContractWrapperFactory("TokenCapGC", TokenCapGCWrapper);
export { TokenCapGC };

export interface TokenCapGcParams {
  cap: number | string;
  token: Address;
}
