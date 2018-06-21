import TruffleContract = require("truffle-contract");
import { TransactionReceipt } from "web3";
import { IntVoteInterfaceWrapper } from ".";
import { AvatarService } from "./avatarService";
import { Address, HasContract, Hash, SchemePermissions } from "./commonTypes";
import { IContractWrapperFactory } from "./contractWrapperFactory";
import { LoggingService } from "./loggingService";
import { TransactionService, TxEventStack, TxGeneratingFunctionOptions } from "./transactionService";
import { Utils } from "./utils";
import { EventFetcherFactory, Web3EventService } from "./web3EventService";
/**
 * Abstract base class for all Arc contract wrapper classes
 *
 * Example of how to define a wrapper:
 *
 * ```
 * import { ContractWrapperBase } from "../contractWrapperBase";
 * import { ContractWrapperFactory } from "../contractWrapperFactory";
 *
 * export class AbsoluteVoteWrapper extends ContractWrapperBase {
 *   [ wrapper properties and methods ]
 * }
 *
 * export const AbsoluteVote = new ContractWrapperFactory(
 *  "AbsoluteVote",
 *  AbsoluteVoteWrapper,
 *  new Web3EventService());
 * ```
 */
export abstract class ContractWrapperBase implements HasContract {

  /**
   * The wrapper factor class providing static methods `at(someAddress)`, `new()` and `deployed()`.
   */
  public abstract factory: IContractWrapperFactory<any>;
  /**
   * The name of the contract.
   */
  public abstract name: string;
  /**
   * A more friendly name for the contract.
   */
  public abstract friendlyName: string;
  /**
   * The address of the contract
   */
  public get address(): Address { return this.contract.address; }
  /**
   * The underlying truffle contract object.  Use this to access
   * parts of the contract that aren't accessible via the wrapper.
   */
  public contract: any;

  /**
   * ContractWrapperFactory constructs this
   * @param solidityContract The json contract truffle artifact
   * @param web3EventService
   */
  constructor(private solidityContract: any, protected web3EventService: Web3EventService) {
  }

  /**
   * Initialize from a newly-migrated instance.
   * This will migrate a new instance of the contract to the net.
   * @returns this
   */
  public async hydrateFromNew(...rest: Array<any>): Promise<any> {
    try {
      // Note that because we are using `.then`, we are returning a true promise
      // rather than the incomplete one returned by truffle.
      this.contract = await this.solidityContract.new(...rest)
        .then((contract: any) => contract, (error: any) => { throw error; });
      this.hydrated();
    } catch (ex) {
      LoggingService.error(`hydrateFromNew failing: ${ex}`);
      return undefined;
    }
    return this;
  }

  /**
   * Initialize from a given address on the current network.
   * @param address of the deployed contract
   * @returns this
   */
  public async hydrateFromAt(address: string): Promise<any> {
    try {
      // Note that because we are using `.then`, we are returning a true promise
      // rather than the incomplete one returned by truffle.
      this.contract = await this.solidityContract.at(address)
        .then((contract: any) => contract, (error: any) => { throw error; });
      this.hydrated();
    } catch (ex) {
      LoggingService.error(`hydrateFromAt failing: ${ex}`);
      return undefined;
    }
    return this;
  }

  /**
   * Initialize as it was migrated by Arc.js on the current network.
   * @returns this
   */
  public async hydrateFromDeployed(): Promise<any> {
    try {
      // Note that because we are using `.then`, we are returning a true promise
      // rather than the incomplete one returned by truffle.
      this.contract = await this.solidityContract.deployed()
        .then((contract: any) => contract, (error: any) => { throw error; });
      this.hydrated();
    } catch (ex) {
      LoggingService.error(`hydrateFromDeployed failing: ${ex}`);
      return undefined;
    }
    return this;
  }

