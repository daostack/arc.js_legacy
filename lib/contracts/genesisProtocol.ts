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
const SolidityContract = Utils.requireContract("GenesisProtocol");
import * as BigNumber from "bignumber.js";
import ContractWrapperFactory from "../ContractWrapperFactory";
import {
  ExecuteProposalEventResult,
  NewProposalEventResult,
  RedeemReputationEventResult,
  VoteProposalEventResult,
} from "./commonEventInterfaces";

export class GenesisProtocolWrapper extends ExtendTruffleContract {

  /**
   * Events
   */

  public NewProposal = this.createEventFetcherFactory<NewProposalEventResult>("NewProposal");
  /**
   * _param in this case is the ExecutionState
   */
  public ExecuteProposal = this.createEventFetcherFactory<ExecuteProposalEventResult>("ExecuteProposal");
  public VoteProposal = this.createEventFetcherFactory<VoteProposalEventResult>("VoteProposal");
  public Stake = this.createEventFetcherFactory<StakeEventResult>("Stake");
  public Redeem = this.createEventFetcherFactory<RedeemEventResult>("Redeem");
  public RedeemReputation = this.createEventFetcherFactory<RedeemReputationEventResult>("RedeemReputation");

  /**
   * Create a proposal
   * @param {ProposeVoteConfig} options
   * @returns Promise<ArcTransactionProposalResult>
   */
  public async propose(opts = {}) {
    /**
     * see GenesisProtocolProposeVoteConfig
     */
    const defaults = {
      avatar: undefined,
      executable: undefined,
      numOfChoices: 0,
      paramsHash: undefined,
      proposer: Utils.getDefaultAccount(),
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

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
      options.proposer,
    );

    return new ArcTransactionProposalResult(tx);
  }

