"use strict";
import * as BigNumber from "bignumber.js";
import {
  Address,
  BinaryVoteResult,
  DefaultSchemePermissions,
  fnVoid,
  GetDaoProposalsConfig,
  Hash,
  SchemePermissions,
  SchemeWrapper,
  VoteConfig
} from "../commonTypes";
import { ConfigService } from "../configService";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  ContractWrapperBase,
  DecodedLogEntryEvent,
  EventFetcherFactory,
} from "../contractWrapperBase";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { TransactionService } from "../transactionService";
import { Utils } from "../utils";
import {
  ExecuteProposalEventResult,
  NewProposalEventResult,
  RedeemReputationEventResult,
  VoteProposalEventResult,
} from "./commonEventInterfaces";

export class GenesisProtocolWrapper extends ContractWrapperBase implements SchemeWrapper {

  public name: string = "GenesisProtocol";
  public friendlyName: string = "Genesis Protocol";
  public factory: ContractWrapperFactory<GenesisProtocolWrapper> = GenesisProtocolFactory;
  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public NewProposal: EventFetcherFactory<NewProposalEventResult> = this.createEventFetcherFactory<NewProposalEventResult>("NewProposal");
  public ExecuteProposal: EventFetcherFactory<GenesisProtocolExecuteProposalEventResult> = this.createEventFetcherFactory<GenesisProtocolExecuteProposalEventResult>("ExecuteProposal");
  public VoteProposal: EventFetcherFactory<VoteProposalEventResult> = this.createEventFetcherFactory<VoteProposalEventResult>("VoteProposal");
  public Stake: EventFetcherFactory<StakeEventResult> = this.createEventFetcherFactory<StakeEventResult>("Stake");
  public Redeem: EventFetcherFactory<RedeemEventResult> = this.createEventFetcherFactory<RedeemEventResult>("Redeem");
  public RedeemReputation: EventFetcherFactory<RedeemReputationEventResult> = this.createEventFetcherFactory<RedeemReputationEventResult>("RedeemReputation");
  /* tslint:enable:max-line-length */

  /**
   * Create a proposal
   * @param {ProposeVoteConfig} options
   * @returns Promise<ArcTransactionProposalResult>
   */
  public async propose(options: ProposeVoteConfig = {} as ProposeVoteConfig): Promise<ArcTransactionProposalResult> {
    /**
     * see GenesisProtocolProposeVoteConfig
     */
    const defaults = {
      numOfChoices: 0,
      proposer: await Utils.getDefaultAccount(),
    };

    options = Object.assign({}, defaults, options);

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    if (!options.executable) {
      throw new Error("executable is not defined");
    }

    if (!options.proposer) {
      throw new Error("proposer is not defined");
    }

    if ((options.numOfChoices < 1) || (options.numOfChoices > 10)) {
      throw new Error("numOfChoices must be between 1 and 10");
    }

    this.logContractFunctionCall("GenesisProtocol.propose", options);

    const txResult = await this.wrapTransactionInvocation("GenesisProtocol.propose",
      options,
      () => {
        return this.contract.propose(
          options.numOfChoices,
          Utils.NULL_HASH,
          options.avatar,
          options.executable,
          options.proposer
        );
      });

    return new ArcTransactionProposalResult(txResult.tx);
  }

