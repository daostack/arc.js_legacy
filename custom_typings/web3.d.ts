declare module "web3" {
  import * as BigNumber from "bignumber.js";

  export type MixedData = string | number | object | Array<any> | BigNumber.BigNumber;

  export namespace providers {
    class HttpProvider implements Provider {
      constructor(url?: string, timeout?: number, username?: string, password?: string);
      public sendAsync(
        payload: JSONRPCRequestPayload,
        callback: (err: Error, result: JSONRPCResponsePayload) => void
      ): void;
    }
  }

  export class Web3 {
    public static providers: typeof providers;
    public currentProvider: Provider;

    public eth: EthApi;
    public personal: PersonalApi | undefined;
    public version: VersionApi;
    public net: NetApi;

    public constructor(provider?: Provider);

    public isConnected(): boolean;
    public setProvider(provider: Provider): void;
    public reset(keepIsSyncing: boolean): void;
    public toHex(data: MixedData): string;
    public toAscii(hex: string): string;
    public fromAscii(ascii: string, padding?: number): string;
    public toDecimal(hex: string): number;
    public toUtf8(hex: string): string;
    public fromDecimal(value: number | string): string;
    public fromWei(value: number | string, unit?: Unit): string;
    public fromWei(value: BigNumber.BigNumber, unit?: Unit): BigNumber.BigNumber;
    public toWei(amount: number | string, unit?: Unit): string;
    public toWei(amount: BigNumber.BigNumber, unit?: Unit): BigNumber.BigNumber;
    public toBigNumber(value: number | string | BigNumber.BigNumber): BigNumber.BigNumber;
    public isAddress(address: string): boolean;
    public isChecksumAddress(address: string): boolean;
    public sha3(value: string, options?: Sha3Options): string;
  }

  export type ContractAbi = Array<AbiDefinition>;

  export type AbiDefinition = FunctionAbi | EventAbi;

  export type FunctionAbi = MethodAbi | ConstructorAbi | FallbackAbi;

  export enum AbiType {
    Function = "function",
    Constructor = "constructor",
    Event = "event",
    Fallback = "fallback",
  }

  export type ConstructorStateMutability = "nonpayable" | "payable";
  export type StateMutability = "pure" | "view" | ConstructorStateMutability;

  export interface MethodAbi {
    type: AbiType.Function;
    name: string;
    inputs: Array<DataItem>;
    outputs: Array<DataItem>;
    constant: boolean;
    stateMutability: StateMutability;
    payable: boolean;
  }

  export interface ConstructorAbi {
    type: AbiType.Constructor;
    inputs: Array<DataItem>;
    payable: boolean;
    stateMutability: ConstructorStateMutability;
  }

  export interface FallbackAbi {
    type: AbiType.Fallback;
    payable: boolean;
  }

  export interface EventParameter extends DataItem {
    indexed: boolean;
  }

  export interface EventAbi {
    type: AbiType.Event;
    name: string;
    inputs: Array<EventParameter>;
    anonymous: boolean;
  }

  export interface DataItem {
    name: string;
    type: string;
    components: Array<DataItem>;
  }

  export interface ContractInstance {
    address: string;
    abi: ContractAbi;
    [name: string]: any;
  }

  export interface Contract<A extends ContractInstance> {
    at(address: string): A;
    getData(...args: Array<any>): string;
    "new"(...args: Array<any>): A;
  }

  export interface FilterObject {
    fromBlock?: number | string;
    toBlock?: number | string;
    address?: string;
    topics?: Array<LogTopic>;
  }

  export type LogTopic = null | string | Array<string>;

  export interface DecodedLogEntry<A> extends LogEntry {
    event: string;
    args: A;
  }

  export interface DecodedLogEntryEvent<A> extends DecodedLogEntry<A> {
    removed: boolean;
  }

  export interface LogEntryEvent extends LogEntry {
    removed: boolean;
  }

  export interface FilterResult {
    get(callback: () => void): void;
    watch(callback: (err: Error, result: LogEntryEvent) => void): void;
    stopWatching(callback?: () => void): void;
  }

  export interface JSONRPCRequestPayload {
    params?: Array<any>;
    method: string;
    id: number;
    jsonrpc: string;
  }

  export interface JSONRPCResponsePayload {
    result: any;
    id: number;
    jsonrpc: string;
  }

  export type OpCode = string;

  export interface StructLog {
    depth: number;
    error: string;
    gas: number;
    gasCost: number;
    memory: Array<string>;
    op: OpCode;
    pc: number;
    stack: Array<string>;
    storage: { [location: string]: string };
  }
  export interface TransactionTrace {
    gas: number;
    returnValue: any;
    structLogs: Array<StructLog>;
  }

  export interface Provider {
    sendAsync(
      payload: JSONRPCRequestPayload,
      callback: (err: Error, result: JSONRPCResponsePayload) => void
    ): void;
  }

  export interface Sha3Options {
    encoding: "hex";
  }

  export interface EthApi {
    coinbase: string;
    mining: boolean;
    hashrate: number;
    gasPrice: BigNumber.BigNumber;
    accounts: Array<string>;
    blockNumber: number;
    defaultAccount?: string;
    defaultBlock: BlockParam;
    syncing: SyncingResult;
    compile: {
      solidity(sourceString: string, cb?: (err: Error, result: any) => void): object;
    };
    getMining(cd: (err: Error, mining: boolean) => void): void;
    getHashrate(cd: (err: Error, hashrate: number) => void): void;
    getGasPrice(cd: (err: Error, gasPrice: BigNumber.BigNumber) => void): void;
    getAccounts(cd: (err: Error, accounts: Array<string>) => void): void;
    getBlockNumber(callback: (err: Error, blockNumber: number) => void): void;
    getSyncing(cd: (err: Error, syncing: SyncingResult) => void): void;
    isSyncing(cb: (err: Error, isSyncing: boolean, syncingState: SyncingState) => void): IsSyncing;

    getBlock(hashStringOrBlockNumber: string | BlockParam): BlockWithoutTransactionData;
    getBlock(
      hashStringOrBlockNumber: string | BlockParam,
      callback: (err: Error, blockObj: BlockWithoutTransactionData) => void
    ): void;
    getBlock(
      hashStringOrBlockNumber: string | BlockParam,
      returnTransactionObjects: boolean
    ): BlockWithTransactionData;
    getBlock(
      hashStringOrBlockNumber: string | BlockParam,
      returnTransactionObjects: boolean,
      callback: (err: Error, blockObj: BlockWithTransactionData) => void
    ): void;

    getBlockTransactionCount(hashStringOrBlockNumber: string | BlockParam): number;
    getBlockTransactionCount(
      hashStringOrBlockNumber: string | BlockParam,
      callback: (err: Error, blockTransactionCount: number) => void
    ): void;

    // TODO returnTransactionObjects
    getUncle(
      hashStringOrBlockNumber: string | BlockParam,
      uncleNumber: number
    ): BlockWithoutTransactionData;
    getUncle(
      hashStringOrBlockNumber: string | BlockParam,
      uncleNumber: number,
      callback: (err: Error, uncle: BlockWithoutTransactionData) => void
    ): void;

    getTransaction(transactionHash: string): Transaction;
    getTransaction(
      transactionHash: string,
      callback: (err: Error, transaction: Transaction) => void
    ): void;

    getTransactionFromBlock(
      hashStringOrBlockNumber: string | BlockParam,
      indexNumber: number
    ): Transaction;
    getTransactionFromBlock(
      hashStringOrBlockNumber: string | BlockParam,
      indexNumber: number,
      callback: (err: Error, transaction: Transaction) => void
    ): void;

    contract(abi: Array<AbiDefinition>): Contract<any>;

    // TODO block param
    getBalance(addressHexString: string, blockNumber?: number | string): BigNumber.BigNumber;
    getBalance(addressHexString: string,
               blockNumber?: number | string,
               callback?: (err: Error, result: BigNumber.BigNumber) => void): void;

    // TODO block param
    getStorageAt(address: string, position: number): string;
    getStorageAt(address: string, position: number, callback: (err: Error, storage: string) => void): void;

    // TODO block param
    getCode(addressHexString: string): string;
    getCode(addressHexString: string, callback: (err: Error, code: string) => void): void;

    filter(value: string | FilterObject, callback?: (err: Error, receipt: TransactionReceipt) => void): FilterResult;

    sendTransaction(txData: TxData): string;
    sendTransaction(txData: TxData, callback: (err: Error, value: string) => void): void;

    sendRawTransaction(rawTxData: string): string;
    sendRawTransaction(rawTxData: string, callback: (err: Error, value: string) => void): void;

    sign(address: string, data: string): string;
    sign(address: string, data: string, callback: (err: Error, signature: string) => void): void;

    getTransactionReceipt(txHash: string): TransactionReceipt | null;
    getTransactionReceipt(
      txHash: string,
      callback: (err: Error, receipt: TransactionReceipt | null) => void
    ): void;

    // TODO block param
    call(callData: CallData): string;
    call(callData: CallData, callback: (err: Error, result: string) => void): void;

    estimateGas(callData: CallData): number;
    estimateGas(callData: CallData, callback: (err: Error, gas: number) => void): void;

    getTransactionCount(address: string,
                        block?: number | string,
                        callback?: (err: Error, count: number) => void): void;
  }

  export interface VersionApi {
    api: string;
    network: string;
    node: string;
    ethereum: string;
    whisper: string;
    getNetwork(cd: (err: Error, networkId: string) => void): void;
    getNode(cd: (err: Error, nodeVersion: string) => void): void;
    getEthereum(cd: (err: Error, ethereum: string) => void): void;
    getWhisper(cd: (err: Error, whisper: string) => void): void;
  }

  export interface PersonalApi {
    listAccounts: Array<string> | undefined;
    newAccount(password?: string): string;
    unlockAccount(address: string, password?: string, duration?: number): boolean;
    lockAccount(address: string): boolean;
    sign(message: string, account: string, password: string): string;
    sign(hexMessage: string, account: string, callback: (error: Error, signature: string) => void): void;
  }

  export interface NetApi {
    listening: boolean;
    peerCount: number;
    getListening(cd: (err: Error, listening: boolean) => void): void;
    getPeerCount(cd: (err: Error, peerCount: number) => void): void;
  }

  export type BlockParam = number | "earliest" | "latest" | "pending";

  export type Unit =
    | "kwei"
    | "ada"
    | "mwei"
    | "babbage"
    | "gwei"
    | "shannon"
    | "szabo"
    | "finney"
    | "ether"
    | "kether"
    | "grand"
    | "einstein"
    | "mether"
    | "gether"
    | "tether";

  export interface SyncingState {
    startingBlock: number;
    currentBlock: number;
    highestBlock: number;
  }
  export type SyncingResult = false | SyncingState;

  export interface IsSyncing {
    addCallback(cb: (err: Error, isSyncing: boolean, syncingState: SyncingState) => void): void;
    stopWatching(): void;
  }

  export interface AbstractBlock {
    number: number | null;
    hash: string | null;
    parentHash: string;
    nonce: string | null;
    sha3Uncles: string;
    logsBloom: string | null;
    transactionsRoot: string;
    stateRoot: string;
    miner: string;
    difficulty: BigNumber.BigNumber;
    totalDifficulty: BigNumber.BigNumber;
    extraData: string;
    size: number;
    gasLimit: number;
    gasUsed: number;
    timestamp: number;
    uncles: Array<string>;
  }
  export interface BlockWithoutTransactionData extends AbstractBlock {
    transactions: Array<string>;
  }
  export interface BlockWithTransactionData extends AbstractBlock {
    transactions: Array<Transaction>;
  }

  export interface Transaction {
    hash: string;
    nonce: number;
    blockHash: string | null;
    blockNumber: number | null;
    transactionIndex: number | null;
    from: string;
    to: string | null;
    value: BigNumber.BigNumber;
    gasPrice: BigNumber.BigNumber;
    gas: number;
    input: string;
  }

  export interface CallTxDataBase {
    to?: string;
    value?: number | string | BigNumber.BigNumber;
    gas?: number | string | BigNumber.BigNumber;
    gasPrice?: number | string | BigNumber.BigNumber;
    data?: string;
    nonce?: number;
  }

  export interface TxData extends CallTxDataBase {
    from: string;
  }

  export interface CallData extends CallTxDataBase {
    from?: string;
  }
  export interface TransactionReceipt {

    blockHash: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
    from: string;
    to: string;
    status: null | string | 0 | 1;
    cumulativeGasUsed: number;
    gasUsed: number;
    contractAddress: string | null;
    logs: Array<LogEntry>;
  }

  export interface LogEntry {
    logIndex: number | null;
    transactionIndex: number | null;
    transactionHash: string;
    blockHash: string | null;
    blockNumber: number | null;
    address: string;
    data: string;
    topics: Array<string>;
  }
}
