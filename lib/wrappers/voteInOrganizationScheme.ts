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

export class VoteInOrganizationSchemeWrapper extends ContractWrapperBase implements SchemeWrapper {

  public name: string = "VoteInOrganizationScheme";
  public friendlyName: string = "Vote In Organization Scheme";
  public factory: ContractWrapperFactory<VoteInOrganizationSchemeWrapper> = VoteInOrganizationSchemeFactory;
  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult> = this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted");
  public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult> = this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted");
  public VoteOnBehalf: EventFetcherFactory<VoteOnBehalfEventResult> = this.createEventFetcherFactory<VoteOnBehalfEventResult>("VoteOnBehalf");
  /* tslint:enable:max-line-length */

  public async proposeVote(
    options: VoteInOrganizationProposeVoteConfig = {} as VoteInOrganizationProposeVoteConfig)
    : Promise<ArcTransactionProposalResult> {

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    if (!options.originalIntVote) {
      throw new Error("originalIntVote is not defined");
    }

    if (!options.originalProposalId) {
      throw new Error("originalProposalId is not defined");
    }

    this.logContractFunctionCall("VoteInOrganizationScheme.proposeVote", options);

    const txResult = await this.wrapTransactionInvocation("VoteInOrganizationScheme.proposeVote",
      options,
      () => {
        return this.contract.proposeVote(
          options.avatar,
          options.originalIntVote,
          options.originalProposalId
        );
      });

    return new ArcTransactionProposalResult(txResult.tx);
  }

  public async setParameters(params: StandardSchemeParams): Promise<ArcTransactionDataResult<Hash>> {

    this.validateStandardSchemeParams(params);

    return super._setParameters(
      "VoteInOrganizationScheme.setParameters",
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public getDefaultPermissions(): SchemePermissions {
    return <number>DefaultSchemePermissions.VoteInOrganizationScheme;
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
}

export const VoteInOrganizationSchemeFactory = new ContractWrapperFactory(
  "VoteInOrganizationScheme", VoteInOrganizationSchemeWrapper);

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
  originalIntVote: string;
  /**
   * Address of the "original" proposal for which the DAO's vote will cast.
   */
  originalProposalId: string;
}
