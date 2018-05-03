import { BigNumber } from "bignumber.js";
import { assert } from "chai";
import { Address, fnVoid, Hash, SchemeWrapper } from "../lib/commonTypes";
import { ConfigService } from "../lib/configService";
import { DAO, NewDaoConfig } from "../lib/dao";
import { ContractWrapperBase, ContractWrapperFactory, ContributionRewardWrapper, InitializeArcJs } from "../lib/index";
import { LoggingService, LogLevel } from "../lib/loggingService";
import { Utils } from "../lib/utils";
import { SchemeRegistrarFactory, SchemeRegistrarWrapper } from "../lib/wrappers/schemeRegistrar";
import { ArcWrappers, WrapperService } from "../lib/wrapperService";

export const NULL_HASH = Utils.NULL_HASH;
export const NULL_ADDRESS = Utils.NULL_ADDRESS;
export const SOME_HASH = "0x1000000000000000000000000000000000000000000000000000000000000000";
export const SOME_ADDRESS = "0x1000000000000000000000000000000000000000";

export const DefaultLogLevel = LogLevel.error;

LoggingService.logLevel = DefaultLogLevel;

let testWeb3;

const etherForEveryone = async (): Promise<void> => {
  // transfer all web3.eth.accounts some ether from the last account
  const count = accounts.length - 1;
  for (let i = 0; i < count; i++) {
    await web3.eth.sendTransaction({
      from: accounts[accounts.length - 1],
      to: accounts[i],
      value: web3.toWei(0.1, "ether"),
    });
  }
};

beforeEach(async () => {
  if (!testWeb3) {
    (global as any).web3 = testWeb3 = await InitializeArcJs();
  }
  (global as any).accounts = web3.eth.accounts;
  await etherForEveryone();
});

export async function forgeDao(opts: any = {}): Promise<DAO> {
  const founders = Array.isArray(opts.founders) ? opts.founders :
    [
      {
        address: accounts[0],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(100),
      },
      {
        address: accounts[1],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(100),
      },
      {
        address: accounts[2],
        reputation: web3.toWei(1000),
        tokens: web3.toWei(100),
      },
    ];

  const schemes = Array.isArray(opts.schemes) ? opts.schemes : [
    { name: "SchemeRegistrar" },
    { name: "UpgradeScheme" },
    { name: "GlobalConstraintRegistrar" },
  ];

  return DAO.new({
    founders,
    name: opts.name || "ArcJsTestDao",
    schemes,
    tokenName: opts.tokenName || "Tokens of ArcJsTestDao",
    tokenSymbol: opts.tokenSymbol || "ATD",
  });
}

/**
 * Register a ContributionReward with the given DAO.
 * @returns the ContributionReward wrapper
 */
export async function addProposeContributionReward(dao: DAO): Promise<ContributionRewardWrapper> {
  const schemeRegistrar =
    await getDaoScheme(dao, "SchemeRegistrar", SchemeRegistrarFactory) as SchemeRegistrarWrapper;
  const contributionReward = await WrapperService.wrappers.ContributionReward;

  const votingMachineHash = await getSchemeVotingMachineParametersHash(dao, schemeRegistrar);
  const votingMachine = await getSchemeVotingMachine(dao, schemeRegistrar);

  const schemeParametersHash = (await contributionReward.setParameters({
    orgNativeTokenFee: "0",
    voteParametersHash: votingMachineHash,
    votingMachineAddress: votingMachine.address,
  })).result;

  const result = await schemeRegistrar.proposeToAddModifyScheme({
    avatar: dao.avatar.address,
    schemeAddress: contributionReward.address,
    schemeName: "ContributionReward",
    schemeParametersHash,
  });

  const proposalId = result.proposalId;

  await vote(votingMachine, proposalId, 1, accounts[1]);
  return contributionReward;
}

export async function getSchemeVotingMachineParametersHash(dao: DAO, scheme: SchemeWrapper): Promise<Hash> {
  return (await scheme.getSchemeParameters(dao.avatar.address)).voteParametersHash;
}

export async function getSchemeVotingMachine(
  dao: DAO,
  scheme: SchemeWrapper,
  votingMachineName?: string): Promise<ContractWrapperBase> {
  const votingMachineAddress = (await scheme.getSchemeParameters(dao.avatar.address)).votingMachineAddress;
  votingMachineName = votingMachineName || ConfigService.get("defaultVotingMachine");
  return WrapperService.getContractWrapper(votingMachineName, votingMachineAddress);
}