  /**
   * Stake some tokens on the final outcome matching this vote.
   *
   * A transfer of tokens from the staker to this GenesisProtocol scheme
   * is automatically approved and executed on the token with which
   * this GenesisProtocol scheme was deployed.
   *
   * @param {StakeConfig} options
   * @returns Promise<ArcTransactionResult>
   */
  public async stake(options: StakeConfig = {} as StakeConfig): Promise<ArcTransactionResult> {

    const defaults = {
      onBehalfOf: null,
    };

    options = Object.assign({}, defaults, options) as StakeConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const web3 = Utils.getWeb3();
    const amount = web3.toBigNumber(options.amount);

    if (amount <= 0) {
      throw new Error("amount must be > 0");
    }

    const autoApproveTransfer = ConfigService.get("autoApproveTokenTransfers");

    const eventTopic = "txReceipts.GenesisProtocol.stake";

    const txReceiptEventPayload = TransactionService.publishKickoffEvent(
      eventTopic,
      options,
      1 + (autoApproveTransfer ? 1 : 0));

    let tx;
    /**
     * approve immediate transfer of staked tokens from onBehalfOf to this scheme
     */
    if (autoApproveTransfer) {

      const token = await
        (await Utils.requireContract("StandardToken")).at(await this.contract.stakingToken()) as any;

      tx = await token.approve(this.address,
        amount,
        { from: options.onBehalfOf ? options.onBehalfOf : await Utils.getDefaultAccount() });

      TransactionService.publishTxEvent(eventTopic, txReceiptEventPayload, tx);
    }

    this.logContractFunctionCall("GenesisProtocol.stake", options);

    tx = await this.contract.stake(
      options.proposalId,
      options.vote,
      amount,
      options.onBehalfOf ? {
        from: options.onBehalfOf ? options.onBehalfOf :
          await Utils.getDefaultAccount(),
      } : undefined
    );

    TransactionService.publishTxEvent(eventTopic, txReceiptEventPayload, tx);

    return new ArcTransactionResult(tx);
  }

  /**
   * Vote on a proposal
   * @param {VoteConfig} options
   * @returns Promise<ArcTransactionResult>
   */
  public async vote(options: VoteConfig = {} as VoteConfig): Promise<ArcTransactionResult> {

    const defaults = {
      onBehalfOf: null,
    };

    options = Object.assign({}, defaults, options);

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    this.logContractFunctionCall("GenesisProtocol.vote", options);

    return this.wrapTransactionInvocation("GenesisProtocol.vote",
      options,
      () => {
        return this.contract.vote(
          options.proposalId,
          options.vote,
          options.onBehalfOf ? { from: options.onBehalfOf } : undefined
        );
      });
  }

  /**
   * Vote on a proposal, staking some reputation that the final outcome will match this vote.
   * Reputation of 0 will stake all the voter's reputation.
   * @param {VoteWithSpecifiedAmountsConfig} options
   * @returns Promise<ArcTransactionResult>
   */
  public async voteWithSpecifiedAmounts(
    options: VoteWithSpecifiedAmountsConfig = {} as VoteWithSpecifiedAmountsConfig)
    : Promise<ArcTransactionResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    if (!options.reputation) {
      throw new Error("reputation is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.voteWithSpecifiedAmounts", options);

    return this.wrapTransactionInvocation("GenesisProtocol.voteWithSpecifiedAmounts",
      options,
      () => {
        return this.contract.voteWithSpecifiedAmounts(
          options.proposalId,
          options.vote,
          options.reputation,
          0
        );
      });
  }

  /**
   * Redeem any tokens and reputation that are due the beneficiary from the outcome of the proposal.
   * @param {RedeemConfig} options
   * @returns Promise<ArcTransactionResult>
   */
  public async redeem(options: RedeemConfig = {} as RedeemConfig): Promise<ArcTransactionResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.redeem", options);

