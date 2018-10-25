"use strict";
import { BigNumber } from "../utils";
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

export class VoteInOrganizationSchemeWrapper extends ProposalGeneratorBase implements IUniversalSchemeWrapper {

  public name: string = "VoteInOrganizationScheme";
  public friendlyName: string = "Vote In Organization Scheme";
  public factory: IContractWrapperFactory<VoteInOrganizationSchemeWrapper> = VoteInOrganizationSchemeFactory;
  /**
   * Events
   */

  public NewVoteProposal: EventFetcherFactory<NewVoteProposalEventResult>;
  public ProposalExecuted: EventFetcherFactory<SchemeProposalExecutedEventResult>;
  public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult>;
  public VoteOnBehalf: EventFetcherFactory<VoteOnBehalfEventResult>;

  /**
   * Submit a proposal to vote on a proposal in another DAO.
   * @param options
   */
  public async proposeVoteInOrganization(
    options: VoteInOrganizationProposeVoteConfig =
      {} as VoteInOrganizationProposeVoteConfig & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionProposalResult> {

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    if (!options.originalVotingMachineAddress) {
      throw new Error("originalVotingMachineAddress is not defined");
    }

    if (!options.originalProposalId) {
      throw new Error("originalProposalId is not defined");
    }

    this.logContractFunctionCall("VoteInOrganizationScheme.proposeVote", options);

    const txResult = await this.wrapTransactionInvocation("VoteInOrganizationScheme.proposeVote",
      options,
      this.contract.proposeVote,
      [options.avatar,
      options.originalVotingMachineAddress,
      options.originalProposalId]
    );

    return new ArcTransactionProposalResult(txResult.tx, this.contract, await this.getVotingMachine(options.avatar));
  }

  /**
   * EntityFetcherFactory for votable VoteInOrganizationProposal.
   * @param avatarAddress
   */
  public async getVotableProposals(avatarAddress: Address):
    Promise<EntityFetcherFactory<VotableVoteInOrganizationProposal, NewVoteProposalEventResult>> {

    return this.proposalService.getProposalEvents(
      {
        baseArgFilter: { _avatar: avatarAddress },
        proposalsEventFetcher: this.NewVoteProposal,
        transformEventCallback:
          async (event: DecodedLogEntryEvent<NewVoteProposalEventResult>)
            : Promise<VotableVoteInOrganizationProposal> => {
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

  public async getVotableProposal(
    avatarAddress: Address,
    proposalId: Hash): Promise<VotableVoteInOrganizationProposal> {

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
    params: StandardSchemeParams & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionDataResult<Hash>> {

    this.validateStandardSchemeParams(params);

    return super._setParameters(
      "VoteInOrganizationScheme.setParameters",
      params.txEventContext,
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public getDefaultPermissions(): SchemePermissions {
    return DefaultSchemePermissions.VoteInOrganizationScheme as number;
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
      voteParametersHash: params[1],
      votingMachineAddress: params[0],
    };
  }

  protected hydrated(): void {
    /* tslint:disable:max-line-length */
    this.NewVoteProposal = this.createEventFetcherFactory<NewVoteProposalEventResult>(this.contract.NewVoteProposal);
    this.ProposalExecuted = this.createEventFetcherFactory<SchemeProposalExecutedEventResult>(this.contract.ProposalExecuted);
    this.ProposalDeleted = this.createEventFetcherFactory<ProposalDeletedEventResult>(this.contract.ProposalDeleted);
    this.VoteOnBehalf = this.createEventFetcherFactory<VoteOnBehalfEventResult>(this.contract.VoteOnBehalf);
    /* tslint:enable:max-line-length */
  }

  private convertProposalPropsArrayToObject(
    propsArray: Array<any>,
    proposalId: Hash): VotableVoteInOrganizationProposal {
    return {
      originalNumOfChoices: propsArray[2].toNumber(),
      originalProposalId: propsArray[1],
      originalVotingMachineAddress: propsArray[0],
      proposalId,
    };
  }
}

export const VoteInOrganizationSchemeFactory =
  new ContractWrapperFactory(
    "VoteInOrganizationScheme",
    VoteInOrganizationSchemeWrapper,
    new Web3EventService());

export interface VoteOnBehalfEventResult {
  _params: Array<Hash>;
}

export interface VoteInOrganizationProposeVoteConfig {
  /**
   * Avatar whose voters are being given the chance to vote on the original proposal.
   */
  avatar: Address;
  /**
   * Address of the voting machine used by the original proposal.  The voting machine must
   * implement IntVoteInterface (as defined in Arc).
   */
  originalVotingMachineAddress: Address;
  /**
   * Address of the "original" proposal for which the DAO's vote will cast.
   */
  originalProposalId: string;
}

export interface VotableVoteInOrganizationProposal {
  originalVotingMachineAddress: Address;
  originalNumOfChoices: number;
  originalProposalId: Hash;
  proposalId: Hash;
}

export interface NewVoteProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _intVoteInterface: Address;
  _originalIntVote: Address;
  _originalProposalId: Hash;
  _originalNumOfChoices: BigNumber;
  /**
   * indexed
   */
  _proposalId: Hash;
}