export async function getVotingMachineParameters(
  votingMachine: ContractWrapperBase,
  votingMachineParamsHash: Hash): Promise<Array<any>> {
  return votingMachine.contract.parameters(votingMachineParamsHash);
}

/**
 * vote for the proposal given by proposalId.
 */
export function vote(votingMachine: any, proposalId: Hash, theVote: number, voter: Address): Promise<void> {
  voter = (voter ? voter : accounts[0]);
  /**
   * depending on whether or not the wrapper was passed, do the right thing
   */
  if (votingMachine.contract) {
    return votingMachine.vote({ proposalId, vote: theVote, onBehalfOf: voter });
  } else {
    return votingMachine.vote(proposalId, theVote, { from: voter });
  }
}

export async function voteWasExecuted(votingMachine: any, proposalId: Hash): Promise<boolean> {
  return new Promise((resolve: (ok: boolean) => void): void => {
    let event;
    /**
     * depending on whether or not the wrapper was passed, do the right thing
     */
    if (votingMachine.contract) {
      event = votingMachine.contract.ExecuteProposal({ _proposalId: proposalId }, { fromBlock: 0 });
    } else {
      event = votingMachine.ExecuteProposal({ _proposalId: proposalId }, { fromBlock: 0 });
    }
    event.get((err: Error, events: Array<any>): void => {
      resolve(events.length === 1);
    });
  });
}

export const outOfGasMessage =
  "VM Exception while processing transaction: out of gas";

export function assertJumpOrOutOfGas(error: Error): void {
  const condition =
    error.message === outOfGasMessage ||
    error.message.search("invalid JUMP") > -1;
  assert.isTrue(
    condition,
    "Expected an out-of-gas error or an invalid JUMP error, got this instead: " +
    error.message
  );
}

export function assertVMException(error: Error): void {
  const condition = error.message.search("VM Exception") > -1;
  assert.isTrue(
    condition,
    "Expected a VM Exception, got this instead:" + error.message
  );
}

export function assertInternalFunctionException(error: Error): void {
  const condition = error.message.search("is not a function") > -1;
  assert.isTrue(
    condition,
    "Expected a function not found Exception, got this instead:" + error.message
  );
}

export function assertJump(error: Error): void {
  assert.isAbove(
    error.message.search("invalid JUMP"),
    -1,
    "Invalid JUMP error must be returned" + error.message
  );
}

export function contractsForTest(): ArcWrappers {
  return WrapperService.wrappers;
}

// Increases ganache time by the passed duration in seconds
export async function increaseTime(duration: number): Promise<void> {
  const id = new Date().getTime();

  return new Promise((resolve: (res: any) => any, reject: (err: any) => any): void => {
    web3.currentProvider.sendAsync({
      id,
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [duration],
    }, (err1: any) => {
      if (err1) { reject(err1); }

      web3.currentProvider.sendAsync({
        id: id + 1,
        jsonrpc: "2.0",
        method: "evm_mine",
      }, (err2: any, res: any): void => {
        err2 ? reject(err2) : resolve(res);
      });
    });
  });
}

export async function getDaoScheme(
  dao: DAO,
  schemeName: string,
  factory: ContractWrapperFactory<any>): Promise<ContractWrapperBase> {
  return factory.at((await dao.getSchemes(schemeName))[0].address);
}

/**
 * Transfer tokens
 * @param {DAO} dao
 * @param {number} amount - will be converted to Wei
 * @param {string} fromAddress - optional, default is accounts[0]
 * @param {string} token - token contract.  optional, default is dao.token
 */
export function transferTokensToDao(dao: DAO, amount: number, fromAddress: Address, token: any): Promise<any> {
  fromAddress = fromAddress || accounts[0];
  token = token ? token : dao.token;
  return token.transfer(dao.avatar.address, web3.toWei(amount), { from: fromAddress });
}

/**
 * Send eth to the dao's avatar
 * @param {DAO} dao
 * @param {number} amount -- will be converted to Wei
 * @param {string} fromAddress  - optional, default is accounts[0]
 */
export function transferEthToDao(dao: DAO, amount: number, fromAddress?: Address): Hash {
  fromAddress = fromAddress || accounts[0];
  return web3.eth.sendTransaction({ from: fromAddress, to: dao.avatar.address, value: web3.toWei(amount) });
}

export async function sleep(milliseconds: number): Promise<any> {
  return new Promise((resolve: fnVoid): any => setTimeout(resolve, milliseconds));
}

export function fromWei(amount: string | number | BigNumber): BigNumber {
  const result = web3.fromWei(amount as any);
  return web3.toBigNumber(result);
}
