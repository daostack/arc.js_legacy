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

export class UpgradeSchemeWrapper extends ContractWrapperBase implements SchemeWrapper {

  public name: string = "UpgradeScheme";
  public friendlyName: string = "Upgrade Scheme";
  public factory: ContractWrapperFactory<UpgradeSchemeWrapper> = UpgradeSchemeFactory;
  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public NewUpgradeProposal: EventFetcherFactory<NewUpgradeProposalEventResult> = this.createEventFetcherFactory<NewUpgradeProposalEventResult>("NewUpgradeProposal");
  public ChangeUpgradeSchemeProposal: EventFetcherFactory<ChangeUpgradeSchemeProposalEventResult> = this.createEventFetcherFactory<ChangeUpgradeSchemeProposalEventResult>("ChangeUpgradeSchemeProposal");
  public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult> = this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted");
  public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult> = this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted");
  /* tslint:enable:max-line-length */

  /*******************************************
   * proposeController
   */
  public async proposeController(
    options: ProposeControllerParams = {} as ProposeControllerParams)
    : Promise<ArcTransactionProposalResult> {

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.controller) {
      throw new Error("controller address is not defined");
    }

    const txResult = await this.wrapTransactionInvocation("txReceipts.UpgradeScheme.proposeController",
      options,
      () => {
        return this.contract.proposeUpgrade(
          options.avatar,
          options.controller
        );
      });

    return new ArcTransactionProposalResult(txResult.tx);
  }

  /********************************************
   * proposeUpgradingScheme
   */
  public async proposeUpgradingScheme(
    options: ProposeUpgradingSchemeParams = {} as ProposeUpgradingSchemeParams)
    : Promise<ArcTransactionProposalResult> {

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.scheme) {
      throw new Error("scheme is not defined");
    }

    if (!options.schemeParametersHash) {
      throw new Error("schemeParametersHash is not defined");
    }

    const txResult = await this.wrapTransactionInvocation("txReceipts.UpgradeScheme.proposeUpgradingScheme",
      options,
      () => {
        return this.contract.proposeChangeUpgradingScheme(
          options.avatar,
          options.scheme,
          options.schemeParametersHash
        );
      });

    return new ArcTransactionProposalResult(txResult.tx);
  }

  public async setParameters(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>> {

    this.validateStandardSchemeParams(params);

    return super.setParameters(
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public getDefaultPermissions(overrideValue?: SchemePermissions | DefaultSchemePermissions): SchemePermissions {
    // return overrideValue || Utils.numberToPermissionsString(DefaultSchemePermissions.UpgradeScheme);
    return (overrideValue || DefaultSchemePermissions.UpgradeScheme) as SchemePermissions;
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

export const UpgradeSchemeFactory = new ContractWrapperFactory("UpgradeScheme", UpgradeSchemeWrapper);

export interface NewUpgradeProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _intVoteInterface: Address;
  _newController: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
}

export interface ChangeUpgradeSchemeProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _intVoteInterface: Address;
  _params: Hash;
  /**
   * indexed
   */
  _proposalId: Hash;
  _newUpgradeScheme: Address;
}

export interface ProposeUpgradingSchemeParams {
  /**
   * avatar address
   */
  avatar: Address;
  /**
   *  upgrading scheme address
   */
  scheme: string;
  /**
   * hash of the parameters of the upgrading scheme. These must be already registered with the new scheme.
   */
  schemeParametersHash: string;
}

export interface ProposeControllerParams {
  /**
   * avatar address
   */
  avatar: Address;
  /**
   *  controller address
   */
  controller: string;
}
