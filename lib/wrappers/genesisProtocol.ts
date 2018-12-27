"use strict";
import { BigNumber } from "bignumber.js";
import ethereumjs = require("ethereumjs-abi");
import { AvatarService } from "../avatarService";
import {
  Address,
  BinaryVoteResult,
  Hash,
} from "../commonTypes";
import { ConfigService } from "../configService";
import { ContractWrapperFactory } from "../contractWrapperFactory";
import {
  ArcTransactionDataResult,
  ArcTransactionProposalResult,
  ArcTransactionResult,
  DecodedLogEntryEvent,
  IContractWrapperFactory,
  IVotingMachineWrapper,
  StandardSchemeParams,
} from "../iContractWrapperBase";
import { ProposalService } from "../proposalService";
import { TransactionService, TxGeneratingFunctionOptions } from "../transactionService";
import { Utils } from "../utils";
import { EntityFetcherFactory, EventFetcherFactory, Web3EventService } from "../web3EventService";
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
import { LoggingService } from "../loggingService";
import { UtilsInternal } from "../utilsInternal";
import { IntVoteInterfaceWrapper } from "./intVoteInterface";
import { StandardTokenFactory, StandardTokenWrapper } from "./standardToken";

export class GenesisProtocolWrapper extends IntVoteInterfaceWrapper
  implements IVotingMachineWrapper {

  public name: string = "GenesisProtocol";
  public friendlyName: string = "Genesis Protocol";
  public factory: IContractWrapperFactory<GenesisProtocolWrapper> = GenesisProtocolFactory;
  /**
   * Events
   */

  /* tslint:disable:max-line-length */
  public GPExecuteProposal: EventFetcherFactory<GPExecuteProposalEventResult>;
  public Stake: EventFetcherFactory<GpStakeEventResult>;
  public Redeem: EventFetcherFactory<GpRedeemEventResult>;
  public RedeemReputation: EventFetcherFactory<GpRedeemEventResult>;
  public RedeemDaoBounty: EventFetcherFactory<GpRedeemEventResult>;
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

    await this._validateVote(options.vote, options.proposalId);

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

    /**
     * approve immediate transfer of staked tokens to this scheme
     */
    if (autoApproveTransfer) {

      const stakingToken = await this.getStakingToken();

      const result = await stakingToken.approve({
        amount,
        spender: this.address,
        txEventContext: eventContext,
      });

      await result.watchForTxMined();
    }

    this.logContractFunctionCall("GenesisProtocol.stake", options);

    const tx = await this.sendTransaction(
      eventContext,
      this.contract.stake,
      [options.proposalId, options.vote, amount]);

    if (tx) {
      TransactionService.publishTxLifecycleEvents(eventContext, tx, this.contract);
    }

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

    await this._validateVote(options.vote, options.proposalId);

    const amount = new BigNumber(options.amount);

    if (amount.lte(0)) {
      throw new Error("amount must be > 0");
    }

    const stakingTokenAddress = await this.getStakingTokenAddress();
    const stakingToken = (await
      (await Utils.requireContract("ERC827Token")).at(stakingTokenAddress));

    if (!stakingToken) {
      throw new Error("GenesisProtocol.stakeWithApproval: token must implement ERC827Token");
    }

    const staker = await Utils.getDefaultAccount();
    const nonce = UtilsInternal.getRandomNumber();

    const web3 = await Utils.getWeb3();
    let signature;
    let signatureType;

    if ((web3.currentProvider as any).isMetaMask) {

      const msgParams = [
        {
          // Any string label you want
          name: "GenesisProtocolAddress",
          // Any valid solidity type
          type: "address",
          // The value to sign
          value: this.address,
        },
        {
          name: "ProposalId",
          type: "bytes32",
          value: options.proposalId,
        },
        {
          name: "Vote",
          type: "uint",
          value: options.vote,
        },
        {
          name: "AmountToStake",
          type: "uint",
          value: amount.toString(10),
        },
        {
          name: "Nonce",
          type: "uint",
          value: nonce,
        },
      ];

      const result: any = await promisify((callback: any) => web3.currentProvider.sendAsync(
        {
          from: staker,
          method: "eth_signTypedData",
          params: [msgParams, staker],
        } as any, callback))();

      if (result.error) {
        throw new Error(`stakeWithApproval: ${result.error.message}`);
      }

      signature = result.result;
      signatureType = 2;
    } else {
      const textMsg = "0x" + ethereumjs.soliditySHA3(
        ["address", "bytes32", "uint", "uint", "uint"],
        [this.address, options.proposalId, options.vote, amount.toString(10), nonce]
      ).toString("hex");
      signature = await promisify((callback: any) => web3.eth.sign(staker, textMsg, callback))();
      signatureType = 1;
    }

    const extraData = await this.contract.stakeWithSignature.request(
      options.proposalId,
      options.vote,
      amount.toString(10),
      nonce,
      signatureType,
      signature);

    this.logContractFunctionCall("GenesisProtocol.stakeWithApproval", options);

    /**
     * We are not using DaoTokenWrapper here because we can't be sure the stakingToken is one.
     * We only know it is ERC827Token, and have retrieved it above as such.
     */
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
   * Return the threshold that is required for a proposal to be shifted into the boosted state.
   * The computation depends on the current number of boosted proposals that were created for
   * this voting machine by the scheme at `schemeInfo.address` for the given `avatarAddress`
   * (`avatarAddress` is the `organizationAddress` given to the `propose` method),
   * and the GenesisProtocol parameters `thresholdConstA` and `thresholdConstB` which
   * are registered on behalf of the given scheme with an avatar's Controller,
   * keyed by the given `avatarAddress`.
   *
   * Thus `avatarAddress` must be an avatar address and this function will not work if
   * you pass for `avatarAddress` any other contract address than an avatar, even though
   * GenesisProtocol is capable of using those non-avatar contract addresses.
   * In those cases, when the organization is not an avatar, you must use `getThresholdFromProposal`
   * to obtain the threshold.
   *
   * Note that there will be a separately-scoped threshold for proposals created for this
   * voting machine by any other scheme than the one given.
   *
   * Note that for Arc.js schemes you can just pass an Arc.js contract wrapper for `schemeInfo`.
   */
  public async getThresholdForSchemeAndCreator(
    schemeInfo: ThresholdSchemeInfo,
    avatarAddress: Address): Promise<BigNumber> {

    if (!schemeInfo) {
      throw new Error("schemeAddress is not defined");
    }

    if (!avatarAddress) {
      throw new Error("avatarAddress is not defined");
    }

    const organizationId = this.organizationIdFromProposalCreator(schemeInfo.address, avatarAddress);

    const votingMachineInfo = await schemeInfo.getSchemeParameters(avatarAddress);

    if (!votingMachineInfo) {
      throw new Error("votingMachineInfo is null, avatarAddress may not be an avatar");
    }

    if (votingMachineInfo.votingMachineAddress !== this.address) {
      throw new Error("the scheme is not using this voting machine");
    }

    const votingMachineParamsHash = votingMachineInfo.voteParametersHash;

    if (UtilsInternal.isNullHash(votingMachineParamsHash)) {
      throw new Error("avatarAddress does not yield a parameters hash, may not be an avatar");
    }

    this.logContractFunctionCall("GenesisProtocol.threshold",
      { address: schemeInfo.address, avatarAddress, votingMachineParamsHash, organizationId });

    return this.contract.threshold(votingMachineParamsHash, organizationId);
  }
  /**
   * Return the threshold that is required for a proposal to be shifted into the boosted state.
   * The computation depends on the current number of boosted proposals that were created for
   * this voting machine by the scheme that created the given proposal,
   * and the GenesisProtocol parameters `thresholdConstA` and `thresholdConstB` which
   * are stored with the proposal.
   *
   * Note that there will be a separately-scoped threshold for proposals created for this
   * voting machine by any other scheme than the one that created the given proposal.
   */
  public async getThresholdFromProposal(proposalId: Hash): Promise<BigNumber> {

    if (!proposalId) {
      throw new Error("proposalId is not defined");
    }

    const proposal = await this.getProposal(proposalId);

    this.logContractFunctionCall("GenesisProtocol.threshold",
      { proposalId, parametersHash: proposal.paramsHash, organizationId: proposal.organizationId });

    return this.contract.threshold(proposal.paramsHash, proposal.organizationId);
  }

  /**
   * Returns a promise of the number of boosted proposals by the address of the scheme
   * that created the proposal and the "creator address" which is typically the avatar for proposals
   * created by the Arc universal schemes.
   * The count does not include those that have expired but have not yet
   * been executed to update their status.
   */
  public async getBoostedProposalsCount(
    schemeAddress: Address,
    creatorAddress: Address): Promise<BigNumber> {

    if (!schemeAddress) {
      throw new Error("schemeAddress is not defined");
    }

    if (!creatorAddress) {
      throw new Error("creatorAddress is not defined");
    }

    const organizationId = this.organizationIdFromProposalCreator(schemeAddress, creatorAddress);

    this.logContractFunctionCall("GenesisProtocol.getBoostedProposalsCount",
      { schemeAddress, creatorAddress, organizationId });

    return this.contract.getBoostedProposalsCount(organizationId);
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

    const stakingTokenBalance = await stakingToken.getBalanceOf(options.avatarAddress);

    const avatarService = new AvatarService(options.avatarAddress);

    const nativeToken = await avatarService.getNativeToken();

    const nativeTokenBalance = await nativeToken.getBalanceOf(options.avatarAddress);

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

    await this._validateVote(options.vote, options.proposalId);

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
   * Return the preBoosted votes, amount staked per vote, total staked and
   * total staked net voters' take for a given proposal
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
      preBoostedVotesNo: result[1],
      preBoostedVotesYes: result[0],
      stakesNo: result[5],
      stakesYes: result[4],
      totalStaked: result[3],
      totalStakerStakes: result[2],
    };
  }

  /**
   * For proposals created by Arc universal schemes, returns a promise of the address of the avatar
   * on whose behalf the proposal was created.  For proposals created by other schemes, the value
   * is defined by those contracts, but is expected to be an address.
   * @returns Promise<Address>
   */
  public async getProposalCreator(proposalId: Hash): Promise<Address> {

    if (!proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.getProposalOrganization", proposalId);

    const organizationId = await this.getProposalOrganizationId(proposalId);

    if (!organizationId) {
      throw new Error("the proposal is not found");
    }

    return this.contract.organizations(organizationId);
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

    this.logContractFunctionCall("GenesisProtocol.getStaker", options);

    const result = await this.contract.getStaker(
      options.proposalId,
      options.staker
    );

    return {
      stake: result[1],
      vote: result[0].toNumber(),
    };
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
      transformEventCallback: async (event: DecodedLogEntryEvent<NewProposalEventResult>)
        : Promise<GenesisProtocolProposal> => {
        return this.getProposal(event.args._proposalId);
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
        async (event: DecodedLogEntryEvent<ExecuteProposalEventResult>): Promise<ExecutedGenesisProposal> => {
          const proposal = await this.getProposal(event.args._proposalId);
          return Object.assign(proposal, {
            decision: event.args._decision.toNumber(),
            executionState: await this.getProposalExecutionState(proposal.proposalId),
            totalReputation: event.args._totalReputation,
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

  /**
   * Returns promise of a `GenesisProtocolProposal` for the given proposal id.
   * @param avatarAddress
   * @param proposalId
   */
  public async getProposal(proposalId: Hash): Promise<GenesisProtocolProposal> {
    const proposalParams = await this.contract.proposals(proposalId);
    const creatorAddress = await this.getProposalCreator(proposalId);
    return this.convertProposalPropsArrayToObject(proposalParams, proposalId, creatorAddress);
  }

  public async getParametersHash(params: GenesisProtocolParams): Promise<Hash> {

    params = Object.assign({},
      await GetDefaultGenesisProtocolParameters(),
      params);

    return this._getParametersHash(
      [
        params.preBoostedVoteRequiredPercentage || 0,
        params.preBoostedVotePeriodLimit,
        params.boostedVotePeriodLimit,
        params.thresholdConstA || 0,
        params.thresholdConstB || 0,
        params.minimumStakingFee || 0,
        params.quietEndingPeriod,
        params.proposingRepRewardConstA || 0,
        params.proposingRepRewardConstB || 0,
        params.stakerFeeRatioForVoters || 0,
        params.votersReputationLossRatio || 0,
        params.votersGainRepRatioFromLostRep || 0,
        params.daoBountyConst || 0,
        params.daoBountyLimit || 0,
      ],
      params.voteOnBehalf
    );
  }

  /**
   * Set the contract parameters.
   * @param {GenesisProtocolParams} params
   * @returns parameters hash
   */
  public async setParameters(
    params: GenesisProtocolParams & TxGeneratingFunctionOptions): Promise<ArcTransactionDataResult<Hash>> {

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
      ],
      params.voteOnBehalf
    );
  }

  public async getParameters(paramsHash: Hash): Promise<GetGenesisProtocolParamsResult> {
    const paramsArray = await this.getParametersArray(paramsHash);
    const params = {
      boostedVotePeriodLimit: paramsArray[2].toNumber(),
      minimumStakingFee: paramsArray[5],
      preBoostedVotePeriodLimit: paramsArray[1].toNumber(),
      preBoostedVoteRequiredPercentage: paramsArray[0].toNumber(),
      proposingRepRewardConstA: paramsArray[7].toNumber(),
      proposingRepRewardConstB: paramsArray[8].toNumber(),
      quietEndingPeriod: paramsArray[6].toNumber(),
      stakerFeeRatioForVoters: paramsArray[9].toNumber(),
      thresholdConstA: paramsArray[3],
      thresholdConstB: paramsArray[4].toNumber(),
      voteOnBehalf: paramsArray[12],
      votersGainRepRatioFromLostRep: paramsArray[11].toNumber(),
      votersReputationLossRatio: paramsArray[10].toNumber(),
    } as GetGenesisProtocolParamsResult;

    const bountyParamsArray = await this.contract.getDaoBountyParams(paramsHash);
    params.daoBountyConst = bountyParamsArray[0].toNumber();
    params.daoBountyLimit = bountyParamsArray[1];

    return params;
  }

  /**
   * Returns promise of the staking token as StandardTokenWrapper.
   * @returns Promise<StandardTokenWrapper>
   */
  public async getStakingToken(): Promise<StandardTokenWrapper> {
    const tokenAddress = await this.getStakingTokenAddress();
    // StandardToken includes `approve`, which is required for staking
    return StandardTokenFactory.at(tokenAddress);
  }

  /**
   * Returns promise of the staking token address.
   * @returns Promise<Address>
   */
  public async getStakingTokenAddress(): Promise<Address> {
    this.logContractFunctionCall("GenesisProtocol.stakingToken");
    return await this.contract.stakingToken();
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
    this.Stake = this.createEventFetcherFactory<GpStakeEventResult>(this.contract.Stake);
    this.Redeem = this.createEventFetcherFactory<GpRedeemEventResult>(this.contract.Redeem);
    this.RedeemReputation = this.createEventFetcherFactory<GpRedeemEventResult>(this.contract.RedeemReputation);
    this.RedeemDaoBounty = this.createEventFetcherFactory<GpRedeemEventResult>(this.contract.RedeemDaoBounty);
    /* tslint:enable:max-line-length */
  }

  /**
   * Returns a promise of the `organizationId`of the proposal.  This id is unique to the
   * contract that created the proposal and, in the case of Arc schemes, the avatar in which
   * the scheme is registered.  The value is included in `GenesisProtocolProposal`
   * and is returned by all of the voting machine events.  So you could use this value when filtering
   * events from a single avatar and contract registered with the avatar.
   */
  private async getProposalOrganizationId(proposalId: Hash): Promise<Hash> {

    if (!proposalId) {
      throw new Error("proposalId is not defined");
    }

    this.logContractFunctionCall("GenesisProtocol.getProposalOrganization", proposalId);

    return this.contract.getProposalOrganization(proposalId);
  }

  private convertProposalPropsArrayToObject(
    proposalArray: Array<any>,
    proposalId: Hash,
    creatorAddress: Address): GenesisProtocolProposal {
    return {
      boostedPhaseTime: proposalArray[5].toNumber(),
      creatorAddress,
      currentBoostedVotePeriodLimit: proposalArray[9].toNumber(),
      daoBountyRemain: proposalArray[11],
      numOfChoices: proposalArray[2].toNumber(),
      organizationId: proposalArray[0],
      paramsHash: proposalArray[10],
      proposalId,
      proposer: proposalArray[8],
      state: proposalArray[6].toNumber(),
      submittedTime: proposalArray[4].toNumber(),
      votersStakes: proposalArray[3],
      winningVote: proposalArray[7].toNumber(),
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
    /**
     * We always have to estimate gas here, regardless of the "estimateGas" config setting,
     * because truffle's default gas limit does not suffice
     */
    const estimate = await super.estimateConstructorGas(stakingTokenAddress);

    LoggingService.debug(`Instantiating GenesisProtocol with gas: ${estimate}`);

    return super.new(stakingTokenAddress, { gas: estimate });
  }
}

export const GenesisProtocolFactory =
  new GenesisProtocolFactoryType(
    "GenesisProtocol",
    GenesisProtocolWrapper,
    new Web3EventService()) as GenesisProtocolFactoryType;

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

export interface GpRedeemEventResult {
  /**
   * the amount redeemed
   */
  _amount: BigNumber;
  /**
   * indexed
   */
  _organization: Address;
  /**
   * indexed
   */
  _beneficiary: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
}

export interface GpStakeEventResult {
  _amount: BigNumber;
  /**
   * indexed
   */
  _organization: Address;
  /**
   * indexed
   */
  _proposalId: Hash;
  /**
   * The choice of vote
   */
  _vote: BigNumber;
  /**
   * indexed
   */
  _staker: Address;
}

export interface GenesisProtocolParams {
  /**
   * The time limit in seconds for a proposal to be in the boosted phase,
   * inclusive of the quietEndingPeriod, in seconds.
   * Default is 259200 (three days).
   */
  boostedVotePeriodLimit: number;
  /**
   * Multiple of a winning stake to be rewarded as bounty.
   * Must be greater than stakerFeeRatioForVoters and less than 2*stakerFeeRatioForVoters.
   * Default is 75.
   */
  daoBountyConst: number;
  /**
   * Upper bound on the total bounty amount on a proposal.
   * Default is 100, converted to Wei.
   */
  daoBountyLimit: BigNumber | string;
  /**
   * A floor on the staking fee which is normally computed using
   * [[GenesisProtocolParams.stakerFeeRatioForVoters]], in Wei.
   * Default is 0.
   */
  minimumStakingFee: BigNumber | string;
  /**
   * The time limit in seconds that a proposal can be in the preBoosted phase before
   * it will be automatically closed, in seconds, with a winning vote of NO, regardless
   * of the actual value of the winning vote at the time expiration.
   * Note an attempt must be made to execute before the proposal state will actually change.
   * Default is 1814400 (three weeks).
   */
  preBoostedVotePeriodLimit: number;
  /**
   * The percent of the DAO's total supply of reputation that, when exceeded
   * by the amount of reputation behind a vote (yes or no), will result
   * in the immediate execution of the proposal, during either the preboosted
   * or boosted phases.
   * Must be greater than zero and less than or equal to 100.
   * Default is 50.
   */
  preBoostedVoteRequiredPercentage: number;
  /**
   * Constant A in the calculation of the proposer's reputation reward.
   * Must be between 0 and 100000000.
   * Default is 5.
   */
  proposingRepRewardConstA: number;
  /**
   * Constant B in the calculation of the proposer's reputation reward.
   * Must be between 0 and 100000000.
   * Default is 5.
   */
  proposingRepRewardConstB: number;
  /**
   * The duration, in seconds, at the end of the boosted phase during which any vote that changes the
   * outcome of a proposal will cause the boosted phase to be extended by the amount
   * of the quietEndingPeriod.  If the quietEndingPeriod expires then the proposal
   * expires and may be executed.  It is a moving window:  If the winning vote switches during
   * the quietEndingPeriod then it restarts at the point in time when the vote switched, thus extending
   * the boosted period.
   * Default is 86400 (one day).
   */
  quietEndingPeriod: number;
  /**
   * For executed proposals, the percentage of staked tokens that is rewarded to all voters,
   * regardless of the vote outcome, the staked vote outcome, or how the voter voted.
   * Voters share this amount in proportion to the amount of reputation they voted.
   * Must be between 0 and 100.
   * Default is 50.
   */
  stakerFeeRatioForVoters: number;
  /**
   * Constant A in the threshold calculation, in Wei. See [[GenesisProtocolWrapper.getThreshold]].
   * If the difference between Yes and No votes exceeds the threshold, then the
   * proposal may be boosted.
   * Must be between 0 and 100000000 (converted to Wei).
   * Default is 7, converted to Wei.
   */
  thresholdConstA: BigNumber | string;
  /**
   * Constant B in the threshold calculation. See [[GenesisProtocolWrapper.getThreshold]].
   * If the difference between Yes and No votes exceeds the threshold, then the
   * proposal may be boosted.
   * Must be greater than zero and less than or equal to 100000000.
   * Default is 3.
   */
  thresholdConstB: number;
  /**
   * optional, to always vote on behalf of the given account.  Otherwise is `msg.sender`.
   */
  voteOnBehalf?: Address;
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
  boostedVotePeriodLimit: number;
  daoBountyConst: number;
  daoBountyLimit: BigNumber;
  minimumStakingFee: BigNumber;
  preBoostedVotePeriodLimit: number;
  preBoostedVoteRequiredPercentage: number;
  proposingRepRewardConstA: number;
  proposingRepRewardConstB: number;
  quietEndingPeriod: number;
  stakerFeeRatioForVoters: number;
  thresholdConstA: BigNumber;
  thresholdConstB: number;
  voteOnBehalf: Address;
  votersGainRepRatioFromLostRep: number;
  votersReputationLossRatio: number;
}

export interface GetVoterInfoResult {
  vote: number;
  reputation: BigNumber;
}

export interface GetProposalStatusResult {
  /**
   * Number of preboosted votes against
   */
  preBoostedVotesNo: BigNumber;
  /**
   * Number of preboosted votes for
   */
  preBoostedVotesYes: BigNumber;
  /**
   * Number of staking tokens staked against
   */
  stakesNo: BigNumber;
  /**
   * Number of staking tokens staked for
   */
  stakesYes: BigNumber;
  /**
   * Number of staking tokens currently redeemable by stakers
   */
  totalStakerStakes: BigNumber;
  /**
   * Total number of staking tokens currently redeemable by everyone
   */
  totalStaked: BigNumber;
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
    voteOnBehalf: Utils.NULL_ADDRESS,
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
  /**
   * This is what will appear as `_organization` in voting machine events.
   * It is the value passed to `propose` as the optional argument: `organizationAddress`.
   * If this argument is set to zero in `propose` then the value will be the msg.sender.
   * With proposals created by Arc universal schemes (like GenesisProtocol), this is the avatar address.
   */
  creatorAddress: Address;
  /**
   * in seconds
   */
  boostedPhaseTime: number;
  /**
   * The amount of time, in seconds, that the proposal can remain in the boosted phase
   * (assuming the proposal has reached the boosted phase).
   */
  currentBoostedVotePeriodLimit: number;
  /**
   * The amount of bounty remaining that can be redeemed on the given proposal.
   */
  daoBountyRemain: BigNumber;
  /**
   * The number of voting choices.  For GenesisProtocol this is always 2 (YES and NO).
   */
  numOfChoices: number;
  /**
   * A hash is unique to the contract that created the proposal and, in the case of Arc schemes,
   * the avatar in which the scheme is registered.
   */
  organizationId: Hash;
  /**
   * The parameters of the registered `GenesisProtocol` used to create the proposal.
   */
  paramsHash: Hash;
  proposalId: Hash;
  /**
   * address of the account the submitted the proposal
   */
  proposer: Address;
  /**
   * current phase in a proposal life-cycle
   */
  state: ProposalState;
  /**
   * in seconds
   */
  submittedTime: number;
  /**
   * the amount of staked GEN receivable by preboosted voters
   */
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

/**
 * Input to `GenesisProtocolWrapper.getThresholdForSchemeAndCreator`.  Provides info about a
 * proposal-creating scheme that is generating proposals using GenesisProtocol.
 */
export interface ThresholdSchemeInfo {
  /**
   * address of the scheme
   */
  address: Address;
  /**
   * Returns promise of a `StandardSchemeParams` as the referenced scheme's parameters, as registered
   * with the given avatar address.
   * @param avatarAddress
   */
  getSchemeParameters(avatarAddress: Address): Promise<StandardSchemeParams>;
}
