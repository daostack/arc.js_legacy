"use strict";
import { Address, Hash } from "../commonTypes";
import { ContractWrapperBase } from "../contractWrapperBase";
import { ArcTransactionDataResult, IContractWrapperFactory } from "../iContractWrapperBase";

import { BigNumber } from "../utils";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ControllerService } from "../controllerService";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Web3EventService } from "../web3EventService";

export class TokenCapGCWrapper extends ContractWrapperBase {
  public name: string = "TokenCapGC";
  public friendlyName: string = "Token Cap Global Constraint";
  public factory: IContractWrapperFactory<TokenCapGCWrapper> = TokenCapGCFactory;

  public getParametersHash(params: TokenCapGcParams): Promise<Hash> {
    return this._getParametersHash(
      params.token,
      params.cap || 0
    );
  }
  public setParameters(
    params: TokenCapGcParams & TxGeneratingFunctionOptions): Promise<ArcTransactionDataResult<Hash>> {

    if (!params.token) {
      throw new Error("token must be set");
    }
    const cap = new BigNumber(params.cap);

    if (cap.ltn(0)) {
      throw new Error("cap must be greater than or equal to zero");
    }

    return super._setParameters(
      "TokenCapGC.setParameters",
      params.txEventContext,
      params.token,
      cap);
  }

  public async getParameters(paramsHash: Hash): Promise<any> {
    const params = await this.getParametersArray(paramsHash);
    return {
      cap: params[1],
      token: params[0],
    };
  }

  public async getSchemeParametersHash(avatarAddress: Address): Promise<Hash> {
    const controllerService = new ControllerService(avatarAddress);
    const controller = await controllerService.getController();
    return controller.getGlobalConstraintParameters(this.address, avatarAddress);
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<GetTokenCapGcParamsResult> {
    return this._getSchemeParameters(avatarAddress);
  }
}

export const TokenCapGCFactory =
  new ContractWrapperFactory("TokenCapGC", TokenCapGCWrapper, new Web3EventService());

export interface TokenCapGcParams {
  cap: BigNumber | string;
  token: Address;
}

export interface GetTokenCapGcParamsResult {
  cap: BigNumber;
  token: Address;
}