    return this.wrapTransactionInvocation("GenesisProtocol.redeem",
      options,
      () => {
        return this.contract.redeem(
          options.proposalId,
          options.beneficiaryAddress
        );
      });
  }

  /**
   * Return whether a proposal should be shifted to the boosted phase.
   * @param {ShouldBoostConfig} options
   * @returns Promise<boolean>
   */
  public async shouldBoost(options: ShouldBoostConfig = {} as ShouldBoostConfig): Promise<boolean> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.shouldBoost", options);

    return this.contract.shouldBoost(options.proposalId);
  }

  /**
   * Return the current proposal score.
   * @param {GetScoreConfig} options
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getScore(options: GetScoreConfig = {} as GetScoreConfig): Promise<BigNumber.BigNumber> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.score", options);

    // TODO:  convert to a number?
    return this.contract.score(options.proposalId);
  }

  /**
   * Return the threshold that is required by a proposal to it shift it into boosted state.
   * The computation depends on the current number of boosted proposals in the DAO
   * as well as the GenesisProtocol parameters thresholdConstA and thresholdConstB.
   * @param {GetThresholdConfig} options
   * @returns Promise<number>
   */
  public async getThreshold(options: GetThresholdConfig = {} as GetThresholdConfig): Promise<number> {

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.threshold", options);

    const threshold = await this.contract.threshold(
      options.proposalId,
      options.avatar
    );

    return threshold.toNumber();
  }

  /**
   * Return the token amount to which the given staker is entitled in the event that the proposal is approved.
   * @param {GetRedeemableTokensStakerConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableTokensStaker(
    options: GetRedeemableTokensStakerConfig = {} as GetRedeemableTokensStakerConfig)
    : Promise<BigNumber.BigNumber> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.getRedeemableTokensStaker", options);

    return this.contract.getRedeemableTokensStaker(
      options.proposalId,
      options.beneficiaryAddress
    );
  }

  /**
   * Return the reputation amount to which the proposal proposer is entitled in the event that the proposal is approved.
   * @param {GetRedeemableReputationProposerConfig} options
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableReputationProposer(
    options: GetRedeemableReputationProposerConfig = {} as GetRedeemableReputationProposerConfig)
    : Promise<BigNumber.BigNumber> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.getRedeemableReputationProposer", options);

    return this.contract.getRedeemableReputationProposer(options.proposalId);
  }

  /**
   * Return the token amount to which the voter is entitled in the event that the proposal is approved.
   * @param {GetRedeemableTokensVoterConfig} options
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableTokensVoter(
    options: GetRedeemableTokensVoterConfig = {} as GetRedeemableTokensVoterConfig)
    : Promise<BigNumber.BigNumber> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.getRedeemableTokensVoter", options);

    return this.contract.getRedeemableTokensVoter(
      options.proposalId,
      options.beneficiaryAddress
    );
  }

  /**
   * Return the reputation amount to which the voter is entitled in the event that the proposal is approved.
   * @param {GetRedeemableReputationVoterConfig} options
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableReputationVoter(
    options: GetRedeemableReputationVoterConfig = {} as GetRedeemableReputationVoterConfig)
    : Promise<BigNumber.BigNumber> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.getRedeemableReputationVoter", options);

    return this.contract.getRedeemableReputationVoter(
      options.proposalId,
      options.beneficiaryAddress);
  }

  /**
   * Return the reputation amount to which the staker is entitled in the event that the proposal is approved.
   * @param {GetRedeemableReputationStakerConfig} options
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableReputationStaker(
    options: GetRedeemableReputationStakerConfig = {} as GetRedeemableReputationStakerConfig)
    : Promise<BigNumber.BigNumber> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.getRedeemableReputationStaker", options);

    return this.contract.getRedeemableReputationStaker(
      options.proposalId,
      options.beneficiaryAddress
    );
  }

  /**
   * Return the number of possible choices when voting for the proposal.
   * @param {GetNumberOfChoicesConfig} options
   * @returns Promise<number>
   */
  public async getNumberOfChoices(
    options: GetNumberOfChoicesConfig = {} as GetNumberOfChoicesConfig)
    : Promise<number> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.getNumberOfChoices", options);

    const numOfChoices = await this.contract.getNumberOfChoices(
      options.proposalId
    );

    return numOfChoices.toNumber();
  }

  /**
   * Return the vote and the amount of reputation of the voter committed to this proposal
   * @param {GetVoterInfoResult} options
   * @returns Promise<GetVoterInfoResult>
   */
  public async getVoterInfo(
    options: GetVoterInfoConfig = {} as GetVoterInfoConfig)
    : Promise<GetVoterInfoResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.voter) {
      throw new Error("voter is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.voteInfo", options);

    const result = await this.contract.voteInfo(
      options.proposalId,
      options.voter
    );

    return {
      reputation: result[1],
      vote: result[0].toNumber(),
    };
  }

  /**
   * Returns the reputation currently voted on the given choice.
   * @param {GetVoteStatusConfig} options
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getVoteStatus(
    options: GetVoteStatusConfig = {} as GetVoteStatusConfig)
    : Promise<BigNumber.BigNumber> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    this.logContractFunctionCall("GenesisProtocol.voteStatus", options);
    /**
     * an array of number counts for each vote choice
     */
    return this.contract.voteStatus(
      options.proposalId,
      options.vote
    );
  }

  /**
   * Return whether the proposal is in a votable state.
   * @param {IsVotableConfig} options
   * @returns Promise<boolean>
   */
  public async isVotable(
    options: IsVotableConfig = {} as IsVotableConfig)
    : Promise<boolean> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.isVotable", options);

    return this.contract.isVotable(options.proposalId);
  }

  /**
   * Return the total votes, total staked, voter stakes and staker stakes for a given proposal
   * @param {GetProposalStatusConfig} options
   * @returns Promise<GetProposalStatusResult>
   */
  public async getProposalStatus(
    options: GetProposalStatusConfig = {} as GetProposalStatusConfig)
    : Promise<GetProposalStatusResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.proposalStatus", options);

    const result = await this.contract.proposalStatus(
      options.proposalId
    );

    return {
      totalStaked: result[2],
      totalStakerStakes: result[1],
      totalVoterStakes: result[3],
      totalVotes: result[0],
    };
  }

  /**
   * Return the DAO avatar address under which the proposal was made
   * @param {GetProposalAvatarConfig} options
   * @returns Promise<string>
   */
  public async getProposalAvatar(
    options: GetProposalAvatarConfig = {} as GetProposalAvatarConfig
  ): Promise<string> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.proposalAvatar", options);

    return this.contract.proposalAvatar(options.proposalId);
  }

  /**
   * Return the score threshold params for the given DAO.
   * @param {GetScoreThresholdParamsConfig} options
   * @returns Promise<GetScoreThresholdParamsResult>
   */
  public async getScoreThresholdParams(
    options: GetScoreThresholdParamsConfig = {} as GetScoreThresholdParamsConfig)
    : Promise<GetScoreThresholdParamsResult> {

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.scoreThresholdParams", options);

    const result = await this.contract.scoreThresholdParams(options.avatar);

    return {
      thresholdConstA: result[0],
      thresholdConstB: result[1].toNumber(),
    };
  }

  /**
   * Return the vote and stake amount for a given proposal and staker.
   * @param {GetStakerInfoConfig} options
   * @returns Promise<GetStakerInfoResult>
   */
  public async getStakerInfo(
    options: GetStakerInfoConfig = {} as GetStakerInfoConfig)
    : Promise<GetStakerInfoResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.staker) {
      throw new Error("staker is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.staker", options);

    const result = await this.contract.staker(
      options.proposalId,
      options.staker
    );

    return {
      stake: result[1],
      vote: result[0].toNumber(),
    };
  }

  /**
   * Return the amount stakes behind a given proposal and vote.
   * @param {GetVoteStakeConfig} options
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getVoteStake(
    options: GetVoteStakeConfig = {} as GetVoteStakeConfig)
    : Promise<BigNumber.BigNumber> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    this.logContractFunctionCall("GenesisProtocol.voteStake", options);

    return this.contract.voteStake(
      options.proposalId,
      options.vote
    );
  }

  /**
   * Return the winningVote for a given proposal.
   * @param {GetWinningVoteConfig} options
   * @returns Promise<number>
   */
  public async getWinningVote(
    options: GetWinningVoteConfig = {} as GetWinningVoteConfig)
    : Promise<number> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.winningVote", options);

    const winningVote = await this.contract.winningVote(options.proposalId);

    return winningVote.toNumber();
  }

  /**
   * Return the current state of a given proposal.
   * @param {GetStateConfig} options
   * @returns Promise<number>
   */
  public async getState(options: GetStateConfig = {} as GetStateConfig): Promise<ProposalState> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.state", options);

    const state = await this.contract.state(options.proposalId);

    return state.toNumber();
  }

  /**
   * Return all executed GenesisProtocol proposals created under the given avatar.
   * Filter by the optional proposalId.
   */
  public async getExecutedDaoProposals(
    options: GetDaoProposalsConfig = {} as GetDaoProposalsConfig)
    : Promise<Array<ExecutedGenesisProposal>> {

    const defaults = {
      proposalId: null,
    };

    options = Object.assign({}, defaults, options);

    if (!options.avatar) {
      throw new Error("avatar address is not defined");
    }

    const proposals = new Array<ExecutedGenesisProposal>();

    const eventFetcher = this.ExecuteProposal(
      { _avatar: options.avatar, _proposalId: options.proposalId },
      { fromBlock: 0 });
    await new Promise((resolve: fnVoid): void => {
      eventFetcher.get(
        async (err: any, log: Array<DecodedLogEntryEvent<GenesisProtocolExecuteProposalEventResult>>) => {
          for (const event of log) {
            proposals.push({
              decision: event.args._decision.toNumber(),
              executionState: event.args._executionState.toNumber(),
              proposalId: event.args._proposalId,
              totalReputation: event.args._totalReputation,
            });
          }
          resolve();
        });
    });

    return proposals;
  }

  /**
   * Set the contract parameters.
   * @param {GenesisProtocolParams} params
   * @returns parameters hash
   */
  public async setParameters(params: GenesisProtocolParams): Promise<ArcTransactionDataResult<Hash>> {

    params = Object.assign({},
      GetDefaultGenesisProtocolParameters(),
      params);

    // in Wei
    const web3 = Utils.getWeb3();
    const maxEthValue = web3.toBigNumber(10).pow(26);

    const proposingRepRewardConstA = web3.toBigNumber(params.proposingRepRewardConstA);

    if (proposingRepRewardConstA.lt(0)) {
      throw new Error("proposingRepRewardConstA must be greater than or equal to 0");
    }

    if (proposingRepRewardConstA.gt(maxEthValue)) {
      throw new Error(`proposingRepRewardConstA must be less than ${maxEthValue}`);
    }

    const proposingRepRewardConstB = params.proposingRepRewardConstB || 0;

    if ((proposingRepRewardConstB < 0) || (proposingRepRewardConstB > 100)) {
      throw new Error("proposingRepRewardConstB must be greater than or equal to 0 and less than or equal to 100");
    }

    const thresholdConstA = web3.toBigNumber(params.thresholdConstA);

    if (thresholdConstA.lt(0)) {
      throw new Error("thresholdConstA must be greater than or equal to 0");
    }

    if (thresholdConstA.gt(maxEthValue)) {
      throw new Error(`thresholdConstA must be less than ${maxEthValue}`);
    }

    const thresholdConstB = web3.toBigNumber(params.thresholdConstB);

    if (thresholdConstB.lte(0)) {
      throw new Error("thresholdConstB must be greater than 0");
    }

    /**
     * thresholdConstB is a number, and is not supposed to be in Wei (unlike the other
     * params checked above), but we check this condition anyways as not everyone
     * may be using the type checking of TypeScript, and it is a condition in the Solidity code.
     */
    if (thresholdConstB.gt(maxEthValue)) {
      throw new Error(`thresholdConstB must be less than ${maxEthValue}`);
    }

    const preBoostedVoteRequiredPercentage = params.preBoostedVoteRequiredPercentage || 0;

    if ((preBoostedVoteRequiredPercentage <= 0) || (preBoostedVoteRequiredPercentage > 100)) {
      throw new Error("preBoostedVoteRequiredPercentage must be greater than 0 and less than or equal to 100");
    }

    const stakerFeeRatioForVoters = params.stakerFeeRatioForVoters || 0;

    if ((stakerFeeRatioForVoters < 0) || (stakerFeeRatioForVoters > 100)) {
      throw new Error("stakerFeeRatioForVoters must be greater than or equal to 0 and less than or equal to 100");
    }

    const votersGainRepRatioFromLostRep = params.votersGainRepRatioFromLostRep || 0;

    if ((votersGainRepRatioFromLostRep < 0) || (votersGainRepRatioFromLostRep > 100)) {
      throw new Error("votersGainRepRatioFromLostRep must be greater than or equal to 0 and less than or equal to 100");
    }

    const votersReputationLossRatio = params.votersReputationLossRatio || 0;

    if ((votersReputationLossRatio < 0) || (votersReputationLossRatio > 100)) {
      throw new Error("votersReputationLossRatio must be greater than or equal to  0 and less than or equal to 100");
    }

    return super._setParameters(
      "GenesisProtocol.setParameters",
      [
        preBoostedVoteRequiredPercentage,
        params.preBoostedVotePeriodLimit,
        params.boostedVotePeriodLimit,
        thresholdConstA,
        thresholdConstB,
        params.minimumStakingFee,
        params.quietEndingPeriod,
        proposingRepRewardConstA,
        proposingRepRewardConstB,
        stakerFeeRatioForVoters,
        votersReputationLossRatio,
        votersGainRepRatioFromLostRep,
      ]
    );
  }

  public getDefaultPermissions(overrideValue?: SchemePermissions | DefaultSchemePermissions): SchemePermissions {
    // return overrideValue || Utils.numberToPermissionsString(DefaultSchemePermissions.GenesisProtocol);
    return (overrideValue || DefaultSchemePermissions.GenesisProtocol) as SchemePermissions;
  }

  public async getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions> {
    return this._getSchemePermissions(avatarAddress);
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<GenesisProtocolParams> {
    return this._getSchemeParameters(avatarAddress);
  }

  public async getParameters(paramsHash: Hash): Promise<GenesisProtocolParams> {
    const params = await this.getParametersArray(paramsHash);
    return {
      boostedVotePeriodLimit: params[2].toNumber(),
      minimumStakingFee: params[5].toNumber(),
      preBoostedVotePeriodLimit: params[1].toNumber(),
      preBoostedVoteRequiredPercentage: params[0].toNumber(),
      proposingRepRewardConstA: params[7],
      proposingRepRewardConstB: params[8],
      quietEndingPeriod: params[6].toNumber(),
      stakerFeeRatioForVoters: params[9].toNumber(),
      thresholdConstA: params[3],
      thresholdConstB: params[4].toNumber(),
      votersGainRepRatioFromLostRep: params[11].toNumber(),
      votersReputationLossRatio: params[10].toNumber(),
    };
  }

  private async _validateVote(vote: number, proposalId: Hash): Promise<void> {
    const numChoices = await this.getNumberOfChoices({ proposalId });
    if (!Number.isInteger(vote) || (vote < 0) || (vote > numChoices)) {
      throw new Error("vote is not valid");
    }
  }
}

