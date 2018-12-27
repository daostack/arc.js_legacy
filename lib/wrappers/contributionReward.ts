"use strict";
import { AvatarService } from "../avatarService";
import {
  Address,
  DefaultSchemePermissions,
  Hash,
  SchemePermissions
} from "../commonTypes";
import { ConfigService } from "../configService";

import { BigNumber } from "bignumber.js";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  DecodedLogEntryEvent,
  IContractWrapperFactory,
  IUniversalSchemeWrapper,
  StandardSchemeParams,
} from "../iContractWrapperBase";
import { ProposalGeneratorBase } from "../proposalGeneratorBase";
import { TransactionService, TxGeneratingFunctionOptions } from "../transactionService";
import { Utils } from "../utils";
import { EntityFetcherFactory, EventFetcherFactory, Web3EventService } from "../web3EventService";
import {
  ProposalDeletedEventResult,
  SchemeProposalExecutedEventResult
} from "./commonEventInterfaces";

export class ContributionRewardWrapper extends ProposalGeneratorBase {

  public name: string = "ContributionReward";
  public friendlyName: string = "Contribution Reward";
  public factory: IContractWrapperFactory<ContributionRewardWrapper> = ContributionRewardFactory;
  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public NewContributionProposal: EventFetcherFactory<NewContributionProposalEventResult>;
  public ProposalExecuted: EventFetcherFactory<SchemeProposalExecutedEventResult>;
  public ProposalDeleted: EventFetcherFactory<ProposalDeletedEventResult>;
  public RedeemReputation: EventFetcherFactory<RedeemEventResult>;
  public RedeemEther: EventFetcherFactory<RedeemEventResult>;
  public RedeemNativeToken: EventFetcherFactory<RedeemEventResult>;
  public RedeemExternalToken: EventFetcherFactory<RedeemEventResult>;
  /* tslint:enable:max-line-length */

  /**
   * Submit a proposal to reward a beneficiary for contributions to the DAO
   * @param {ProposeContributionRewardParams} options
   */
  public async proposeContributionReward(
    options: ProposeContributionRewardParams = {} as ProposeContributionRewardParams & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionProposalResult> {

    const defaults = {
      descriptionIsHashed: false,
      ethReward: "0",
      externalToken: "", // must have a value for solidity
      externalTokenReward: "0",
      nativeTokenReward: "0",
      reputationChange: "0",
    };

    options = Object.assign({}, defaults, options) as ProposeContributionRewardParams;

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.description) {
      throw new Error("description is not defined");
    }

    if (!Number.isInteger(options.numberOfPeriods) || (options.numberOfPeriods <= 0)) {
      throw new Error("numberOfPeriods must be greater than zero");
    }

    if (!Number.isInteger(options.periodLength) || (options.periodLength < 0)) {
      throw new Error("periodLength must be an integer greater than or equal to zero");
    }

    /**
     * will thrown Error if not valid numbers
     */
    const web3 = await Utils.getWeb3();
    const reputationChange = web3.toBigNumber(options.reputationChange);
    const nativeTokenReward = web3.toBigNumber(options.nativeTokenReward);
    const ethReward = web3.toBigNumber(options.ethReward);
    const externalTokenReward = web3.toBigNumber(options.externalTokenReward);

    if (
      (nativeTokenReward.lt(0) ||
        ethReward.lt(0) ||
        externalTokenReward.lt(0))
    ) {
      throw new Error("rewards must be greater than or equal to zero");
    }

    if (
      !(
        (!reputationChange.eq(0) ||
          nativeTokenReward.gt(0) ||
          reputationChange.gt(0) ||
          ethReward.gt(0) ||
          externalTokenReward.gt(0))
      )
    ) {
      throw new Error("no reward amount was given");
    }

    if (externalTokenReward.gt(0) && !options.externalToken) {
      throw new Error(
        "external token reward is proposed but externalToken is not defined"
      );
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    const orgNativeTokenFee = (await this.getSchemeParameters(options.avatar)).orgNativeTokenFee;
    const autoApproveTransfer = ConfigService.get("autoApproveTokenTransfers") && (orgNativeTokenFee.toNumber() > 0);

    const functionName = "ContributionReward.proposeContributionReward";

    const payload = TransactionService.publishKickoffEvent(
      functionName,
      options,
      1 + (autoApproveTransfer ? 1 : 0));

    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);

    if (autoApproveTransfer) {
      /**
       * approve immediate transfer of native tokens from msg.sender to the avatar
       */
      const avatarService = new AvatarService(options.avatar);
      const token = await avatarService.getNativeToken();

      const result = await token.approve({
        amount: orgNativeTokenFee,
        spender: options.avatar,
        txEventContext: eventContext,
      });

      await result.watchForTxMined();
    }

    this.logContractFunctionCall("ContributionReward.proposeContributionReward", options);

    const tx = await this.sendTransaction(
      eventContext,
      this.contract.proposeContributionReward,
      [options.avatar,
      options.descriptionIsHashed ? options.description : Utils.SHA3(options.description),
        reputationChange,
      [nativeTokenReward, ethReward, externalTokenReward, options.periodLength, options.numberOfPeriods],
      options.externalToken,
      options.beneficiaryAddress]);

    if (tx) {
      TransactionService.publishTxLifecycleEvents(eventContext, tx, this.contract);
    }

    return new ArcTransactionProposalResult(tx, this.contract, await this.getVotingMachine(options.avatar));
  }

