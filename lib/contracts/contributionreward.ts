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
  public async proposeContributionReward(opts = {}): Promise<ArcTransactionProposalResult> {
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
   * Redeem the specified rewards for the beneficiary of the proposal
   * @param {ContributionRewardRedeemParams} opts
   */
  public async redeemContributionReward(opts = {}): Promise<ArcTransactionResult> {
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

  /**
   * Redeem external token reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} opts
   */
  public async redeemExternalToken(opts = {}): Promise<ArcTransactionResult> {

    const defaults = {
      avatar: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const tx = await this.contract.redeemExternalToken(
      options.proposalId,
      options.avatar,
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Redeem reputation reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} opts
   */
  public async redeemReputation(opts = {}): Promise<ArcTransactionResult> {

    const defaults = {
      avatar: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const tx = await this.contract.redeemReputation(
      options.proposalId,
      options.avatar,
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Redeem native token reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} opts
   */
  public async redeemNativeToken(opts = {}): Promise<ArcTransactionResult> {

    const defaults = {
      avatar: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const tx = await this.contract.redeemNativeToken(
      options.proposalId,
      options.avatar,
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Redeem ether reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} opts
   */
  public async redeemEther(opts = {}): Promise<ArcTransactionResult> {

    const defaults = {
      avatar: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const tx = await this.contract.redeemEther(
      options.proposalId,
      options.avatar,
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Return all proposals ever created under the given avatar.
   * Filter by the optional proposalId.
   * @param opts
   */
  public async getDaoProposals(opts = {}): Promise<Array<ContributionProposal>> {

    const defaults: GetDaoProposalsParams = {
      avatar: undefined,
      proposalId: null,
    };

    const options: GetDaoProposalsParams = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const proposals = new Array<ContributionProposal>();

    if (options.proposalId) {
      const orgProposal = await this.contract.organizationsProposals(options.avatar, options.proposalId);
      const proposal = this.orgProposalToContributionProposal(orgProposal, options.proposalId);
      proposals.push(proposal);
    } else {
      const eventFetcher = this.contract.NewContributionProposal({ _avatar: options.avatar }, { fromBlock: 0 });
      await new Promise((resolve) => {
        eventFetcher.get(async (err, events) => {
          for (const event of events) {
            const proposalId = event.args._proposalId;
            const orgProposal = await this.contract.organizationsProposals(options.avatar, proposalId);
            const proposal = this.orgProposalToContributionProposal(orgProposal, proposalId);
            proposals.push(proposal);
          }
          resolve();
        });
      });
    }

    return proposals;
  }

  /**
   * Return a list of executed (passed) proposals that have rewards
   * waiting to be redeemed by the given beneficiary.
   * @param opts
   */
  public async getBeneficiaryRewards(opts = {}): Promise<Array<ProposalRewards>> {

    const defaults = {
      avatar: undefined,
      beneficiary: undefined,
      proposalId: null,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const proposals = await this.getDaoProposals(options);

    const rewardsArray = new Array<ProposalRewards>();

    for (const proposal of proposals) {

      rewardsArray.push({
        ethReward: await this.computeRemainingReward(proposal, "ethReward", options.avatar, RewardType.Eth),
        externalTokenReward: await this.computeRemainingReward(proposal, "externalTokenReward", options.avatar, RewardType.ExternalToken),
        nativeTokenReward: await this.computeRemainingReward(proposal, "nativeTokenReward", options.avatar, RewardType.NativeToken),
        proposalId: proposal.proposalId,
        reputationChange: await this.computeRemainingReward(proposal, "reputationChange", options.avatar, RewardType.Reputation),
      });
    }

    return rewardsArray;
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

  private async computeRemainingReward(
    proposal: ContributionProposal,
    rewardName: string,
    avatar: Address,
    rewardType: RewardType): Promise<BigNumber.BigNumber> {

    const amountToRedeemPerPeriod = proposal[rewardName];
    const countRedeemedPeriods = await this.contract.getRedeemedPeriods(proposal.proposalId, avatar, rewardType);
    const totalReward = amountToRedeemPerPeriod.mul(proposal.numberOfPeriods);
    const amountRewarded = amountToRedeemPerPeriod.mul(countRedeemedPeriods);
    return totalReward.sub(amountRewarded);
  }

  private orgProposalToContributionProposal(orgProposal: Array<any>, proposalId: Hash): ContributionProposal {
    return {
      beneficiary: orgProposal[6],
      contributionDescriptionHash: orgProposal[9],
      ethReward: orgProposal[3],
      executionTime: orgProposal[9],
      externalToken: orgProposal[4],
      externalTokenReward: orgProposal[5],
      nativeTokenReward: orgProposal[1],
      numberOfPeriods: orgProposal[8],
      periodLength: orgProposal[7],
      proposalId,
      reputationChange: orgProposal[2],
    };
  }
}

enum RewardType {
  Reputation = 0,
  NativeToken = 1,
  Eth = 2,
  ExternalToken = 3,
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
  _rewards: Array<BigNumber.BigNumber>;
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

export interface ContributionProposal {
  proposalId: Hash;
  beneficiary: Address;
  contributionDescriptionHash: Hash;
  ethReward: BigNumber.BigNumber;
  executionTime: number;
  externalToken: Address;
  externalTokenReward: BigNumber.BigNumber;
  nativeTokenReward: BigNumber.BigNumber;
  numberOfPeriods: number;
  periodLength: number;
  reputationChange: BigNumber.BigNumber;
}

export interface GetDaoProposalsParams {
  /**
   * The avatar under which the proposals were created
   */
  avatar: Address;
  /**
   * Optionally filter on the given proposalId
   */
  proposalId?: Hash;
}

interface ProposalRewards {
  ethReward: BigNumber.BigNumber;
  externalTokenReward: BigNumber.BigNumber;
  nativeTokenReward: BigNumber.BigNumber;
  proposalId: Hash;
  reputationChange: BigNumber.BigNumber;
}
