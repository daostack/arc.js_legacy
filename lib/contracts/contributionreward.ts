"use strict";
import dopts = require("default-options");

import {
  Address,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  ExtendTruffleContract,
  Hash,
} from "../ExtendTruffleContract";
import { Utils } from "../utils";
const SolidityContract = Utils.requireContract("ContributionReward");
import * as BigNumber from "bignumber.js";
import ContractWrapperFactory from "../ContractWrapperFactory";
import {
  ProposalDeletedEventResult,
  ProposalExecutedEventResult,
  RedeemReputationEventResult,
} from "./commonEventInterfaces";

export class ContributionRewardWrapper extends ExtendTruffleContract {

  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public NewContributionProposal = this.createEventFetcherFactory<NewContributionProposalEventResult>("NewContributionProposal");
  public ProposalExecuted = this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted");
  public ProposalDeleted = this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted");
  public RedeemReputation = this.createEventFetcherFactory<RedeemReputationEventResult>("RedeemReputation");
  public RedeemEther = this.createEventFetcherFactory<RedeemEtherEventResult>("RedeemEther");
  public RedeemNativeToken = this.createEventFetcherFactory<RedeemNativeTokenEventResult>("RedeemNativeToken");
  public RedeemExternalToken = this.createEventFetcherFactory<RedeemExternalTokenEventResult>("RedeemExternalToken");
  /* tslint:enable:max-line-length */

  /**
   * Submit a proposal for a reward for a contribution
   * @param {ProposeContributionParams} opts
   */
  public async proposeContributionReward(opts = {}) {
    /**
     * Note that explicitly supplying any property with a value of undefined will prevent the property
     * from taking on its default value (weird behavior of default-options)
     */
    const defaults = {
      avatar: undefined,
      beneficiary: undefined,
      description: undefined,
      ethReward: 0,
      externalToken: null,
      externalTokenReward: 0,
      nativeTokenReward: 0,
      numberOfPeriods: undefined,
      periodLength: undefined,
      reputationChange: 0,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.description) {
      throw new Error("description is not defined");
    }

    if (!Number.isInteger(options.numberOfPeriods) || (options.numberOfPeriods <= 0)) {
      throw new Error("numberOfPeriods must be greater than zero");
    }

    if (!Number.isInteger(options.periodLength) || (options.periodLength <= 0)) {
      throw new Error("periodLength must be greater than zero");
    }

    /**
     * will thrown Error if not valid numbers
     */
    const web3 = Utils.getWeb3();
    const reputationChange = web3.toBigNumber(options.reputationChange);
    const nativeTokenReward = web3.toBigNumber(options.nativeTokenReward);
    const ethReward = web3.toBigNumber(options.ethReward);
    const externalTokenReward = web3.toBigNumber(options.externalTokenReward);

    if (
      (nativeTokenReward < 0) ||
      (ethReward < 0) ||
      (externalTokenReward < 0)
    ) {
      throw new Error("rewards must be greater than or equal to zero");
    }

    if (
      !(
        (reputationChange !== 0) ||
        (nativeTokenReward > 0) ||
        (reputationChange > 0) ||
        (ethReward > 0) ||
        (externalTokenReward > 0)
      )
    ) {
      throw new Error("no reward amount was given");
    }

    if ((externalTokenReward > 0) && !options.externalToken) {
      throw new Error(
        "external token reward is proposed but externalToken is not defined",
      );
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const tx = await this.contract.proposeContributionReward(
      options.avatar,
      Utils.SHA3(options.description),
      reputationChange,
      [nativeTokenReward, ethReward, externalTokenReward, options.periodLength, options.numberOfPeriods],
      options.externalToken,
      options.beneficiary,
    );
    return new ArcTransactionProposalResult(tx);
  }

  /**
   * Redeem reward for proposal
   * @param {ContributionRewardRedeemParams} opts
   */
  public async redeemContributionReward(opts = {}) {
    const defaults = {
      avatar: undefined,
      ethers: false,
      externalTokens: false,
      nativeTokens: false,
      proposalId: undefined,
      reputation: false,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const tx = await this.contract.redeem(
      options.proposalId,
      options.avatar,
      [options.reputation, options.nativeTokens, options.ethers, options.externalTokens],
    );

    return new ArcTransactionResult(tx);
  }

  public async setParams(params) {

    params = Object.assign({},
      {
        orgNativeTokenFee: 0,
      },
      params);

    return super.setParams(
      params.orgNativeTokenFee,
      params.voteParametersHash,
      params.votingMachine,
    );
  }

  public getDefaultPermissions(overrideValue?: string) {
    return overrideValue || "0x00000001";
  }
}

const ContributionReward = new ContractWrapperFactory(SolidityContract, ContributionRewardWrapper);
export { ContributionReward };

export interface NewContributionProposalEventResult {
  /**
   * indexed
   */
  _avatar: Address;
  _beneficiary: Address;
  _contributionDescription: Hash;
  _externalToken: Address;
  /**
   * indexed
   */
  _intVoteInterface: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
  _reputationChange: BigNumber.BigNumber;
  _rewards: BigNumber.BigNumber[];
}

export interface RedeemEtherEventResult {
  _amount: BigNumber.BigNumber;
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _beneficiary: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
}

export interface RedeemNativeTokenEventResult {
  _amount: BigNumber.BigNumber;
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _beneficiary: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
}

export interface RedeemExternalTokenEventResult {
  _amount: BigNumber.BigNumber;
  /**
   * indexed
   */
  _avatar: Address;
  /**
   * indexed
   */
  _beneficiary: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
}
