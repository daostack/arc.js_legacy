"use strict";
import { Address, DefaultSchemePermissions, Hash, SchemePermissions } from "../commonTypes";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  DecodedLogEntryEvent,
  IContractWrapperFactory,
  IUniversalSchemeWrapper,
  StandardSchemeParams,
} from "../iContractWrapperBase";
import { ProposalGeneratorBase } from "../proposalGeneratorBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { EntityFetcherFactory, EventFetcherFactory, Web3EventService } from "../web3EventService";
import {
  ProposalDeletedEventResult,
  SchemeProposalExecuted,
  SchemeProposalExecutedEventResult
} from "./commonEventInterfaces";

export class GlobalConstraintRegistrarWrapper extends ProposalGeneratorBase {

  public name: string = "GlobalConstraintRegistrar";
  public friendlyName: string = "Global Constraint Registrar";
  public factory: IContractWrapperFactory<GlobalConstraintRegistrarWrapper> = GlobalConstraintRegistrarFactory;
  /**
   * Events
   */

  public NewGlobalConstraintsProposal: EventFetcherFactory<NewGlobalConstraintsProposalEventResult>;
  public RemoveGlobalConstraintsProposal: EventFetcherFactory<RemoveGlobalConstraintsProposalEventResult>;
  public ProposalExecuted: EventFetcherFactory<SchemeProposalExecutedEventResult>;
  public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult>;

  /**
   * Submit a proposal to add or modify a given global constraint.
   * @param options
   */
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
      this.contract.proposeGlobalConstraint,
      [options.avatar,
      options.globalConstraint,
      options.globalConstraintParametersHash,
      options.votingMachineHash]
    );

    return new ArcTransactionProposalResult(txResult.tx, this.contract, await this.getVotingMachine(options.avatar));
  }

  /**
   * Submit a proposal to remove a global constraint.
   * @param options
   */
  public async proposeToRemoveGlobalConstraint(
    options: ProposeToRemoveGlobalConstraintParams = {} as ProposeToRemoveGlobalConstraintParams)
    : Promise<ArcTransactionProposalResult> {

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.globalConstraintAddress) {
      throw new Error("avatar globalConstraint is not defined");
    }

    this.logContractFunctionCall("GlobalConstraintRegistrar.proposeToRemoveGC", options);

    const txResult = await this.wrapTransactionInvocation(
      "GlobalConstraintRegistrar.proposeToRemoveGlobalConstraint",
      options,
      this.contract.proposeToRemoveGC,
      [options.avatar,
      options.globalConstraintAddress]
    );

    return new ArcTransactionProposalResult(txResult.tx, this.contract, await this.getVotingMachine(options.avatar));
  }

  /**
   * EntityFetcherFactory for votable GlobalConstraintProposal.
   * @param avatarAddress
   */
  public async getVotableAddGcProposals(avatarAddress: Address):
    Promise<EntityFetcherFactory<VotableGlobalConstraintProposal, NewGlobalConstraintsProposalEventResult>> {

    return this.proposalService.getProposalEvents(
      {
        baseArgFilter: { _avatar: avatarAddress },
        proposalsEventFetcher: this.NewGlobalConstraintsProposal,
        transformEventCallback:
          async (event: DecodedLogEntryEvent<NewGlobalConstraintsProposalEventResult>)
            : Promise<VotableGlobalConstraintProposal> => {
            return this.getVotableProposal(event.args._avatar, event.args._proposalId);
          },
        votableOnly: true,
        votingMachine: await this.getVotingMachine(avatarAddress),
      });
  }

  /**
   * EntityFetcherFactory for votable GlobalConstraintProposal.
   * @param avatarAddress
   */
  public async getVotableRemoveGcProposals(avatarAddress: Address):
    Promise<EntityFetcherFactory<VotableGlobalConstraintProposal, RemoveGlobalConstraintsProposalEventResult>> {

    return this.proposalService.getProposalEvents(
      {
        baseArgFilter: { _avatar: avatarAddress },
        proposalsEventFetcher: this.RemoveGlobalConstraintsProposal,
        transformEventCallback:
          async (event: DecodedLogEntryEvent<RemoveGlobalConstraintsProposalEventResult>)
            : Promise<VotableGlobalConstraintProposal> => {
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

  public async getVotableProposal(avatarAddress: Address, proposalId: Hash): Promise<VotableGlobalConstraintProposal> {
    const proposalParams = await this.contract.organizationsProposals(avatarAddress, proposalId);
    return this.convertProposalPropsArrayToObject(proposalParams, proposalId);
  }

  public getParametersHash(params: StandardSchemeParams): Promise<Hash> {
    return this._getParametersHash(
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public setParameters(
    params: StandardSchemeParams & TxGeneratingFunctionOptions): Promise<ArcTransactionDataResult<Hash>> {

    this.validateStandardSchemeParams(params);

    return super._setParameters(
      "GlobalConstraintRegistrar.setParameters",
      params.txEventContext,
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public getDefaultPermissions(): SchemePermissions {
    return DefaultSchemePermissions.GlobalConstraintRegistrar as number;
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

  protected hydrated(): void {
    /* tslint:disable:max-line-length */
    this.NewGlobalConstraintsProposal = this.createEventFetcherFactory<NewGlobalConstraintsProposalEventResult>(this.contract.NewGlobalConstraintsProposal);
    this.RemoveGlobalConstraintsProposal = this.createEventFetcherFactory<RemoveGlobalConstraintsProposalEventResult>(this.contract.RemoveGlobalConstraintsProposal);
    this.ProposalExecuted = this.createEventFetcherFactory<SchemeProposalExecutedEventResult>(this.contract.ProposalExecuted);
    this.ProposalDeleted = this.createEventFetcherFactory<ProposalDeletedEventResult>(this.contract.ProposalDeleted);
    /* tslint:enable:max-line-length */

  }
  private convertProposalPropsArrayToObject(propsArray: Array<any>, proposalId: Hash): VotableGlobalConstraintProposal {
    return {
      constraintAddress: propsArray[0],
      paramsHash: propsArray[1],
      proposalId,
      proposalType: propsArray[2].toNumber(),
      voteToRemoveParamsHash: propsArray[3],
    };
  }
}

export const GlobalConstraintRegistrarFactory = new ContractWrapperFactory(
  "GlobalConstraintRegistrar", GlobalConstraintRegistrarWrapper, new Web3EventService());

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
  globalConstraintAddress: Address;
}

export enum GlobalConstraintProposalType {
  Add = 1,
  Remove = 2,
}

export interface VotableGlobalConstraintProposal {
  /**
   * Address of the global constraint
   */
  constraintAddress: Address;
  /**
   * The global constraint's parameters
   */
  paramsHash: Hash;
  /**
   * Hash of the proposalId
   */
  proposalId: Hash;
  /**
   * Add or Remove
   */
  proposalType: GlobalConstraintProposalType;
  /**
   * Hash of voting machine parameters to use when removing a global constraint
   */
  voteToRemoveParamsHash: Hash;
}
