import { promisify } from "es6-promisify";
import { DecodedLogEntry, LogEntry, TransactionReceipt } from "web3";
import { Hash } from "./commonTypes";
import { ConfigService } from "./configService";
import { TransactionReceiptTruffle } from "./contractWrapperBase";
import { LoggingService } from "./loggingService";
import { PubSubEventService } from "./pubSubEventService";
import { Utils } from "./utils";
import { UtilsInternal } from "./utilsInternal";
import { WrapperService } from "./wrapperService";
/* tslint:disable-next-line:no-var-requires */
const ethJSABI = require("ethjs-abi");

/**
 * Enables you to track the completion of transactions triggered by Arc.js functions.
 * You can subscribe to events that tell you how many transactions are anticipated when
 * the transactions have completed.  For more information, see [Tracking Transactions](/Transactions).
 */
export class TransactionService extends PubSubEventService {

  /**
   * Generate a new invocation key for the given string which typically looks
   * like: "[classname][functionname]".
   * @param functionName
   */
  public static generateInvocationKey(functionName: string): symbol {
    return Symbol(functionName);
  }

  /**
   * Publish the `kickoff` event and return the payload that should be passed
   * to the ensuing calls to `publishTxLifecycleEvents`.
   *
   * @hidden - for internal use only
   * @param functionName Looks like [classname].[functionname], the function that is generating the transaction.
   * @param options Arbitrary object to pass in the callback for each event
   * @param txCount The expected number of transactions, will be included in the payload.
   */
  public static publishKickoffEvent(
    functionName: string,
    options: any,
    txCount: number
  ): TransactionReceiptsEventInfo {

    const payload = TransactionService.createPayload(functionName, options, txCount);
    /**
     * publish the `kickoff` event
     */
    TransactionService._publishTxEvent([{ functionName, payload }], null, null, TransactionStage.kickoff);

    return payload;
  }

  /**
   * Send the given payload to subscribers of the given topic on `sent`, `mined` and `confirmed`.
   *
   * @hidden - for internal use only
   * @param eventStack array of TxEventSpec
   * @param tx the transaction id.
   * @param contract Truffle contract wrapper for the contract that is generating the transaction.
   */
  public static publishTxLifecycleEvents(
    eventStack: TxEventStack,
    tx: Hash,
    contract: any
  ): void {

    TransactionService._publishTxEvent(eventStack, tx, null, TransactionStage.sent);

    /**
     * We are at the base context and should start watching for the mined and confirmed transaction stages.
     */
    TransactionService.watchForMinedTransaction(tx, contract)
      .then((txReceiptMined: TransactionReceiptTruffle): void => {

        TransactionService._publishTxEvent(eventStack, tx, txReceiptMined, TransactionStage.mined);
        /**
         * now start watching for confirmation
         */
        TransactionService.watchForConfirmedTransaction(tx, contract)
          .then((txReceiptConfirmed: TransactionReceiptTruffle): void => {

            TransactionService._publishTxEvent(eventStack, tx, txReceiptConfirmed, TransactionStage.confirmed);
          });
      });
  }

  /**
   * Return a new event stack with the given one pushed onto it.
   * Will take obj.txEventStack, else create a new one.
   *
   * @hidden - for internal use only
   * @param obj
   * @param eventSpec
   * @param addToObject True to clone obj and add the new txEventContext to it
   */
  public static newTxEventContext(
    functionName: string,
    payload: TransactionReceiptsEventInfo,
    obj: Partial<TxGeneratingFunctionOptions> & any
  ): TxEventStack {

    const eventSpec: TxEventSpec = { functionName, payload };
    let eventStack: TxEventStack | undefined = obj.txEventStack;

    if (!eventStack) {
      eventStack = new Array<TxEventSpec>();
    }

    // clone to avoid problems with re-entrancy
    eventStack = [...eventStack];

    eventStack.push(eventSpec);

    return eventStack;
  }

