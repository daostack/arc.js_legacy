import { Utils } from "../lib/utils";
import { assert } from "chai";
import { DAO } from "../lib/dao.js";
import { Contracts } from "../lib/contracts.js";
const DAOToken = Utils.requireContract("DAOToken");
import { AbsoluteVote } from "../lib/contracts/absoluteVote";
import { SchemeRegistrar } from "../lib/contracts/schemeregistrar";

export const NULL_HASH = Utils.NULL_HASH;
export const NULL_ADDRESS = Utils.NULL_ADDRESS;
export const SOME_HASH = "0x1000000000000000000000000000000000000000000000000000000000000000";
export const SOME_ADDRESS = "0x1000000000000000000000000000000000000000";

beforeEach(async () => {
  global.web3 = Utils.getWeb3();
  global.assert = assert;
  global.accounts = [];
  await etherForEveryone();
});

function getProposalAddress(tx) {
  // helper function that returns a proposal object from the ProposalCreated event
  // in the logs of tx

  ual(tx.logs[0].event, "ProposalCreated");
  const proposalAddress = tx.logs[0].args.proposaladdress;
  return proposalAddress;
}

export async function getProposal(tx) {
  return await Proposal.at(getProposalAddress(tx));
}

async function etherForEveryone() {
  // give all web3.eth.accounts some ether
  accounts = web3.eth.accounts;
  const count = accounts.length;
  for (let i = 0; i < count; i++) {
    await web3.eth.sendTransaction({
      to: accounts[i],
      from: accounts[0],
      value: web3.toWei(0.1, "ether")
    });
  }
}

export async function forgeDao(opts = {}) {
  const founders = Array.isArray(opts.founders) ? opts.founders :
    [
      {
        address: accounts[0],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(100)
      },
      {
        address: accounts[1],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(100)
      },
      {
        address: accounts[2],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(100)
      }
    ];

  const schemes = Array.isArray(opts.schemes) ? opts.schemes : [
    { name: "SchemeRegistrar" },
    { name: "UpgradeScheme" },
    { name: "GlobalConstraintRegistrar" }
  ];

  return DAO.new({
    name: opts.name || "Skynet",
    tokenName: opts.tokenName || "Tokens of skynet",
    tokenSymbol: opts.tokenSymbol || "SNT",
    schemes: schemes,
    founders: founders
  });
}

/**
 * Register a ContributionReward with the given DAO.
 * @param {*} dao
 * @returns the ContributionReward wrapper
 */
export async function addProposeContributionReward(dao) {
  const schemeRegistrar = await getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrar);
  const contributionReward = await dao.getScheme("ContributionReward");

  const votingMachineHash = await getSchemeVotingMachineParametersHash(dao, schemeRegistrar, 0);
  const votingMachine = await getSchemeVotingMachine(dao, schemeRegistrar, 2);

  const schemeParametersHash = (await contributionReward.setParams({
    orgNativeTokenFee: 0,
    voteParametersHash: votingMachineHash,
    votingMachine: votingMachine.address
  })).result;

  const result = await schemeRegistrar.proposeToAddModifyScheme({
    avatar: dao.avatar.address,
    scheme: contributionReward.address,
    schemeName: "ContributionReward",
    schemeParametersHash: schemeParametersHash
  });

  const proposalId = result.proposalId;

  await vote(votingMachine, proposalId, 1, accounts[1]);
  return contributionReward;
}

export async function transferTokensToAvatar(avatar, amount, fromAddress) {
  const tokenAddress = await avatar.nativeToken();
  const schemeToken = await DAOToken.at(tokenAddress);
  await schemeToken.transfer(avatar.address, amount, { from: fromAddress });
  return tokenAddress;
}

export async function getSchemeParameter(dao, scheme, ndxParameter) {
  const schemeParams = await dao.getSchemeParameters(scheme);
  return schemeParams[ndxParameter];
}

export async function getSchemeVotingMachineParametersHash(dao, scheme, ndxVotingMachineParametersHash = 0) {
  return getSchemeParameter(dao, scheme, ndxVotingMachineParametersHash);
}

export async function getSchemeVotingMachine(dao, scheme, ndxVotingMachineParameter = 1) {
  const votingMachineAddress = await getSchemeParameter(dao, scheme, ndxVotingMachineParameter);
  return AbsoluteVote.at(votingMachineAddress);
}

export async function getVotingMachineParameters(votingMachine, votingMachineParamsHash) {
  return votingMachine.parameters(votingMachineParamsHash);
}

/**
 * vote for the proposal given by proposalId.
 * votingMachine must be the raw contract, not a wrapper.
 */
export async function vote(votingMachine, proposalId, vote, voter) {

  voter = (voter ? voter : accounts[0]);

  // console.log(`voting: ${vote} on ${proposalId} on behalf of: ${voter}`);

  votingMachine = votingMachine.contract ? votingMachine.contract : votingMachine;
  const tx = await votingMachine.vote(proposalId, vote, { from: voter });

  // const status = await votingMachine.voteInfo(proposalId, voter);
  // console.log(`voted: ${status[0]}, using reputation: ${web3.fromWei(status[1])}`);

  // console.log(`executed: ${await voteWasExecuted(votingMachine, proposalId)}`);

  return tx;
}

export async function voteWasExecuted(votingMachine, proposalId) {
  return new Promise(async (resolve) => {
    const event = votingMachine.ExecuteProposal({}, { fromBlock: 0 });
    let found = false;
    event.get((err, eventsArray) => {
      for (const event of eventsArray) {
        found = event.args._proposalId === proposalId;
        if (found) { break; }
      }
      event.stopWatching(); // maybe not necessary, but just in case...
      resolve(found);
    });
  });
}

export const outOfGasMessage =
  "VM Exception while processing transaction: out of gas";

export function assertJumpOrOutOfGas(error) {
  const condition =
    error.message == outOfGasMessage ||
    error.message.search("invalid JUMP") > -1;
  assert.isTrue(
    condition,
    "Expected an out-of-gas error or an invalid JUMP error, got this instead: " +
    error.message
  );
}

export function assertVMException(error) {
  const condition = error.message.search("VM Exception") > -1;
  assert.isTrue(
    condition,
    "Expected a VM Exception, got this instead:" + error.message
  );
}

export function assertInternalFunctionException(error) {
  const condition = error.message.search("is not a function") > -1;
  assert.isTrue(
    condition,
    "Expected a function not found Exception, got this instead:" + error.message
  );
}

export function assertJump(error) {
  assert.isAbove(
    error.message.search("invalid JUMP"),
    -1,
    "Invalid JUMP error must be returned" + error.message
  );
}

export async function contractsForTest() {
  return await Contracts.getDeployedContracts();
}

// Increases ganache time by the passed duration in seconds
export async function increaseTime(duration) {
  const id = new Date().getTime();

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [duration],
      id: id,
    }, err1 => {
      if (err1) { return reject(err1); }

      web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: "evm_mine",
        id: id + 1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res);
      });
    });
  });
}

export async function getDaoScheme(dao, schemeName, factory) {
  return factory.at((await dao.getSchemes(schemeName))[0].address);
}
