"use strict";
import dopts = require("default-options");
import { AvatarService } from "../avatarService";
import { Address, fnVoid, GetDaoProposalsConfig, Hash } from "../commonTypes";
import { Config } from "../config";

import * as BigNumber from "bignumber.js";
import ContractWrapperFactory from "../ContractWrapperFactory";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  DecodedLogEntryEvent,
  EventFetcherFactory,
  ExtendTruffleContract,
  StandardSchemeParams,
} from "../ExtendTruffleContract";
import { Utils } from "../utils";
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
  public NewContributionProposal: EventFetcherFactory<NewContributionProposalEventResult> = this.createEventFetcherFactory<NewContributionProposalEventResult>("NewContributionProposal");
  public ProposalExecuted: EventFetcherFactory<ProposalExecutedEventResult> = this.createEventFetcherFactory<ProposalExecutedEventResult>("ProposalExecuted");
  public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult> = this.createEventFetcherFactory<ProposalDeletedEventResult>("ProposalDeleted");
  public RedeemReputation: EventFetcherFactory<RedeemReputationEventResult> = this.createEventFetcherFactory<RedeemReputationEventResult>("RedeemReputation");
  public RedeemEther: EventFetcherFactory<RedeemEtherEventResult> = this.createEventFetcherFactory<RedeemEtherEventResult>("RedeemEther");
  public RedeemNativeToken: EventFetcherFactory<RedeemNativeTokenEventResult> = this.createEventFetcherFactory<RedeemNativeTokenEventResult>("RedeemNativeToken");
  public RedeemExternalToken: EventFetcherFactory<RedeemExternalTokenEventResult> = this.createEventFetcherFactory<RedeemExternalTokenEventResult>("RedeemExternalToken");
  /* tslint:enable:max-line-length */

  /**
   * Submit a proposal for a reward for a contribution
   * @param {ProposeContributionRewardParams} opts
   */
  public async proposeContributionReward(
    opts: ProposeContributionRewardParams = {} as ProposeContributionRewardParams)
    : Promise<ArcTransactionProposalResult> {
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

    const options = dopts(opts, defaults, { allowUnknown: true }) as ProposeContributionRewardParams;

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
        "external token reward is proposed but externalToken is not defined"
      );
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const orgNativeTokenFee = (await this.getSchemeParameters(options.avatar)).orgNativeTokenFee;

    if (Config.get("autoApproveTokenTransfers") && (orgNativeTokenFee.toNumber() > 0)) {
      /**
       * approve immediate transfer of native tokens from msg.sender to the avatar
       */
      const avatarService = new AvatarService(options.avatar);
      const token = await avatarService.getNativeToken();
      await token.approve(this.address, orgNativeTokenFee, { from: await Utils.getDefaultAccount() });
    }

    const tx = await this.contract.proposeContributionReward(
      options.avatar,
      Utils.SHA3(options.description),
      reputationChange,
      [nativeTokenReward, ethReward, externalTokenReward, options.periodLength, options.numberOfPeriods],
      options.externalToken,
      options.beneficiary
    );
    return new ArcTransactionProposalResult(tx);
  }

  /**
   * Redeem the specified rewards for the beneficiary of the proposal
   * @param {ContributionRewardRedeemParams} opts
   */
  public async redeemContributionReward(
    opts: ContributionRewardRedeemParams = {} as ContributionRewardRedeemParams)
    : Promise<ArcTransactionResult> {
    const defaults = {
      avatar: undefined,
      ethers: false,
      externalTokens: false,
      nativeTokens: false,
      proposalId: undefined,
      reputation: false,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as ContributionRewardRedeemParams;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const tx = await this.contract.redeem(
      options.proposalId,
      options.avatar,
      [options.reputation, options.nativeTokens, options.ethers, options.externalTokens]
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Redeem external token reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} opts
   */
  public async redeemExternalToken(
    opts: ContributionRewardSpecifiedRedemptionParams = {} as ContributionRewardSpecifiedRedemptionParams)
    : Promise<ArcTransactionResult> {

    const defaults = {
      avatar: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as ContributionRewardSpecifiedRedemptionParams;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const tx = await this.contract.redeemExternalToken(
      options.proposalId,
      options.avatar
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Redeem reputation reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} opts
   */
  public async redeemReputation(
    opts: ContributionRewardSpecifiedRedemptionParams = {} as ContributionRewardSpecifiedRedemptionParams)
    : Promise<ArcTransactionResult> {

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
      options.avatar
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Redeem native token reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} opts
   */
  public async redeemNativeToken(
    opts: ContributionRewardSpecifiedRedemptionParams = {} as ContributionRewardSpecifiedRedemptionParams)
    : Promise<ArcTransactionResult> {

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
      options.avatar
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Redeem ether reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} opts
   */
  public async redeemEther(
    opts: ContributionRewardSpecifiedRedemptionParams = {} as ContributionRewardSpecifiedRedemptionParams)
    : Promise<ArcTransactionResult> {

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
      options.avatar
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Return all ContributionReward proposals ever created under the given avatar.
   * Filter by the optional proposalId.
   */
  public async getDaoProposals(
    opts: GetDaoProposalsConfig = {} as GetDaoProposalsConfig): Promise<Array<ContributionProposal>> {

    const defaults: GetDaoProposalsConfig = {
      avatar: undefined,
      proposalId: null,
    };

    const options: GetDaoProposalsConfig = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const proposals = new Array<ContributionProposal>();

    if (options.proposalId) {
      const orgProposal = await this.contract.organizationsProposals(options.avatar, options.proposalId);
      const proposal = this.orgProposalToContributionProposal(orgProposal, options.proposalId);
      proposals.push(proposal);
    } else {
      const eventFetcher = this.NewContributionProposal({ _avatar: options.avatar }, { fromBlock: 0 });
      await new Promise((resolve: fnVoid): void => {
        eventFetcher.get(async (err: any, log: Array<DecodedLogEntryEvent<NewContributionProposalEventResult>>) => {
          for (const event of log) {
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
   * Return a list of `ProposalRewards` for executed (passed by vote) proposals
   * that have rewards waiting to be redeemed by the given beneficiary.
   * `ProposalRewards` includes both the total amount redeemable and the amount
   * yet-to-be redeemed.
   * @param {GetBeneficiaryRewardsParams} opts
   */
  public async getBeneficiaryRewards(
    opts: GetBeneficiaryRewardsParams = {} as GetBeneficiaryRewardsParams)
    : Promise<Array<ProposalRewards>> {

    const defaults = {
      avatar: undefined,
      beneficiary: undefined,
      proposalId: null,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetBeneficiaryRewardsParams;

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const proposals = await this.getDaoProposals(options);

    const rewardsArray = new Array<ProposalRewards>();

    for (const proposal of proposals) {

      const proposalRewards = {} as ProposalRewards;

      proposalRewards.proposalId = proposal.proposalId;

      await this.computeRemainingReward(proposalRewards,
        proposal, "ethReward", options.avatar, RewardType.Eth);

      await this.computeRemainingReward(proposalRewards,
        proposal, "externalTokenReward", options.avatar, RewardType.ExternalToken);

      await this.computeRemainingReward(proposalRewards,
        proposal, "nativeTokenReward", options.avatar, RewardType.NativeToken);

      await this.computeRemainingReward(proposalRewards,
        proposal, "reputationChange", options.avatar, RewardType.Reputation);

      rewardsArray.push(proposalRewards);
    }

    return rewardsArray;
  }

  public async setParams(params: ContributionRewardParams): Promise<ArcTransactionDataResult<Hash>> {

    params = Object.assign({},
      {
        orgNativeTokenFee: 0,
      },
      params);

    return super.setParams(
      params.orgNativeTokenFee,
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public getDefaultPermissions(overrideValue?: string): string {
    return overrideValue || "0x00000001";
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<ContributionRewardParamsReturn> {
    return this._getSchemeParameters(avatarAddress);
  }

  public async getParameters(paramsHash: Hash): Promise<ContributionRewardParamsReturn> {
    const params = await this.getParametersArray(paramsHash);
    return {
      orgNativeTokenFee: params[0],
      voteParametersHash: params[1],
      votingMachineAddress: params[2],
    };
  }

  private async computeRemainingReward(
    proposalRewards: ProposalRewards,
    proposal: ContributionProposal,
    rewardName: string,
    avatar: Address,
    rewardType: RewardType): Promise<void> {

    const amountToRedeemPerPeriod = proposal[rewardName];
    const countRedeemedPeriods = await this.contract.getRedeemedPeriods(proposal.proposalId, avatar, rewardType);
    const totalReward = amountToRedeemPerPeriod.mul(proposal.numberOfPeriods);
    const amountRewarded = amountToRedeemPerPeriod.mul(countRedeemedPeriods);
    proposalRewards[rewardName] = totalReward;
    proposalRewards[`${rewardName}Unredeemed`] = totalReward.sub(amountRewarded);
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

const ContributionReward = new ContractWrapperFactory("ContributionReward", ContributionRewardWrapper);
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

export interface ProposalRewards {
  ethReward: BigNumber.BigNumber;
  ethRewardUnredeemed: BigNumber.BigNumber;
  externalTokenReward: BigNumber.BigNumber;
  externalTokenRewardUnredeemed: BigNumber.BigNumber;
  nativeTokenReward: BigNumber.BigNumber;
  nativeTokenRewardUnredeemed: BigNumber.BigNumber;
  proposalId: Hash;
  reputationChange: BigNumber.BigNumber;
  reputationChangeUnredeemed: BigNumber.BigNumber;
}

export interface ContributionRewardParams extends StandardSchemeParams {
  orgNativeTokenFee: BigNumber.BigNumber | string;
}

export interface ContributionRewardParamsReturn extends StandardSchemeParams {
  orgNativeTokenFee: BigNumber.BigNumber;
}

export interface ContributionRewardSpecifiedRedemptionParams {
  /**
   * The avatar under which the proposal was made
   */
  avatar: string;
  /**
   * The reward proposal
   */
  proposalId: string;
}

export interface GetBeneficiaryRewardsParams {
  /**
   * The avatar under which the proposals were created
   */
  avatar: string;
  /**
   * The agent who is to receive the rewards
   */
  beneficiary: string;
  /**
   * Optionally filter on the given proposalId
   */
  proposalId?: string;
}

export interface ProposeContributionRewardParams {
  /**
   * avatar address
   */
  avatar: string;
  /**
   * description of the constraint
   */
  description: string;
  /**
   * Amount of reputation change requested, per period.
   * Can be negative.  In Wei. Default is 0;
   */
  reputationChange?: BigNumber.BigNumber | string;
  /**
   * Reward in tokens per period, in the DAO's native token.
   * Must be >= 0.
   * In Wei. Default is 0;
   */
  nativeTokenReward?: BigNumber.BigNumber | string;
  /**
   * Reward per period, in ethers.
   * Must be >= 0.
   * In Wei. Default is 0;
   */
  ethReward?: BigNumber.BigNumber | string;
  /**
   * Reward per period in the given external token.
   * Must be >= 0.
   * In Wei. Default is 0;
   */
  externalTokenReward?: BigNumber.BigNumber | string;
  /**
   * The number of blocks in a period.
   * Must be > 0.
   */
  periodLength: number;
  /**
   * Maximum number of periods that can be paid out.
   * Must be > 0.
   */
  numberOfPeriods: number;
  /**
   * The address of the external token (for externalTokenReward)
   * Only required when externalTokenReward is non-zero.
   */
  externalToken?: string;
  /**
   *  beneficiary address
   */
  beneficiary: string;
}

export interface ContributionRewardRedeemParams {
  /**
   * The reward proposal
   */
  proposalId: string;
  /**
   * The avatar under which the proposal was made
   */
  avatar: string;
  /**
   * true to credit/debit reputation
   * Default is false
   */
  reputation?: boolean;
  /**
   * true to reward native tokens
   * Default is false
   */
  nativeTokens?: boolean;
  /**
   * true to reward ethers
   * Default is false
   */
  ethers?: boolean;
  /**
   * true to reward external tokens
   * Default is false
   */
  externalTokens?: boolean;
}