  /**
   * Call setParameters on this.contract.
   * Returns promise of ArcTransactionDataResult<Hash> where Result is the parameters hash.
   *
   * @param {any} params -- parameters as the contract.setParameters function expects them.
   */
  public async setParameters(...params: Array<any>): Promise<ArcTransactionDataResult<Hash>> {
    throw new Error("setParameters has not been not implemented by the contract wrapper");
  }

  /**
   * Given a hash, returns the associated parameters as an object.
   * @param paramsHash
   */
  public async getParameters(paramsHash: Hash): Promise<any> {
    throw new Error("getParameters has not been not implemented by the contract wrapper");
  }

  /**
   * Given an avatar address, returns the schemes parameters hash
   * @param avatarAddress
   */
  public async getSchemeParametersHash(avatarAddress: Address): Promise<Hash> {
    const controller = await this.getController(avatarAddress);
    return controller.getSchemeParameters(this.address, avatarAddress);
  }

  /**
   * Given a hash, returns the associated parameters as an array, ordered by the order
   * in which the parameters appear in the contract's Parameters struct.
   * @param paramsHash
   */
  public async getParametersArray(paramsHash: Hash): Promise<Array<any>> {
    return this.contract.parameters(paramsHash);
  }

  /**
   * Returns the controller associated with the given avatar
   * @param avatarAddress
   */
  public async getController(avatarAddress: Address): Promise<any> {
    const avatarService = new AvatarService(avatarAddress);
    return avatarService.getController();
  }

  /**
   * invoked to let base classes know that the `contract` is available.
   */
  /* tslint:disable-next-line:no-empty */
  protected hydrated(): void { }

  protected async _setParameters(
    functionName: string,
    txEventStack: TxEventStack,
    ...params: Array<any>): Promise<ArcTransactionDataResult<Hash>> {

    const parametersHash: Hash = await this.contract.getParametersHash(...params);

    const txResult = await this.wrapTransactionInvocation(functionName,
      Object.assign(params, { txEventStack }),
      () => {
        return this.contract.setParameters.sendTransaction(...params);
      });

    return new ArcTransactionDataResult<Hash>(txResult.tx, this.contract, parametersHash);
  }

  /**
   * Returns this scheme's permissions.
   * @param avatarAddress
   */
  protected async _getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions> {
    const permissions = await (await this.getController(avatarAddress))
      .getSchemePermissions(this.address, avatarAddress) as string;

    return SchemePermissions.fromString(permissions);
  }

  protected async _getSchemeParameters(avatarAddress: Address): Promise<any> {
    const paramsHash = await this.getSchemeParametersHash(avatarAddress);
    return this.getParameters(paramsHash);
  }

  /**
   * See [Web3EventService.createEventFetcherFactory](Web3EventService#createEventFetcherFactory).
   *
   * @type TArgs
   * @param eventName
   */
  protected createEventFetcherFactory<TArgs>(baseEvent: any): EventFetcherFactory<TArgs> {
    return this.web3EventService.createEventFetcherFactory(baseEvent);
  }

  protected validateStandardSchemeParams(params: StandardSchemeParams): void {
    if (!params.voteParametersHash) {
      throw new Error(`voteParametersHash is not defined`);
    }
    if (!params.votingMachineAddress) {
      throw new Error(`votingMachineAddress is not defined`);
    }
  }

  /**
   * Wrap code that creates a transaction in the given transaction event. This is a helper
   * just for the common case of generating a single transaction.
   * @param functionName Should look like [contractName].[functionName]
   * @param options Options that will be passed to the contract function being invoked
   * @param generateTx Callback that will invoke the contract function
   */
  protected async wrapTransactionInvocation(
    functionName: string,
    options: Partial<TxGeneratingFunctionOptions> & any,
    generateTx: () => Promise<Hash>): Promise<ArcTransactionResult> {

    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);

