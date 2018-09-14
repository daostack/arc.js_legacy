import { promisify } from "es6-promisify";
import { DecodedLogEntry, LogEntry, TransactionReceipt } from "web3";
import { Hash } from "./commonTypes";
import { ConfigService } from "./configService";
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
   * Generate a new invocation key.
   */
  public static generateInvocationKey(): number {
    return Math.floor((Math.random() * Number.MAX_SAFE_INTEGER));
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
    TransactionService._publishTxEvent(
      [new TxEventSpec(functionName, payload)],
      null, null,
      TransactionStage.kickoff);

    return payload;
  }

  /**
   * Send the given payload to subscribers of the given topic on `sent`, `mined` and `confirmed`.
   *
   * @hidden - for internal use only
   * @param eventContext array of TxEventSpec
   * @param tx the transaction id.
   * @param contract Truffle contract wrapper for the contract that is generating the transaction.
   */
  public static publishTxLifecycleEvents(
    eventContext: TxEventContext,
    tx: Hash,
    contract: any
  ): void {

    TransactionService._publishTxEvent(eventContext.stack, tx, null, TransactionStage.sent);

    /**
     * We are at the base context and should start watching for the mined and confirmed transaction stages.
     */
    TransactionService.watchForMinedTransaction(tx, contract)
      .then((txReceiptMined: TransactionReceiptTruffle): void => {

        if (txReceiptMined.receipt.status !== "0x1") {
          TransactionService.publishTxFailed(
            eventContext,
            TransactionStage.mined,
            new Error("Transaction status is 0"),
            tx,
            txReceiptMined);
        } else {
          TransactionService._publishTxEvent(eventContext.stack, tx, txReceiptMined, TransactionStage.mined);
          /**
           * now start watching for confirmation
           */
          TransactionService.watchForConfirmedTransaction(tx, contract)
            .then((txReceiptConfirmed: TransactionReceiptTruffle): void => {

              if (txReceiptConfirmed.receipt.status !== "0x1") {
                TransactionService.publishTxFailed(
                  eventContext,
                  TransactionStage.confirmed,
                  new Error("Transaction status is 0"),
                  tx,
                  txReceiptConfirmed);
              } else {
                TransactionService._publishTxEvent(
                  eventContext.stack,
                  tx,
                  txReceiptConfirmed,
                  TransactionStage.confirmed);
              }
            })
            .catch((ex: Error) => {
              TransactionService.publishTxFailed(
                eventContext,
                TransactionStage.confirmed,
                ex,
                tx,
                txReceiptMined);
            });
        }
      })
      .catch((ex: Error) => {
        TransactionService.publishTxFailed(eventContext, TransactionStage.mined, ex, tx);
      });
  }

  public static publishTxFailed(
    eventContext: TxEventContext,
    atStage: TransactionStage,
    error: Error = new Error("Unspecified error"),
    tx?: Hash,
    txReceipt?: TransactionReceiptTruffle): void {

    TransactionService._publishTxEvent(eventContext.stack, tx, txReceipt, atStage, true, error);
  }

  /**
   * Return a new event stack with the given one pushed onto it.
   * Will take obj.txEventContext, else create a new one.
   *
   * Every transaction-generating function must invoke `newTxEventContext` to
   * define its own context. Whenever a transaction-generating function invokes
   * another transaction-generating function, it must add its `TxEventContext`
   * to the `options` object that it passes to the "nested" call
   * (see `TxGeneratingFunctionOptions`).
   *
   * Every transaction-generating function must assume that it may be a nested call,
   * that is, that the `options` object passed-into it may conform to `TxGeneratingFunctionOptions`
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
  ): TxEventContext {

    const eventSpec = new TxEventSpec(functionName, payload);
    let eventContext: TxEventContext | undefined = obj.txEventContext;

    if (!eventContext) {
      eventContext = new TxEventContext(
        payload.invocationKey,
        new Array<TxEventSpec>()
      );
    } else {
      // clone the incoming stack to avoid problems with re-entrancy
      eventContext = new TxEventContext(
        payload.invocationKey,
        [...eventContext.stack]
      );
    }

    // push the new context
    eventContext.stack.push(eventSpec);

    return eventContext;
  }

  /**
   * Returns a promise of a TransactionReceipt once the given transaction has been mined.
   *
   * See also [getMinedTransaction](/api/classes/TransactionService#getMinedTransaction) and
   * [getTransactionDepth](/api/classes/TransactionService#getTransactionDepth).
   *
   * @param txHash the transaction hash
   * @param contract Optional contract instance or contract name of the contract that generated the transaction.
   * Supply this if you want decoded events.
   * @param requiredDepth Optional minimum block depth required to resolve the promise.  Default is 0.
   * @returns Promise of `TransactionReceiptTruffle` if contract is given, else `TransactionReceipt`
   */
  public static async watchForMinedTransaction(
    txHash: Hash,
    contract: string | object = null,
    requiredDepth: number = 0
  ): Promise<TransactionReceipt | TransactionReceiptTruffle> {

    return new Promise(async (
      resolve: (tx: TransactionReceipt | TransactionReceiptTruffle) => void,
      reject: (error: Error) => void): Promise<void> => {

      try {

        if (requiredDepth < 0) {
          return reject(new Error(
            `TransactionService.watchForConfirmedTransaction: requiredDepth cannot be less then zero: ${requiredDepth}`)
          );
        }

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
          async (ex: Error): Promise<void> => {
            if (!ex) {
              receipt = await TransactionService.getMinedTransaction(txHash, contract, requiredDepth);
              if (receipt) {
                await UtilsInternal.stopWatchingAsync(filter).then(() => {
                  return resolve(receipt);
                });
              }
            } else {
              LoggingService.error(`TransactionService.watchForMinedTransaction: an error occurred: ${ex}`);
              return reject(ex);
            }
          });
      } catch (ex) {
        return reject(ex);
      }
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
   * Supply this if you want decoded events.
   * @param requiredDepth Optional minimum block depth required to resolve the promise.
   * Default comes from the `ConfigService`.
   */
  public static async watchForConfirmedTransaction(
    txHash: Hash,
    contract: string | object = null,
    requiredDepth?: number): Promise<TransactionReceipt | TransactionReceiptTruffle> {

    return new Promise(async (
      resolve: (tx: TransactionReceipt | TransactionReceiptTruffle) => void,
      reject: (error: Error) => void): Promise<void> => {
      try {
        requiredDepth = await TransactionService.getDefaultDepth(requiredDepth);
        return resolve(await TransactionService.watchForMinedTransaction(txHash, contract, requiredDepth));
      } catch (ex) {
        return reject(ex);
      }
    });
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
   * Supply this if you want decoded events.
   * @returns Promise of `TransactionReceiptTruffle` if contract is given, else `TransactionReceipt`,
   * or null if not found.
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
            return await TransactionService.toTxTruffle(receipt, contract);
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
   * Default comes from the `ConfigService`.
   * @param contract Optional contract instance or contract name of the contract that generated the transaction.
   * Supply this if you want decoded events.
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
  public static async toTxTruffle(
    txReceipt: TransactionReceipt,
    contract: string | object): Promise<TransactionReceiptTruffle> {

    let contractInstance: any;

    if (typeof contract === "string") {
      // Can't use WrapperService here without causing circular dependencies.
      contractInstance = await (await Utils.requireContract(contract)).deployed();
      if (!contractInstance) {
        throw new Error(`TransactionService.toTxTruffle: can't find contract ${contract}`);
      }
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

  /**
   * Returns a value from the given transaction log.
   * Undefined if not found for any reason.
   *
   * @param tx The transaction
   * @param arg The name of the property whose value we wish to return from the args object:
   *  tx.logs[index].args[argName]
   * @param eventName Overrides index, identifies which log,
   *  where tx.logs[n].event === eventName
   * @param index Identifies which log when eventName is not given
   */
  public static getValueFromLogs(
    tx: TransactionReceiptTruffle | TransactionReceipt,
    arg: string,
    eventName: string = null,
    index: number = 0): any | undefined {
    /**
     *
     * tx is an object with the following values:
     *
     * tx.tx      => transaction hash, string
     * tx.logs    => array of decoded events that were triggered within this transaction
     * tx.receipt => transaction receipt object, which includes gas used
     *
     * tx.logs look like this:
     *
     * [ { logIndex: 13,
     *     transactionIndex: 0,
     *     transactionHash: "0x999e51b4124371412924d73b60a0ae1008462eb367db45f8452b134e5a8d56c8",
     *     blockHash: "0xe35f7c374475a6933a500f48d4dfe5dce5b3072ad316f64fbf830728c6fe6fc9",
     *     blockNumber: 294,
     *     address: "0xd6a2a42b97ba20ee8655a80a842c2a723d7d488d",
     *     type: "mined",
     *     event: "NewOrg",
     *     args: { _avatar: "0xcc05f0cde8c3e4b6c41c9b963031829496107bbb" } } ]
     */
    if (!tx.logs || !tx.logs.length) {
      // TODO: log "getValueFromLogs: Transaction has no logs");
      return undefined;
    }

    if (eventName && (eventName.length)) {
      for (let i = 0; i < tx.logs.length; i++) {
        if (tx.logs[i].event === eventName) {
          index = i;
          break;
        }
      }
      if (typeof index === "undefined") {
        // TODO: log  `getValueFromLogs: There is no event logged with eventName ${eventName}`
        return undefined;
      }
    } else if (typeof index === "undefined") {
      index = tx.logs.length - 1;
    }

    const result = tx.logs[index].args[arg];

    if (!result) {
      // TODO: log  `getValueFromLogs: This log does not seem to have a field "${arg}": ${tx.logs[index].args}`
      return undefined;
    }
    return result;
  }

  /**
   * Returns the default value for required block depth defined for the current network
   * in the Arc.js global configuration
   * "[txDepthRequiredForConfirmation](Configuration#txDepthRequiredForConfirmation)".
   * @param requiredDepth Overrides the default if given
   */
  public static async getDefaultDepth(requiredDepth?: number): Promise<number> {

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

  private static createPayload(
    functionName: string,
    options: TxGeneratingFunctionOptions & any,
    txCount: number
  ): TransactionReceiptsEventInfo {

    const payload = {
      functionName,
      options,
      tx: null,
      txCount,
      txReceipt: null,
      txStage: TransactionStage.kickoff,
    } as Partial<TransactionReceiptsEventInfo>;

    payload.invocationKey = options.txEventContext ?
      options.txEventContext.invocationKey : TransactionService.generateInvocationKey();

    return payload as TransactionReceiptsEventInfo;
  }

  private static _publishTxEvent(
    eventStack: Array<TxEventSpec>,
    tx: Hash,
    txReceipt: TransactionReceiptTruffle = null,
    txStage: TransactionStage,
    failed: boolean = false,
    error: Error = new Error("Unspecified error")
  ): void {

    for (let i = eventStack.length - 1; i >= 0; --i) {

      const eventSpec: TxEventSpec = eventStack[i];

      const functionName = eventSpec.functionName;

      const baseTopic = TransactionService.topicBaseFromFunctionName(functionName);

      const fullTopic = `${baseTopic}.${TransactionStage[txStage]}${failed ? ".failed" : ""}`;

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
      if (failed) {
        payload.error = error;
      }
      PubSubEventService.publish(fullTopic, payload);
    }
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
 * Information supplied to the event callback when the event is published. Otherwise
 * known as the "payload".
 */
export interface TransactionReceiptsEventInfo {
  /**
   * A value that is unique to the invocation of the function that is generating
   * the transaction. It is useful for grouping events by a single function invocation.
   */
  invocationKey: number;
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
  /**
   * Error when a failure has occured.  Supplied by the ".failed" events.
   */
  error?: Error;
}

/**
 * @hidden - for internal use only
 */
export class TxEventContext {
  constructor(
    public invocationKey: number,
    public stack: Array<TxEventSpec>
  ) { }
}

/**
 * Arc.js inserts this into the `options` object that the
 * user has passed into the transaction-generating wrapper function.
 *
 * @hidden - for internal use only
 */
export class TxEventSpec {
  constructor(
    public functionName: string,
    public payload: TransactionReceiptsEventInfo) { }
}

/**
 * @hidden - for internal use only
 */
export interface TxGeneratingFunctionOptions {
  txEventContext?: TxEventContext;
}

/**
 * The bundle of logs, TransactionReceipt and other information as returned by Truffle after invoking
 * a contract function that causes a transaction.
 */
export interface TransactionReceiptTruffle {
  logs: Array<any>;
  receipt: TransactionReceipt;
  transactionHash: Hash;
}
