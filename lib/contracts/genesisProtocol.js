"use strict";
const dopts = require("default-options");

import { ExtendTruffleContract, ArcTransactionProposalResult } from "../ExtendTruffleContract";
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
      proposer: accounts[0],
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
