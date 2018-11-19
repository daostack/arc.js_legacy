import { BigNumber } from "bignumber.js";
import { promisify } from "es6-promisify";
import { Address, Hash } from "../lib/commonTypes";
import { DAO, NewDaoConfig } from "../lib/dao";
import {
  ArcTransactionResult,
  DecodedLogEntryEvent,
  IContractWrapper,
  IContractWrapperFactory,
  IUniversalSchemeWrapper
} from "../lib/iContractWrapperBase";

import {
  ContributionRewardWrapper,
} from "../lib/wrappers/contributionReward";

import {
  ConfigService
} from "../lib/configService";

import { InitializeArcJs } from "../lib/index";

import {
  ExecuteProposalEventResult,
  IIntVoteInterface
} from "../lib/wrappers/iIntVoteInterface";

import {
  IntVoteInterfaceWrapper,
} from "../lib/wrappers/intVoteInterface";

import {
  ProposalGeneratorBase,
} from "../lib/proposalGeneratorBase";

import { LoggingService, LogLevel } from "../lib/loggingService";
import { Utils } from "../lib/utils";
import { UtilsInternal } from "../lib/utilsInternal";
import { DaoTokenWrapper } from "../lib/wrappers/daoToken";
import { SchemeRegistrarFactory, SchemeRegistrarWrapper } from "../lib/wrappers/schemeRegistrar";
import { WrapperService } from "../lib/wrapperService";
/* tslint:disable-next-line:no-var-requires */
const env = require("env-variable")();

export const NULL_HASH = Utils.NULL_HASH;
export const NULL_ADDRESS = Utils.NULL_ADDRESS;
export const SOME_HASH = "0x1000000000000000000000000000000000000000000000000000000000000000";
export const SOME_ADDRESS = "0x1000000000000000000000000000000000000000";

/* tslint:disable-next-line:no-bitwise */
export const DefaultLogLevel = LogLevel.error | LogLevel.info;

ConfigService.set("logLevel", DefaultLogLevel);
ConfigService.set("estimateGas", true);
ConfigService.set("cacheContractWrappers", true);

let testWeb3;
let network;

const etherForEveryone = async (): Promise<void> => {
  const count = accounts.length - 1;
  for (let i = 0; i < count; i++) {
    await promisify((callback: any): void => web3.eth.sendTransaction({
      from: accounts[accounts.length - 1],
      to: accounts[i],
      value: web3.toWei(0.1, "ether"),
    }, callback))();
  }
};

const genTokensForEveryone = async (): Promise<void> => {
  const genToken = await DaoTokenWrapper.getGenToken();
  accounts.forEach((account: Address) => {
    // 1000 is an arbitrary number we've always given to founders for tests
    genToken.contract.mint(account, web3.toWei(1000));
  });
};

let provider;

const setupForNonGanacheNet = (): void => {
  const webConstructor = require("web3");

  let providerConfig;

  /* tslint:disable:no-console */
  console.log(`providerConfig at: ${env.arcjs_providerConfig}`);
  providerConfig = require(env.arcjs_providerConfig);

  const HDWalletProvider = require("truffle-hdwallet-provider");
  console.log(`Provider: '${providerConfig.providerUrl}'`);
  console.log(`Account: '${providerConfig.mnemonic}'`);
  provider = new HDWalletProvider(providerConfig.mnemonic, providerConfig.providerUrl);
  // Utils.getWeb3() will use this in InitializeArcJs()
  (global as any).web3 = new webConstructor(provider);
  /* tslint:enable:no-console */
};

beforeEach(async () => {

  const suppressArcInitialization = env.arcjs_noInitialize;

  if (!suppressArcInitialization) {
    network = (env.arcjs_network || "ganache").toLowerCase();

    if (!testWeb3) {

      if (env.arcjs_providerConfig) {
        // note this can be ganache too
        setupForNonGanacheNet();
      }

      (global as any).web3 = testWeb3 = await InitializeArcJs();
    }

    (global as any).accounts = await promisify(web3.eth.getAccounts)();

    if (network === "ganache") {
      await etherForEveryone();
      await genTokensForEveryone();
    }
  }
});

after(() => {
  if (provider) {
    /* tslint:disable-next-line:no-console */
    console.log("stopping provider engine...");
    // see: https://github.com/trufflesuite/truffle-hdwallet-provider/issues/46
    provider.engine.stop();
  }
});

export async function forgeDao(opts: Partial<NewDaoConfig> = {}): Promise<DAO> {
  const defaultFounders =
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

  const defaultSchemes = [
    { name: "SchemeRegistrar" },
    { name: "UpgradeScheme" },
    { name: "GlobalConstraintRegistrar" },
  ];

  try {
    return await DAO.new(Object.assign({
      founders: defaultFounders,
      name: opts.name || "ArcJsTestDao",
      schemes: defaultSchemes,
      tokenName: opts.tokenName || "Tokens of ArcJsTestDao",
      tokenSymbol: opts.tokenSymbol || "ATD",
    }, opts));
  } catch (ex) {
    throw new Error(`error creating DAO: ${ex.message ? ex.message : ex}`);
  }
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

export function wrapperForContract(contractName: string, address?: Address): Promise<IContractWrapper> {
  return WrapperService.getContractWrapper(contractName, address);
}

export async function getSchemeVotingMachineParametersHash(dao: DAO, scheme: IUniversalSchemeWrapper): Promise<Hash> {
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
  votingMachine: IIntVoteInterface,
  proposalId: Hash,
  theVote: number,
  voter: Address): Promise<ArcTransactionResult> {
  voter = (voter ? voter : accounts[0]);
  return (votingMachine as any).contract.vote(proposalId, theVote, NULL_ADDRESS, { from: voter });
}

export function wrapperForVotingMachine(votingMachine: IntVoteInterfaceWrapper): IUniversalSchemeWrapper {
  // Only works if the votingMachine is an instance originally deployed by DAOstack
  return WrapperService.wrappersByAddress.get(votingMachine.address) as IUniversalSchemeWrapper;
}

export async function voteWasExecuted(votingMachine: IntVoteInterfaceWrapper, proposalId: Hash): Promise<boolean> {
  return new Promise((resolve: (ok: boolean) => void, reject: (error: Error) => void): void => {

    // TODO: VotingMachineSerice events should suffice
    const vmWrapper = wrapperForVotingMachine(votingMachine) as any;

    const event = vmWrapper.ExecuteProposal({ _proposalId: proposalId }, { fromBlock: 0 });
    event.get(
      (err: Error, events: Array<DecodedLogEntryEvent<ExecuteProposalEventResult>>): void => {
        if (err) {
          return reject(err);
        }
        resolve((events.length === 1) && (events[0].args._proposalId === proposalId));
      });
  });
}

// Increases ganache time by the passed duration in seconds
export async function increaseTime(duration: number): Promise<void> {

  if (network === "ganache") {
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
}

export async function waitForBlocks(blocks: number): Promise<void> {
  const currentBlock = await UtilsInternal.lastBlockNumber();
  /* tslint:disable-next-line:no-empty */
  while ((await UtilsInternal.lastBlockNumber()) - currentBlock < blocks) { }
}

export async function getDaoScheme(
  dao: DAO,
  schemeName: string,
  factory: IContractWrapperFactory<any>): Promise<IContractWrapper> {
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
  token = token.contract ? token.contract : token;
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
