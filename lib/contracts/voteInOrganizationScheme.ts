"use strict";
import dopts = require("default-options");
import { Address, Hash } from "../commonTypes";
import ContractWrapperFactory from "../ContractWrapperFactory";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  EventFetcherFactory,
  ExtendTruffleContract,
  StandardSchemeParams,
} from "../ExtendTruffleContract";
import { ProposalDeletedEventResult, ProposalExecutedEventResult } from "./commonEventInterfaces";

export class VoteInOrganizationSchemeWrapper extends ExtendTruffleContract {

  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult> = this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted");
  public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult> = this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted");
  public VoteOnBehalf: EventFetcherFactory<VoteOnBehalfEventResult> = this.createEventFetcherFactory<VoteOnBehalfEventResult>("VoteOnBehalf");
  /* tslint:enable:max-line-length */

  public async proposeVote(
    opts: VoteInOrganizationProposeVoteConfig = {} as VoteInOrganizationProposeVoteConfig)
    : Promise<ArcTransactionProposalResult> {
    /**
     * see VoteInOrganizationProposeVoteConfig
     */
    const defaults = {
      avatar: undefined,
      originalIntVote: undefined,
      originalProposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    if (!options.originalIntVote) {
      throw new Error("originalIntVote is not defined");
    }

    if (!options.originalProposalId) {
      throw new Error("originalProposalId is not defined");
    }

    const tx = await this.contract.proposeVote(
      options.avatar,
      options.originalIntVote,
      options.originalProposalId
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
    return overrideValue || "0x00000001";
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<StandardSchemeParams> {
    return this._getSchemeParameters(avatarAddress);
  }

  public async getParameters(paramsHash: Hash): Promise<StandardSchemeParams> {
    const params = await this.getParametersArray(paramsHash);
    return {
      voteParametersHash: params[1],
      votingMachine: params[0],
    };
  }
}

const VoteInOrganizationScheme = new ContractWrapperFactory(
  "VoteInOrganizationScheme", VoteInOrganizationSchemeWrapper);
export { VoteInOrganizationScheme };

export interface VoteOnBehalfEventResult {
  _params: Array<Hash>;
}

export interface VoteInOrganizationProposeVoteConfig {
  /**
   * Avatar whose voters are being given the chance to vote on the original proposal.
   */
  avatar: string;
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
