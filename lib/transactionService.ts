import { promisify } from "es6-promisify";
import TruffleContract = require("truffle-contract");
import { DecodedLogEntry, LogEntry, TransactionReceipt } from "web3";
import { Hash } from "./commonTypes";
import { ConfigService } from "./configService";
import { TransactionReceiptTruffle } from "./contractWrapperBase";
import { LoggingService } from "./loggingService";
import { PubSubEventService } from "./pubSubEventService";
import { Utils } from "./utils";
import { UtilsInternal } from "./utilsInternal";
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
    TransactionService._publishTxEvent(functionName, payload, TransactionStage.kickoff);

    return payload;
  }

  /**
   * Send the given payload to subscribers of the given topic on `sent`, `mined` and `confirmed`.
   *
   * @hidden - for internal use only
   * @param functionName Looks like [classname].[functionname]
   * @param payload Sent in the subscription callback.
   * @param tx the transaction id.
   * @param contract TruffleContract for the contract that is generating the transaction.
   * @param popContextOnConfirmed Optional, true to pop the context when transaction is confirmed.
   * (TODO: consider eliminating popContextOnConfirmed)
   * @returns True if there are any subscribers
   */
  public static publishTxLifecycleEvents(
    functionName: string,
    payload: TransactionReceiptsEventInfo,
    tx: Hash,
    contract: TruffleContract,
    popContextOnConfirmed: boolean = false
  ): void {

    payload.tx = tx;
    TransactionService._publishTxEvent(functionName, payload, TransactionStage.sent);

    /**
     * We are at the base context and should start watching for the mined and confirmed transaction stages.
     */
    TransactionService.watchForMinedTransaction(tx)
      .then((txReceiptMined: TransactionReceipt): void => {

        payload.txReceipt = TransactionService.toTxTruffle(txReceiptMined, contract);

        TransactionService._publishTxEvent(functionName, payload, TransactionStage.mined);
        /**
         * now start watching for confirmation
         */
        TransactionService.watchForConfirmedTransaction(tx)
          .then((txReceiptConfirmed: TransactionReceipt): void => {

            payload.txReceipt = TransactionService.toTxTruffle(txReceiptConfirmed, contract);

            TransactionService._publishTxEvent(functionName, payload, TransactionStage.confirmed);
            if (popContextOnConfirmed) {
              TransactionService.popContext();
            }
          });
      });
  }

  /**
   * Push an event triggering context.  The presence of this context sets a scope within which events matching the
   * filter will trigger the event topic given in the payload.  Contexts may be nested within one another.  Thus
   * topic A may trigger topic B which may trigger topic C.  Thus the contexts are represented as a stack.
   *
   * @hidden - for internal use only
   * @param topicTriggerFilter topic(s) that should be trigger the publishing of the topic given in the payload.
   * @param payload The topic payload for the triggered topic.  The payload contains the topic string itself.
   */
  public static pushContext(
    topicTriggerFilter: Array<string> | string,
    payload: TransactionReceiptsEventInfo): EventContext {

    const eventContext = {
      payload,
      topicTriggerFilter: UtilsInternal.ensureArray(topicTriggerFilter)
        .map((t: string) => TransactionService.topicBaseFromFunctionName(t)),
    };
    TransactionService.contextStack.push(eventContext);
    LoggingService.debug(`TransactionService.pushContext: length: ${TransactionService.contextStack.length}`);

    return eventContext;
  }

  /**
   * Pop the current context off the stack.  Logs a warning when the stack is already empty.
   *
   * @hidden - for internal use only
   */
  public static popContext(): void {
    if (TransactionService.contextStack.length === 0) {
      LoggingService.warn(`popContext: TransactionService.eventContext is already empty`);
    }
    TransactionService.contextStack.pop();
    LoggingService.debug(`TransactionService.popContext: length: ${TransactionService.contextStack.length}`);
  }

  /**
   * Returns a promise of a TransactionReceipt once the given transaction has been mined.  Before watching,
   * checks to see whether the transaction has already been mined.
   *
   * Note you can use `TransactionService.getMinedTransaction` to try to obtain
   * a TransactionReceipt without watching for it when it hasn't yet been mined.
   *
   * @param txHash the transaction hash
   * @param requiredDepth optional minimum block depth required to resolve the promise.  Default is 0.
   */
  public static async watchForMinedTransaction(txHash: Hash, requiredDepth: number = 0): Promise<TransactionReceipt> {

    if (requiredDepth < 0) {
      throw Error(
        `TransactionService.watchForConfirmedTransaction: requiredDepth cannot be less then zero: ${requiredDepth}`);
    }

    return new Promise(async (
      resolve: (tx: TransactionReceipt) => void,
      reject: (error: Error) => void): Promise<void> => {

      const web3 = await Utils.getWeb3();

      /**
       * see if we already have it
       */
      let receipt = await TransactionService.getMinedTransaction(txHash);
      if (receipt) {
        if (requiredDepth) {
          const depth = await TransactionService.getTransactionDepth(receipt);
          if (depth < requiredDepth) {
            receipt = null;
          }
        }
        if (receipt) {
          return resolve(receipt);
        }
      }

      /**
       * Fires on every new block
       */
      const filter = web3.eth.filter("latest");

      filter.watch(
        async (error: Error): Promise<void> => {
          if (!error) {
            receipt = await TransactionService.getMinedTransaction(txHash);
            if (receipt) {
              if (requiredDepth) {
                const depth = await TransactionService.getTransactionDepth(receipt);
                if (depth < requiredDepth) {
                  receipt = null;
                }
              }
              if (receipt) {
                filter.stopWatching();
                resolve(receipt);
              }
            }
          } else {
            LoggingService.error(`TransactionService.watchForMinedTransaction: an error occurred: ${error.message}`);
            reject(error);
          }
        });
    });
  }

  /**
   * Returns a promise of a mined TransactionReceipt or null if it hasn't yet been mined.
   * @param txHash
   */
  public static async getMinedTransaction(txHash: Hash): Promise<TransactionReceipt | null> {
    const web3 = await Utils.getWeb3();
    return promisify((innerCallback: any) => {
      web3.eth.getTransactionReceipt(txHash, innerCallback);
    })()
      .then((tx: TransactionReceipt | null) => {
        // blockNumber should always be set, but just in case...
        if (tx && !tx.blockNumber) { return null; } else { return tx; }
      }) as Promise<TransactionReceipt | null>;
  }

  /**
   * Returns a promise of a TransactionReceipt once the given transaction has been confirmed,
   * according to the optional `requiredDepth`.
   *
   * See also [getTransactionDepth](/api/classes/TransactionService#getTransactionDepth).
   *
   * @param txHash The transaction hash to watch
   * @param requiredDepth Optional minimum block depth required to resolve the promise.  Default is 0.
   */
  public static async watchForConfirmedTransaction(txHash: Hash, requiredDepth?: number): Promise<TransactionReceipt> {

    if (typeof requiredDepth === "undefined") {
      const requiredDepths = ConfigService.get("txDepthRequiredForConfirmation");
      const networkName = await Utils.getNetworkName();
      requiredDepth = requiredDepths[networkName.toLowerCase()];
      if (typeof requiredDepth === "undefined") {
        requiredDepth = requiredDepths.default;
      }
    }

    return TransactionService.watchForMinedTransaction(txHash, requiredDepth);
  }

  /**
   * Returns a promise of the number of blocks that have been added to the chain since
   * the given transaction appeared. Use this to decide whether a transaction is
   * sufficiently secure (confirmed).
   *
   * See also [watchForConfirmedTransaction](/api/classes/TransactionService#watchForConfirmedTransaction).
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
   * Convert a mined TransactionReceipt to a TransactionReceiptTruffle with more readable logs
   * such as are produced by truffle (see `DecodedLogEntry`).
   *
   * @hidden - for internal use only
   *
   * @param txReceipt The mined tx
   * @param contract The truffle contract that generated the tx
   */
  public static toTxTruffle(txReceipt: TransactionReceipt, contract: TruffleContract): TransactionReceiptTruffle {
    const events = contract.constructor.events;

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
          copy.args[key] = contract.constructor.web3.toBigNumber("0x" + val.toString(16));
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

  private static contextStack: Array<EventContext> = new Array<EventContext>();

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
    functionName: string,
    payload: TransactionReceiptsEventInfo,
    txStage: TransactionStage
  ): void {

    let baseTopic = TransactionService.topicBaseFromFunctionName(functionName);

    payload.txStage = txStage;

    PubSubEventService.publish(`${baseTopic}.${TransactionStage[txStage]}`, payload);

    if (payload.tx) {
      /**
       * Trigger the context topic as appropriate in every context on the stack.  Note recursion, as each
       * triggered topic must itself be checked for further triggering.
       */
      for (let i = TransactionService.contextStack.length - 1; i >= 0; --i) {

        const currentContext = TransactionService.contextStack[i];

        if (functionName === currentContext.payload.functionName) {
          continue; // skip the caller's own context, if it has one.
        }

        if (PubSubEventService.isTopicSpecifiedBy(currentContext.topicTriggerFilter, baseTopic)) {
          /**
           * Pass the tx info up to the new context. clone currentContext.payload because it can be
           * shared by multiple transactions in progress in the same context.
           */
          payload = Object.assign(
            {},
            currentContext.payload,
            { tx: payload.tx, txReceipt: payload.txReceipt, txStage });
          baseTopic = TransactionService.topicBaseFromFunctionName(currentContext.payload.functionName);
          PubSubEventService.publish(`${baseTopic}.${TransactionStage[txStage]}`, payload);
        }
      }
    } // don't resend `kickoff` events
  }

  private static topicBaseFromFunctionName(functionName: string): string {
    return `TxTracking.${functionName}`;
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

export interface EventContext {
  payload: TransactionReceiptsEventInfo;
  topicTriggerFilter: Array<string>;
}
