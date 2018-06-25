import { AvatarService } from "./avatarService";
import { Address, Hash, SchemePermissions } from "./commonTypes";
import {
  ArcTransactionDataResult,
  ArcTransactionResult,
  IContractWrapperBase,
  IContractWrapperFactory,
  StandardSchemeParams
} from "./iContractWrapperBase";
import { LoggingService } from "./loggingService";
import {
  TransactionService,
  TransactionStage,
  TxEventStack,
  TxGeneratingFunctionOptions
} from "./transactionService";
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
export abstract class ContractWrapperBase implements IContractWrapperBase {

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
      // typically this is supposed to be an object, but here it is an array
      Object.assign(params, { txEventStack }),
      this.contract.setParameters,
      params);

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
   * Rethrows exceptions that occur.
   *
   * @param functionName Should look like [contractName].[functionName]
   * @param options Options that will be passed to the contract function being invoked
   * @param generateTx Callback that will  the contract function
   * @param func The contract function
   * @param params The contract function parameters
   * @param web3Params Optional web params, like `from`
   */
  protected async wrapTransactionInvocation(
    functionName: string,
    options: Partial<TxGeneratingFunctionOptions> & any,
    func: ITruffleContractFunction,
    params: Array<any>,
    web3Params?: any): Promise<ArcTransactionResult> {

    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);
    let error;

    try {
      const txHash = await this.sendTransaction(eventContext, func, params, web3Params);
      TransactionService.publishTxLifecycleEvents(eventContext, txHash, this.contract);
      return new ArcTransactionResult(txHash, this.contract);
    } catch (ex) {
      LoggingService.error(
        `ContractWrapperBase.wrapTransactionInvocation: An error occurred calling ${functionName}: ${ex}`);
      error = ex;
    }

    if (error) {
      throw error;
    }
  }

  /**
   * Invoke sendTransaction on the function.  Properly publish TxTracking events.
   * Rethrows exceptions that occur.
   * @param eventContext
   * @param func
   * @param params
   * @param web3Params
   */
  protected sendTransaction(
    eventContext: TxEventStack,
    func: ITruffleContractFunction,
    params: Array<any>,
    web3Params: any = {}
  ): Promise<Hash> {

    params = params.concat(web3Params);

    return func.sendTransaction(...params)
      .then((txHash: Hash) => txHash)
      .catch((ex: Error) => {
        TransactionService.publishTxFailed(eventContext, TransactionStage.sent);
        throw ex;
      });
  }

  protected logContractFunctionCall(functionName: string, params?: any): void {
    LoggingService.debug(`${functionName}: ${params ? `${LoggingService.stringifyObject(params)}` : "no parameters"}`);
  }
}

export type TruffleContractFunction = (args?: Array<any>) => Promise<Hash>;

export interface ITruffleContractFunction extends TruffleContractFunction {
  sendTransaction: (args?: Array<any>) => Promise<Hash>;
}