/**
 * defined just to add good type checking
 */
export class GenesisProtocolFactoryType extends ContractWrapperFactory<GenesisProtocolWrapper> {
  /**
   * Migrate a new instance of GenesisProtocol.
   * @param stakingTokenAddress The token that will be used when staking.  Typically
   * is the token of the DAO that is going to use this GenesisProtocol.
   */
  public async new(stakingTokenAddress: Address): Promise<GenesisProtocolWrapper> {
    return super.new(stakingTokenAddress);
  }
}

export const GenesisProtocolFactory =
  new GenesisProtocolFactoryType("GenesisProtocol", GenesisProtocolWrapper) as GenesisProtocolFactoryType;

export interface StakeEventResult {
  _amount: BigNumber.BigNumber;
  /**
   * indexed
   */
  _proposalId: Hash;
  _vote: number;
  /**
   * indexed
   */
  _voter: Address;
}

export interface RedeemEventResult {
  _amount: BigNumber.BigNumber;
  /**
   * indexed
   */
  _beneficiary: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
}

export interface GenesisProtocolParams {
  /**
   * The percentage of the absolute vote that must be exceeded to result in a win.
   * Must be between 0 and 100.
   * Default is 50.
   */
  preBoostedVoteRequiredPercentage: number;
  /**
   * The time limit in seconds for a proposal to be in an absolute voting mode.
   * Default is 5184000 (two months).
   */
  preBoostedVotePeriodLimit: number;
  /**
   * The time limit in seconds for a proposal to be in an relative voting mode.
   * Default is 604800 (one week).
   */
  boostedVotePeriodLimit: number;
  /**
   * Constant A in the threshold calculation,in Wei. See [[GenesisProtocolWrapper.getThreshold]].
   * Default is 2, converted to Wei
   */
  thresholdConstA: BigNumber.BigNumber | string;
  /**
   * Constant B in the threshold calculation. See [[GenesisProtocolWrapper.getThreshold]].
   * Default is 10
   */
  thresholdConstB: number;
  /**
   * A floor on the staking fee which is normally computed using [[GenesisProtocolParams.stakerFeeRatioForVoters]].
   * Default is 0
   */
  minimumStakingFee: number;
  /**
   * The duration of the quietEndingPeriod, in seconds.
   * Default is 7200 (two hours)
   */
  quietEndingPeriod: number;
  /**
   * Constant A in the calculation of the proposer's reward, in Wei
   * See [[GenesisProtocolWrapper.getRedeemableReputationProposer]].
   * Default is 5, converted to Wei.
   */
  proposingRepRewardConstA: BigNumber.BigNumber | string;
  /**
   * Constant B in the calculation of the proposer's reward.
   * See [[GenesisProtocolWrapper.getRedeemableReputationProposer]].
   * Must be between 0 and 100.
   * Default is 1.
   */
  proposingRepRewardConstB: number;
  /**
   * The percentage of a stake that is given to all voters.
   * Voters (pre and during boosting period) share this amount in proportion to their reputation.
   * Must be between 0 and 100.
   * Default is 1.
   */
  stakerFeeRatioForVoters: number;
  /**
   * The percentage of lost reputation, in proportion to voters' reputation.
   * Must be between 0 and 100.
   * Default is 80
   */
  votersGainRepRatioFromLostRep: number;
  /**
   * The percentage of reputation that is lost by pre-booster voters.
   * Must be between 0 and 100.
   * Default is 1
   */
  votersReputationLossRatio: number;
}

