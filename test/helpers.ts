import { BigNumber } from "bignumber.js";
import { Address, Hash } from "../lib/commonTypes";
import { DAO, NewDaoConfig } from "../lib/dao";
import {
  ArcTransactionResult,
  ContributionRewardWrapper,
  DecodedLogEntryEvent,
  IContractWrapperBase,
  IContractWrapperFactory,
  InitializeArcJs,
  IntVoteInterfaceWrapper,
  ProposalGeneratorBase,
  SchemeWrapper,
  VotingMachineExecuteProposalEventResult
} from "../lib/index";
import { LoggingService, LogLevel } from "../lib/loggingService";
import { Utils } from "../lib/utils";
import { UtilsInternal } from "../lib/utilsInternal";
import { SchemeRegistrarFactory, SchemeRegistrarWrapper } from "../lib/wrappers/schemeRegistrar";
import { WrapperService } from "../lib/wrapperService";

export const NULL_HASH = Utils.NULL_HASH;
export const NULL_ADDRESS = Utils.NULL_ADDRESS;
export const SOME_HASH = "0x1000000000000000000000000000000000000000000000000000000000000000";
export const SOME_ADDRESS = "0x1000000000000000000000000000000000000000";

export const DefaultLogLevel = LogLevel.error;

LoggingService.logLevel = DefaultLogLevel;

let testWeb3;

const etherForEveryone = async (): Promise<void> => {
  const count = accounts.length - 1;
  for (let i = 0; i < count; i++) {
    await web3.eth.sendTransaction({
      from: accounts[accounts.length - 1],
      to: accounts[i],
      value: web3.toWei(0.1, "ether"),
    });
  }
};

const genTokensForEveryone = async (): Promise<void> => {
  const address = await Utils.getGenTokenAddress();
  const genToken = await (await Utils.requireContract("DAOToken")).at(address) as any;
  accounts.forEach((account: Address) => {
    // 1000 is an arbitrary number we've always given to founders for tests
    genToken.mint(account, web3.toWei(1000));
  });
};

beforeEach(async () => {
  if (!testWeb3) {
    (global as any).web3 = testWeb3 = await InitializeArcJs();
  }
  (global as any).accounts = web3.eth.accounts;
  await etherForEveryone();
  await genTokensForEveryone();
});

export async function forgeDao(opts: Partial<NewDaoConfig> = {}): Promise<DAO> {
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

  const proposalId = await result.getProposalIdFromMinedTx();

  await vote(votingMachine, proposalId, 1, accounts[1]);
  return contributionReward;
}

export function wrapperForContract(contractName: string, address?: Address): Promise<IContractWrapperBase> {
  return WrapperService.getContractWrapper(contractName, address);
}

export async function getSchemeVotingMachineParametersHash(dao: DAO, scheme: SchemeWrapper): Promise<Hash> {
  return (await scheme.getSchemeParameters(dao.avatar.address)).voteParametersHash;
}

export async function getSchemeVotingMachine(
  dao: DAO,
  scheme: ProposalGeneratorBase): Promise<IntVoteInterfaceWrapper> {
  return await scheme.getVotingMachine(dao.avatar.address);
}

export async function getVotingMachineParameters(
  votingMachine: IntVoteInterfaceWrapper,
  votingMachineParamsHash: Hash): Promise<any> {

  /**
   * only works for originally-deployed voting machines
   */
  const wrapper = wrapperForVotingMachine(votingMachine);

  return wrapper.getParameters(votingMachineParamsHash);
}

/**
 * vote for the proposal given by proposalId.
 */
export function vote(
  votingMachine: IntVoteInterfaceWrapper,
  proposalId: Hash,
  theVote: number,
  voter: Address): Promise<ArcTransactionResult> {
  voter = (voter ? voter : accounts[0]);
  return votingMachine.vote({ vote: theVote, proposalId, onBehalfOf: voter });
}

export function wrapperForVotingMachine(votingMachine: IntVoteInterfaceWrapper): IContractWrapperBase {
  // Only works if the votingMachine is an instance originally deployed by DAOstack
  return WrapperService.wrappersByAddress.get(votingMachine.address);
}

export async function voteWasExecuted(votingMachine: IntVoteInterfaceWrapper, proposalId: Hash): Promise<boolean> {
  return new Promise((resolve: (ok: boolean) => void, reject: (error: Error) => void): void => {

    // TODO: VotingMachineSerice events should suffice
    const vmWrapper = wrapperForVotingMachine(votingMachine) as any;

    const event = vmWrapper.ExecuteProposal({ _proposalId: proposalId }, { fromBlock: 0 });
    event.get(
      (err: Error, events: Array<DecodedLogEntryEvent<VotingMachineExecuteProposalEventResult>>): void => {
        if (err) {
          return reject(err);
        }
        resolve((events.length === 1) && (events[0].args._proposalId === proposalId));
      });
  });
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
      if (err1) { return reject(err1); }

      web3.currentProvider.sendAsync({
        id: id + 1,
        jsonrpc: "2.0",
        method: "evm_mine",
      }, (err2: any, res: any): void => {
        return err2 ? reject(err2) : resolve(res);
      });
    });
  });
}

export async function getDaoScheme(
  dao: DAO,
  schemeName: string,
  factory: IContractWrapperFactory<any>): Promise<IContractWrapperBase> {
  return factory.at((await dao.getSchemes(schemeName))[0].address);
}

/**
 * Transfer tokens
 * @param {DAO} dao
 * @param {number} amount - will be converted to Wei
 * @param {string} fromAddress - transfer from this account
 * @param {string} token - token contract.  optional, default is dao.token
 */
export function transferTokensToDao(dao: DAO, amount: number, fromAddress: Address, token: any): Promise<any> {
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

export function sleep(milliseconds: number): Promise<any> {
  return UtilsInternal.sleep(milliseconds);
}

export function fromWei(amount: string | number | BigNumber): BigNumber {
  const result = web3.fromWei(amount as any);
  return web3.toBigNumber(result);
}
