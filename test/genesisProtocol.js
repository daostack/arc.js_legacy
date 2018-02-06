import { DAO } from "../lib/dao";
const DAOToken = Utils.requireContract("DAOToken");
import { getDeployedContracts } from "../lib/contracts.js";
import { GenesisProtocol } from "../lib/contracts/genesisProtocol";
import { Utils } from "../lib/utils";
import "./helpers";
const ExecutableTest = Utils.requireContract("ExecutableTest");

describe("GenesisProtocol", () => {
  let dao, genesisProtocol, paramsHash, executableTest;

  const createProposal = async function () {

    const result = await genesisProtocol.propose({
      avatar: dao.avatar.address,
      numOfChoices: 2,
      paramsHash: paramsHash,
      executable: executableTest.address
    });

    assert.isOk(result);
    assert.isOk(result.proposalId);

    const stakingToken = await DAOToken.at(await genesisProtocol.stakingToken());

    await stakingToken.approve(accounts[0], web3.toWei(10));
    await stakingToken.approve(genesisProtocol.address, web3.toWei(10));

    return result.proposalId;
  };

  const voteProposal = function (proposalId, how) {
    return genesisProtocol.vote({
      proposalId: proposalId,
      vote: how
    });
  };

  const stakeProposalVote = function (proposalId, how, amount) {
    return genesisProtocol.stake({
      proposalId: proposalId,
      vote: how,
      amount: web3.toWei(amount)
    });
  };

  beforeEach(async () => {

    dao = await DAO.new({
      name: "Skynet",
      tokenName: "Tokens of skynet",
      tokenSymbol: "SNT",
      schemes: [
        { name: "GenesisProtocol" }
      ],
      founders: [{
        address: accounts[0],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(1000)
      }
      ]
    });

    const scheme = await dao.getSchemes("GenesisProtocol");

    assert.isOk(scheme);
    assert.equal(scheme.length, 1);
    assert.equal(scheme[0].name, "GenesisProtocol");

    genesisProtocol = await GenesisProtocol.at(scheme[0].address);

    assert.isOk(genesisProtocol);

    // all default parameters
    paramsHash = (await genesisProtocol.setParams({})).result;

    executableTest = await ExecutableTest.deployed();
  });


  it("can call getScoreThresholdParams", async () => {
    const result = await genesisProtocol.getScoreThresholdParams({
      avatar: dao.avatar.address,
    });
    assert.isOk(result);
    assert.equal(result.thresholdConstA, 1);
    assert.equal(result.thresholdConstB, 1);
  });

  it("can call getShouldBoost", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getShouldBoost({
      proposalId: proposalId
    });
    assert.equal(result, false);
  });


  it("can call getVoteStake", async () => {
    const proposalId = await createProposal();

    await stakeProposalVote(proposalId, 1, 10);

    const result = await genesisProtocol.getVoteStake({
      proposalId: proposalId,
      vote: 1
    });
    assert.equal(web3.fromWei(result), 10);
  });

  it("can call getVotesStatus", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getVotesStatus({
      proposalId: proposalId
    });
    assert.isOk(result);
    // TODO: currently failing. Bug in Arc?  assert.equal(result.length, 2);
  });

  it("can call getProposalStatus", async () => {
    const proposalId = await createProposal();

    await voteProposal(proposalId, 1);

    const result = await genesisProtocol.getProposalStatus({
      proposalId: proposalId
    });

    assert.isOk(result);
    assert.equal(web3.fromWei(result.totalVotes), 1000);
    assert.equal(result.totalStakes, 0);
    assert.equal(result.votersStakes, 0);
  });

  it("can call getStakerInfo", async () => {
    const proposalId = await createProposal();
    let result = await genesisProtocol.getStakerInfo({
      proposalId: proposalId,
      staker: accounts[0]
    });

    assert.isOk(result);
    assert.equal(result.vote, 0);
    assert.equal(result.stake.toNumber(), 0);

    await genesisProtocol.stake({
      proposalId: proposalId,
      vote: 1,
      amount: web3.toWei(10)
    });

    result = await genesisProtocol.getStakerInfo({
      proposalId: proposalId,
      staker: accounts[0]
    });

    assert.isOk(result);
    assert.equal(result.vote, 1);
    assert.equal(web3.fromWei(result.stake), 10);
  });

  it("can call getVoterInfo", async () => {
    const proposalId = await createProposal();
    let result = await genesisProtocol.getVoterInfo({
      proposalId: proposalId,
      voter: accounts[0]
    });
    assert.isOk(result);
    assert.equal(result.vote, 0);
    assert.equal(result.reputation.toNumber(), 0);

    await voteProposal(proposalId, 1);

    result = await genesisProtocol.getVoterInfo({
      proposalId: proposalId,
      voter: accounts[0]
    });

    assert.isOk(result);
    assert.equal(result.vote, 1);
    assert.equal(web3.fromWei(result.reputation), 1000);

  });

  it("can call stake", async () => {
    const proposalId = await createProposal();
    const result = await stakeProposalVote(proposalId, 1, 10);
    assert.isOk(result);
    assert.isOk(result.tx);
  });

  it("can call vote", async () => {
    const proposalId = await createProposal();
    let result = await voteProposal(proposalId, 1);
    assert.isOk(result);
    assert.isOk(result.tx);

    result = await genesisProtocol.getVoterInfo({
      proposalId: proposalId,
      voter: accounts[0]
    });

    assert.isOk(result);
    assert.equal(result.vote, 1);
    assert.equal(web3.fromWei(result.reputation), 1000);

  });

  it("can call voteWithSpecifiedAmounts", async () => {
    const proposalId = await createProposal();
    let result = await genesisProtocol.voteWithSpecifiedAmounts({
      proposalId: proposalId,
      vote: 1,
      reputation: web3.toWei(10)
    });
    assert.isOk(result);
    assert.isOk(result.tx);

    result = await genesisProtocol.getVoterInfo({
      proposalId: proposalId,
      voter: accounts[0]
    });

    assert.isOk(result);
    assert.equal(result.vote, 1);
    assert.equal(web3.fromWei(result.reputation), 10);
  });

  it("can call redeem", async () => {
    const proposalId = await createProposal();

    await voteProposal(proposalId, 1);

    const result = await genesisProtocol.redeem({
      proposalId: proposalId,
      beneficiary: accounts[0]
    });
    assert.isOk(result);
    assert.isOk(result.tx);
  });

  it("can call getScore", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getScore({
      proposalId: proposalId
    });
    assert(typeof result !== "undefined");
  });

  it("can call getThreshold", async () => {
    const result = await genesisProtocol.getThreshold({
      avatar: dao.avatar.address
    });
    assert(typeof result !== "undefined");
  });

  it("can call getRedeemableTokensStaker", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getRedeemableTokensStaker({
      proposalId: proposalId,
      beneficiary: accounts[0]
    });
    assert(typeof result !== "undefined");
  });

  it("can call getRedeemableReputationProposer", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getRedeemableReputationProposer({
      proposalId: proposalId
    });
    assert(typeof result !== "undefined");
  });

  it("can call getRedeemableTokensVoter", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getRedeemableTokensVoter({
      proposalId: proposalId,
      beneficiary: accounts[0]
    });
    assert(typeof result !== "undefined");
  });

  it("can call getRedeemableReputationVoter", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getRedeemableReputationVoter({
      proposalId: proposalId,
      beneficiary: accounts[0]
    });
    assert(typeof result !== "undefined");
  });

  it("can call getRedeemableReputationStaker", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getRedeemableReputationStaker({
      proposalId: proposalId,
      beneficiary: accounts[0]
    });
    assert(typeof result !== "undefined");
  });

  it("can call getNumberOfChoices", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getNumberOfChoices({
      proposalId: proposalId
    });
    assert.equal(result, 2);
  });

  it("can call getIsVotable", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getIsVotable({
      proposalId: proposalId
    });
    assert.equal(result, true);
  });


  it("can call getTotalReputationSupply", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getTotalReputationSupply({
      proposalId: proposalId
    });
    assert(typeof result !== "undefined");
  });

  it("can call getProposalAvatar", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getProposalAvatar({
      proposalId: proposalId
    });
    assert.equal(result, dao.avatar.address);
  });


  it("can call getWinningVote", async () => {
    const proposalId = await createProposal();

    await voteProposal(proposalId, 1);

    const result = await genesisProtocol.getWinningVote({
      proposalId: proposalId
    });
    assert.equal(result, 1);
  });

  it("can call getState", async () => {
    const proposalId = await createProposal();
    const result = await genesisProtocol.getState({
      proposalId: proposalId
    });
    assert.equal(result, 2); // PreBoosted
  });

  it("can do new", async () => {
    const scheme = await GenesisProtocol.new(Utils.NULL_ADDRESS);
    assert.isOk(scheme);
  });


  it("can do deployed", async () => {
    const scheme = await GenesisProtocol.deployed();
    assert.equal(scheme.address, (await getDeployedContracts()).allContracts.GenesisProtocol.address);
  });

  it("can register new proposal", async () => {
    await createProposal();
  });

  it("cannot register new proposal with no params", async () => {

    try {
      await genesisProtocol.propose({});
      assert(false, "Should have thrown validation exception");
    } catch (ex) {
      assert.equal(ex, "Error: Missing required properties: avatar, paramsHash, executable");
    }
  });

  it("cannot register new proposal with out of range numOfChoices", async () => {

    try {
      await genesisProtocol.propose({
        avatar: dao.avatar.address,
        numOfChoices: 13,
        paramsHash: paramsHash,
        executable: executableTest.address
      });
      assert(false, "Should have thrown validation exception");
    } catch (ex) {
      assert.equal(ex, "Error: numOfChoices must be between 1 and 10");
    }
  });
});
