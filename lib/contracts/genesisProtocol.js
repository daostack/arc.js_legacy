"use strict";
const dopts = require("default-options");

import { ExtendTruffleContract, ArcTransactionResult, ArcTransactionProposalResult } from "../ExtendTruffleContract";
const SolidityContract = Utils.requireContract("GenesisProtocol");
import { Utils } from "../utils";

export class GenesisProtocol extends ExtendTruffleContract(SolidityContract) {
  /**
   * Address of token to use when staking
   * @param {string} token
   */
  static async new(token) {
    const contract = await SolidityContract.new(token);
    return new this(contract);
  }

  async propose(opts = {}) {
    /**
     * see GenesisProtocolProposeVoteConfig
     */
    const defaults = {
      avatar: undefined,
      numOfChoices: 0,
      proposer: Utils.getDefaultAccount(),
      paramsHash: undefined,
      executable: undefined
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
      options.proposer
    );

    return new ArcTransactionProposalResult(tx);
  }

  async stake(opts = {}) {

    const defaults = {
      proposalId: undefined,
      vote: undefined,
      amount: undefined
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
      options.proposalId
      , options.vote
      , amount
    );

    return new ArcTransactionResult(tx);
  }

  async vote(opts = {}) {

    const defaults = {
      proposalId: undefined,
      vote: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const tx = await this.contract.vote(
      options.proposalId
      , options.vote
    );

    return new ArcTransactionResult(tx);
  }

  async voteWithSpecifiedAmounts(opts = {}) {
    const defaults = {
      proposalId: undefined,
      vote: undefined,
      reputation: undefined
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
      options.proposalId
      , options.vote
      , options.reputation
      , 0
    );

    return new ArcTransactionResult(tx);
  }

  async redeem(opts = {}) {

    const defaults = {
      proposalId: undefined,
      beneficiary: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const tx = await this.contract.redeem(
      options.proposalId
      , options.beneficiary
    );

    return new ArcTransactionResult(tx);
  }

  async shouldBoost(opts = {}) {

    const defaults = {
      proposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const shouldBoost = await this.contract.shouldBoost(
      options.proposalId
    );

    return shouldBoost;
  }

  async getScore(opts = {}) {

    const defaults = {
      proposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const score = await this.contract.score(
      options.proposalId
    );

    // TODO: convert to number?
    return score;
  }

  async getThreshold(opts = {}) {

    const defaults = {
      avatar: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    const threshold = await this.contract.threshold(
      options.avatar
    );

    // TODO: convert to number?
    return threshold;
  }

  async getRedeemableTokensStaker(opts = {}) {

    const defaults = {
      proposalId: undefined,
      beneficiary: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const redeemAmount = await this.contract.redeemAmount(
      options.proposalId
      , options.beneficiary
    );

    return redeemAmount;
  }

  async getRedeemableReputationProposer(opts = {}) {

    const defaults = {
      proposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const reputation = await this.contract.redeemProposerReputation(
      options.proposalId
    );

    return reputation;
  }

  async getRedeemableTokensVoter(opts = {}) {

    const defaults = {
      proposalId: undefined,
      beneficiary: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const amount = await this.contract.redeemVoterAmount(
      options.proposalId
      , options.beneficiary
    );

    return amount;
  }

  async getRedeemableReputationVoter(opts = {}) {

    const defaults = {
      proposalId: undefined,
      beneficiary: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const reputation = await this.contract.redeemVoterReputation(
      options.proposalId
      , options.beneficiary
    );

    return reputation;
  }

  async getRedeemableReputationStaker(opts = {}) {

    const defaults = {
      proposalId: undefined,
      beneficiary: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.beneficiary) {
      throw new Error("beneficiary is not defined");
    }

    const reputation = await this.contract.redeemStakerRepAmount(
      options.proposalId
      , options.beneficiary
    );

    return reputation;
  }

  async getNumberOfChoices(opts = {}) {

    const defaults = {
      proposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const numOfChoices = await this.contract.getNumberOfChoices(
      options.proposalId
    );

    return numOfChoices.toNumber();
  }

  async getVoterInfo(opts = {}) {

    const defaults = {
      proposalId: undefined,
      voter: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.voter) {
      throw new Error("voter is not defined");
    }

    const result = await this.contract.voteInfo(
      options.proposalId
      , options.voter
    );

    return {
      vote: result[0].toNumber(),
      reputation: result[1]
    };
  }

  async getVotesStatus(opts = {}) {

    const defaults = {
      proposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const votes = await this.contract.votesStatus(
      options.proposalId
    );

    /**
     * an array of number counts for each vote choice
     */
    return votes;
  }

  async isVotable(opts = {}) {

    const defaults = {
      proposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const votable = await this.contract.isVotable(
      options.proposalId
    );

    return votable;
  }

  async getProposalStatus(opts = {}) {

    const defaults = {
      proposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const result = await this.contract.proposalStatus(
      options.proposalId
    );

    return {
      totalVotes: result[0],
      totalStakes: result[1],
      votersStakes: result[2]
    };
  }

  async getTotalReputationSupply(opts = {}) {

    const defaults = {
      proposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const supply = await this.contract.totalReputationSupply(
      options.proposalId
    );

    return supply;
  }

  async getProposalAvatar(opts = {}) {

    const defaults = {
      proposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const avatar = await this.contract.proposalAvatar(
      options.proposalId
    );

    return avatar;
  }

  async getScoreThresholdParams(opts = {}) {

    const defaults = {
      avatar: undefined,
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.avatar) {
      throw new Error("avatar is not defined");
    }

    const result = await this.contract.scoreThresholdParams(
      options.avatar
    );

    // TODO:  convert to number??  dunno what these values represent.
    return {
      thresholdConstA: result[0],
      thresholdConstB: result[1]
    };
  }

  async getStakerInfo(opts = {}) {

    const defaults = {
      proposalId: undefined,
      staker: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    if (!options.staker) {
      throw new Error("staker is not defined");
    }

    const result = await this.contract.staker(
      options.proposalId
      , options.staker
    );

    return {
      vote: result[0].toNumber(),
      stake: result[1]
    };
  }

  async getVoteStake(opts = {}) {
    const defaults = {
      proposalId: undefined,
      vote: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this._validateVote(options.vote, options.proposalId);

    const stake = await this.contract.voteStake(
      options.proposalId
      , options.vote
    );

    return stake;
  }

  async getWinningVote(opts = {}) {

    const defaults = {
      proposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const winningVote = await this.contract.winningVote(
      options.proposalId
    );

    return winningVote.toNumber();
  }

  async getState(opts = {}) {

    const defaults = {
      proposalId: undefined
    };

    const options = dopts(opts, defaults, { allowUnknown: true });

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    const state = await this.contract.state(
      options.proposalId
    );

    return state;
  }

  async _validateVote(vote, proposalId) {
    const numChoices = await this.getNumberOfChoices({ proposalId: proposalId });
    if (!Number.isInteger(vote) || (vote < 0) || (vote >= numChoices)) {
      throw new Error("vote is not valid");
    }
  }

  /**
   * Set the contract parameters.
   * @param {GenesisProtocolParams} params
   * @returns parameters hash
   */
  async setParams(params) {

    params = Object.assign({},
      {
        preBoostedVoteRequiredPercentage: 50,
        preBoostedVotePeriodLimit: 60,
        boostedVotePeriodLimit: 60,
        thresholdConstA: 1,
        thresholdConstB: 1,
        minimumStakingFee: 0,
        quietEndingPeriod: 0,
        proposingRepRewardConstA: 1,
        proposingRepRewardConstB: 1,
        stakerFeeRatioForVoters: 1,
        votersReputationLossRatio: 10,
        votersGainRepRatioFromLostRep: 80,
        governanceFormulasInterface: Utils.NULL_ADDRESS
      },
      params);

    if (params.proposingRepRewardConstB <= 0) {
      throw new Error("proposingRepRewardConstB must be greater than 0");
    }

    if ((params.preBoostedVoteRequiredPercentage <= 0) || (params.preBoostedVoteRequiredPercentage > 100)) {
      throw new Error("preBoostedVoteRequiredPercentage must be greater than 0 and less than or equal to 100");
    }

    return await super.setParams(
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
        params.votersGainRepRatioFromLostRep
      ],
      params.governanceFormulasInterface
    );
  }

  getDefaultPermissions(overrideValue) {
    return overrideValue || "0x00000001";
  }
}