  /**
   * Stake some tokens on the final outcome matching this vote.
   * @param {StakeConfig} opts
   * @returns Promise<ArcTransactionResult>
   */
  public async stake(opts = {}) {

    const defaults = {
      amount: undefined,
      proposalId: undefined,
      vote: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const amount = web3.toBigNumber(options.amount);

    if (amount <= 0) {
      throw new Error("amount must be > 0");
    }

    const tx = await this.contract.stake(
      options.proposalId,
      options.vote,
      amount,
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Vote on a proposal
   * @param {VoteConfig} opts
   * @returns Promise<ArcTransactionResult>
   */
  public async vote(opts = {}) {

    const defaults = {
      proposalId: undefined,
      vote: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const tx = await this.contract.vote(
      options.proposalId,
      options.vote,
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Vote on a proposal, staking some reputation that the final outcome will match this vote.
   * Reputation of 0 will stake all the voter's reputation.
   * @param {VoteWithSpecifiedAmountsConfig} opts
   * @returns Promise<ArcTransactionResult>
   */
  public async voteWithSpecifiedAmounts(opts = {}) {
    const defaults = {
      proposalId: undefined,
      reputation: undefined,
      vote: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

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
      0,
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Redeem any tokens and reputation that are due the beneficiary from the outcome of the proposal.
   * @param {RedeemConfig} opts
   * @returns Promise<ArcTransactionResult>
   */
  public async redeem(opts = {}) {

    const defaults = {
      beneficiary: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const tx = await this.contract.redeem(
      options.proposalId,
      options.beneficiary,
    );

    return new ArcTransactionResult(tx);
  }

  /**
   * Return whether a proposal should be shifted to the boosted phase.
   * @param {ShouldBoostConfig} opts
   * @returns Promise<boolean>
   */
  public async shouldBoost(opts = {}) {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const shouldBoost = await this.contract.shouldBoost(
      options.proposalId,
    );

    return shouldBoost;
  }

  /**
   * Return the current proposal score.
   * @param {GetScoreCOnfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getScore(opts = {}) {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const score = await this.contract.score(
      options.proposalId,
    );

    // TODO: convert to number?
    return score;
  }

  /**
   * Return the DAO's score threshold that is required by a proposal to it shift to boosted state.
   * @param {GetThresholdConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getThreshold(opts = {}) {

    const defaults = {
      avatar: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    const threshold = await this.contract.threshold(
      options.avatar,
    );

    // TODO: convert to number?
    return threshold;
  }

  /**
   * Return the token amount to which the given staker is entitled in the event that the proposal is approved.
   * @param {GetRedeemableTokensStakerConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableTokensStaker(opts = {}) {

    const defaults = {
      beneficiary: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const redeemAmount = await this.contract.getRedeemableTokensStaker(
      options.proposalId,
      options.beneficiary,
    );

    return redeemAmount;
  }

  /**
   * Return the reputation amount to which the proposal proposer is entitled in the event that the proposal is approved.
   * @param {GetRedeemableReputationProposerConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableReputationProposer(opts = {}) {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const reputation = await this.contract.getRedeemableReputationProposer(
      options.proposalId,
    );

    return reputation;
  }

  /**
   * Return the token amount to which the voter is entitled in the event that the proposal is approved.
   * @param {GetRedeemableTokensVoterConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableTokensVoter(opts = {}) {

    const defaults = {
      beneficiary: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const amount = await this.contract.getRedeemableTokensVoter(
      options.proposalId,
      options.beneficiary,
    );

    return amount;
  }

  /**
   * Return the reputation amount to which the voter is entitled in the event that the proposal is approved.
   * @param {RetRedeemableReputationVoterConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableReputationVoter(opts = {}) {

    const defaults = {
      beneficiary: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const reputation = await this.contract.getRedeemableReputationVoter(
      options.proposalId,
      options.beneficiary,
    );

    return reputation;
  }

  /**
   * Return the reputation amount to which the staker is entitled in the event that the proposal is approved.
   * @param {GetRedeemableReputationStakerConfig} opts
   * @returns Promise<BigNumber.BigNumber>
   */
  public async getRedeemableReputationStaker(opts = {}) {

    const defaults = {
      beneficiary: undefined,
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const reputation = await this.contract.getRedeemableReputationStaker(
      options.proposalId,
      options.beneficiary,
    );

    return reputation;
  }

  /**
   * Return the number of possible choices when voting for the proposal.
   * @param {GetNumberOfChoicesConfig} opts
   * @returns Promise<number>
   */
  public async getNumberOfChoices(opts = {}) {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const numOfChoices = await this.contract.getNumberOfChoices(
      options.proposalId,
    );

    return numOfChoices.toNumber();
  }

  /**
   * Return the vote and the amount of reputation of the voter committed to this proposal
   * @param {GetVoterInfo} opts
   * @returns Promise<GetVoterInfoResult>
   */
  public async getVoterInfo(opts = {}) {

    const defaults = {
      proposalId: undefined,
      voter: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.voter) {
      throw new Error("voter is not defined");
    }

    const result = await this.contract.voteInfo(
      options.proposalId,
      options.voter,
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
  public async getVoteStatus(opts = {}) {

    const defaults = {
      proposalId: undefined,
      vote: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const reputation = await this.contract.voteStatus(
      options.proposalId,
      options.vote,
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
  public async isVotable(opts = {}) {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const votable = await this.contract.isVotable(
      options.proposalId,
    );

    return votable;
  }

  /**
   * Return the total votes, total stakes and voter stakes for a given proposal
   * @param {GetProposalStatusConfig} opts
   * @returns Promise<GetProposalStatusResult>
   */
  public async getProposalStatus(opts = {}) {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const result = await this.contract.proposalStatus(
      options.proposalId,
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
  public async getTotalReputationSupply(opts = {}) {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const supply = await this.contract.totalReputationSupply(
      options.proposalId,
    );

    return supply;
  }

  /**
   * Return the DAO avatar address under which the proposal was made
   * @param {GetProposalAvatarConfig} opts
   * @returns Promise<string>
   */
  public async getProposalAvatar(opts = {}) {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const avatar = await this.contract.proposalAvatar(
      options.proposalId,
    );

    return avatar;
  }

  /**
   * Return the score threshold params for the given DAO.
   * @param {GetScoreThresholdParamsConfig} opts
   * @returns Promise<GetScoreThresholdParamsResult>
   */
  public async getScoreThresholdParams(opts = {}) {

    const defaults = {
      avatar: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    const result = await this.contract.scoreThresholdParams(
      options.avatar,
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
   * @returns Promise<getStakerInfoResult>
   */
  public async getStakerInfo(opts = {}) {

    const defaults = {
      proposalId: undefined,
      staker: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.staker) {
      throw new Error("staker is not defined");
    }

    const result = await this.contract.staker(
      options.proposalId,
      options.staker,
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
  public async getVoteStake(opts = {}) {
    const defaults = {
      proposalId: undefined,
      vote: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const stake = await this.contract.voteStake(
      options.proposalId,
      options.vote,
    );

    return stake;
  }

  /**
   * Return the winningVote for a given proposal.
   * @param {GetWinningVoteConfig} opts
   * @returns Promise<number>
   */
  public async getWinningVote(opts = {}) {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const winningVote = await this.contract.winningVote(
      options.proposalId,
    );

    return winningVote.toNumber();
  }

  /**
   * Return the current state of a given proposal.
   * @param {GetStateConfig} opts
   * @returns Promise<number>
   */
  public async getState(opts = {}) {

    const defaults = {
      proposalId: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const state = await this.contract.state(
      options.proposalId,
    );

    return state;
  }

  public async _validateVote(vote, proposalId) {
    const numChoices = await this.getNumberOfChoices({ proposalId });
    if (!Number.isInteger(vote) || (vote < 0) || (vote > numChoices)) {
      throw new Error("vote is not valid");
    }
  }

  /**
   * Set the contract parameters.
   * @param {GenesisProtocolParams} params
   * @returns parameters hash
   */
  public async setParams(params) {

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

    return super.setParams(
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
      params.governanceFormulasInterface,
    );
  }

  public getDefaultPermissions(overrideValue?: string) {
    return overrideValue || "0x00000001";
  }
}

const GenesisProtocol = new ContractWrapperFactory(SolidityContract, GenesisProtocolWrapper);
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