  /**
   * Redeem the specified rewards for the beneficiary of the proposal
   * @param {ContributionRewardRedeemParams} opts
   */
  public async redeemContributionReward(
    options: ContributionRewardRedeemParams = {} as ContributionRewardRedeemParams & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {
    const defaults = {
      ethers: false,
      externalTokens: false,
      nativeTokens: false,
      reputation: false,
    };

    options = Object.assign({}, defaults, options) as ContributionRewardRedeemParams;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    this.logContractFunctionCall("ContributionReward.redeem", options);

    return this.wrapTransactionInvocation("ContributionReward.redeemContributionReward",
      options,
      this.contract.redeem,
      [options.proposalId,
      options.avatar,
      [options.reputation, options.nativeTokens, options.ethers, options.externalTokens]]
    );
  }

  /**
   * Redeem external token reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} options
   */
  public async redeemExternalToken(
    options: ContributionRewardSpecifiedRedemptionParams =
      {} as ContributionRewardSpecifiedRedemptionParams & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    this.logContractFunctionCall("ContributionReward.redeemExternalToken", options);

    return this.wrapTransactionInvocation("ContributionReward.redeemExternalToken",
      options,
      this.contract.redeemExternalToken,
      [options.proposalId,
      options.avatar]
    );
  }

  /**
   * Redeem reputation reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} options
   */
  public async redeemReputation(
    options: ContributionRewardSpecifiedRedemptionParams =
      {} as ContributionRewardSpecifiedRedemptionParams & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    this.logContractFunctionCall("ContributionReward.redeemReputation", options);

    return this.wrapTransactionInvocation("ContributionReward.redeemReputation",
      options,
      this.contract.redeemReputation,
      [options.proposalId,
      options.avatar]
    );
  }

  /**
   * Redeem native token reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} options
   */
  public async redeemNativeToken(
    options: ContributionRewardSpecifiedRedemptionParams =
      {} as ContributionRewardSpecifiedRedemptionParams & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    this.logContractFunctionCall("ContributionReward.redeemNativeToken", options);

    return this.wrapTransactionInvocation("ContributionReward.redeemNativeToken",
      options,
      this.contract.redeemNativeToken,
      [options.proposalId,
      options.avatar]
    );
  }

  /**
   * Redeem ether reward for the beneficiary of the proposal
   * @param {ContributionRewardSpecifiedRedemptionParams} options
   */
  public async redeemEther(
    options: ContributionRewardSpecifiedRedemptionParams =
      {} as ContributionRewardSpecifiedRedemptionParams & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    this.logContractFunctionCall("ContributionReward.redeemEther", options);

    return this.wrapTransactionInvocation("ContributionReward.redeemEther",
      options,
      this.contract.redeemEther,
      [options.proposalId,
      options.avatar]
    );
  }

  /**
   * EntityFetcherFactory for votable ContributionProposals.
   * @param avatarAddress
   */
  public async getVotableProposals(avatarAddress: Address):
    Promise<EntityFetcherFactory<ContributionProposal, NewContributionProposalEventResult>> {

    if (!avatarAddress) {
      throw new Error("avatarAddress is not set");
    }

    return this.proposalService.getProposalEvents(
      {
        baseArgFilter: { _avatar: avatarAddress },
        proposalsEventFetcher: this.NewContributionProposal,
        transformEventCallback:
          async (event: DecodedLogEntryEvent<NewContributionProposalEventResult>): Promise<ContributionProposal> => {
            return this.getProposal(event.args._avatar, event.args._proposalId);
          },
        votableOnly: true,
        votingMachine: await this.getVotingMachine(avatarAddress),
      });
  }

  /**
   * EntityFetcherFactory for executed ContributionProposals.
   * The Arc ContributionProposals contract retains the original proposal struct after execution.
   * @param avatarAddress
   */
  public getExecutedProposals(avatarAddress: Address):
    EntityFetcherFactory<ContributionProposal, SchemeProposalExecutedEventResult> {

    return this.proposalService.getProposalEvents(
      {
        baseArgFilter: { _avatar: avatarAddress },
        proposalsEventFetcher: this.ProposalExecuted,
        transformEventCallback:
          (event: DecodedLogEntryEvent<SchemeProposalExecutedEventResult>): Promise<ContributionProposal> => {
            return this.getProposal(avatarAddress, event.args._proposalId);
          },
      });
  }

  /**
   * Return a list of `ProposalRewards` for executed (passed by vote) proposals
   * that have rewards waiting to be redeemed by the given beneficiary.
   * `ProposalRewards` includes the total amount redeemable, the amount
   * yet-to-be redeemed and where applicable, the amount that the Dao has available
   * to pay out.  The latter is useful for anticipating whether an attempt
   * to redeem would succeed.
   * @param {GetBeneficiaryRewardsParams} options
   */
  public async getBeneficiaryRewards(
    options: GetBeneficiaryRewardsParams = {} as GetBeneficiaryRewardsParams)
    : Promise<Array<ProposalRewards>> {

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }
    /**
     * Fetch from block 0 for the given avatar
     */
    const proposalsFetcher = this.ProposalExecuted(
      Object.assign({ _avatar: options.avatar }, options.proposalId ? { _proposalId: options.proposalId } : {}),
      { fromBlock: 0 });
    /**
     * get the proposals for the given beneficiary.
     * We don't use getExecutedProposals because we want to be able to work
     * across avatars.
     */
    const proposals = new Array<ContributionProposal>();
    await new Promise<Array<void>>(
      async (resolve: () => void, reject: (error: Error) => void): Promise<void> => {
        proposalsFetcher.get(
          async (error: Error, log: Array<DecodedLogEntryEvent<SchemeProposalExecutedEventResult>>) => {
            if (error) {
              return reject(error);
            }
            for (const event of log) {
              const proposal = await this.getProposal(options.avatar, event.args._proposalId);
              if (proposal.beneficiaryAddress === options.beneficiaryAddress) {
                proposals.push(proposal);
              }
            }
            resolve();
          });
      });

    const rewardsArray = new Array<ProposalRewards>();
    const avatarService = new AvatarService(options.avatar);

    for (const proposal of proposals) {

      const proposalRewards: Partial<ProposalRewards> = {};

      proposalRewards.proposalId = proposal.proposalId;

      await this.computeRemainingReward(proposalRewards,
        proposal, "ethReward", options.avatar, RewardType.Eth);

      if (proposal.ethReward.gt("0")) {
        proposalRewards.ethAvailableToReward = await avatarService.getEthBalance();
      }

      await this.computeRemainingReward(proposalRewards,
        proposal, "externalTokenReward", options.avatar, RewardType.ExternalToken);

      if (proposal.externalTokenReward.gt("0")) {
        proposalRewards.externalTokensAvailableToReward = await avatarService.getTokenBalance(proposal.externalToken);
      }

      await this.computeRemainingReward(proposalRewards,
        proposal, "nativeTokenReward", options.avatar, RewardType.NativeToken);

      await this.computeRemainingReward(proposalRewards,
        proposal, "reputationChange", options.avatar, RewardType.Reputation);

      rewardsArray.push(proposalRewards as ProposalRewards);
    }

    return rewardsArray;
  }

