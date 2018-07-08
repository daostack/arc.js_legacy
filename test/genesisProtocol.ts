import { BigNumber } from "bignumber.js";
import { assert } from "chai";
import { BinaryVoteResult, Hash } from "../lib/commonTypes";
import { DAO, DaoSchemeInfo } from "../lib/dao";
import { ArcTransactionResult } from "../lib/iContractWrapperBase";
import { Utils } from "../lib/utils";
import {
  ExecutedGenesisProposal,
  ExecutionState,
  GenesisProtocolFactory,
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
  let executableTest: any;
  let ExecutableTest;

  const createProposal = async (): Promise<Hash> => {

    const result = await genesisProtocol.propose({
      avatarAddress: dao.avatar.address,
      executable: executableTest.address,
      numOfChoices: 2,
    });

    assert.isOk(result);
    assert.isOk(await result.getProposalIdFromMinedTx());

    return await result.getProposalIdFromMinedTx();
  };

  const voteProposal = (proposalId: Hash, how: number): Promise<ArcTransactionResult> => {
    return genesisProtocol.vote({
      proposalId,
      vote: how,
    });
  };

  const stakeProposalVote =
    (proposalId: Hash, how: number, amount: number): Promise<ArcTransactionResult> => {
      return genesisProtocol.stake({
        amount: web3.toWei(amount),
        proposalId,
        vote: how,
      });
    };

  beforeEach(async () => {

    ExecutableTest = await Utils.requireContract("ExecutableTest");

    dao = await helpers.forgeDao({
      founders: [{
        address: accounts[0],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(1000),
      },
      ],
      schemes: [
        { name: "GenesisProtocol" },
      ],
    });

    const scheme = await dao.getSchemes("GenesisProtocol") as Array<DaoSchemeInfo>;

    assert.isOk(scheme);
    assert.equal(scheme.length, 1);
    assert.equal(scheme[0].wrapper.name, "GenesisProtocol");

    genesisProtocol = await GenesisProtocolFactory.at(scheme[0].address);

    assert.isOk(genesisProtocol);

    executableTest = await ExecutableTest.deployed();
  });

  it("can get range of choices", async () => {
    const result = await await genesisProtocol.getAllowedRangeOfChoices();
    assert.equal(result.minVote, 2);
    assert.equal(result.maxVote, 2);
  });

  it("can set boostedVotePeriodLimit in dao.new", async () => {
    dao = await helpers.forgeDao({
      founders: [{
        address: accounts[0],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(1000),
      },
      ],
      schemes: [
        {
          boostedVotePeriodLimit: 180,
          name: "GenesisProtocol",
          quietEndingPeriod: 60,
        },
      ],
    });

    const scheme =
      (await helpers.getDaoScheme(dao, "GenesisProtocol", GenesisProtocolFactory)) as GenesisProtocolWrapper;

    const params = await scheme.getSchemeParameters(dao.avatar.address);

    assert.equal(params.boostedVotePeriodLimit, 180);
    assert.equal(params.quietEndingPeriod, 60);
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

    dao = await helpers.forgeDao({
      founders: [{
        address: accounts[0],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(1000),
      },
      ],
      schemes: [
        {
          name: "GenesisProtocol",
          votingMachineParams: {
            ownerVote: false,
          },
        },
      ],
    });

    const proposalId1 = await createProposal();

    const proposalId2 = await createProposal();

    const proposals = await genesisProtocol.VotableGenesisProtocolProposals(
      { _avatar: dao.avatar.address },
      { fromBlock: 0 }).get();

    assert(proposals.length === 2, "Should have found 2 proposals");
    assert(proposals.filter((p: GenesisProtocolProposal) => p.proposalId === proposalId1).length,
      "proposalId1 not found");
    assert(proposals.filter((p: GenesisProtocolProposal) => p.proposalId === proposalId2).length,
      "proposalId2 not found");

    assert(typeof proposals[0].numOfChoices === "number");
    assert.equal(proposals[0].state, ProposalState.PreBoosted, "state is wrong");
  });

  it("can get executed proposals", async () => {

    const proposalId1 = await createProposal();
    await voteProposal(proposalId1, 1);

    const proposalId2 = await createProposal();
    await voteProposal(proposalId2, 1);

    let proposals = await genesisProtocol.ExecutedProposals(
      { _avatar: dao.avatar.address },
      { fromBlock: 0 }).get();

    assert(proposals.length === 2, "Should have found 2 proposals");
    assert(proposals.filter((p: ExecutedGenesisProposal) => p.proposalId === proposalId1).length,
      "proposalId1 not found");
    assert(proposals.filter((p: ExecutedGenesisProposal) => p.proposalId === proposalId2).length,
      "proposalId2 not found");

    proposals = await genesisProtocol.ExecutedProposals(
      { _avatar: dao.avatar.address, _proposalId: proposalId2 },
      { fromBlock: 0 }).get();

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
        { name: "GenesisProtocol" },
        { name: "ContributionReward" },
        {
          name: "SchemeRegistrar",
          votingMachineParams: {
            ownerVote: false,
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
     * propose to remove ContributionReward.  It should get the ownerVote, then requiring just 30 more reps to execute.
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

    await votingMachine.vote({ vote: BinaryVoteResult.Yes, proposalId, onBehalfOf: accounts[0] });

    assert.isTrue(await helpers.voteWasExecuted(votingMachine, proposalId), "vote was not executed");
    assert.isFalse(await votingMachine.isVotable({ proposalId }), "Should not be votable");
  });

  it("can call getScoreThresholdParams", async () => {
    const result = await genesisProtocol.getScoreThresholdParams({
      avatar: dao.avatar.address,
    });
    assert.isOk(result);
    assert(result.thresholdConstA.eq((await GetDefaultGenesisProtocolParameters()).thresholdConstA));
    assert.equal(result.thresholdConstB, (await GetDefaultGenesisProtocolParameters()).thresholdConstB);
  });

  it("can call shouldBoost", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.shouldBoost({
      proposalId,
    });
    assert.equal(result, false);
  });

  it("can call getVoteStake", async () => {
    const proposalId = await createProposal();

    await stakeProposalVote(proposalId, 1, 10);

    const result = await genesisProtocol.getVoteStake({
      proposalId,
      vote: 1,
    });
    assert.equal(helpers.fromWei(result).toNumber(), 10);
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
    assert.equal(helpers.fromWei(result.totalVotes).toNumber(), 1000);
    assert.equal(result.totalStaked.toNumber(), 0);
    assert.equal(result.totalVoterStakes.toNumber(), 0);
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

    await genesisProtocol.stake({
      amount: web3.toWei(10),
      proposalId,
      vote: 1,
    });

    result = await genesisProtocol.getStakerInfo({
      proposalId,
      staker: accounts[0],
    });

    assert.isOk(result);
    assert.equal(result.vote, 1);
    assert.equal(helpers.fromWei(result.stake).toNumber(), 10);
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
    const result = await stakeProposalVote(proposalId, 1, 10);
    assert.isOk(result);
    assert.isOk(result.tx);
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

  it("can call getScore", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getScore({
      proposalId,
    });
    assert(typeof result !== "undefined");
  });

  it("can call getThreshold", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getThreshold({
      avatar: dao.avatar.address,
      proposalId,
    });
    assert(typeof result !== "undefined");
  });

  it("can call getRedeemableTokensStaker", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getRedeemableTokensStaker({
      beneficiaryAddress: accounts[0],
      proposalId,
    });
    assert(typeof result !== "undefined");
  });

  it("can call getRedeemableTokensStakerBounty", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getRedeemableTokensStakerBounty({
      beneficiaryAddress: accounts[0],
      proposalId,
    });
    assert(typeof result !== "undefined");
  });

  it("can call getRedeemableReputationProposer", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getRedeemableReputationProposer({
      proposalId,
    });
    assert(typeof result !== "undefined");
  });

  it("can call getRedeemableTokensVoter", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getRedeemableTokensVoter({
      beneficiaryAddress: accounts[0],
      proposalId,
    });
    assert(typeof result !== "undefined");
  });

  it("can call getRedeemableReputationVoter", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getRedeemableReputationVoter({
      beneficiaryAddress: accounts[0],
      proposalId,
    });
    assert(typeof result !== "undefined");
  });

  it("can call getRedeemableReputationStaker", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getRedeemableReputationStaker({
      beneficiaryAddress: accounts[0],
      proposalId,
    });
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

  it("can call getProposalAvatar", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getProposalAvatar({
      proposalId,
    });
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
      assert.equal(ex, "Error: avatar is not defined");
    }
  });

  it("cannot register new proposal with out of range numOfChoices", async () => {

    try {
      await genesisProtocol.propose({
        avatarAddress: dao.avatar.address,
        executable: executableTest.address,
        numOfChoices: 13,
      });
      assert(false, "Should have thrown validation exception");
    } catch (ex) {
      assert.equal(ex, "Error: numOfChoices cannot be greater than 2");
    }
  });
});