    const tx = await generateTx();

    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);

    TransactionService.publishTxLifecycleEvents(eventContext, tx, this.contract);

    return new ArcTransactionResult(tx, this.contract);
  }

  protected logContractFunctionCall(functionName: string, params?: any): void {
    LoggingService.debug(`${functionName}: ${params ? `${LoggingService.stringifyObject(params)}` : "no parameters"}`);
  }

  protected async sendTransaction(
    fn: { sendTransaction: (...rest: Array<any>) => Promise<Hash> },
    ...args: Array<any>): Promise<ArcTransactionResult> {

    const txHash = await fn.sendTransaction(...args);
    return new ArcTransactionResult(txHash, this.contract);
  }
}

/**
 * The bundle of logs, TransactionReceipt and other information as returned by Truffle after invoking
 * a contract function that causes a transaction.
 */
export interface TransactionReceiptTruffle {
  logs: Array<any>;
  receipt: TransactionReceipt;
  transactionHash: Hash;
  /**
   * address of the transaction
   */
  // tx: Address;
}

export class ArcTransactionResult {

  constructor(
    public tx: Hash,
    private contract: TruffleContract) {
  }

  /**
   * Returns promise of a mined transaction if it already exists,
   * converted to a TransactionReceiptTruffle, or null if it doesn't exist.
   */
  public async getTxMined(): Promise<TransactionReceiptTruffle | null> {
    const tx = await TransactionService.getMinedTransaction(this.tx);
    return TransactionService.toTxTruffle(tx, this.contract);
  }

  /**
   * Returns promise of a mined transaction, converted to a TransactionReceiptTruffle
   */
  public async watchForTxMined(): Promise<TransactionReceiptTruffle> {
    const tx = await TransactionService.watchForMinedTransaction(this.tx);
    return TransactionService.toTxTruffle(tx, this.contract);
  }

  /**
   * Returns promise of a value from the logs of the mined transaction. Will watch for the mined tx,
   * so could take a while to return.
   * @param valueName - The name of the property whose value we wish to return
   * @param eventName - Name of the event in whose log we are to look for the value
   * @param index - Index of the log in which to look for the value, when eventName is not given.
   * Default is the index of the last log in the transaction.
   */
  public async getValueFromMinedTx(
    valueName: string,
    eventName: string = null, index: number = 0): Promise<any | undefined> {
    const txMined = await this.watchForTxMined();
    return Utils.getValueFromLogs(txMined, valueName, eventName, index);
  }
}
/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction and initiate a proposal.
 */
export class ArcTransactionProposalResult extends ArcTransactionResult {
  /**
   * The proposal's voting machine, as IntVoteInterfaceWrapper
   */
  public votingMachine: IntVoteInterfaceWrapper;

  constructor(
    tx: Hash,
    contract: TruffleContract,
    votingMachine: IntVoteInterfaceWrapper) {
    super(tx, contract);
    this.votingMachine = votingMachine;
  }

  /**
   * Returns promise of the proposal id from the logs of the mined transaction. Will watch for the mined tx;
   * if it hasn't yet been mined, could take a while to return.
   */
  public async getProposalIdFromMinedTx(): Promise<Hash> {
    return this.getValueFromMinedTx("_proposalId");
  }
}

/**
 * Base or actual type returned by all contract wrapper methods that generate a transaction and any other result.
 */
export class ArcTransactionDataResult<TData> extends ArcTransactionResult {
  /**
   * Additional data being returned.
   */
  public result: TData;

  constructor(
    tx: Hash,
    contract: TruffleContract,
    result: TData) {
    super(tx, contract);
    this.result = result;
  }
}

/**
 * Common scheme parameters for schemes that are able to create proposals.
 */
export interface StandardSchemeParams extends TxGeneratingFunctionOptions {
  /**
   * Hash of the voting machine parameters to use when voting on a proposal.
   */
  voteParametersHash: Hash;
  /**
   * Address of the voting machine to use when voting on a proposal.
   */
  votingMachineAddress: Address;
}

export { DecodedLogEntryEvent, TransactionReceipt } from "web3";