  public getParametersHash(params: ContributionRewardParams): Promise<Hash> {
    params = Object.assign({},
      {
        orgNativeTokenFee: 0,
      },
      params);

    return this._getParametersHash(
      params.orgNativeTokenFee,
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  public setParameters(
    params: ContributionRewardParams & TxGeneratingFunctionOptions): Promise<ArcTransactionDataResult<Hash>> {

    this.validateStandardSchemeParams(params);

    params = Object.assign({},
      {
        orgNativeTokenFee: 0,
      },
      params);

    const orgNativeTokenFee = new BigNumber(params.orgNativeTokenFee);

    if (orgNativeTokenFee.lt(0)) {
      throw new Error("orgNativeTokenFee must be greater than or equal to 0");
    }

    return super._setParameters(
      "ContributionReward.setParameters",
      params.txEventContext,
      orgNativeTokenFee,
      params.voteParametersHash,
      params.votingMachineAddress
    );
  }

  /**
   * Returns promise of a `ContributionProposal` for the given proposal id and avatar address.
   * @param avatarAddress
   * @param proposalId
   */
  public async getProposal(avatarAddress: Address, proposalId: Hash): Promise<ContributionProposal> {
    const proposalParams = await this.contract.organizationsProposals(avatarAddress, proposalId);
    return this.convertProposalPropsArrayToObject(proposalParams, proposalId);
  }

  public getDefaultPermissions(): SchemePermissions {
    return DefaultSchemePermissions.ContributionReward as number;
  }

  public async getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions> {
    return this._getSchemePermissions(avatarAddress);
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

  protected hydrated(): void {
    /* tslint:disable:max-line-length */
    this.NewContributionProposal = this.createEventFetcherFactory<NewContributionProposalEventResult>(this.contract.NewContributionProposal);
    this.ProposalExecuted = this.createEventFetcherFactory<SchemeProposalExecutedEventResult>(this.contract.ProposalExecuted);
    this.RedeemReputation = this.createEventFetcherFactory<RedeemEventResult>(this.contract.RedeemReputation);
    this.RedeemEther = this.createEventFetcherFactory<RedeemEventResult>(this.contract.RedeemEther);
    this.RedeemNativeToken = this.createEventFetcherFactory<RedeemEventResult>(this.contract.RedeemNativeToken);
    this.RedeemExternalToken = this.createEventFetcherFactory<RedeemEventResult>(this.contract.RedeemExternalToken);
    /* tslint:enable:max-line-length */
  }

  private async computeRemainingReward(
    proposalRewards: Partial<ProposalRewards>,
    proposal: ContributionProposal,
    rewardName: string,
    avatarAddress: Address,
    rewardType: RewardType): Promise<void> {

    const amountToRedeemPerPeriod = proposal[rewardName];
    const countRedeemedPeriods = await this.contract.getRedeemedPeriods(proposal.proposalId, avatarAddress, rewardType);
    const countRedeemablePeriods = await this.contract.getPeriodsToPay(proposal.proposalId, avatarAddress, rewardType);
    const totalReward = amountToRedeemPerPeriod.mul(proposal.numberOfPeriods);
    const amountRewarded = amountToRedeemPerPeriod.mul(countRedeemedPeriods);
    const amountRedeemable = amountToRedeemPerPeriod.mul(countRedeemablePeriods);
    proposalRewards[rewardName] = totalReward;
    proposalRewards[`${rewardName}Unredeemed`] = totalReward.sub(amountRewarded);
    proposalRewards[`${rewardName}Redeemable`] = amountRedeemable;
  }

  private convertProposalPropsArrayToObject(propsArray: Array<any>, proposalId: Hash): ContributionProposal {
    return {
      beneficiaryAddress: propsArray[5],
      ethReward: propsArray[2],
      executionTime: propsArray[8],
      externalToken: propsArray[3],
      externalTokenReward: propsArray[4],
      nativeTokenReward: propsArray[0],
      numberOfPeriods: propsArray[7],
      periodLength: propsArray[6],
      proposalId,
      reputationChange: propsArray[1],
    };
  }
}

export enum RewardType {
  Reputation = 0,
  NativeToken = 1,
  Eth = 2,
  ExternalToken = 3,
}

export const ContributionRewardFactory =
  new ContractWrapperFactory("ContributionReward", ContributionRewardWrapper, new Web3EventService());

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
  _reputationChange: BigNumber;
  _rewards: Array<BigNumber>;
}

export interface ContributionProposal {
  proposalId: Hash;
  beneficiaryAddress: Address;
  ethReward: BigNumber;
  executionTime: number;
  externalToken: Address;
  externalTokenReward: BigNumber;
  nativeTokenReward: BigNumber;
  numberOfPeriods: number;
  periodLength: number;
  reputationChange: BigNumber;
}

export interface ProposalRewards {
  /**
   * The amount of ETH the DAO currently has on hand to reward.
   */
  ethAvailableToReward: BigNumber;
  /**
   * The total ETH reward
   */
  ethReward: BigNumber;
  /**
   * The total unredeemed amount of ETH
   */
  ethRewardUnredeemed: BigNumber;
  /**
   * The currently-redeemable external token reward
   */
  ethRewardRedeemable: BigNumber;
  /**
   * The amount of external tokens the DAO currently has on hand to reward.
   */
  externalTokensAvailableToReward: BigNumber;
  /**
   * The total external token reward
   */
  externalTokenReward: BigNumber;
  /**
   * The total unredeemed number of external tokens
   */
  externalTokenRewardUnredeemed: BigNumber;
  /**
   * The currently-redeemable external token reward
   */
  externalTokenRewardRedeemable: BigNumber;
  /**
   * The total native token reward
   */
  nativeTokenReward: BigNumber;
  /**
   * The total unredeemed number of native tokens
   */
  nativeTokenRewardUnredeemed: BigNumber;
  /**
   * The currently-redeemable native token reward
   */
  nativeTokenRewardRedeemable: BigNumber;
  /**
   * The proposal Id
   */
  proposalId: Hash;
  /**
   * The total reputation reward
   */
  reputationChange: BigNumber;
  /**
   * The total unredeemed amount of reputation
   */
  reputationChangeUnredeemed: BigNumber;
  /**
   * The currently-redeemable reputation reward
   */
  reputationChangeRedeemable: BigNumber;
}

export interface ContributionRewardParams extends StandardSchemeParams {
  orgNativeTokenFee: BigNumber | string;
}

export interface ContributionRewardParamsReturn extends StandardSchemeParams {
  orgNativeTokenFee: BigNumber;
}

export interface ContributionRewardSpecifiedRedemptionParams {
  /**
   * The avatar under which the proposal was made
   */
  avatar: Address;
  /**
   * The reward proposal
   */
  proposalId: string;
}

export interface GetBeneficiaryRewardsParams {
  /**
   * The avatar under which the proposals were created
   */
  avatar: Address;
  /**
   * The agent who is to receive the rewards
   */
  beneficiaryAddress: string;
  /**
   * Optionally filter on the given proposalId
   */
  proposalId?: string;
}

export interface ProposeContributionRewardParams {
  /**
   * avatar address
   */
  avatar: Address;
  /**
   * description of the constraint
   */
  description: string;
  /**
   * Amount of reputation change requested, per period.
   * Can be negative.  In Wei. Default is 0;
   */
  reputationChange?: BigNumber | string;
  /**
   * Reward in tokens per period, in the DAO's native token.
   * Must be >= 0.
   * In Wei. Default is 0;
   */
  nativeTokenReward?: BigNumber | string;
  /**
   * Reward per period, in ethers.
   * Must be >= 0.
   * In Wei. Default is 0;
   */
  ethReward?: BigNumber | string;
  /**
   * Reward per period in the given external token.
   * Must be >= 0.
   * In Wei. Default is 0;
   */
  externalTokenReward?: BigNumber | string;
  /**
   * The number of blocks in a period.
   * Must be >= 0.  If zero then the rewards will be redeemable immediately
   * upon proposal execution.
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
  beneficiaryAddress: string;
  /**
   * True if description is a hashed, false if not and in which case Arc.js will hash it.
   * The default is false.
   */
  descriptionIsHashed?: boolean;
}

export interface ContributionRewardRedeemParams {
  /**
   * The reward proposal
   */
  proposalId: string;
  /**
   * The avatar under which the proposal was made
   */
  avatar: Address;
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

export interface RedeemEventResult {
  /**
   * the amount redeemed
   */
  _amount: BigNumber;
  /**
   * avatar address
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
