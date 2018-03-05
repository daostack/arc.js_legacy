"use strict";
import dopts = require("default-options");
import { Address, Hash } from "../commonTypes";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  EventFetcherFactory,
  ExtendTruffleContract,
  StandardSchemeParams,
} from "../ExtendTruffleContract";
import { Utils } from "../utils";

import ContractWrapperFactory from "../ContractWrapperFactory";
const SolidityContract = Utils.requireContract("UpgradeScheme");
import { ProposalDeletedEventResult, ProposalExecutedEventResult } from "./commonEventInterfaces";

export class UpgradeSchemeWrapper extends ExtendTruffleContract {

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
    opts: ProposeControllerParams = {} as ProposeControllerParams)
    : Promise<ArcTransactionProposalResult> {
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       *  controller address
       */
      controller: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as ProposeControllerParams;

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.controller) {
      throw new Error("controller address is not defined");
    }

    const tx = await this.contract.proposeUpgrade(
      options.avatar,
      options.controller
    );

    return new ArcTransactionProposalResult(tx);
  }

  /********************************************
   * proposeUpgradingScheme
   */
  public async proposeUpgradingScheme(
    opts: ProposeUpgradingSchemeParams = {} as ProposeUpgradingSchemeParams)
    : Promise<ArcTransactionProposalResult> {
    /**
     * Note that explicitly supplying any property with a value of undefined will prevent the property
     * from taking on its default value (weird behavior of default-options)
     */
    const defaults = {
      /**
       * avatar address
       */
      avatar: undefined,
      /**
       *  upgrading scheme address
       */
      scheme: undefined,
      /**
       * hash of the parameters of the upgrading scheme. These must be already registered with the new scheme.
       */
      schemeParametersHash: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as ProposeUpgradingSchemeParams;

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.scheme) {
      throw new Error("scheme is not defined");
    }

    if (!options.schemeParametersHash) {
      throw new Error("schemeParametersHash is not defined");
    }

    const tx = await this.contract.proposeChangeUpgradingScheme(
      options.avatar,
      options.scheme,
      options.schemeParametersHash
    );

    return new ArcTransactionProposalResult(tx);
  }

  public async setParams(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>> {
    return super.setParams(
      params.voteParametersHash,
      params.votingMachine
    );
  }

  public getDefaultPermissions(overrideValue?: string): string {
    return overrideValue || "0x0000000b";
  }
}

const UpgradeScheme = new ContractWrapperFactory(SolidityContract, UpgradeSchemeWrapper);
export { UpgradeScheme };

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
  newUpgradeScheme: Address;
}

export interface ProposeUpgradingSchemeParams {
  /**
   * avatar address
   */
  avatar: string;
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
  avatar: string;
  /**
   *  controller address
   */
  controller: string;
}
