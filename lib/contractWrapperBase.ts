import { Address, DefaultSchemePermissions, Hash, SchemePermissions } from "./commonTypes";
import { ControllerService } from "./controllerService";
import {
  ArcTransactionDataResult,
  ArcTransactionResult,
  IContractWrapper,
  IContractWrapperFactory,
  StandardSchemeParams,
} from "./iContractWrapperBase";
import { LoggingService } from "./loggingService";
import {
  TransactionService,
  TxEventContext,
  TxGeneratingFunctionOptions,
  IHasEstimateGasFunction,
  TransactionStage
} from "./transactionService";
import { EventFetcherFactory, Web3EventService } from "./web3EventService";

/**
 * Abstract base class for all Arc contract wrapper classes.
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
export abstract class ContractWrapperBase implements IContractWrapper {

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
  public async hydrateFromNew(...rest: Array<any>): Promise<IContractWrapper> {
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
   * @returns this or undefined if not found
   */
  public async hydrateFromAt(address: string): Promise<IContractWrapper> {
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
   * @returns this or undefined if not found
   */
  public async hydrateFromDeployed(): Promise<IContractWrapper> {
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
   * Given a hash, returns the associated parameters as an object.
   * @param paramsHash
   */
  public getParameters(paramsHash: Hash): Promise<any> {
    throw new Error("getParameters has not been not implemented by the contract wrapper");
  }

  /**
   * Given an avatar address, returns the schemes parameters hash
   * @param avatarAddress
   */
  public async getSchemeParametersHash(avatarAddress: Address): Promise<Hash> {
    const controllerService = new ControllerService(avatarAddress);
    const controller = await controllerService.getController();
    return controller.getSchemeParameters(this.address, avatarAddress);
  }

  /**
   * Given a hash, returns the associated parameters as an array, ordered by the order
   * in which the parameters appear in the contract's Parameters struct.
   * @param paramsHash
   */
  public getParametersArray(paramsHash: Hash): Promise<Array<any>> {
    return this.contract.parameters(paramsHash);
  }

  /**
   * TODO: getDefaultPermissions should be moved to a new subclass `SchemeWrapper`
   * which itself would be a base class for a new class `UniversalScheme`
   */

  /**
   * Any scheme that needs greater permissions should override this
   * @hidden - for internal use only.
   * This method will eventually be moved (see comment above)
   */
  public getDefaultPermissions(): SchemePermissions {
    return DefaultSchemePermissions.MinimumPermissions as number;
  }

  /**
   * invoked to let base classes know that the `contract` is available.
   */
  /* tslint:disable-next-line:no-empty */
  protected hydrated(): void { }

  protected async _setParameters(
    functionName: string,
    txEventContext: TxEventContext,
    ...params: Array<any>): Promise<ArcTransactionDataResult<Hash>> {

    const parametersHash: Hash = await this.contract.getParametersHash(...params);

    const txResult = await this.wrapTransactionInvocation(functionName,
      // typically this is supposed to be an object, but here it is an array
      Object.assign(params, { txEventContext }),
      this.contract.setParameters,
      params);

    return new ArcTransactionDataResult<Hash>(txResult.tx, this.contract, parametersHash);
  }

  /**
   * Returns this scheme's permissions.
   * @param avatarAddress
   */
  protected async _getSchemePermissions(avatarAddress: Address): Promise<SchemePermissions> {
    const controllerService = new ControllerService(avatarAddress);
    const controller = await controllerService.getController();
    const permissions = await controller.getSchemePermissions(this.address, avatarAddress) as string;

    return SchemePermissions.fromString(permissions);
  }

  protected async _getSchemeParameters(avatarAddress: Address): Promise<any> {
    const paramsHash = await this.getSchemeParametersHash(avatarAddress);
    return this.getParameters(paramsHash);
  }

  protected _getParametersHash(...params: Array<any>): Promise<Hash> {
    return this.contract.getParametersHash(...params);
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
   * @param options Options that will be passed in the event payload, and
   * potentially containing a txEventContext
   * @param generateTx Callback that will  the contract function
   * @param func The contract function
   * @param params The contract function parameters
   * @param web3Params Optional web params, like `from`
   */
  protected async wrapTransactionInvocation(
    functionName: string,
    options: Partial<TxGeneratingFunctionOptions> & any,
    func: IHasSendTransactionFunction,
    params: Array<any>,
    web3Params?: any): Promise<ArcTransactionResult> {

    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);

    try {
      const txHash = await this.sendTransaction(eventContext, func, params, web3Params);
      TransactionService.publishTxLifecycleEvents(eventContext, txHash, this.contract);
      return new ArcTransactionResult(txHash, this.contract);
    } catch (ex) {
      LoggingService.error(
        `ContractWrapperBase.wrapTransactionInvocation: An error occurred calling ${functionName}: ${ex}`);
      throw ex;
    }
  }

  /**
   * Invoke sendTransaction on the function.  Properly publish TxTracking events.
   * Rethrows exceptions that occur.
   *
   * If `ConfigService.get("estimateGas")` and gas was not already supplied,
   * then we estimate gas.
   * 
   * Assumes a web3Params object is not already appended to params array.
   * 
   * @hidden
   * 
   * @param eventContext The TxTracking context
   * @param func The contract function
   * @param params The contract function parameters
   * @param web3Params Optional web params, like `from`
   */
  protected async sendTransaction(
    eventContext: TxEventContext,
    func: IHasSendTransactionFunction,
    params: Array<any>,
    web3Params: any = {}
  ): Promise<Hash> {

    try {
      web3Params = await TransactionService.paramsForOptimalGasParameters(func, params, web3Params);

      params = params.concat(web3Params);

      return func.sendTransaction(...params);

    } catch (ex) {
      TransactionService.publishTxFailed(eventContext, TransactionStage.sent, ex);
      throw ex;
    }
  }

  protected logContractFunctionCall(functionName: string, params?: any): void {
    LoggingService.debug(`${functionName}: ${params ? `${LoggingService.stringifyObject(params)}` : "no parameters"}`);
  }
}

/**
 * @hidden
 */
export type HasSendTransactionFunction = (args?: Array<any>) => Promise<Hash>;

/**
 * @hidden
 */
export interface IHasSendTransactionFunction extends HasSendTransactionFunction, IHasEstimateGasFunction {
  sendTransaction?: (args?: Array<any>) => Promise<Hash>;
}