/**
 * Javascript version of the Arc ExecutableInterface,
 * for information purposes.
 */
export interface ExecutableInterface {
  execute(proposalId: number, avatar: Address, vote: number): Promise<boolean>;
}

export interface ProposeVoteConfig {
  /**
   * The DAO's avatar under which the proposal is being made.
   */
  avatar: Address;
  /**
   * address of the agent making the proposal.
   * Default is the current default account.
   */
  proposer: string;
  /**
   * number of choices when voting.  Must be between 1 and 10.
   */
  numOfChoices: number;
  /**
   * contract that implements ExecutableInterface to invoke if/when the vote passes
   */
  executable: string;
}

export interface GetVoterInfoResult {
  vote: number;
  reputation: BigNumber.BigNumber;
}

export interface GetProposalStatusResult {
  /**
   * Amount of reputation voted
   */
  totalVotes: BigNumber.BigNumber;
  /**
   * Number of staked tokens currently redeemable by stakers
   */
  totalStakerStakes: BigNumber.BigNumber;
  /**
   * Total number of staked tokens currently redeemable by everyone
   */
  totalStaked: BigNumber.BigNumber;
  /**
   * Number of staked tokens set aside and redeemable for all voters (via the staking fee)
   */
  totalVoterStakes: BigNumber.BigNumber;
}