  /**
   * Returns a promise of a TransactionReceipt once the given transaction has been mined.
   *
   * See also [getMinedTransaction](/api/classes/TransactionService#getMinedTransaction) and
   * [getTransactionDepth](/api/classes/TransactionService#getTransactionDepth).
   *
   * @param txHash the transaction hash
   * @param contract Optional contract instance or contract name of the contract that generated the transaction.
   * Supply this if you want decoded events (or else call `TransactionService.toTxTruffle` manually yourself)
   * @param requiredDepth Optional minimum block depth required to resolve the promise.  Default is 0.
   */
  public static async watchForMinedTransaction(
    txHash: Hash,
    contract: string | object = null,
    requiredDepth: number = 0
  ): Promise<TransactionReceipt | TransactionReceiptTruffle> {

    if (requiredDepth < 0) {
      throw Error(
        `TransactionService.watchForConfirmedTransaction: requiredDepth cannot be less then zero: ${requiredDepth}`);
    }

    return new Promise(async (
      resolve: (tx: TransactionReceipt | TransactionReceiptTruffle) => void,
      reject: (error: Error) => void): Promise<void> => {

      const web3 = await Utils.getWeb3();

      /**
       * see if we already have it
       */
      let receipt = await TransactionService.getMinedTransaction(txHash, contract, requiredDepth);
      if (receipt) {
        return resolve(receipt);
      }

      /**
       * Fires on every new block
       */
      const filter = web3.eth.filter("latest");

      filter.watch(
        async (error: Error): Promise<void> => {
          if (!error) {
            receipt = await TransactionService.getMinedTransaction(txHash, contract, requiredDepth);
            if (receipt) {
              filter.stopWatching();
              resolve(receipt);
            }
          } else {
            LoggingService.error(`TransactionService.watchForMinedTransaction: an error occurred: ${error.message}`);
            reject(error);
          }
        });
    });
  }

  /**
   * Returns a promise of a TransactionReceipt once the given transaction has been confirmed
   * according to the optional `requiredDepth`.
   *
   * See also [getConfirmedTransaction](/api/classes/TransactionService#getConfirmedTransaction) and
   * [getTransactionDepth](/api/classes/TransactionService#getTransactionDepth).
   *
   * @param txHash The transaction hash to watch
   * @param contract Optional contract instance or contract name of the contract that generated the transaction.
   * Supply this if you want decoded events (or else call `TransactionService.toTxTruffle` manually yourself)
   * @param requiredDepth Optional minimum block depth required to resolve the promise.
   * Default comes from the `ConfigurationService`.
   */
  public static async watchForConfirmedTransaction(
    txHash: Hash,
    contract: string | object = null,
    requiredDepth?: number): Promise<TransactionReceipt | TransactionReceiptTruffle> {

    requiredDepth = await TransactionService.getDefaultDepth(requiredDepth);

    return TransactionService.watchForMinedTransaction(txHash, contract, requiredDepth);
  }

  /**
   * Returns a promise of the number of blocks that have been added to the chain since
   * the given transaction appeared. Use this to decide whether a transaction is
   * sufficiently secure (confirmed).
   *
   * See also [getConfirmedTransaction](/api/classes/TransactionService#getConfirmedTransaction)
   * and [watchForConfirmedTransaction](/api/classes/TransactionService#watchForConfirmedTransaction).
   * @param tx txHash or TransactionReceipt
   * @returns Promise of the depth or -1 if the transaction cannot be found
   */
  public static async getTransactionDepth(tx: Hash | TransactionReceipt): Promise<number> {

    const web3 = await Utils.getWeb3();
    const lastBlockNum = await UtilsInternal.lastBlock();
    let receipt: TransactionReceipt;

    if (typeof tx === "string") {
      receipt = (await promisify(
        (innerCallback: any) => {
          web3.eth.getTransactionReceipt(tx, innerCallback);
        })()) as TransactionReceipt | null;
    } else {
      receipt = tx;
    }

    if (receipt) {
      const txBlockNum = receipt.blockNumber;
      return lastBlockNum - txBlockNum;
    } else {
      return Promise.resolve(-1);
    }
  }

