/**
    helpers for tests
*/
import { getWeb3, requireContract } from "../lib/utils.js";
import { assert } from "chai";

beforeEach(async () => {
  global.web3 = getWeb3();
  global.assert = assert;
  global.accounts = [];
  await etherForEveryone();
});

import { Organization } from "../lib/organization.js";
import { getDeployedContracts } from "../lib/contracts.js";
const GenesisScheme = requireContract("GenesisScheme");
const Avatar = requireContract("Avatar");
const DAOToken = requireContract("DAOToken");
const Reputation = requireContract("Reputation");
const AbsoluteVote = requireContract("AbsoluteVote");
const Controller = requireContract("Controller");

export const NULL_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
export const SOME_HASH =
  "0x1000000000000000000000000000000000000000000000000000000000000000";
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const SOME_ADDRESS = "0x1000000000000000000000000000000000000000";

beforeEach(async () => {
  global.web3 = getWeb3();
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
  isOwnedVote = true,
  precReq = 50,
  reputations = []
) {
  const votingMachine = await AbsoluteVote.at((await AbsoluteVote.deployed()).address);

  // set up a reputation system
  const reputation = await Reputation.at(await avatar.nativeReputation());


  for (const r of reputations) {
    await reputation.mint(r.address, r.reputation);
  }

  // register some parameters
  await votingMachine.setParameters(reputation.address, precReq, isOwnedVote);
  const configHash = await votingMachine.getParametersHash(
    reputation.address,
    precReq,
    isOwnedVote
  );
  votingMachine.configHash__ = configHash; // for reuse by tests
  return votingMachine;
}

async function setupOrganization(founders) {
  const org = new Organization();
  const genesisScheme = await GenesisScheme.deployed();

  const tx = await genesisScheme.forgeOrg(
    "testOrg",
    "TEST",
    "TST",
    founders.map(x => x.address),
    founders.map(x => x.tokens),
    founders.map(x => x.reputation),
    NULL_ADDRESS
  );
  assert.equal(tx.logs.length, 1);
  assert.equal(tx.logs[0].event, "NewOrg");
  const avatarAddress = tx.logs[0].args._avatar;
  org.avatar = await Avatar.at(avatarAddress);
  const tokenAddress = await org.avatar.nativeToken();
  org.token = await DAOToken.at(tokenAddress);
  const reputationAddress = await org.avatar.nativeReputation();
  org.reputation = await Reputation.at(reputationAddress);
  const controllerAddress = await org.avatar.owner();
  org.controller = await Controller.at(controllerAddress);

  org.votingMachine = await setupAbsoluteVote(org.avatar);

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
        voteParametersHash: org.votingMachine.configHash__,
        votingMachine: org.votingMachine.address
      })
      .then(hash => {
        params.push(hash);
      });
  }

  await genesisScheme.setSchemes(
    org.avatar.address,
    defaultSchemes.map(s => s.address),
    params,
    defaultSchemes.map(s => s.getDefaultPermissions())
  );

  return org;
}

export async function forgeOrganization(opts = {}) {
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

  return await setupOrganization(founders);
}

export async function transferTokensToAvatar(avatar, amount, fromAddress) {
  const tokenAddress = await avatar.nativeToken();
  const schemeToken = await DAOToken.at(tokenAddress);
  await schemeToken.transfer(avatar.address, amount, { from: fromAddress });
  return tokenAddress;
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