export interface GetScoreThresholdParamsResult {
  thresholdConstA: BigNumber.BigNumber;
  thresholdConstB: number;
}

export interface GetStakerInfoResult {
  vote: number;
  stake: BigNumber.BigNumber;
}

export interface StakeConfig {
  /**
   * token amount to stake on the outcome resulting in this vote, in Wei
   */
  amount: BigNumber.BigNumber | string;
  /**
   * stake on behalf of this agent
   */
  onBehalfOf?: Address;
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * the choice of vote. Can be 1 (YES) or 2 (NO).
   */
  vote: number;
}

export interface VoteWithSpecifiedAmountsConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * the choice of vote. Can be 1 (YES) or 2 (NO).
   */
  vote: number;
  /**
   * reputation to put behind this vote, in Wei
   */
  reputation: BigNumber.BigNumber | string;
}

export interface RedeemConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * agent to whom to award the proposal payoffs
   */
  beneficiaryAddress: Address;
}

export interface ShouldBoostConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}

export interface GetScoreConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}

export interface GetThresholdConfig {
  /**
   * the DAO's avatar address
   */
  avatar: Address;
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}

/**
 * return the amount of tokens to which the staker will be entitled as an outcome of the proposal
 */
export interface GetRedeemableTokensStakerConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * the staker
   */
  beneficiaryAddress: Address;
}