  /**
   * Returns a promise of a TransactionReceipt for a mined transaction, or null if it hasn't yet been mined.
   * @param txHash
   * @param requiredDepth Optional minimum block depth required to resolve the promise.  Default is 0.
   * @param contract Optional contract instance or contract name of the contract that generated the transaction.
   * Supply this if you want decoded events (or else call `TransactionService.toTxTruffle` manually yourself)
   */
  public static async getMinedTransaction(
    txHash: Hash,
    contract: string | object = null,
    requiredDepth: number = 0): Promise<TransactionReceipt | TransactionReceiptTruffle | null> {

    const web3 = await Utils.getWeb3();
    return promisify((innerCallback: any) => {
      web3.eth.getTransactionReceipt(txHash, innerCallback);
    })()
      .then(async (receipt: TransactionReceipt | null) => {
        const depth = await TransactionService.getTransactionDepth(receipt);
        // blockNumber should always be set, but just in case...
        if ((receipt && !receipt.blockNumber) || (depth < requiredDepth)) { return null; } else {
          if (contract) {
            return TransactionService.toTxTruffle(receipt, contract);
          } else {
            return receipt;
          }
        }
      }) as Promise<TransactionReceipt | null>;
  }

  /**
   * Returns a promise of a TransactionReceipt for a confirmed transaction, or null if it hasn't yet been confirmed
   * according to the requiredDepth.
   * @param txHash
   * @param requiredDepth Optional minimum block depth required to resolve the promise.
   * Default comes from the `ConfigurationService`.
   * @param contract Optional contract instance or contract name of the contract that generated the transaction.
   * Supply this if you want decoded events (or else call `TransactionService.toTxTruffle` manually yourself)
   */
  public static async getConfirmedTransaction(
    txHash: Hash,
    contract: string | object = null,
    requiredDepth?: number): Promise<TransactionReceipt | TransactionReceiptTruffle | null> {

    requiredDepth = await TransactionService.getDefaultDepth(requiredDepth);
    return TransactionService.getMinedTransaction(txHash, contract, requiredDepth);
  }

  /**
   * Convert a mined TransactionReceipt to a TransactionReceiptTruffle with more readable logs
   * such as are produced by truffle (see `DecodedLogEntry`).
   *
   * @hidden - for internal use only
   *
   * @param txReceipt The mined tx
   * @param contract The truffle contract that generated the tx
   */
  public static toTxTruffle(txReceipt: TransactionReceipt, contract: string | object): TransactionReceiptTruffle {

    let contractInstance: any;

    if (typeof contract === "string") {
      const wrapper = WrapperService.wrappers[contract];
      if (!wrapper) {
        throw new Error(`TransactionService.toTxTruffle: can't find contract ${contract}`);
      }
      contractInstance = wrapper.contract;
    } else {
      contractInstance = contract;
    }
    const events = contractInstance.constructor.events;

    if ((txReceipt as any).receipt) {
      // then already done
      return;
    }

    const logs: Array<DecodedLogEntry<any>> = txReceipt.logs.map((log: LogEntry): DecodedLogEntry<any> => {
      const logABI = events[log.topics[0]];

      if (logABI == null) {
        return null;
      }
      const copy: DecodedLogEntry<any> & LogEntry = Object.assign({}, log) as any;

      const partialABI = (fullABI: any, indexed: any): any => {
        const inputs = fullABI.inputs.filter((i: any): boolean => {
          return i.indexed === indexed;
        });

        const partial = {
          anonymous: fullABI.anonymous,
          inputs,
          name: fullABI.name,
          type: fullABI.type,
        };

        return partial;
      };

      const argTopics = logABI.anonymous ? copy.topics : copy.topics.slice(1);
      const indexedData = "0x" + argTopics.map((topics: any): any => topics.slice(2)).join("");
      const indexedParams = ethJSABI.decodeEvent(partialABI(logABI, true), indexedData);

      const notIndexedData = copy.data;
      const notIndexedParams = ethJSABI.decodeEvent(partialABI(logABI, false), notIndexedData);

      copy.event = logABI.name;

      copy.args = logABI.inputs.reduce((acc: any, current: any): any => {
        let val = indexedParams[current.name];

        if (val === undefined) {
          val = notIndexedParams[current.name];
        }

        acc[current.name] = val;
        return acc;
      }, {});

      Object.keys(copy.args).forEach((key: any) => {
        const val = copy.args[key];

        // We have BN. Convert it to BigNumber
        if (val.constructor.isBN) {
          copy.args[key] = contractInstance.constructor.web3.toBigNumber("0x" + val.toString(16));
        }
      });

      delete copy.data;
      delete copy.topics;

      return copy as any;
    }).filter((log: DecodedLogEntry<any>): boolean => {
      return log != null;
    });

    return {
      logs,
      receipt: txReceipt,
      transactionHash: txReceipt.transactionHash,
    };
  }

