import { BigNumber } from "bignumber.js";
import { promisify } from "es6-promisify";
import { Address, Hash } from "./commonTypes";
import { ConfigService } from "./configService";
import { ControllerService } from "./controllerService";
import {
  ArcTransactionDataResult,
  ArcTransactionResult,
  GasPriceAdjustor,
  IContractWrapper,
  IContractWrapperFactory,
  StandardSchemeParams
} from "./iContractWrapperBase";
import { LoggingService } from "./loggingService";
import {
  TransactionService,
  TransactionStage,
  TxEventContext,
  TxGeneratingFunctionOptions
} from "./transactionService";
import { Utils } from "./utils";
import { UtilsInternal } from "./utilsInternal";
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
   * Given a hash, returns the associated parameters as an object.
   * @param paramsHash
   */
  public getParameters(paramsHash: Hash): Promise<any> {
    throw new Error("getParameters has not been not implemented by the contract wrapper");
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
   * Estimate conservatively the amount of gas required to execute the given function with the given parameters.
   * Adds 21000 to the estimate computed by web3.
   *
   * @param func The function
   * @param params The parameters to send to the function
   * @param web3Params The web3 parameters (like "from", for example).  If it contains "gas"
   * then that value is returned, effectively a no-op.
   */
  public async estimateGas(
    func: ITruffleContractFunction,
    params: Array<any>,
    web3Params: any = {}): Promise<number> {

    if (web3Params.gas) {
      return web3Params.gas;
    }

    const currentNetwork = await Utils.getNetworkName();

    const maxGasLimit = await UtilsInternal.computeMaxGasLimit();

    // note that Ganache is identified specifically as the one instantiated by arc.js (by the networkId)
    if (currentNetwork === "Ganache") {
      return maxGasLimit; // because who cares with ganache and we can't get good estimates from it
    }

    /**
     * Add the input web3 params to the params we pass to estimateGas.
     * Include maxGasLimit just for doing the estimation.
     * I believe estimateGas will return a value will not exceed maxGasLimit.
     * If it returns maxGasLimit then the actual function will probably run out of gas when called for real.
     * TODO:  Throw an exception in that case?
     */
    params = params.concat(Object.assign({ gas: maxGasLimit }, web3Params));
    return Math.max(Math.min((await func.estimateGas(...params)), maxGasLimit), 21000);
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

  protected _getParametersHash(...params: Array<any>): Promise<Hash> {
    return this.contract.getParametersHash(...params);
  }

  /**
   * See [Web3EventService.createEventFetcherFactory](Web3EventService.md#createEventFetcherFactory).
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
    func: ITruffleContractFunction,
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
   * @param eventContext The TxTracking context
   * @param func The contract function
   * @param params The contract function parameters
   * @param web3Params Optional web params, like `from`
   */
  protected async sendTransaction(
    eventContext: TxEventContext,
    func: ITruffleContractFunction,
    params: Array<any>,
    web3Params: any = {}
  ): Promise<Hash> {

    try {
      let error;

      const gasPriceComputed = ConfigService.get("gasPriceAdjustment") as GasPriceAdjustor;
      const web3 = await Utils.getWeb3();

      if (gasPriceComputed && !web3Params.gasPrice) {
        if (gasPriceComputed) {
          const defaultGasPrice =
            await promisify((callback: any): void => { web3.eth.getGasPrice(callback); })() as BigNumber;
          web3Params.gasPrice = await gasPriceComputed(defaultGasPrice);
        }
        LoggingService.debug(
          `invoking function with configured gasPrice: ${web3.fromWei(web3Params.gasPrice, "gwei")}`);
      }

      if (ConfigService.get("estimateGas") && !web3Params.gas) {
        await this.estimateGas(func, params, web3Params)
          .then((gas: number) => {
            // side-effect of altering web3Params allows caller to know what we used
            Object.assign(web3Params, { gas });
            LoggingService.debug(`invoking function with estimated gas: ${gas}`);
          })
          .catch((ex: Error) => {
            LoggingService.error(`estimateGas failed: ${ex}`);
            error = ex;
          });
      } else if (web3Params.gas) {
        // cap any already-given gas limit
        web3Params.gas = Math.min(web3Params.gas, await UtilsInternal.computeMaxGasLimit());
      }

      if (error) {
        // don't attempt sending the tx
        throw error;
      }

      params = params.concat(web3Params);

      const txHash = await func.sendTransaction(...params)
        .then((tx: Hash) => tx)
        /**
         * Because of truffle's faked Promise implementation, catching here is the only way
         * to be able to catch it on the outside
         */
        .catch((ex: Error) => {
          error = ex;
          return null;
        });

      if (error) {
        throw error;
      }

      return txHash;
    } catch (ex) {
      // catch every possible error
      TransactionService.publishTxFailed(eventContext, TransactionStage.sent, ex);
      throw ex;
    }
  }

  protected logContractFunctionCall(functionName: string, params?: any): void {
    LoggingService.debug(`${functionName}: ${params ? `${LoggingService.stringifyObject(params)}` : "no parameters"}`);
  }
}

export type TruffleContractFunction = (args?: Array<any>) => Promise<Hash>;

export interface ITruffleContractFunction extends TruffleContractFunction {
  sendTransaction: (args?: Array<any>) => Promise<Hash>;
  estimateGas: (args?: Array<any>) => number;
}
