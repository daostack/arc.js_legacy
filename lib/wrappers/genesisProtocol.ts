"use strict";
import { BigNumber } from "bignumber.js";
import ethereumjs = require("ethereumjs-abi");
import { gasLimitsConfig } from "../../gasLimits.js";
import { AvatarService } from "../avatarService";
import {
  Address,
  BinaryVoteResult,
  DefaultSchemePermissions,
  Hash,
  SchemePermissions
} from "../commonTypes";
import { ConfigService } from "../configService";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  IContractWrapperFactory,
  SchemeWrapper
} from "../iContractWrapperBase";
import { ProposalService } from "../proposalService";
import { TransactionService, TxGeneratingFunctionOptions } from "../transactionService";
import { Utils } from "../utils";
import { EntityFetcherFactory, EventFetcherFactory, Web3EventService } from "../web3EventService";
import { RedeemEventResult } from "./commonEventInterfaces";
import {
  ExecuteProposalEventResult,
  NewProposalEventResult,
  OwnerVoteOptions,
  ProposalIdOption,
  ProposeOptions,
  VoteOptions,
  VoteWithSpecifiedAmountsOptions,
} from "./iIntVoteInterface";

import { promisify } from "es6-promisify";
import { IntVoteInterfaceWrapper } from "./intVoteInterface";

export class GenesisProtocolWrapper extends IntVoteInterfaceWrapper implements SchemeWrapper {

  public name: string = "GenesisProtocol";
  public friendlyName: string = "Genesis Protocol";
  public factory: IContractWrapperFactory<GenesisProtocolWrapper> = GenesisProtocolFactory;
  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public GPExecuteProposal: EventFetcherFactory<GPExecuteProposalEventResult>;
  public Stake: EventFetcherFactory<StakeEventResult>;
  public Redeem: EventFetcherFactory<RedeemEventResult>;
  public RedeemReputation: EventFetcherFactory<RedeemEventResult>;
  public RedeemDaoBounty: EventFetcherFactory<RedeemEventResult>;
  /* tslint:enable:max-line-length */

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
  public async stake(options: StakeConfig =
    {} as StakeConfig & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const amount = new BigNumber(options.amount);

    if (amount.lte(0)) {
      throw new Error("amount must be > 0");
    }

    const autoApproveTransfer = ConfigService.get("autoApproveTokenTransfers");

    const functionName = "GenesisProtocol.stake";

    const payload = TransactionService.publishKickoffEvent(
      functionName,
      options,
      1 + (autoApproveTransfer ? 1 : 0));

    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);

    let tx;
    /**
     * approve immediate transfer of staked tokens to this scheme
     */
    if (autoApproveTransfer) {

      const stakingToken = await this.getStakingToken();

      tx = await this.sendTransaction(
        eventContext,
        stakingToken.approve,
        [this.address, amount]);

      TransactionService.publishTxLifecycleEvents(eventContext, tx, this.contract);
      await TransactionService.watchForMinedTransaction(tx);
    }

    this.logContractFunctionCall("GenesisProtocol.stake", options);

    tx = await this.sendTransaction(
      eventContext,
      this.contract.stake,
      [options.proposalId, options.vote, amount]);

    TransactionService.publishTxLifecycleEvents(eventContext, tx, this.contract);

