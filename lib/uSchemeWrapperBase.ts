import { Address, Hash } from "./commonTypes";
import { ControllerService } from "./controllerService";
import {
  ArcTransactionDataResult,
  IUniversalSchemeWrapper,
  StandardSchemeParams,
} from "./iContractWrapperBase";
import { SchemeWrapperBase } from "./schemeWrapperBase";
import { TxEventContext } from "./transactionService";

/**
 * Abstract base class for all Arc universal scheme contract wrapper classes.  A universal scheme
 * is defined as an Arc scheme (see `SchemeWrapperBase`) that follows the pattern of registering
 * operating parameters with the DAO's controller, thus enabling the contract to be reused across DAOs.
 */
export abstract class USchemeWrapperBase extends SchemeWrapperBase {

  /**
   * Given a hash, returns the associated parameters as an object.
   * @param paramsHash
   */
  public abstract getParameters(paramsHash: Hash): Promise<any>;

  public abstract getParametersHash(params: any): Promise<Hash>;

  public abstract setParameters(params: any): Promise<ArcTransactionDataResult<Hash>>;

  public abstract getSchemeParameters(avatarAddress: Address): Promise<any>;

  /**
   * Given an avatar address, returns the schemes parameters hash
   * @param avatarAddress
   */
  public async getSchemeParametersHash(avatarAddress: Address): Promise<Hash> {
    const controllerService = new ControllerService(avatarAddress);
    const controller = await controllerService.getController();
    return controller.getSchemeParameters(this.address, avatarAddress);
  }

  /**
   * Given a hash, returns the associated parameters as an array, ordered by the order
   * in which the parameters appear in the contract's Parameters struct.
   * @param paramsHash
   */
  public getParametersArray(paramsHash: Hash): Promise<Array<any>> {
    return this.contract.parameters(paramsHash);
  }
  protected async _setParameters(
    functionName: string,
    txEventContext: TxEventContext,
    ...params: Array<any>): Promise<ArcTransactionDataResult<Hash>> {

    const parametersHash: Hash = await this.contract.getParametersHash(...params);

    const txResult = await this.wrapTransactionInvocation(functionName,
      // typically this is supposed to be an object, but here it is an array
      Object.assign(params, { txEventContext }),
      this.contract.setParameters,
      params);

    return new ArcTransactionDataResult<Hash>(txResult.tx, this.contract, parametersHash);
  }

  protected async _getSchemeParameters(avatarAddress: Address): Promise<any> {
    const paramsHash = await this.getSchemeParametersHash(avatarAddress);
    return this.getParameters(paramsHash);
  }

  protected _getParametersHash(...params: Array<any>): Promise<Hash> {
    return this.contract.getParametersHash(...params);
  }

  protected validateStandardSchemeParams(params: StandardSchemeParams): void {
    if (!params.voteParametersHash) {
      throw new Error(`voteParametersHash is not defined`);
    }
    if (!params.votingMachineAddress) {
      throw new Error(`votingMachineAddress is not defined`);
    }
  }
}