  private static createPayload(
    functionName: string,
    options: any,
    txCount: number
  ): TransactionReceiptsEventInfo {

    const payload = {
      functionName,
      invocationKey: TransactionService.generateInvocationKey(functionName),
      options,
      tx: null,
      txCount,
      txReceipt: null,
      txStage: TransactionStage.kickoff,
    };

    return payload;
  }

  private static _publishTxEvent(
    eventStack: TxEventStack,
    tx: Hash,
    txReceipt: TransactionReceiptTruffle = null,
    txStage: TransactionStage
  ): void {

    for (let i = eventStack.length - 1; i >= 0; --i) {

      const eventSpec: TxEventSpec = eventStack[i];

      const functionName = eventSpec.functionName;

      const baseTopic = TransactionService.topicBaseFromFunctionName(functionName);

      /**
       * Clone to handle re-entrancy and ensure that recipients of the event can
       * rely on receiving a distinct payload for each event. This can be particularly
       * needed with fast networks like ganache, but also if the consumer is
       * saving these payloads on each stage of the lifecycle and expecting them
       * to be distinct.
       */
      const payload = Object.assign({}, eventSpec.payload);
      payload.tx = tx;
      payload.txReceipt = txReceipt;
      payload.txStage = txStage;

      PubSubEventService.publish(`${baseTopic}.${TransactionStage[txStage]}`, payload);
    }
  }

  private static topicBaseFromFunctionName(functionName: string): string {
    return `TxTracking.${functionName}`;
  }

  private static async getDefaultDepth(requiredDepth?: number): Promise<number> {

    if (typeof requiredDepth === "undefined") {
      const requiredDepths = ConfigService.get("txDepthRequiredForConfirmation");
      const networkName = await Utils.getNetworkName();
      requiredDepth = requiredDepths[networkName.toLowerCase()];
      if (typeof requiredDepth === "undefined") {
        requiredDepth = requiredDepths.default;
      }
    }
    return requiredDepth;
  }
}

export enum TransactionStage {
  kickoff,
  sent,
  mined,
  confirmed,
}

/**
 * Information supplied to the event callback when the event is published.
 */
export interface TransactionReceiptsEventInfo {
  /**
   * A value that is unique to the invocation of the function that is generating
   * the transaction. It is useful for grouping events by a single function invocation.
   */
  invocationKey: symbol;
  /**
   * The options that were passed to the function that is generating the transaction, if any.
   * In most cases this will have default values filled in.
   */
  options?: any;
  /**
   * The name of the function that is generating the transactions and these events.
   */
  functionName: string;
  /**
   * The transaction hash id.  Note that the transaction may not necessarily have completed successfully
   * in the case of errors or rejection.
   * Will be null in `kickoff` events.
   */
  tx: Hash | null;
  /**
   * The `TransactionReceiptTruffle` once the transaction has been mined.
   * Will be null in `kickoff` and `sent` events.
   */
  txReceipt: TransactionReceiptTruffle | null;
  /**
   * The total expected number of transactions.
   */
  txCount: number;
  /**
   * Stage of the transaction.  Can be `kickoff`, `sent`, `mined` or `confirmed`.
   */
  txStage: TransactionStage;
}

/**
 * @hidden - for internal use only
 */
export type TxEventStack = Array<TxEventSpec>;

/**
 * @hidden - for internal use only
 */
export interface TxEventSpec {
  functionName: string;
  payload: TransactionReceiptsEventInfo;
}

/**
 * @hidden - for internal use only
 */
export interface TxGeneratingFunctionOptions {
  txEventStack?: TxEventStack;
}
