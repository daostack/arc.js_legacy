'use strict';
import { Address, DefaultSchemePermissions, Hash, SchemePermissions } from '../commonTypes';
import { ContractWrapperFactory } from '../contractWrapperFactory';
import {
  ArcTransactionDataResult,
  IContractWrapperFactory,
  StandardSchemeParams,
} from '../iContractWrapperBase';
import { ProposalGeneratorBase } from '../proposalGeneratorBase';
import { TxGeneratingFunctionOptions } from '../transactionService';
import { Web3EventService } from '../web3EventService';

export class GenericSchemeWrapper extends ProposalGeneratorBase {

  public name: string = 'GenericScheme';
  public friendlyName: string = 'Generic Scheme';
  public factory: IContractWrapperFactory<GenericSchemeWrapper> = GenericSchemeFactory;

  public getParametersHash(params: GenericSchemeParams): Promise<Hash> {
    return this._getParametersHash(
      params.voteParametersHash,
      params.votingMachineAddress,
      params.contractToCall
    );
  }

  public setParameters(
    params: GenericSchemeParams & TxGeneratingFunctionOptions): Promise<ArcTransactionDataResult<Hash>> {

    if (!params.contractToCall) {
      throw new Error(`contractToCall is not defined`);
    }

    this.validateStandardSchemeParams(params);

    return super._setParameters(
      'GenericScheme.setParameters',
      params.txEventContext,
      params.voteParametersHash,
      params.votingMachineAddress,
      params.contractToCall
    );
  }

  public getDefaultPermissions(): SchemePermissions {
    return DefaultSchemePermissions.GenericScheme as number;
  }

  public async getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions> {
    return this._getSchemePermissions(avatarAddress);
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<GenericSchemeParams> {
    return this._getSchemeParameters(avatarAddress);
  }

  public async getParameters(paramsHash: Hash): Promise<GenericSchemeParams> {
    const params = await this.getParametersArray(paramsHash);
    return {
      contractToCall: params[2],
      voteParametersHash: params[0],
      votingMachineAddress: params[1],
    };
  }
}

export const GenericSchemeFactory = new ContractWrapperFactory(
  'GenericScheme', GenericSchemeWrapper, new Web3EventService());

export interface GenericSchemeParams extends StandardSchemeParams {
  contractToCall: Address;
}
