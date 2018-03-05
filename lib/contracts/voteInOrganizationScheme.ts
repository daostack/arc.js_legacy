"use strict";
import dopts = require("default-options");
import { Hash } from "../commonTypes";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  EventFetcherFactory,
  ExtendTruffleContract,
  StandardSchemeParams,
} from "../ExtendTruffleContract";
import { Utils } from "../utils";
const SolidityContract = Utils.requireContract("VoteInOrganizationScheme");
import ContractWrapperFactory from "../ContractWrapperFactory";
import { ProposalDeletedEventResult, ProposalExecutedEventResult } from "./commonEventInterfaces";

export class VoteInOrganizationSchemeWrapper extends ExtendTruffleContract {

  /**
   * Events
   */

  public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult> = this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted");
  public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult> = this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted");
  public VoteOnBehalf: EventFetcherFactory<VoteOnBehalfEventResult> = this.createEventFetcherFactory<VoteOnBehalfEventResult>("VoteOnBehalf");

  public async proposeVote(opts = {}) {
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
}

const VoteInOrganizationScheme = new ContractWrapperFactory(SolidityContract, VoteInOrganizationSchemeWrapper);
export { VoteInOrganizationScheme };

export interface VoteOnBehalfEventResult {
  _params: Array<Hash>;
}
