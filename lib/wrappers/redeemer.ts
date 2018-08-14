"use strict";
import { BigNumber } from "bignumber.js";
import { Address, Hash } from "../commonTypes";
import { ContractWrapperBase } from "../contractWrapperBase";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import { ArcTransactionResult, IContractWrapperFactory } from "../iContractWrapperBase";
import { TxGeneratingFunctionOptions } from "../transactionService";
import { Web3EventService } from "../web3EventService";

export class RedeemerWrapper extends ContractWrapperBase {
  public name: string = "Redeemer";
  public friendlyName: string = "Redeemer";
  public factory: IContractWrapperFactory<RedeemerWrapper> = RedeemerFactory;

  /**
   * Redeems rewards for a ContributionReward proposal in a single transaction.
   * Calls execute on the proposal if it is not yet executed.
   * Redeems rewardable reputation and stake from the GenesisProtocol.
   * Redeem rewardable contribution proposal rewards.
   * @param options
   */
  public async redeem(options: RedeemerOptions & TxGeneratingFunctionOptions)
    : Promise<ArcTransactionResult> {

    if (!options.avatarAddress) {
      throw new Error("avatarAddress is not defined");
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("Redeemer.redeem", options);

    return this.wrapTransactionInvocation("Redeemer.redeem",
      options,
      this.contract.redeem,
      [options.proposalId, options.avatarAddress, options.beneficiaryAddress]
    );
  }

  /**
   * Returns the amounts that would be redeemed if `Redeemer.redeem` were invoked right now.
   * @param options
   */
  public async redeemables(options: RedeemerOptions)
    : Promise<RedeeemableResult> {

    if (!options.avatarAddress) {
      throw new Error("avatarAddress is not defined");
    }

    if (!options.beneficiaryAddress) {
      throw new Error("beneficiaryAddress is not defined");
    }

    if (!options.proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("Redeemer.redeem.call", options);

    const result = await this.contract.redeem.call(
      options.proposalId,
      options.avatarAddress,
      options.beneficiaryAddress)
      // correct for fake truffle promises
      .then((r: any): any => r)
      .catch((ex: Error) => {
        throw new Error(ex.message);
      });

    return {
      contributionRewardEther: result[3][2],
      contributionRewardExternalToken: result[3][3],
      contributionRewardNativeToken: result[3][1],
      contributionRewardReputation: result[3][0],
      daoStakingBountyPotentialReward: result[1][1],
      daoStakingBountyReward: result[1][0],
      proposalExecuted: result[2],
      proposalId: options.proposalId,
      proposerReputationAmount: result[0][4],
      stakerReputationAmount: result[0][1],
      stakerTokenAmount: result[0][0],
      voterReputationAmount: result[0][3],
      voterTokenAmount: result[0][2],
    };
  }
}

/**
 * defined just to add good type checking
 */
export class RedeemerFactoryType extends ContractWrapperFactory<RedeemerWrapper> {

  public async new(
    contributionRewardAddress: Address,
    genesisProtocolAddress: Address): Promise<RedeemerWrapper> {
    return super.new(contributionRewardAddress, genesisProtocolAddress);
  }
}

export const RedeemerFactory =
  new RedeemerFactoryType(
    "Redeemer",
    RedeemerWrapper,
    new Web3EventService()) as RedeemerFactoryType;

export interface RedeeemableResult {
  contributionRewardEther: boolean;
  contributionRewardExternalToken: boolean;
  contributionRewardNativeToken: boolean;
  contributionRewardReputation: boolean;
  daoStakingBountyReward: BigNumber;
  daoStakingBountyPotentialReward: BigNumber;
  proposalExecuted: boolean;
  proposalId: Hash;
  proposerReputationAmount: BigNumber;
  stakerReputationAmount: BigNumber;
  stakerTokenAmount: BigNumber;
  voterReputationAmount: BigNumber;
  voterTokenAmount: BigNumber;
}

export interface RedeemerOptions {
  avatarAddress: Address;
  beneficiaryAddress: Address;
  proposalId: Hash;
}

export interface RedeemerRedeemEventResult {
  _contributionRewardEther: boolean;
  _contributionRewardExternalToken: boolean;
  _contributionRewardNativeToken: boolean;
  _contributionRewardReputation: boolean;
  /**
   * indexed
   */
  _execute: boolean;
  _genesisProtocolRedeem: boolean;
  _genesisProtocolDaoBounty: boolean;
  _proposalId: Hash;
}