    return new ArcTransactionResult(tx, this.contract);
  }

  /**
   * Preapprove the transfer of stakingTokens from the default account to this GenesisProtocol contract,
   * and then stake, all in a single transaction.
   * @param options
   */
  public async stakeWithApproval(options: StakeConfig =
    {} as StakeConfig & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const amount = new BigNumber(options.amount);

    if (amount.lte(0)) {
      throw new Error("amount must be > 0");
    }
    const stakingToken = await this.getStakingToken();
    const staker = await Utils.getDefaultAccount();
    const nonce = 0;

    const textMsg = "0x" + ethereumjs.soliditySHA3(
      ["address", "bytes32", "uint", "uint", "uint"],
      [this.address, options.proposalId, options.vote, amount.toString(10), nonce]
    ).toString("hex");

    const web3 = await Utils.getWeb3();
    const signature = web3.eth.sign(staker, textMsg);

    const extraData = await this.contract.stakeWithSignature.request(
      options.proposalId,
      options.vote,
      amount.toString(10),
      nonce,
      signature);

    this.logContractFunctionCall("GenesisProtocol.stakeWithApproval", options);

    return this.wrapTransactionInvocation(
      "GenesisProtocol.stakeWithApproval",
      options,
      stakingToken.approveAndCall,
      [this.address, amount.toString(10), extraData.params[0].data],
      { from: staker });
  }

  /**
   * Redeem any tokens and reputation, excluding bounty, that are due the beneficiary from the outcome of the proposal.
   * @param {RedeemConfig} options
   * @returns Promise<ArcTransactionResult>
   */
  public async redeem(options: RedeemConfig =
    {} as RedeemConfig & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    const proposalState = await this.getState({ proposalId: options.proposalId });

    if ((proposalState !== ProposalState.Executed) &&
      (proposalState !== ProposalState.Closed)) {
      /* tslint:disable-next-line:max-line-length */
      throw new Error(`cannot redeem unless proposal state is either executed or closed. Current state: ${ProposalState[proposalState]}`);
    }

    this.logContractFunctionCall("GenesisProtocol.redeem", options);

    return this.wrapTransactionInvocation("GenesisProtocol.redeem",
      options,
      this.contract.redeem,
      [options.proposalId, options.beneficiaryAddress]
    );
  }

  /**
   * Redeem any token bounty that are due the beneficiary from the outcome of the proposal.
   * @param {RedeemConfig} options
   * @returns Promise<ArcTransactionResult>
   */
  public async redeemDaoBounty(options: RedeemConfig =
    {} as RedeemConfig & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.redeemDaoBounty", options);

    const proposalState = await this.getState({ proposalId: options.proposalId });

    if ((proposalState !== ProposalState.Executed) &&
      (proposalState !== ProposalState.Closed)) {
      throw new Error("cannot redeem bounty unless proposal state is either executed or closed");
    }

    return this.wrapTransactionInvocation("GenesisProtocol.redeemDaoBounty",
      options,
      this.contract.redeemDaoBounty,
      [options.proposalId, options.beneficiaryAddress]
    );
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
   * @returns Promise<BigNumber>
   */
  public async getScore(options: GetScoreConfig = {} as GetScoreConfig): Promise<BigNumber> {

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
   */
  public getThreshold(options: GetThresholdConfig = {} as GetThresholdConfig): Promise<BigNumber> {

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.threshold", options);

    return this.contract.threshold(options.proposalId, options.avatar);
  }

  /**
   * Return the reputation amount to which the proposal proposer is entitled in the event that the proposal is approved.
   * @param {GetRedeemableReputationProposerConfig} options
   * @returns Promise<BigNumber>
   */
  public async getRedeemableReputationProposer(
    options: GetRedeemableReputationProposerConfig = {} as GetRedeemableReputationProposerConfig)
    : Promise<BigNumber> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.getRedeemableReputationProposer", options);

    return this.contract.getRedeemableReputationProposer(options.proposalId);
  }

  /**
   * Return the token amount to which the voter is entitled in the event that the proposal is approved.
   * @param {GetRedeemableTokensVoterConfig} options
   * @returns Promise<BigNumber>
   */
  public async getRedeemableTokensVoter(
    options: GetRedeemableTokensVoterConfig = {} as GetRedeemableTokensVoterConfig)
    : Promise<BigNumber> {

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
   * @returns Promise<BigNumber>
   */
  public async getRedeemableReputationVoter(
    options: GetRedeemableReputationVoterConfig = {} as GetRedeemableReputationVoterConfig)
    : Promise<BigNumber> {

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
   * Return the token amount to which the given staker is entitled in the event that the proposal is approved.
   * @param {GetRedeemableRewardsStakerConfig} opts
   * @returns Promise<BigNumber>
   */
  public async getRedeemableTokensStaker(
    options: GetRedeemableRewardsStakerConfig = {} as GetRedeemableRewardsStakerConfig)
    : Promise<BigNumber> {

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
   * Return the token amount of bounty to which the given staker is entitled in the event that the proposal is approved.
   * @param {GetRedeemableRewardsStakerConfig} opts
   * @returns Promise<BigNumber>
   */
  public async getRedeemableTokensStakerBounty(
    options: GetRedeemableRewardsStakerConfig = {} as GetRedeemableRewardsStakerConfig)
    : Promise<BigNumber> {

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.getRedeemableTokensStakerBounty", options);

    return this.contract.getRedeemableTokensStakerBounty(
      options.proposalId,
      options.beneficiaryAddress
    );
  }

  /**
   * Return the reputation amount to which the staker is entitled in the event that the proposal is approved.
   * @param {GetRedeemableReputationStakerConfig} options
   * @returns Promise<BigNumber>
   */
  public async getRedeemableReputationStaker(
    options: GetRedeemableReputationStakerConfig = {} as GetRedeemableReputationStakerConfig)
    : Promise<BigNumber> {

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
   * Return the current balances on this GenesisProtocol's staking and the given avatar's native tokens.
   * This can be useful, for example, if you want to know in advance whether the avatar has enough funds
   * at the moment to payout rewards to stakers and voters.
   * It also returns the respective tokens' truffle contracts.
   * @param options
   */
  public async getTokenBalances(
    options: GetTokenBalancesOptions = {} as GetTokenBalancesOptions)
    : Promise<GenesisProtocolDaoTokenBalances> {

    if (!options.avatarAddress) {
      throw new Error("avatarAddress is not defined");
    }

    const stakingToken = await this.getStakingToken();

    const stakingTokenBalance = await stakingToken.balanceOf(options.avatarAddress);

    const avatarService = new AvatarService(options.avatarAddress);

    const nativeToken = await avatarService.getNativeToken();

    const nativeTokenBalance = await nativeToken.balanceOf(options.avatarAddress);

    return {
      nativeToken,
      nativeTokenBalance,
      stakingToken,
      stakingTokenBalance,
    };
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
   * @returns Promise<BigNumber>
   */
  public async getVoteStatus(
    options: GetVoteStatusConfig = {} as GetVoteStatusConfig)
    : Promise<BigNumber> {

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
   * @returns Promise<BigNumber>
   */
  public async getVoteStake(
    options: GetVoteStakeConfig = {} as GetVoteStakeConfig)
    : Promise<BigNumber> {

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
   * EntityFetcherFactory for votable GenesisProtocolProposal.
   * @param avatarAddress
   */
  public get VotableGenesisProtocolProposals():
    EntityFetcherFactory<GenesisProtocolProposal, NewProposalEventResult> {

    const proposalService = new ProposalService(this.web3EventService);

    return proposalService.getProposalEvents({
      proposalsEventFetcher: this.NewProposal,
      transformEventCallback: async (args: NewProposalEventResult): Promise<GenesisProtocolProposal> => {
        return this.getProposal(args._proposalId);
      },
      votableOnly: true,
      votingMachine: this,
    });
  }

  /**
   * Cancel the given proposal
   * @param options
   */
  public async cancelProposal(options: ProposalIdOption): Promise<ArcTransactionResult> {
    throw new Error("GenesisProtocol does not support cancelProposal");
  }

  public async ownerVote(options: OwnerVoteOptions): Promise<ArcTransactionResult> {
    throw new Error("GenesisProtocol does not support ownerVote");
  }

  public async cancelVote(options: ProposalIdOption): Promise<ArcTransactionResult> {
    throw new Error("GenesisProtocol does not support cancelVote");
  }

  /**
   * EntityFetcherFactory for executed ExecutedGenesisProposal.
   * The Arc GenesisProtocol contract retains the original proposal struct after execution.
   * @param avatarAddress
   */
  public get ExecutedProposals():
    EntityFetcherFactory<ExecutedGenesisProposal, ExecuteProposalEventResult> {

    return this.web3EventService
      .createEntityFetcherFactory<ExecutedGenesisProposal, ExecuteProposalEventResult>(
        this.ExecuteProposal,
        async (args: ExecuteProposalEventResult): Promise<ExecutedGenesisProposal> => {
          const proposal = await this.getProposal(args._proposalId);
          return Object.assign(proposal, {
            decision: args._decision.toNumber(),
            executionState: await this.getProposalExecutionState(proposal.proposalId),
            totalReputation: args._totalReputation,
          });
        });
  }

  /**
   * Returns a promise of the execution state of the given proposal.  The result is
   * ExecutionState.None if the proposal has not been executed or is not found.
   * @param proposalId
   */
  public async getProposalExecutionState(proposalId: Hash): Promise<ExecutionState> {
    const fetcher = this.GPExecuteProposal({ _proposalId: proposalId }, { fromBlock: 0 });
    const events = await fetcher.get();
    return events.length ? events[0].args._executionState.toNumber() : ExecutionState.None;
  }

  public async getProposal(proposalId: Hash): Promise<GenesisProtocolProposal> {
    const proposalParams = await this.contract.proposals(proposalId);
    return this.convertProposalPropsArrayToObject(proposalParams, proposalId);
  }

  /**
   * Set the contract parameters.
   * @param {GenesisProtocolParams} params
   * @returns parameters hash
   */
  public async setParameters(params: GenesisProtocolParams): Promise<ArcTransactionDataResult<Hash>> {

    params = Object.assign({},
      await GetDefaultGenesisProtocolParameters(),
      params);

    // in Wei
    const maxEthValue = new BigNumber(10).pow(26);

    const minimumStakingFee = new BigNumber(params.minimumStakingFee);

    if (minimumStakingFee.lt(0)) {
      throw new Error("minimumStakingFee must be greater than or equal to 0");
    }

    if (minimumStakingFee.gt(maxEthValue)) {
      throw new Error(`minimumStakingFee must be less than ${maxEthValue}`);
    }

    const proposingRepRewardConstA = params.proposingRepRewardConstA || 0;

    if ((proposingRepRewardConstA < 0) || (proposingRepRewardConstA > 100000000)) {
      throw new Error(
        "proposingRepRewardConstA must be greater than or equal to 0 and less than or equal to 100000000");
    }

    const proposingRepRewardConstB = params.proposingRepRewardConstB || 0;

    if ((proposingRepRewardConstB < 0) || (proposingRepRewardConstB > 100000000)) {
      throw new Error(
        "proposingRepRewardConstB must be greater than or equal to 0 and less than or equal to 100000000");
    }

    const thresholdConstA = new BigNumber(params.thresholdConstA);

    if (thresholdConstA.lt(0)) {
      throw new Error("thresholdConstA must be greater than or equal to 0");
    }

    if (thresholdConstA.gt(maxEthValue)) {
      throw new Error(`thresholdConstA must be less than ${maxEthValue}`);
    }

    const thresholdConstB = params.thresholdConstB || 0;

    if ((thresholdConstB <= 0) || (thresholdConstB > 100000000)) {
      throw new Error("thresholdConstB must be greater than 0 and less than or equal to 100000000");
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

    const daoBountyConst = params.daoBountyConst || 0;

    if ((daoBountyConst <= stakerFeeRatioForVoters) || (daoBountyConst >= stakerFeeRatioForVoters * 2)) {
      throw new Error(
        "daoBountyConst must be greater than stakerFeeRatioForVoters and less than 2*stakerFeeRatioForVoters");
    }

    const daoBountyLimit = new BigNumber(params.daoBountyLimit);

    if (daoBountyLimit.lt(0)) {
      throw new Error("daoBountyLimit must be greater than or equal to 0");
    }

    return super._setParameters(
      "GenesisProtocol.setParameters",
      params.txEventContext,
      [
        preBoostedVoteRequiredPercentage,
        params.preBoostedVotePeriodLimit,
        params.boostedVotePeriodLimit,
        thresholdConstA,
        thresholdConstB,
        minimumStakingFee,
        params.quietEndingPeriod,
        proposingRepRewardConstA,
        proposingRepRewardConstB,
        stakerFeeRatioForVoters,
        votersReputationLossRatio,
        votersGainRepRatioFromLostRep,
        daoBountyConst,
        daoBountyLimit,
      ]
    );
  }

  public getDefaultPermissions(): SchemePermissions {
    return DefaultSchemePermissions.GenesisProtocol as number;
  }

  public async getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions> {
    return this._getSchemePermissions(avatarAddress);
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<GenesisProtocolParams> {
    return this._getSchemeParameters(avatarAddress);
  }

  public async getParameters(paramsHash: Hash): Promise<GetGenesisProtocolParamsResult> {
    const params = await this.getParametersArray(paramsHash);
    return {
      boostedVotePeriodLimit: params[2].toNumber(),
      daoBountyConst: params[12].toNumber(),
      daoBountyLimit: params[13],
      minimumStakingFee: params[5].toNumber(),
      preBoostedVotePeriodLimit: params[1].toNumber(),
      preBoostedVoteRequiredPercentage: params[0].toNumber(),
      proposingRepRewardConstA: params[7].toNumber(),
      proposingRepRewardConstB: params[8].toNumber(),
      quietEndingPeriod: params[6].toNumber(),
      stakerFeeRatioForVoters: params[9].toNumber(),
      thresholdConstA: params[3],
      thresholdConstB: params[4].toNumber(),
      votersGainRepRatioFromLostRep: params[11].toNumber(),
      votersReputationLossRatio: params[10].toNumber(),
    };
  }

  /**
   * Return promise of the staking token truffle contract.
   * @returns Promise<Address>
   */
  public async getStakingToken(): Promise<any> {
    const tokenAddress = await this.contract.stakingToken();
    return (await Utils.requireContract("ERC827Token")).at(tokenAddress);
  }

  public async propose(options: ProposeOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionProposalResult> {
    const functionName = "GenesisProtocol.propose";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.propose(Object.assign(options, { txEventContext: eventContext }));
  }

  public async vote(options: VoteOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "GenesisProtocol.vote";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.vote(Object.assign(options, { txEventContext: eventContext }));
  }

  public async voteWithSpecifiedAmounts(
    options: VoteWithSpecifiedAmountsOptions & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "GenesisProtocol.voteWithSpecifiedAmounts";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.voteWithSpecifiedAmounts(Object.assign(options, { txEventContext: eventContext }));
  }
  public async execute(options: ProposalIdOption & TxGeneratingFunctionOptions): Promise<ArcTransactionResult> {
    const functionName = "GenesisProtocol.execute";
    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    return super.execute(Object.assign(options, { txEventContext: eventContext }));
  }

  protected hydrated(): void {
    super.hydrated();
    /* tslint:disable:max-line-length */
    this.GPExecuteProposal = this.createEventFetcherFactory<GPExecuteProposalEventResult>(this.contract.GPExecuteProposal);
    this.Stake = this.createEventFetcherFactory<StakeEventResult>(this.contract.Stake);
    this.Redeem = this.createEventFetcherFactory<RedeemEventResult>(this.contract.Redeem);
    this.RedeemReputation = this.createEventFetcherFactory<RedeemEventResult>(this.contract.RedeemReputation);
    this.RedeemDaoBounty = this.createEventFetcherFactory<RedeemEventResult>(this.contract.RedeemDaoBounty);
    /* tslint:enable:max-line-length */
  }

  private convertProposalPropsArrayToObject(proposalArray: Array<any>, proposalId: Hash): GenesisProtocolProposal {
    return {
      avatarAddress: proposalArray[0],
      boostedPhaseTime: proposalArray[7],
      currentBoostedVotePeriodLimit: proposalArray[11],
      daoBountyRemain: proposalArray[13],
      executable: proposalArray[2],
      lostReputation: proposalArray[5],
      numOfChoices: proposalArray[1].toNumber(),
      paramsHash: proposalArray[12],
      proposalId,
      proposer: proposalArray[10],
      state: proposalArray[8].toNumber(),
      submittedTime: proposalArray[6].toNumber(),
      totalVotes: proposalArray[3],
      votersStakes: proposalArray[4],
      winningVote: proposalArray[9].toNumber(),
    };
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
    return super.new(stakingTokenAddress, { gas: gasLimitsConfig.gasLimit_arc });
  }
}

export const GenesisProtocolFactory =
  new GenesisProtocolFactoryType(
    "GenesisProtocol",
    GenesisProtocolWrapper,
    new Web3EventService()) as GenesisProtocolFactoryType;

export interface StakeEventResult {
  _amount: BigNumber;
  /**
   * indexed
   */
  _proposalId: Hash;
  _vote: number;
  /**
   * indexed
   */
  _staker: Address;
}

export interface GenesisProtocolParams extends TxGeneratingFunctionOptions {
  /**
   * The time limit in seconds for a proposal to be in relative voting mode.
   * Default is 259200 (three days).
   */
  boostedVotePeriodLimit: number;
  /**
   * Multiple of a winning stake to be rewarded as bounty.
   * Must be greater than stakerFeeRatioForVoters and less than 2*stakerFeeRatioForVoters.
   */
  daoBountyConst: number;
  /**
   * Upper bound on the total bounty amount on a proposal.
   */
  daoBountyLimit: BigNumber | string;
  /**
   * A floor on the staking fee which is normally computed using
   * [[GenesisProtocolParams.stakerFeeRatioForVoters]], in Wei.
   * Default is 0.
   */
  minimumStakingFee: BigNumber | string;
  /**
   * The time limit in seconds for a proposal to be in absolute voting mode.
   * Default is 1814400 (three weeks).
   */
  preBoostedVotePeriodLimit: number;
  /**
   * The percentage of the absolute vote that must be exceeded to result in a win.
   * Must be between 0 and 100.
   * Default is 50.
   */
  preBoostedVoteRequiredPercentage: number;
  /**
   * Constant A in the calculation of the proposer's reward.
   * See [[GenesisProtocolWrapper.getRedeemableReputationProposer]].
   * Must be between 0 and 100000000.
   * Default is 5.
   */
  proposingRepRewardConstA: number;
  /**
   * Constant B in the calculation of the proposer's reward.
   * See [[GenesisProtocolWrapper.getRedeemableReputationProposer]].
   * Must be between 0 and 100000000.
   * Default is 5.
   */
  proposingRepRewardConstB: number;
  /**
   * The duration of the quietEndingPeriod, in seconds.
   * Default is 86400 (one day).
   */
  quietEndingPeriod: number;
  /**
   * The percentage of a stake that is given to all voters.
   * Voters (pre and during boosting period) share this amount in proportion to their reputation.
   * Must be between 0 and 100.
   * Default is 50.
   */
  stakerFeeRatioForVoters: number;
  /**
   * Constant A in the threshold calculation,in Wei. See [[GenesisProtocolWrapper.getThreshold]].
   * Must be between 0 and 100000000 (converted to Wei).
   * Default is 7, converted to Wei.
   */
  thresholdConstA: BigNumber | string;
  /**
   * Constant B in the threshold calculation. See [[GenesisProtocolWrapper.getThreshold]].
   * Must be greater than zero and less than or equal to 100000000.
   * Default is 3.
   */
  thresholdConstB: number;
  /**
   * The percentage of losing pre-boosted voters' lost reputation (see votersReputationLossRatio)
   * rewarded to winning pre-boosted voters.
   * Must be between 0 and 100.
   * Default is 80.
   */
  votersGainRepRatioFromLostRep: number;
  /**
   * The percentage of reputation deducted from losing pre-boosted voters.
   * Must be between 0 and 100.
   * Default is 1.
   */
  votersReputationLossRatio: number;
}

export interface GetGenesisProtocolParamsResult {
  /**
   * The time limit in seconds for a proposal to be in relative voting mode.
   */
  boostedVotePeriodLimit: number;
  /**
   * Multiple of a winning stake to be rewarded as bounty.
   */
  daoBountyConst: number;
  /**
   * Upper bound on the total bounty amount on a proposal.
   */
  daoBountyLimit: BigNumber;
  /**
   * A floor on the staking fee which is normally computed using
   * [[GenesisProtocolParams.stakerFeeRatioForVoters]], in Wei.
   */
  minimumStakingFee: BigNumber;
  /**
   * The time limit in seconds for a proposal to be in absolute voting mode.
   */
  preBoostedVotePeriodLimit: number;
  /**
   * The percentage of the absolute vote that must be exceeded to result in a win.
   */
  preBoostedVoteRequiredPercentage: number;
  /**
   * Constant A in the calculation of the proposer's reward.
   * See [[GenesisProtocolWrapper.getRedeemableReputationProposer]].
   */
  proposingRepRewardConstA: number;
  /**
   * Constant B in the calculation of the proposer's reward.
   * See [[GenesisProtocolWrapper.getRedeemableReputationProposer]].
   */
  proposingRepRewardConstB: number;
  /**
   * The duration of the quietEndingPeriod, in seconds.
   */
  quietEndingPeriod: number;
  /**
   * The percentage of a stake that is given to all voters.
   * Voters (pre and during boosting period) share this amount in proportion to their reputation.
   * Must be between 0 and 100.
   */
  stakerFeeRatioForVoters: number;
  /**
   * Constant A in the threshold calculation,in Wei. See [[GenesisProtocolWrapper.getThreshold]].
   */
  thresholdConstA: BigNumber | string;
  /**
   * Constant B in the threshold calculation. See [[GenesisProtocolWrapper.getThreshold]].
   */
  thresholdConstB: number;
  /**
   * The percentage of losing pre-boosted voters' lost reputation (see votersReputationLossRatio)
   * rewarded to winning pre-boosted voters.
   */
  votersGainRepRatioFromLostRep: number;
  /**
   * The percentage of reputation deducted from losing pre-boosted voters.
   */
  votersReputationLossRatio: number;
}

export interface GetVoterInfoResult {
  vote: number;
  reputation: BigNumber;
}

export interface GetProposalStatusResult {
  /**
   * Amount of reputation voted
   */
  totalVotes: BigNumber;
  /**
   * Number of staked tokens currently redeemable by stakers
   */
  totalStakerStakes: BigNumber;
  /**
   * Total number of staked tokens currently redeemable by everyone
   */
  totalStaked: BigNumber;
  /**
   * Number of staked tokens set aside and redeemable for all voters (via the staking fee)
   */
  totalVoterStakes: BigNumber;
}

export interface GetScoreThresholdParamsResult {
  thresholdConstA: BigNumber;
  thresholdConstB: number;
}

export interface GetStakerInfoResult {
  vote: number;
  stake: BigNumber;
}

export interface StakeConfig {
  /**
   * token amount to stake on the outcome resulting in this vote, in Wei
   */
  amount: BigNumber | string;
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * the choice of vote. Can be 1 (YES) or 2 (NO).
   */
  vote: number;
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
 * return the amount of bounty or staked tokens to which the staker will be entitled as an outcome of the proposal
 */
export interface GetRedeemableRewardsStakerConfig {
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

export interface GetVoterInfoConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  voter: string;
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

export interface GPExecuteProposalEventResult {
  /**
   * indexed
   */
  _proposalId: Hash;
  /**
   * _executionState.toNumber() will give you a value from the enum `ExecutionState`
   */
  _executionState: BigNumber;
}

export enum ProposalState {
  None,
  Closed,
  Executed,
  PreBoosted,
  Boosted,
  QuietEndingPeriod,
}

export interface GetTokenBalancesOptions {
  avatarAddress: Address;
}

export interface GenesisProtocolDaoTokenBalances {
  /**
   * The native token's truffle contract
   */
  nativeToken: any;
  /**
   * The avatar's balance off native tokens, in Wei
   */
  nativeTokenBalance: BigNumber;
  /**
   * The standard token's truffle contract
   */
  stakingToken: any;
  /**
   * The avatar's balance of staking tokens, in Wei
   */
  stakingTokenBalance: BigNumber;
}

export const GetDefaultGenesisProtocolParameters = async (): Promise<GenesisProtocolParams> => {
  const web3 = await Utils.getWeb3();

  return {
    boostedVotePeriodLimit: 259200,
    daoBountyConst: 75,
    daoBountyLimit: web3.toWei(100),
    minimumStakingFee: web3.toWei(0),
    preBoostedVotePeriodLimit: 1814400,
    preBoostedVoteRequiredPercentage: 50,
    proposingRepRewardConstA: 5,
    proposingRepRewardConstB: 5,
    quietEndingPeriod: 86400,
    stakerFeeRatioForVoters: 50,
    thresholdConstA: web3.toWei(7),
    thresholdConstB: 3,
    votersGainRepRatioFromLostRep: 80,
    votersReputationLossRatio: 1,
  };
};

export interface ExecutedGenesisProposal extends GenesisProtocolProposal {
  decision: BinaryVoteResult;
  /**
   * total reputation in the DAO at the time the proposal is created in the voting machine
   */
  totalReputation: BigNumber;
  executionState: ExecutionState;
}

export interface GenesisProtocolProposal {
  avatarAddress: Address;
  /**
   * in seconds
   */
  boostedPhaseTime: number;
  /**
   * in seconds
   */
  currentBoostedVotePeriodLimit: number;
  daoBountyRemain: BigNumber;
  executable: Address;
  lostReputation: BigNumber;
  numOfChoices: number;
  paramsHash: Hash;
  proposalId: Hash;
  proposer: Address;
  state: ProposalState;
  /**
   * in seconds
   */
  submittedTime: number;
  totalVotes: BigNumber;
  votersStakes: BigNumber;
  winningVote: number;
}

export interface GetVoteStatusConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
  /**
   * the choice of vote, like 1 (YES) or 2 (NO).
   */
  vote: number;
}

export interface GetTokenBalancesOptions {
  avatarAddress: Address;
}

export interface GetNumberOfChoicesConfig {
  /**
   * unique hash of proposal index
   */
  proposalId: string;
}
