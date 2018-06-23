"use strict";
import { Address, Hash } from "../commonTypes";
import {
  ArcTransactionDataResult,
  ContractWrapperBase,
  IContractWrapperFactory,
} from "../contractWrapperBase";

import { ContractWrapperFactory } from "../contractWrapperFactory";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Web3EventService } from "../web3EventService";

export class TokenCapGCWrapper extends ContractWrapperBase {
  public name: string = "TokenCapGC";
  public friendlyName: string = "Token Cap Global Constraint";
  public factory: IContractWrapperFactory<TokenCapGCWrapper> = TokenCapGCFactory;

  public async setParameters(params: TokenCapGcParams): Promise<ArcTransactionDataResult<Hash>> {

    if (!params.token) {
      throw new Error("token must be set");
    }

    if (((typeof params.cap !== "number") &&
      ((typeof params.cap !== "string") ||
        (isNaN(parseInt(params.cap, undefined)))))) {
      throw new Error("cap must be set and represent a number");
    }

    return super._setParameters(
      "TokenCapGC.setParameters",
      params.txEventStack,
      params.token,
      params.cap);
  }
}

export const TokenCapGCFactory =
  new ContractWrapperFactory("TokenCapGC", TokenCapGCWrapper, new Web3EventService());

export interface TokenCapGcParams extends TxGeneratingFunctionOptions {
  cap: number | string;
  token: Address;
}
