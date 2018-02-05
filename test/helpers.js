import { Utils } from "../lib/utils.js";
import { assert } from "chai";
import { DAO } from "../lib/dao.js";
import { getDeployedContracts } from "../lib/contracts.js";
const DaoCreator = Utils.requireContract("DaoCreator");
const Avatar = Utils.requireContract("Avatar");
const DAOToken = Utils.requireContract("DAOToken");
const Reputation = Utils.requireContract("Reputation");
import { AbsoluteVote } from "../lib/contracts/absoluteVote";
const Controller = Utils.requireContract("Controller");

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

async function setupAbsoluteVote(
  avatar,
  ownerVote = true,
  votePerc = 50,
  reputations = []
) {
  const votingMachine = await AbsoluteVote.deployed();

  // set up a reputation system
  const reputation = await Reputation.at(await avatar.nativeReputation());

  for (const r of reputations) {
    await reputation.mint(r.address, r.reputation);
  }

  // register some parameters
  const configHash = (await votingMachine.setParams({
    reputation: reputation.address,
    votePerc: votePerc,
    ownerVote: ownerVote
  })).result;

  votingMachine.configHash__ = configHash; // for reuse by tests

  return votingMachine;
}

async function setupDao(founders) {
  const dao = new DAO();
  const daoCreator = await DaoCreator.deployed();

  const tx = await daoCreator.forgeOrg(
    "testOrg",
    "TEST",
    "TST",
    founders.map(x => x.address),
    founders.map(x => x.tokens),
    founders.map(x => x.reputation),
    Utils.NULL_ADDRESS
  );
  assert.equal(tx.logs.length, 1);
  assert.equal(tx.logs[0].event, "NewOrg");
  const avatarAddress = tx.logs[0].args._avatar;
  dao.avatar = await Avatar.at(avatarAddress);
  const tokenAddress = await dao.avatar.nativeToken();
  dao.token = await DAOToken.at(tokenAddress);
  const reputationAddress = await dao.avatar.nativeReputation();
  dao.reputation = await Reputation.at(reputationAddress);
  const controllerAddress = await dao.avatar.owner();
  dao.controller = await Controller.at(controllerAddress);

  dao.votingMachine = await setupAbsoluteVote(dao.avatar);

  const contracts = await getDeployedContracts();

  const defaultSchemes = [];

  for (const name of [
    "SchemeRegistrar",
    "UpgradeScheme",
    "GlobalConstraintRegistrar"
  ]) {
    await contracts.allContracts[name].contract
      .at(contracts.allContracts[name].address)
      .then(scheme => {
        defaultSchemes.push(scheme);
      });
  }

  const params = [];

  for (const scheme of defaultSchemes) {
    // yes, this set of schemes all have the same params
    // when that changes we can improve this
    await scheme
      .setParams({
        voteParametersHash: dao.votingMachine.configHash__,
        votingMachine: dao.votingMachine.address
      })
      .then(result => {
        params.push(result.result);
      });
  }

  await daoCreator.setSchemes(
    dao.avatar.address,
    defaultSchemes.map(s => s.address),
    params,
    defaultSchemes.map(s => s.getDefaultPermissions())
  );

  return dao;
}

export async function forgeDao(opts = {}) {
  const founders =
    opts && opts.founders
      ? opts.founders
      : [
        {
          address: accounts[0],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40)
        },
        {
          address: accounts[1],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40)
        },
        {
          address: accounts[2],
          reputation: web3.toWei(1000),
          tokens: web3.toWei(40)
        }
      ];

  return await setupDao(founders);
}

export async function proposeContributionReward(dao) {
  const schemeRegistrar = await dao.getScheme("SchemeRegistrar");
  const contributionReward = await dao.getScheme("ContributionReward");

  const votingMachineHash = await dao.votingMachine.configHash__;
  const votingMachineAddress = dao.votingMachine.address;

  const schemeParametersHash = (await contributionReward.setParams({
    orgNativeTokenFee: 0,
    voteParametersHash: votingMachineHash,
    votingMachine: votingMachineAddress
  })).result;

  const result = await schemeRegistrar.proposeToAddModifyScheme({
    avatar: dao.avatar.address,
    scheme: contributionReward.address,
    schemeName: "ContributionReward",
    schemeParametersHash: schemeParametersHash
  });

  const proposalId = result.proposalId;

  vote(dao, proposalId, 1, { from: accounts[2] });

  return contributionReward;
}

export async function transferTokensToAvatar(avatar, amount, fromAddress) {
  const tokenAddress = await avatar.nativeToken();
  const schemeToken = await DAOToken.at(tokenAddress);
  await schemeToken.transfer(avatar.address, amount, { from: fromAddress });
  return tokenAddress;
}

/**
 * vote for the proposal given by proposalId using this.votingMachine
 * This will not work for proposals using votingMachines that are not the default one.
 * Also doesn't work for DAOs created using DAO.new or DaoCreator (the DAO won't have .votingMachine)
 * See getVotingMachineForScheme() below.
 */
export function vote(dao, proposalId, choice, params) {
  return dao.votingMachine.vote(proposalId, choice, params);
}

export async function getVotingMachineForScheme(dao, scheme, ndxParam) {
  const schemeParams = await dao.getSchemeParameters(scheme);
  const votingMachineAddress = schemeParams[ndxParam];
  return await AbsoluteVote.at(votingMachineAddress);
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
  return await getDeployedContracts();
}
