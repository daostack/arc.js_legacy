"use strict";
import * as BigNumber from "bignumber.js";
import dopts = require("default-options");
import {
  Address,
  BinaryVoteResult,
  DefaultSchemePermissions,
  fnVoid,
  GetDaoProposalsConfig,
  Hash,
  SchemePermissions,
  VoteConfig
} from "../commonTypes";
import { Config } from "../config";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  ContractWrapperBase,
  DecodedLogEntryEvent,
  EventFetcherFactory,
} from "../contractWrapperBase";
import ContractWrapperFactory from "../contractWrapperFactory";
import { Utils } from "../utils";
import {
  ExecuteProposalEventResult,
  NewProposalEventResult,
  RedeemReputationEventResult,
  VoteProposalEventResult,
} from "./commonEventInterfaces";

export class GenesisProtocolWrapper extends ContractWrapperBase {

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
  public async propose(opts: ProposeVoteConfig = {} as ProposeVoteConfig): Promise<ArcTransactionProposalResult> {
    /**
     * see GenesisProtocolProposeVoteConfig
     */
    const defaults = {
      avatar: undefined,
      executable: undefined,
      numOfChoices: 0,
      paramsHash: undefined,
      proposer: await Utils.getDefaultAccount(),
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as ProposeVoteConfig;

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    if (!options.paramsHash) {
      throw new Error("paramsHash is not defined");
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

    const tx = await this.contract.propose(
      options.numOfChoices,
      options.paramsHash,
      options.avatar,
      options.executable,
      options.proposer
    );

    return new ArcTransactionProposalResult(tx);
  }

  /**
   * Stake some tokens on the final outcome matching this vote.
   *
   * A transfer of tokens from the staker to this GenesisProtocol scheme
   * is automatically approved and executed on the token with which
   * this GenesisProtocol scheme was deployed.
   *
   * @param {StakeConfig} opts
   * @returns Promise<ArcTransactionResult>
   */
  public async stake(opts: StakeConfig = {} as StakeConfig): Promise<ArcTransactionResult> {

    const defaults = {
      amount: undefined,
      onBehalfOf: null,
      proposalId: undefined,
      vote: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as StakeConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const amount = web3.toBigNumber(options.amount);

    if (amount <= 0) {
      throw new Error("amount must be > 0");
    }

    /**
     * approve immediate transfer of staked tokens from onBehalfOf to this scheme
     */
    if (Config.get("autoApproveTokenTransfers")) {
      const token = await
        (await Utils.requireContract("StandardToken")).at(await this.contract.stakingToken()) as any;
      await token.approve(this.address,
        amount,
        { from: options.onBehalfOf ? options.onBehalfOf : await Utils.getDefaultAccount() });
    }

    const tx = await this.contract.stake(
      options.proposalId,
      options.vote,
      amount,
      options.onBehalfOf ? {
        from: options.onBehalfOf ? options.onBehalfOf :
          await Utils.getDefaultAccount(),
      } : undefined
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Vote on a proposal
   * @param {VoteConfig} opts
   * @returns Promise<ArcTransactionResult>
   */
  public async vote(opts: VoteConfig = {} as VoteConfig): Promise<ArcTransactionResult> {

    const defaults = {
      onBehalfOf: null,
      proposalId: undefined,
      vote: undefined,
    } as VoteConfig;

    const options = dopts(opts, defaults, { allowUnknown: true }) as VoteConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const tx = await this.contract.vote(
      options.proposalId,
      options.vote,
      options.onBehalfOf ? { from: options.onBehalfOf } : undefined
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Vote on a proposal, staking some reputation that the final outcome will match this vote.
   * Reputation of 0 will stake all the voter's reputation.
   * @param {VoteWithSpecifiedAmountsConfig} opts
   * @returns Promise<ArcTransactionResult>
   */
  public async voteWithSpecifiedAmounts(
    opts: VoteWithSpecifiedAmountsConfig = {} as VoteWithSpecifiedAmountsConfig)
    : Promise<ArcTransactionResult> {
    const defaults = {
      proposalId: undefined,
      reputation: undefined,
      vote: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as VoteWithSpecifiedAmountsConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    if (!options.reputation) {
      throw new Error("reputation is not defined");
    }

    const tx = await this.contract.voteWithSpecifiedAmounts(
      options.proposalId,
      options.vote,
      options.reputation,
      0
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Redeem any tokens and reputation that are due the beneficiary from the outcome of the proposal.
   * @param {RedeemConfig} opts
   * @returns Promise<ArcTransactionResult>
   */
  public async redeem(opts: RedeemConfig = {} as RedeemConfig): Promise<ArcTransactionResult> {

    const defaults = {
      beneficiary: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as RedeemConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const tx = await this.contract.redeem(
      options.proposalId,
      options.beneficiary
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Return whether a proposal should be shifted to the boosted phase.
   * @param {ShouldBoostConfig} opts
   * @returns Promise<boolean>
   */
  public async shouldBoost(opts: ShouldBoostConfig = {} as ShouldBoostConfig): Promise<boolean> {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as ShouldBoostConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const shouldBoost = await this.contract.shouldBoost(
      options.proposalId
    );

    return shouldBoost;
  }

  /**
   * Return the current proposal score.
   * @param {GetScoreConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getScore(opts: GetScoreConfig = {} as GetScoreConfig): Promise<BigNumber.BigNumber> {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetScoreConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const score = await this.contract.score(
      options.proposalId
    );

    // TODO: convert to number?
    return score;
  }

  /**
   * Return the DAO's score threshold that is required by a proposal to it shift to boosted state.
   * @param {GetThresholdConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getThreshold(opts: GetThresholdConfig = {} as GetThresholdConfig): Promise<BigNumber.BigNumber> {

    const defaults = {
      avatar: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetThresholdConfig;

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    const threshold = await this.contract.threshold(
      options.avatar
    );

    // TODO: convert to number?
    return threshold;
  }

  /**
   * Return the token amount to which the given staker is entitled in the event that the proposal is approved.
   * @param {GetRedeemableTokensStakerConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableTokensStaker(opts: GetRedeemableTokensStakerConfig = {} as GetRedeemableTokensStakerConfig)
    : Promise<BigNumber.BigNumber> {

    const defaults = {
      beneficiary: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetRedeemableTokensStakerConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const redeemAmount = await this.contract.getRedeemableTokensStaker(
      options.proposalId,
      options.beneficiary
    );

    return redeemAmount;
  }

  /**
   * Return the reputation amount to which the proposal proposer is entitled in the event that the proposal is approved.
   * @param {GetRedeemableReputationProposerConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableReputationProposer(
    opts: GetRedeemableReputationProposerConfig = {} as GetRedeemableReputationProposerConfig)
    : Promise<BigNumber.BigNumber> {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const reputation = await this.contract.getRedeemableReputationProposer(
      options.proposalId
    );

    return reputation;
  }

  /**
   * Return the token amount to which the voter is entitled in the event that the proposal is approved.
   * @param {GetRedeemableTokensVoterConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableTokensVoter(
    opts: GetRedeemableTokensVoterConfig = {} as GetRedeemableTokensVoterConfig)
    : Promise<BigNumber.BigNumber> {

    const defaults = {
      beneficiary: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetRedeemableTokensVoterConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const amount = await this.contract.getRedeemableTokensVoter(
      options.proposalId,
      options.beneficiary
    );

    return amount;
  }

  /**
   * Return the reputation amount to which the voter is entitled in the event that the proposal is approved.
   * @param {GetRedeemableReputationVoterConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableReputationVoter(
    opts: GetRedeemableReputationVoterConfig = {} as GetRedeemableReputationVoterConfig)
    : Promise<BigNumber.BigNumber> {

    const defaults = {
      beneficiary: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetRedeemableReputationVoterConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const reputation = await this.contract.getRedeemableReputationVoter(
      options.proposalId,
      options.beneficiary
    );

    return reputation;
  }

  /**
   * Return the reputation amount to which the staker is entitled in the event that the proposal is approved.
   * @param {GetRedeemableReputationStakerConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableReputationStaker(
    opts: GetRedeemableReputationStakerConfig = {} as GetRedeemableReputationStakerConfig)
    : Promise<BigNumber.BigNumber> {

    const defaults = {
      beneficiary: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetRedeemableReputationStakerConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const reputation = await this.contract.getRedeemableReputationStaker(
      options.proposalId,
      options.beneficiary
    );

    return reputation;
  }

  /**
   * Return the number of possible choices when voting for the proposal.
   * @param {GetNumberOfChoicesConfig} opts
   * @returns Promise<number>
   */
  public async getNumberOfChoices(
    opts: GetNumberOfChoicesConfig = {} as GetNumberOfChoicesConfig)
    : Promise<number> {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetNumberOfChoicesConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const numOfChoices = await this.contract.getNumberOfChoices(
      options.proposalId
    );

    return numOfChoices.toNumber();
  }

  /**
   * Return the vote and the amount of reputation of the voter committed to this proposal
   * @param {GetVoterInfoResult} opts
   * @returns Promise<GetVoterInfoResult>
   */
  public async getVoterInfo(
    opts: GetVoterInfoConfig = {} as GetVoterInfoConfig)
    : Promise<GetVoterInfoResult> {

    const defaults = {
      proposalId: undefined,
      voter: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetVoterInfoConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.voter) {
      throw new Error("voter is not defined");
    }

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
   * @param {GetVoteStatusConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getVoteStatus(
    opts: GetVoteStatusConfig = {} as GetVoteStatusConfig)
    : Promise<BigNumber.BigNumber> {

    const defaults = {
      proposalId: undefined,
      vote: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetVoteStatusConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const reputation = await this.contract.voteStatus(
      options.proposalId,
      options.vote
    );

    /**
     * an array of number counts for each vote choice
     */
    return reputation;
  }

  /**
   * Return whether the proposal is in a votable state.
   * @param {IsVotableConfig} opts
   * @returns Promise<boolean>
   */
  public async isVotable(
    opts: IsVotableConfig = {} as IsVotableConfig)
    : Promise<boolean> {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as IsVotableConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const votable = await this.contract.isVotable(
      options.proposalId
    );

    return votable;
  }

  /**
   * Return the total votes, total stakes and voter stakes for a given proposal
   * @param {GetProposalStatusConfig} opts
   * @returns Promise<GetProposalStatusResult>
   */
  public async getProposalStatus(
    opts: GetProposalStatusConfig = {} as GetProposalStatusConfig)
    : Promise<GetProposalStatusResult> {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetProposalStatusConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const result = await this.contract.proposalStatus(
      options.proposalId
    );

    return {
      totalStakes: result[1],
      totalVotes: result[0],
      votersStakes: result[2],
    };
  }

  /**
   * Return the total reputation supply for a given proposal.
   * @param {GetTotalReputationSupplyConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getTotalReputationSupply(
    opts: GetTotalReputationSupplyConfig = {} as GetTotalReputationSupplyConfig)
    : Promise<BigNumber.BigNumber> {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetTotalReputationSupplyConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const supply = await this.contract.totalReputationSupply(
      options.proposalId
    );

    return supply;
  }

  /**
   * Return the DAO avatar address under which the proposal was made
   * @param {GetProposalAvatarConfig} opts
   * @returns Promise<string>
   */
  public async getProposalAvatar(
    opts: GetProposalAvatarConfig = {} as GetProposalAvatarConfig
  ): Promise<string> {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetProposalAvatarConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const avatar = await this.contract.proposalAvatar(
      options.proposalId
    );

    return avatar;
  }

  /**
   * Return the score threshold params for the given DAO.
   * @param {GetScoreThresholdParamsConfig} opts
   * @returns Promise<GetScoreThresholdParamsResult>
   */
  public async getScoreThresholdParams(
    opts: GetScoreThresholdParamsConfig = {} as GetScoreThresholdParamsConfig)
    : Promise<GetScoreThresholdParamsResult> {

    const defaults = {
      avatar: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetScoreThresholdParamsConfig;

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    const result = await this.contract.scoreThresholdParams(
      options.avatar
    );

    // TODO:  convert to number??  dunno what these values represent.
    return {
      thresholdConstA: result[0],
      thresholdConstB: result[1],
    };
  }

  /**
   * Return the vote and stake amount for a given proposal and staker.
   * @param {GetStakerInfoConfig} opts
   * @returns Promise<GetStakerInfoResult>
   */
  public async getStakerInfo(
    opts: GetStakerInfoConfig = {} as GetStakerInfoConfig)
    : Promise<GetStakerInfoResult> {

    const defaults = {
      proposalId: undefined,
      staker: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetStakerInfoConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.staker) {
      throw new Error("staker is not defined");
    }

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
   * @param {GetVoteStakeConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getVoteStake(
    opts: GetVoteStakeConfig = {} as GetVoteStakeConfig)
    : Promise<BigNumber.BigNumber> {

    const defaults = {
      proposalId: undefined,
      vote: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetVoteStakeConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const stake = await this.contract.voteStake(
      options.proposalId,
      options.vote
    );

    return stake;
  }

  /**
   * Return the winningVote for a given proposal.
   * @param {GetWinningVoteConfig} opts
   * @returns Promise<number>
   */
  public async getWinningVote(
    opts: GetWinningVoteConfig = {} as GetWinningVoteConfig)
    : Promise<number> {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetWinningVoteConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const winningVote = await this.contract.winningVote(
      options.proposalId
    );

    return winningVote.toNumber();
  }

  /**
   * Return the current state of a given proposal.
   * @param {GetStateConfig} opts
   * @returns Promise<number>
   */
  public async getState(opts: GetStateConfig = {} as GetStateConfig): Promise<number> {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true }) as GetStateConfig;

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const state = await this.contract.state(
      options.proposalId
    );

    return state;
  }

  /**
   * Return all executed GenesisProtocol proposals created under the given avatar.
   * Filter by the optional proposalId.
   */
  public async getExecutedDaoProposals(
    opts: GetDaoProposalsConfig = {} as GetDaoProposalsConfig)
    : Promise<Array<ExecutedGenesisProposal>> {

    const defaults: GetDaoProposalsConfig = {
      avatar: undefined,
      proposalId: null,
    };

    const options: GetDaoProposalsConfig = dopts(opts, defaults, { allowUnknown: true });

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
      {
        boostedVotePeriodLimit: 60,
        governanceFormulasInterface: Utils.NULL_ADDRESS,
        minimumStakingFee: 0,
        preBoostedVotePeriodLimit: 60,
        preBoostedVoteRequiredPercentage: 50,
        proposingRepRewardConstA: 1,
        proposingRepRewardConstB: 1,
        quietEndingPeriod: 0,
        stakerFeeRatioForVoters: 1,
        thresholdConstA: 1,
        thresholdConstB: 1,
        votersGainRepRatioFromLostRep: 80,
        votersReputationLossRatio: 10,
      },
      params);

    if (params.proposingRepRewardConstB <= 0) {
      throw new Error("proposingRepRewardConstB must be greater than 0");
    }

    if ((params.preBoostedVoteRequiredPercentage <= 0) || (params.preBoostedVoteRequiredPercentage > 100)) {
      throw new Error("preBoostedVoteRequiredPercentage must be greater than 0 and less than or equal to 100");
    }

    return super.setParameters(
      [
        params.preBoostedVoteRequiredPercentage,
        params.preBoostedVotePeriodLimit,
        params.boostedVotePeriodLimit,
        params.thresholdConstA,
        params.thresholdConstB,
        params.minimumStakingFee,
        params.quietEndingPeriod,
        params.proposingRepRewardConstA,
        params.proposingRepRewardConstB,
        params.stakerFeeRatioForVoters,
        params.votersReputationLossRatio,
        params.votersGainRepRatioFromLostRep,
      ],
      params.governanceFormulasInterface
    );
  }

  public getDefaultPermissions(overrideValue?: SchemePermissions | DefaultSchemePermissions): SchemePermissions {
    // return overrideValue || Utils.numberToPermissionsString(DefaultSchemePermissions.GenesisProtocol);
    return (overrideValue || DefaultSchemePermissions.GenesisProtocol) as SchemePermissions;
  }

  public async getSchemeParameters(avatarAddress: Address): Promise<GenesisProtocolParams> {
    return this._getSchemeParameters(avatarAddress);
  }

  public async getParameters(paramsHash: Hash): Promise<GenesisProtocolParams> {
    const params = await this.getParametersArray(paramsHash);
    return {
      boostedVotePeriodLimit: params[2],
      governanceFormulasInterface: params[5],
      minimumStakingFee: params[6],
      preBoostedVotePeriodLimit: params[1],
      preBoostedVoteRequiredPercentage: params[0],
      proposingRepRewardConstA: params[8],
      proposingRepRewardConstB: params[9],
      quietEndingPeriod: params[7],
      stakerFeeRatioForVoters: params[10],
      thresholdConstA: params[3],
      thresholdConstB: params[4],
      votersGainRepRatioFromLostRep: params[12],
      votersReputationLossRatio: params[11],
    };
  }

  private async _validateVote(vote: number, proposalId: Hash): Promise<void> {
    const numChoices = await this.getNumberOfChoices({ proposalId });
    if (!Number.isInteger(vote) || (vote < 0) || (vote > numChoices)) {
      throw new Error("vote is not valid");
    }
  }
}

const GenesisProtocol = new ContractWrapperFactory("GenesisProtocol", GenesisProtocolWrapper);
export { GenesisProtocol };

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
   * the absolute vote percentages bar
   * Must be greater than zero.
   * Default is 50.
   */
  preBoostedVoteRequiredPercentage: number;
  /**
   * the time limit for a proposal to be in an absolute voting mode.
   * TODO: Units? Default?
   * Default is 60.
   */
  preBoostedVotePeriodLimit: number;
  /**
   * the time limit for a proposal to be in an relative voting mode.
   * TODO: Units? Default?
   * Default is 60.
   */
  boostedVotePeriodLimit: number;
  /**
   * TODO: Purpose?
   * Default is 1
   */
  thresholdConstA: number;
  /**
   * TODO: Purpose?
   * Default is 1
   */
  thresholdConstB: number;
  /**
   * GenesisProtocolFormulasInterface address
   */
  governanceFormulasInterface?: string;
  /**
   * Default is 0
   */
  minimumStakingFee: number;
  /**
   * TODO: Purpose?
   * Default is 0
   */
  quietEndingPeriod: number;
  /**
   * TODO: Purpose?
   * Default is 1
   */
  proposingRepRewardConstA: number;
  /**
   * TODO: Purpose?
   * Default is 1
   */
  proposingRepRewardConstB: number;
  /**
   * a value between 0-100
   * TODO: Purpose?
   * Default is 1 (?)
   */
  stakerFeeRatioForVoters: number;
  /**
   * a value between 0-100
   * TODO: Purpose?
   * Default is 10
   */
  votersReputationLossRatio: number;
  /**
   * a value between 0-100
   * TODO: Purpose?
   * Default is 80
   */
  votersGainRepRatioFromLostRep: number;
}

export interface GenesisProtocolParams {
  /**
   * the absolute vote percentages bar
   * Must be greater than zero.
   * Default is 50.
   */
  preBoostedVoteRequiredPercentage: number;
  /**
   * the time limit for a proposal to be in an absolute voting mode.
   * TODO: Units? Default?
   * Default is 60.
   */
  preBoostedVotePeriodLimit: number;
  /**
   * the time limit for a proposal to be in an relative voting mode.
   * TODO: Units? Default?
   * Default is 60.
   */
  boostedVotePeriodLimit: number;
  /**
   * TODO: Purpose?
   * Default is 1
   */
  thresholdConstA: number;
  /**
   * TODO: Purpose?
   * Default is 1
   */
  thresholdConstB: number;
  /**
   * GenesisProtocolFormulasInterface address
   */
  governanceFormulasInterface?: string;
  /**
   * Default is 0
   */
  minimumStakingFee: number;
  /**
   * TODO: Purpose?
   * Default is 0
   */
  quietEndingPeriod: number;
  /**
   * TODO: Purpose?
   * Default is 1
   */
  proposingRepRewardConstA: number;
  /**
   * TODO: Purpose?
   * Default is 1
   */
  proposingRepRewardConstB: number;
  /**
   * a value between 0-100
   * TODO: Purpose?
   * Default is 1 (?)
   */
  stakerFeeRatioForVoters: number;
  /**
   * a value between 0-100
   * TODO: Purpose?
   * Default is 10
   */
  votersReputationLossRatio: number;
  /**
   * a value between 0-100
   * TODO: Purpose?
   * Default is 80
   */
  votersGainRepRatioFromLostRep: number;
}

/**
 * Javascript version of the Arc ExecutableInterface,
 * for information purposes.
 */
export interface ExecutableInterface {
  execute(proposalId: number, avatar: string, vote: number): Promise<boolean>;
}

export interface ProposeVoteConfig {
  /**
   * The DAO's avatar under which the proposal is being made.
   */
  avatar: string;
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
   * GenesisProtocol parameters to apply to this proposal
   */
  paramsHash: string;
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
  totalVotes: BigNumber.BigNumber;
  totalStakes: BigNumber.BigNumber;
  votersStakes: BigNumber.BigNumber;
}

export interface GetScoreThresholdParamsResult {
  thresholdConstA: number;
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
  beneficiary: string;
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
  avatar: string;
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
  beneficiary: string;
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
  beneficiary: string;
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
  beneficiary: string;
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
  beneficiary: string;
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
  avatar: string;
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
