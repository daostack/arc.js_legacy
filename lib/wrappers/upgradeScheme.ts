"use strict";
import { Address, DefaultSchemePermissions, Hash, SchemePermissions } from "../commonTypes";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  DecodedLogEntryEvent,
  IContractWrapperFactory,
  IUniversalSchemeWrapper,
  StandardSchemeParams,
} from "../iContractWrapperBase";

import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ProposalGeneratorBase } from "../proposalGeneratorBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { EntityFetcherFactory, EventFetcherFactory, Web3EventService } from "../web3EventService";
import {
  ProposalDeletedEventResult,
  SchemeProposalExecuted,
  SchemeProposalExecutedEventResult
} from "./commonEventInterfaces";

export class UpgradeSchemeWrapper extends ProposalGeneratorBase {

  public name: string = "UpgradeScheme";
  public friendlyName: string = "Upgrade Scheme";
  public factory: IContractWrapperFactory<UpgradeSchemeWrapper> = UpgradeSchemeFactory;
  /**
   * Events
   */

  public NewUpgradeProposal: EventFetcherFactory<NewUpgradeProposalEventResult>;
  public ChangeUpgradeSchemeProposal: EventFetcherFactory<ChangeUpgradeSchemeProposalEventResult>;
  public ProposalExecuted: EventFetcherFactory<SchemeProposalExecutedEventResult>;
  public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult>;

  /**
   * Submit a proposal to change the DAO's controller.
   * @param options
   */
  public async proposeController(
    options: ProposeControllerParams = {} as ProposeControllerParams & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionProposalResult> {

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.controller) {
      throw new Error("controller address is not defined");
    }

    this.logContractFunctionCall("UpgradeScheme.proposeUpgrade", options);

    const txResult = await this.wrapTransactionInvocation("UpgradeScheme.proposeController",
      options,
      this.contract.proposeUpgrade,
      [options.avatar,
      options.controller]
    );

    return new ArcTransactionProposalResult(txResult.tx, this.contract, await this.getVotingMachine(options.avatar));
  }

  /**
   * Submit a proposal to change or modify the DAO's upgrading scheme.
   * @param options
   */
  public async proposeUpgradingScheme(
    options: ProposeUpgradingSchemeParams = {} as ProposeUpgradingSchemeParams & TxGeneratingFunctionOptions)
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

    this.logContractFunctionCall("UpgradeScheme.proposeUpgradingScheme", options);

    const txResult = await this.wrapTransactionInvocation("UpgradeScheme.proposeUpgradingScheme",
      options,
      this.contract.proposeChangeUpgradingScheme,
      [options.avatar,
      options.scheme,
      options.schemeParametersHash]
    );

    return new ArcTransactionProposalResult(txResult.tx, this.contract, await this.getVotingMachine(options.avatar));
  }

  public getParametersHash(params: StandardSchemeParams): Promise<Hash> {
    return this._getParametersHash(
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public setParameters(
    params: StandardSchemeParams & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionDataResult<Hash>> {

    this.validateStandardSchemeParams(params);

    return super._setParameters(
      "UpgradeScheme.setParameters",
      params.txEventContext,
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public getDefaultPermissions(): SchemePermissions {
    return DefaultSchemePermissions.UpgradeScheme as number;
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

  /**
   * EntityFetcherFactory for votable UpgradeSchemeProposal.
   * @param avatarAddress
   */
  public async getVotableUpgradeUpgradeSchemeProposals(avatarAddress: Address):
    Promise<EntityFetcherFactory<VotableUpgradeSchemeProposal, ChangeUpgradeSchemeProposalEventResult>> {

    return this.proposalService.getProposalEvents(
      {
        baseArgFilter: { _avatar: avatarAddress },
        proposalsEventFetcher: this.ChangeUpgradeSchemeProposal,
        transformEventCallback:
          async (event: DecodedLogEntryEvent<ChangeUpgradeSchemeProposalEventResult>)
            : Promise<VotableUpgradeSchemeProposal> => {
            return this.getVotableProposal(event.args._avatar, event.args._proposalId);
          },
        votableOnly: true,
        votingMachine: await this.getVotingMachine(avatarAddress),
      });
  }

  /**
   * EntityFetcherFactory for votable UpgradeSchemeProposal.
   * @param avatarAddress
   */
  public async getVotableUpgradeControllerProposals(avatarAddress: Address):
    Promise<EntityFetcherFactory<VotableUpgradeSchemeProposal, NewUpgradeProposalEventResult>> {

    return this.proposalService.getProposalEvents(
      {
        baseArgFilter: { _avatar: avatarAddress },
        proposalsEventFetcher: this.NewUpgradeProposal,
        transformEventCallback:
          async (event: DecodedLogEntryEvent<NewUpgradeProposalEventResult>): Promise<VotableUpgradeSchemeProposal> => {
            return this.getVotableProposal(event.args._avatar, event.args._proposalId);
          },
        votableOnly: true,
        votingMachine: await this.getVotingMachine(avatarAddress),
      });
  }

  /**
   * EntityFetcherFactory for executed proposals.
   * @param avatarAddress
   */
  public getExecutedProposals(avatarAddress: Address):
    EntityFetcherFactory<SchemeProposalExecuted, SchemeProposalExecutedEventResult> {

    return this.proposalService.getProposalEvents(
      {
        baseArgFilter: { _avatar: avatarAddress },
        proposalsEventFetcher: this.ProposalExecuted,
        transformEventCallback:
          (event: DecodedLogEntryEvent<SchemeProposalExecutedEventResult>): Promise<SchemeProposalExecuted> => {
            return Promise.resolve({
              avatarAddress: event.args._avatar,
              proposalId: event.args._proposalId,
              winningVote: event.args._param,
            });
          },
      });
  }

  public async getVotableProposal(avatarAddress: Address, proposalId: Hash): Promise<VotableUpgradeSchemeProposal> {
    const proposalParams = await this.contract.organizationsProposals(avatarAddress, proposalId);
    return this.convertProposalPropsArrayToObject(proposalParams, proposalId);
  }

  protected hydrated(): void {
    /* tslint:disable:max-line-length */
    this.NewUpgradeProposal = this.createEventFetcherFactory<NewUpgradeProposalEventResult>(this.contract.NewUpgradeProposal);
    this.ChangeUpgradeSchemeProposal = this.createEventFetcherFactory<ChangeUpgradeSchemeProposalEventResult>(this.contract.ChangeUpgradeSchemeProposal);
    this.ProposalExecuted = this.createEventFetcherFactory<SchemeProposalExecutedEventResult>(this.contract.ProposalExecuted);
    this.ProposalDeleted = this.createEventFetcherFactory<ProposalDeletedEventResult>(this.contract.ProposalDeleted);
    /* tslint:enable:max-line-length */
  }

  private convertProposalPropsArrayToObject(propsArray: Array<any>, proposalId: Hash): VotableUpgradeSchemeProposal {
    return {
      paramsUpgradingScheme: propsArray[1],
      proposalId,
      proposalType: propsArray[2].toNumber(),
      upgradeContractAddress: propsArray[0],
    };
  }
}

export const UpgradeSchemeFactory =
  new ContractWrapperFactory("UpgradeScheme", UpgradeSchemeWrapper, new Web3EventService());

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

export enum UpgradeSchemeProposalType {
  Controller = 1,
  UpgradeScheme = 2,
}

export interface VotableUpgradeSchemeProposal {
  /**
   * Either a controller or an upgrade scheme.
   */
  upgradeContractAddress: Address;
  paramsUpgradingScheme: Hash;
  proposalType: UpgradeSchemeProposalType;
  proposalId: Hash;
}
