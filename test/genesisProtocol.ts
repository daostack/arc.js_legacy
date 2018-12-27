import { BigNumber } from "bignumber.js";
import { assert } from "chai";
import { Address, BinaryVoteResult, Hash } from "../lib/commonTypes";
import { DAO, DaoSchemeInfo } from "../lib/dao";
import { ArcTransactionResult } from "../lib/iContractWrapperBase";
import { TransactionReceiptsEventInfo, TransactionService } from "../lib/transactionService";
import { Utils } from "../lib/utils";
import { UtilsInternal } from "../lib/utilsInternal";
import { Web3EventService } from "../lib/web3EventService";
import { ContributionRewardWrapper } from "../lib/wrappers/contributionReward";
import {
  ExecutedGenesisProposal,
  ExecutionState,
  GenesisProtocolFactory,
  GenesisProtocolParams,
  GenesisProtocolProposal,
  GenesisProtocolWrapper,
  GetDefaultGenesisProtocolParameters,
  ProposalState,
} from "../lib/wrappers/genesisProtocol";
import { SchemeRegistrarFactory, SchemeRegistrarWrapper } from "../lib/wrappers/schemeRegistrar";
import { WrapperService } from "../lib/wrapperService";
import * as helpers from "./helpers";

describe("GenesisProtocol", () => {
  let dao: DAO;
  let genesisProtocol: GenesisProtocolWrapper;
  let gpParams: GenesisProtocolParams;
  let gpParamsHash: Hash;
  let contributionReward: ContributionRewardWrapper;

  const sufficientStake = async (proposalId: Hash, amount: number): Promise<BigNumber> => {
    return (await genesisProtocol.getThresholdFromProposal(proposalId)).add(web3.toWei(amount));
  };

  const createProposal = async (): Promise<Hash> => {

    const result = await contributionReward.proposeContributionReward({
      avatar: dao.avatar.address,
      beneficiaryAddress: helpers.SOME_ADDRESS,
      description: "A new contribution",
      numberOfPeriods: 1,
      periodLength: 1,
      reputationChange: "1",
    });

    assert.isOk(result);
    const proposalId = await result.getProposalIdFromMinedTx();
    assert.isOk(proposalId);

    return proposalId;
  };

  const voteProposal = (proposalId: Hash, how: number): Promise<ArcTransactionResult> => {
    return genesisProtocol.vote({
      proposalId,
      vote: how,
    });
  };

  const stakeProposalVote =
    async (proposalId: Hash, how: number, amount: BigNumber | string): Promise<ArcTransactionResult> => {

      return genesisProtocol.stake({
        amount,
        proposalId,
        vote: how,
      });
    };

  beforeEach(async () => {

    dao = await helpers.forgeDao({
      founders: [{
        address: accounts[0],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(1000),
      },
      ],
      schemes: [
        {
          name: "ContributionReward",
          votingMachineParams: {
            votingMachineName: "GenesisProtocol",
          },
        },
      ],
    });

    const scheme = await dao.getSchemes("ContributionReward") as Array<DaoSchemeInfo>;

    assert.isOk(scheme);
    assert.equal(scheme.length, 1);
    assert.equal(scheme[0].wrapper.name, "ContributionReward");

    contributionReward = scheme[0].wrapper as ContributionRewardWrapper;

    const gpAddress = await (contributionReward).getVotingMachineAddress(dao.avatar.address);

    genesisProtocol = await WrapperService.factories.GenesisProtocol.at(gpAddress);

    gpParams = await GetDefaultGenesisProtocolParameters();
    gpParamsHash = await genesisProtocol.getParametersHash(gpParams);

    assert.isOk(genesisProtocol);
  });

  it("can get parameters", async () => {
    const paramsHash = (await genesisProtocol.getParametersHash(gpParams));

    const params = await genesisProtocol.getParameters(paramsHash);

    assert.equal(params.preBoostedVotePeriodLimit, 1814400, "preBoostedVotePeriodLimit is not correct");
    assert.equal(params.stakerFeeRatioForVoters, 50, "stakerFeeRatioForVoters is not correct");
    assert.equal(params.boostedVotePeriodLimit, 259200, "boostedVotePeriodLimit is not correct");
    assert.equal(params.daoBountyConst, 75, "daoBountyConst is not correct");
    assert(params.daoBountyLimit.eq(web3.toWei(100)), "daoBountyLimit is not correct");
    assert(params.minimumStakingFee.eq(web3.toWei(0)), "minimumStakingFee is not correct");
    assert.equal(params.preBoostedVoteRequiredPercentage, 50, "preBoostedVoteRequiredPercentage is not correct");
    assert.equal(params.proposingRepRewardConstA, 5, "proposingRepRewardConstA is not correct");
    assert.equal(params.proposingRepRewardConstB, 5, "proposingRepRewardConstB is not correct");
    assert.equal(params.quietEndingPeriod, 86400, "quietEndingPeriod is not correct");
    assert(params.thresholdConstA.eq(web3.toWei(7)), "thresholdConstA is not correct");
    assert.equal(params.thresholdConstB, 3, "thresholdConstB is not correct");
    assert.equal(params.voteOnBehalf, helpers.NULL_ADDRESS, "voteOnBehalf is not correct");
    assert.equal(params.votersGainRepRatioFromLostRep, 80, "votersGainRepRatioFromLostRep is not correct");
    assert.equal(params.votersReputationLossRatio, 1, "votersReputationLossRatio is not correct");
  });

  it("can set parameters", async () => {

    const modifiedGpParams = Object.assign(gpParams, {
      daoBountyConst: 55,
      voteOnBehalf: helpers.SOME_ADDRESS,
    });

    const paramsHashSet = (await genesisProtocol.setParameters(modifiedGpParams)).result;

    const paramsHashGet = await genesisProtocol.getParametersHash(modifiedGpParams);

    assert.equal(paramsHashGet, paramsHashSet, "Hashes are not the same");

    const params = await genesisProtocol.getParameters(paramsHashGet);

    assert.equal(params.voteOnBehalf, helpers.SOME_ADDRESS, "voteOnBehalf is not correct");

  });

  it("can get params hash", async () => {

    const paramsHashSet = (await genesisProtocol.setParameters(gpParams)).result;

    const paramsHashGet = await genesisProtocol.getParametersHash(gpParams);

    assert.equal(paramsHashGet, paramsHashSet, "Hashes are not the same");
  });

  it("can call stakeWithApproval", async () => {
    const proposalId = await createProposal();

    const web3EventService = new Web3EventService();
    const stakingToken = await genesisProtocol.getStakingToken();
    const transferFetcher = web3EventService
      .createEventFetcherFactory<{ to: Address, from: Address, value: BigNumber }>(stakingToken.Transfer)(
        { from: accounts[0] }, { fromBlock: 0 });
    let transferEvents = await transferFetcher.get();
    const transfersBefore = transferEvents.length;

    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.GenesisProtocol.stakeWithApproval.mined"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    const stakeAmount = await sufficientStake(proposalId, 1);

    try {
      const result = await (await genesisProtocol.stakeWithApproval({
        amount: stakeAmount,
        proposalId,
        vote: BinaryVoteResult.Yes,
      })).watchForTxMined();

      assert.isOk(result);
      assert.isOk(result.transactionHash);
    } finally {
      await subscription.unsubscribe(0);
    }

    transferEvents = await transferFetcher.get();
    const transfersAfter = transferEvents.length;
    assert.equal(transfersBefore + 1, transfersAfter, "should be one more transfer event");
    assert(transferEvents[transfersAfter - 1].args.value.eq(stakeAmount));
    assert.equal(transferEvents[transfersAfter - 1].args.to.toString(), genesisProtocol.address);

    const stakeFetcher = genesisProtocol.Stake({ _proposalId: proposalId }, { fromBlock: 0 });
    const stakeEvents = await stakeFetcher.get();
    assert.equal(stakeEvents.length, 1, "should be one Stake event");

    assert.equal(eventsReceived.length, 1, "didn't receive the right number of txTracking events");
  });

  it("can call stakeWithApproval a second time", async () => {
    const proposalId = await createProposal();

    const stakeAmount = await sufficientStake(proposalId, 1);

    const result = await genesisProtocol.stakeWithApproval({
      amount: stakeAmount,
      proposalId,
      vote: BinaryVoteResult.Yes,
    });

    assert.isOk(result);
    assert.isOk(result.tx);
  });

  it("can get range of choices", async () => {
    const result = await await genesisProtocol.getAllowedRangeOfChoices();
    assert.equal(result.minVote, 2);
    assert.equal(result.maxVote, 2);
  });

  it("can call getTokenBalances", async () => {
    const stakingToken = await genesisProtocol.getStakingToken();

    await helpers.transferTokensToDao(dao, 15, accounts[0], dao.token);
    await helpers.transferTokensToDao(dao, 25, accounts[0], stakingToken);

    const result = await genesisProtocol.getTokenBalances({
      avatarAddress: dao.avatar.address,
    });

    assert.equal(result.nativeToken.address, dao.token.address, "wrong nativeToken");
    assert.equal(result.stakingToken.address, stakingToken.address, "wrong stakingToken");
    assert(result.nativeTokenBalance.eq(web3.toWei(15)),
      `nativeTokenBalance is wrong: ${result.nativeTokenBalance}`);
    assert(result.stakingTokenBalance.eq(web3.toWei(25)),
      `stakingTokenBalance is wrong: ${result.stakingTokenBalance}`);
  });

  it("can get votable proposals", async () => {

    const startingBlock = await UtilsInternal.lastBlockNumber();

    const proposalId1 = await createProposal();

    const proposalId2 = await createProposal();

    const proposals = await genesisProtocol.VotableGenesisProtocolProposals(
      { _avatar: dao.avatar.address },
      { fromBlock: startingBlock }).get();

    assert.equal(proposals.length, 2, "Should have found 2 proposals");
    assert(proposals.filter((p: GenesisProtocolProposal) => p.proposalId === proposalId1).length,
      "proposalId1 not found");
    assert(proposals.filter((p: GenesisProtocolProposal) => p.proposalId === proposalId2).length,
      "proposalId2 not found");

    assert(typeof proposals[0].numOfChoices === "number");
    assert.equal(proposals[0].state, ProposalState.PreBoosted, "state is wrong");
  });

  it("can get executed proposals", async () => {

    const startingBlock = await UtilsInternal.lastBlockNumber();

    const proposalId1 = await createProposal();
    await voteProposal(proposalId1, 1);

    const proposalId2 = await createProposal();
    await voteProposal(proposalId2, 1);

    let proposals = await genesisProtocol.ExecutedProposals(
      { _avatar: dao.avatar.address },
      { fromBlock: startingBlock }).get();

    assert(proposals.length === 2, "Should have found 2 proposals");
    assert(proposals.filter((p: ExecutedGenesisProposal) => p.proposalId === proposalId1).length,
      "proposalId1 not found");
    assert(proposals.filter((p: ExecutedGenesisProposal) => p.proposalId === proposalId2).length,
      "proposalId2 not found");

    proposals = await genesisProtocol.ExecutedProposals(
      { _avatar: dao.avatar.address, _proposalId: proposalId2 },
      { fromBlock: startingBlock }).get();

    assert.equal(proposals.length, 1, "Should have found 1 proposals");
    assert(proposals[0].proposalId === proposalId2, "proposalId2 not found");
    assert.isOk(proposals[0].totalReputation, "totalReputation not set properly on proposal");
    assert.equal(proposals[0].decision, 1, "decision is wrong");
    assert.equal(proposals[0].state, ProposalState.Executed, "state is wrong");
    assert.equal(proposals[0].executionState, ExecutionState.PreBoostedBarCrossed, "executionState is wrong");
  });

  it("scheme can use GenesisProtocol", async () => {

    dao = await helpers.forgeDao({
      founders: [{
        address: accounts[0],
        reputation: web3.toWei(1001),
        tokens: web3.toWei(1000),
      },
      {
        address: accounts[1],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(1000),
      }],
      schemes: [
        { name: "ContributionReward" },
        {
          name: "SchemeRegistrar",
          votingMachineParams: {
            votingMachineName: "GenesisProtocol",
          },
        },
      ],
    });

    const schemeToDelete = (await dao.getSchemes("ContributionReward"))[0].address;
    assert.isOk(schemeToDelete);

    const schemeRegistrar = await helpers.getDaoScheme(
      dao,
      "SchemeRegistrar",
      SchemeRegistrarFactory) as SchemeRegistrarWrapper;

    assert.isOk(schemeRegistrar);
    /**
     * propose to remove ContributionReward.
     */
    const result = await schemeRegistrar.proposeToRemoveScheme(
      {
        avatar: dao.avatar.address,
        schemeAddress: schemeToDelete,
      });

    assert.isOk(await result.getProposalIdFromMinedTx());

    /**
     * get the voting machine to use to vote for this proposal
     */
    const votingMachine = await helpers.getSchemeVotingMachine(dao, schemeRegistrar);
    const votingMachineWrapper = WrapperService.wrappersByAddress.get(votingMachine.address);

    assert.isOk(votingMachine);
    assert.equal(votingMachine.constructor.name,
      "IntVoteInterfaceWrapper", "schemeRegistrar is not based on IntVoteInterfaceWrapper");
    assert.equal(votingMachineWrapper.constructor.name,
      "GenesisProtocolWrapper", "schemeRegistrar is not using GenesisProtocol");
    assert.equal(votingMachineWrapper.address,
      WrapperService.wrappers.GenesisProtocol.address,
      "voting machine address is not that of GenesisProtocol");

    const proposalId = await result.getProposalIdFromMinedTx();

    assert.isFalse(await helpers.voteWasExecuted(votingMachine, proposalId), "Should not have been executed");
    assert.isTrue(await votingMachine.isVotable({ proposalId }), "Should be votable");

    await helpers.vote(votingMachine, proposalId, BinaryVoteResult.Yes, accounts[0]);

    assert.isTrue(await helpers.voteWasExecuted(votingMachine, proposalId), "vote was not executed");
    assert.isFalse(await votingMachine.isVotable({ proposalId }), "Should not be votable");
  });

  it("can call shouldBoost", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.shouldBoost({
      proposalId,
    });
    assert.equal(result, false);
  });

  it("can call getVoteStatus", async () => {
    const proposalId = await createProposal();

    let result = await genesisProtocol.getVoteStatus({
      proposalId,
      vote: 1,
    });
    assert.equal(result.toNumber(), 0);

    await voteProposal(proposalId, 1);

    result = await genesisProtocol.getVoteStatus({
      proposalId,
      vote: 1,
    });

    assert.equal(helpers.fromWei(result).toNumber(), 1000);
  });

  it("can call getProposalStatus", async () => {
    const proposalId = await createProposal();

    await voteProposal(proposalId, 1);

    const result = await genesisProtocol.getProposalStatus({
      proposalId,
    });

    assert.isOk(result);
    assert.equal(web3.fromWei(result.preBoostedVotesYes).toNumber(), 1000);
    assert.equal(web3.fromWei(result.preBoostedVotesNo).toNumber(), 0);
    assert.equal(web3.fromWei(result.totalStaked).toNumber(), 0);
    assert.equal(web3.fromWei(result.totalStakerStakes).toNumber(), 0);
    assert.equal(web3.fromWei(result.stakesNo).toNumber(), 0);
    assert.equal(web3.fromWei(result.stakesYes).toNumber(), 0);
  });

  it("can call getStakerInfo", async () => {
    const proposalId = await createProposal();
    let result = await genesisProtocol.getStakerInfo({
      proposalId,
      staker: accounts[0],
    });

    assert.isOk(result);
    assert.equal(result.vote, 0);
    assert.equal(result.stake.toNumber(), 0);

    const amountStaked = await sufficientStake(proposalId, 10);

    await stakeProposalVote(proposalId, 1, amountStaked);

    result = await genesisProtocol.getStakerInfo({
      proposalId,
      staker: accounts[0],
    });

    assert.isOk(result);
    assert.equal(result.vote, 1);
    assert(result.stake.eq(amountStaked));
  });

  it("can call getVoterInfo", async () => {
    const proposalId = await createProposal();
    let result = await genesisProtocol.getVoterInfo({
      proposalId,
      voter: accounts[0],
    });
    assert.isOk(result);
    assert.equal(result.vote, 0);
    assert.equal(result.reputation.toNumber(), 0);

    await voteProposal(proposalId, 1);

    result = await genesisProtocol.getVoterInfo({
      proposalId,
      voter: accounts[0],
    });

    assert.isOk(result);
    assert.equal(result.vote, 1);
    assert.equal(helpers.fromWei(result.reputation).toNumber(), 1000);
  });

  it("can call stake", async () => {
    const proposalId = await createProposal();
    const eventsReceived = new Array<string>();

    const subscription = TransactionService.subscribe(
      ["TxTracking.GenesisProtocol.stake.mined", "TxTracking.StandardToken.approve.mined"],
      (topic: string, txEventInfo: TransactionReceiptsEventInfo) => {
        eventsReceived.push(topic);
      });

    try {
      const amountStaked = await sufficientStake(proposalId, 10);
      const result = await (await stakeProposalVote(proposalId, 1, amountStaked)).watchForTxMined();
      assert.isOk(result);
      assert.isOk(result.transactionHash);

      const resultStatus = await genesisProtocol.getProposalStatus({
        proposalId,
      });

      assert.isOk(resultStatus);
      assert(resultStatus.totalStaked.eq(amountStaked));
      assert(resultStatus.stakesYes.eq(amountStaked));
      assert(resultStatus.totalStakerStakes.eq(amountStaked.div(2)));
      assert(resultStatus.stakesNo.eq(0));

    } finally {
      await subscription.unsubscribe(0);
    }
    assert.equal(eventsReceived.length, 3, "didn't receive the right number of txTracking events");
  });

  it("can call vote", async () => {
    const proposalId = await createProposal();
    const result = await voteProposal(proposalId, 1);
    assert.isOk(result);
    assert.isOk(result.tx);

    const voteResult = await genesisProtocol.getVoterInfo({
      proposalId,
      voter: accounts[0],
    });

    assert.isOk(result);
    assert.equal(voteResult.vote, 1);
    assert.equal(helpers.fromWei(voteResult.reputation).toNumber(), 1000);
  });

  it("can call voteWithSpecifiedAmounts", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.voteWithSpecifiedAmounts({
      proposalId,
      reputation: web3.toWei(10),
      vote: 1,
    });
    assert.isOk(result);
    assert.isOk(result.tx);

    const voteResult = await genesisProtocol.getVoterInfo({
      proposalId,
      voter: accounts[0],
    });

    assert.isOk(result);
    assert.equal(voteResult.vote, 1);
    assert.equal(helpers.fromWei(voteResult.reputation).toNumber(), 10);
  });

  it("can call redeem", async () => {
    const proposalId = await createProposal();

    await voteProposal(proposalId, 1);

    const result = await genesisProtocol.redeem({
      beneficiaryAddress: accounts[0],
      proposalId,
    });
    assert.isOk(result);
    assert.isOk(result.tx);
  });

  it("can call redeemDaoBounty", async () => {
    const proposalId = await createProposal();

    await voteProposal(proposalId, 1);

    const result = await genesisProtocol.redeemDaoBounty({
      beneficiaryAddress: accounts[0],
      proposalId,
    });
    assert.isOk(result);
    assert.isOk(result.tx);
  });

  it("can call getBoostedProposalsCount", async () => {

    const count1 = await genesisProtocol.getBoostedProposalsCount(
      contributionReward.address,
      dao.avatar.address
    );

    assert(typeof count1 !== "undefined");

    const proposalId = await createProposal();

    const amountStaked = await sufficientStake(proposalId, 10);

    await stakeProposalVote(proposalId, BinaryVoteResult.Yes, amountStaked);

    const count2 = await genesisProtocol.getBoostedProposalsCount(
      contributionReward.address,
      dao.avatar.address);

    assert(typeof count2 !== "undefined");

    assert((count2.sub(count1)).eq(1));
  });

  it("can call getScore", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getScore({
      proposalId,
    });
    assert(typeof result !== "undefined");
  });

  it("can call getThresholdFromProposal", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getThresholdFromProposal(proposalId);
    assert(typeof result !== "undefined");
  });

  it("can call getThresholdForSchemeAndCreator", async () => {
    const result = await genesisProtocol.getThresholdForSchemeAndCreator(
      contributionReward,
      dao.avatar.address);
    assert(typeof result !== "undefined");
  });

  it("can call getNumberOfChoices", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getNumberOfChoices({
      proposalId,
    });
    assert.equal(result, 2);
  });

  it("can call isVotable", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.isVotable({
      proposalId,
    });
    assert.equal(result, true);
  });

  it("can call getProposalCreator", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getProposalCreator(proposalId);
    assert.equal(result, dao.avatar.address);
  });

  it("can call getWinningVote", async () => {
    const proposalId = await createProposal();

    await voteProposal(proposalId, 1);

    const result = await genesisProtocol.getWinningVote({
      proposalId,
    });
    assert.equal(result, 1);
  });

  it("can call getState", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getState({
      proposalId,
    });
    assert.equal(result, 3); // PreBoosted
  });

  it("can do new", async () => {
    const scheme = await GenesisProtocolFactory.new(Utils.NULL_ADDRESS);
    assert.isOk(scheme);
  });

  it("can do deployed", async () => {
    const scheme = await GenesisProtocolFactory.deployed();
    assert.equal(scheme.address, WrapperService.wrappers.GenesisProtocol.address);
  });

  it("can register new proposal", async () => {
    await createProposal();
  });

  it("cannot register new proposal with no params", async () => {

    try {
      await genesisProtocol.propose({} as any);
      assert(false, "Should have thrown validation exception");
    } catch (ex) {
      assert.equal(ex, "Error: numOfChoices must be a number");
    }
  });

  it("cannot register new proposal with out of range numOfChoices", async () => {

    try {
      await genesisProtocol.propose({
        numOfChoices: 13,
        organizationAddress: helpers.SOME_ADDRESS,
        proposalParameters: gpParamsHash,
        proposerAddress: helpers.SOME_ADDRESS,
      });
      assert(false, "Should have thrown validation exception");
    } catch (ex) {
      assert.equal(ex, "Error: numOfChoices cannot be greater than 2");
    }
  });
});
