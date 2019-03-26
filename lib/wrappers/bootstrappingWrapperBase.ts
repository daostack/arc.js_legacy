'use strict';
import BigNumber from 'bignumber.js';
import { promisify } from 'es6-promisify';
import { Address, Hash } from '../commonTypes';
import { ConfigService } from '../configService';
import { ITruffleContractFunction } from '../contractWrapperBase';
import { ArcTransactionResult, GasPriceAdjustor } from '../iContractWrapperBase';
import { LoggingService } from '../loggingService';
import { SchemeWrapperBase } from '../schemeWrapperBase';
import {
  TransactionService,
  TransactionStage,
  TxEventContext,
  TxGeneratingFunctionOptions
} from '../transactionService';
import { Utils, Web3 } from '../utils';
import { UtilsInternal } from '../utilsInternal';

export abstract class BootstrappingWrapperBase extends SchemeWrapperBase {
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
   * @param legalContractHash: Hash
   * @param web3Params Optional web params, like `from`
   */
  protected async wrapTransactionInvocationWithPayload(
    functionName: string,
    options: Partial<TxGeneratingFunctionOptions> & any,
    func: ITruffleContractFunction,
    params: Array<any>,
    legalContractHash: Hash,
    web3Params?: any): Promise<ArcTransactionResult> {

    // if (!referrerAddress) {
    //   return this.wrapTransactionInvocation(
    //     functionName,
    //     options,
    //     func,
    //     params,
    //     web3Params
    //   );
    // }

    if (typeof (legalContractHash) === 'undefined') {
      throw new Error('legalContractHash is undefined');
    }

    const payload = TransactionService.publishKickoffEvent(functionName, options, 1);
    const eventContext = TransactionService.newTxEventContext(functionName, payload, options);

    try {

      const txHash = await this.sendTransactionWithPayload(
        eventContext,
        functionName,
        func,
        params,
        legalContractHash,
        web3Params);

      TransactionService.publishTxLifecycleEvents(eventContext, txHash, this.contract);

      return new ArcTransactionResult(txHash, this.contract);
    } catch (ex) {
      LoggingService.error(
        // tslint:disable-next-line: max-line-length
        `BootstrappingWrapperBase.wrapTransactionInvocationWithPayload: An error occurred calling ${functionName}: ${ex}`);
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
   * @param functionName The contract function name (*just* the function name, on prepended contract name)
   * @param func The contract function
   * @param params The contract function parameters
   * @param legalContractHash: Hash
   * @param web3Params Optional web params, like `from`
   */
  protected async sendTransactionWithPayload(
    eventContext: TxEventContext,
    functionName: string,
    func: ITruffleContractFunction,
    params: Array<any>,
    legalContractHash: Hash,
    web3Params: any = {}
  ): Promise<Hash> {

    try {
      let error;

      const gasPriceComputed = ConfigService.get('gasPriceAdjustment') as GasPriceAdjustor;
      const web3 = await Utils.getWeb3();

      if (gasPriceComputed && !web3Params.gasPrice) {
        if (gasPriceComputed) {
          const defaultGasPrice =
            await promisify((callback: any): void => { web3.eth.getGasPrice(callback); })() as BigNumber;
          web3Params.gasPrice = await gasPriceComputed(defaultGasPrice);
        }
        LoggingService.debug(
          `invoking function with configured gasPrice: ${web3.fromWei(web3Params.gasPrice, 'gwei')}`);
      }

      if (ConfigService.get('estimateGas') && !web3Params.gas) {
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

      return this._sendTransactionWithPayload(
        web3,
        functionName.substring(functionName.indexOf('.') + 1),
        legalContractHash,
        params,
        web3Params);
    } catch (ex) {
      // catch every possible error
      TransactionService.publishTxFailed(eventContext, TransactionStage.sent, ex);
      throw ex;
    }
  }

  private async _sendTransactionWithPayload(
    web3: Web3,
    functionName: string,
    legalContractHash: Hash,
    functionParameters: Array<any>,
    web3Params?: any): Promise<Hash> {

    const contractName = this.name;
    const contractAddress = this.address;

    const truffleContract = await Utils.requireContract(contractName);

    const abi = truffleContract.abi.filter((entry: any) => entry.name === functionName)[0];

    // tslint:disable-next-line: variable-name
    const SolidityFunction = require('web3/lib/web3/function');

    const func = new SolidityFunction(
      web3.eth,
      abi,
      contractAddress
    );

    const coder = require('web3/lib/solidity/coder');
    const signature = func.signature();
    const payload = {} as any;
    payload.to = contractAddress;
    payload.from = await Utils.getDefaultAccount();
    payload.data =
      '0x' +
      signature +
      coder.encodeParams(
        [...func._inputTypes, 'bytes32'],
        [...functionParameters, legalContractHash]);

    if (web3Params) {
      Object.assign(payload, web3Params);
    }

    return promisify((callback: any): any => web3.eth.sendTransaction(payload, callback))() as Promise<Hash>;
  }
}
