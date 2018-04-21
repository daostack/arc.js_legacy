"use strict";
import { Address, DefaultSchemePermissions, Hash, SchemePermissions, SchemeWrapper } from "../commonTypes";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ContractWrapperBase,
  EventFetcherFactory,
  StandardSchemeParams,
} from "../contractWrapperBase";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ProposalDeletedEventResult, ProposalExecutedEventResult } from "./commonEventInterfaces";

export class GlobalConstraintRegistrarWrapper extends ContractWrapperBase implements SchemeWrapper {

  public name: string = "GlobalConstraintRegistrar";
  public friendlyName: string = "Global Constraint Registrar";
  public factory: ContractWrapperFactory<GlobalConstraintRegistrarWrapper> = GlobalConstraintRegistrarFactory;
  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public NewGlobalConstraintsProposal: EventFetcherFactory<NewGlobalConstraintsProposalEventResult> = this.createEventFetcherFactory<NewGlobalConstraintsProposalEventResult>("NewGlobalConstraintsProposal");
  public RemoveGlobalConstraintsProposal: EventFetcherFactory<RemoveGlobalConstraintsProposalEventResult> = this.createEventFetcherFactory<RemoveGlobalConstraintsProposalEventResult>("RemoveGlobalConstraintsProposal");
  public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult> = this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted");
  public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult> = this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted");
  /* tslint:enable:max-line-length */

  public async proposeToAddModifyGlobalConstraint(
    options: ProposeToAddModifyGlobalConstraintParams = {} as ProposeToAddModifyGlobalConstraintParams)
    : Promise<ArcTransactionProposalResult> {

    if (!options.avatar) {
      throw new Error("address is not defined");
    }

    if (!options.globalConstraint) {
      throw new Error("globalConstraint is not defined");
    }

    if (!options.globalConstraintParametersHash) {
      throw new Error("globalConstraintParametersHash is not defined");
    }

    if (!options.votingMachineHash) {
      throw new Error("votingMachineHash is not defined");
    }

    this.logContractFunctionCall("GlobalConstraintRegistrar.proposeGlobalConstraint", options);

    const txResult = await this.wrapTransactionInvocation(
      "GlobalConstraintRegistrar.proposeToAddModifyGlobalConstraint",
      options,
      () => {
        return this.contract.proposeGlobalConstraint(
          options.avatar,
          options.globalConstraint,
          options.globalConstraintParametersHash,
          options.votingMachineHash
        );
      });

    return new ArcTransactionProposalResult(txResult.tx);
  }

  public async proposeToRemoveGlobalConstraint(
    options: ProposeToRemoveGlobalConstraintParams = {} as ProposeToRemoveGlobalConstraintParams)
    : Promise<ArcTransactionProposalResult> {

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.globalConstraint) {
      throw new Error("avatar globalConstraint is not defined");
    }

    this.logContractFunctionCall("GlobalConstraintRegistrar.proposeToRemoveGC", options);

    const txResult = await this.wrapTransactionInvocation(
      "GlobalConstraintRegistrar.proposeToRemoveGlobalConstraint",
      options,
      () => {
        return this.contract.proposeToRemoveGC(
          options.avatar,
          options.globalConstraint
        );
      });

    return new ArcTransactionProposalResult(txResult.tx);
  }

  public async setParameters(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>> {

    this.validateStandardSchemeParams(params);

    return super._setParameters(
      "GlobalConstraintRegistrar.setParameters",
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public getDefaultPermissions(overrideValue?: SchemePermissions | DefaultSchemePermissions): SchemePermissions {
    // return overrideValue || Utils.numberToPermissionsString(DefaultSchemePermissions.GlobalConstraintRegistrar);
    return (overrideValue || DefaultSchemePermissions.GlobalConstraintRegistrar) as SchemePermissions;
  }

  public async getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions> {
    return this._getSchemePermissions(avatarAddress);
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<StandardSchemeParams> {
    return this._getSchemeParameters(avatarAddress);
  }

  public async getParameters(paramsHash: Hash): Promise<StandardSchemeParams> {
    const params = await this.getParametersArray(paramsHash);
    return {
      voteParametersHash: params[0],
      votingMachineAddress: params[1],
    };
  }
}

export const GlobalConstraintRegistrarFactory = new ContractWrapperFactory(
  "GlobalConstraintRegistrar", GlobalConstraintRegistrarWrapper);

export interface NewGlobalConstraintsProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _intVoteInterface: Address;
  _gc: Address;
  _params: Hash;
  /**
   * indexed
   */
  _proposalId: Hash;
  _voteToRemoveParams: Hash;
}

export interface RemoveGlobalConstraintsProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  _gc: Address;
  /**
   * indexed
   */
  _intVoteInterface: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
}

export interface ProposeToAddModifyGlobalConstraintParams {
  /**
   * avatar address
   */
  avatar: Address;
  /**
   *  the address of the global constraint to add
   */
  globalConstraint: string;
  /**
   * hash of the parameters of the global contraint
   */
  globalConstraintParametersHash: string;
  /**
   * voting machine to use when voting to remove the global constraint
   */
  votingMachineHash: string;
}

export interface ProposeToRemoveGlobalConstraintParams {
  /**
   * avatar address
   */
  avatar: Address;
  /**
   *  the address of the global constraint to remove
   */
  globalConstraint: string;
}