/**
 * return the amount of reputation to which the proposer will be entitled as an outcome of the proposal
 */
export interface GetRedeemableReputationProposerConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}

/**
 * return the amount of tokens to which the voter will be entitled as an outcome of the proposal
 */
export interface GetRedeemableTokensVoterConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * the voter
   */
  beneficiaryAddress: Address;
}

/**
 * return the amount of reputation to which the voter will be entitled as an outcome of the proposal
 */
export interface GetRedeemableReputationVoterConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * the voter
   */
  beneficiaryAddress: Address;
}

/**
 * return the amount of reputation to which the staker will be entitled as an outcome of the proposal
 */
export interface GetRedeemableReputationStakerConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * the staker
   */
  beneficiaryAddress: Address;
}

export interface GetNumberOfChoicesConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}

export interface GetVoterInfoConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  voter: string;
}

export interface GetVoteStatusConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * the choice of vote. Can be 1 (YES) or 2 (NO).
   */
  vote: number;
}

export interface IsVotableConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}

export interface GetProposalStatusConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}

export interface GetTotalReputationSupplyConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}

export interface GetProposalAvatarConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}

export interface GetScoreThresholdParamsConfig {
  /**
   * the DAO's avatar address
   */
  avatar: Address;
}

export interface GetStakerInfoConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * address of the staking agent
   */
  staker: string;
}

export interface GetVoteStakeConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * the choice of vote. Can be 1 (YES) or 2 (NO).
   */
  vote: number;
}

export interface GetWinningVoteConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}

export interface GetStateConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}

export enum ExecutionState {
  None = 0,
  PreBoostedTimeOut = 1,
  PreBoostedBarCrossed = 2,
  BoostedTimeOut = 3,
  BoostedBarCrossed = 4,
}

export interface GenesisProtocolExecuteProposalEventResult extends ExecuteProposalEventResult {
  /**
   * _executionState.toNumber() will give you a value from the enum `ExecutionState`
   */
  _executionState: BigNumber.BigNumber;
}

export interface ExecutedGenesisProposal {
  decision: BinaryVoteResult;
  proposalId: Hash;
  /**
   * total reputation in the DAO at the time the proposal is created in the voting machine
   */
  totalReputation: BigNumber.BigNumber;
  executionState: ExecutionState;
}

export enum ProposalState {
  None,
  Closed,
  Executed,
  PreBoosted,
  Boosted,
  QuietEndingPeriod,
}

export const GetDefaultGenesisProtocolParameters = (): GenesisProtocolParams => {
  const web3 = Utils.getWeb3();
  return {
    boostedVotePeriodLimit: 604800, // 1 week
    minimumStakingFee: 0,
    preBoostedVotePeriodLimit: 5184000, // 2 months
    preBoostedVoteRequiredPercentage: 50,
    proposingRepRewardConstA: web3.toWei(5),
    proposingRepRewardConstB: 1,
    quietEndingPeriod: 7200, // Two hours
    stakerFeeRatioForVoters: 1,
    thresholdConstA: web3.toWei(2),
    thresholdConstB: 10,
    votersGainRepRatioFromLostRep: 80,
    votersReputationLossRatio: 1,
  };
};
