import { publish, subscribe, clearAllSubscriptions, unsubscribe } from "pubsub-js";
import { TransactionReceiptTruffle } from "./contractWrapperBase";
import { LoggingService } from "./loggingService";

/**
 * Enables you to track the completion of transactions triggered by Arc.js functions.
 * You can subscribe to events that tell you how many transactions are anticipated when
 * the transactions have completed.  For more information, see [subscribe](TransactionService#subscribe).
 */
export class TransactionService {

  /**
   * Generate a new invocation key for the given topic and function.
   * Topic should look like "[classname][functionname]".
   * @param topic 
   */
  public static generateInvocationKey(topic: string): symbol {
    return Symbol(topic);
  }
  /**
   * Send the given payload to subscribers of the given topic.
   * 
   * @param topic See [subscribe](TransactionService#subscribe)
   * @param txEventInfo Sent in the subscription callback.
   * @returns True if there are any subscribers
   */
  public static publish(topic: string, txEventInfo: TransactionEventInfo): boolean {
    LoggingService.debug(`TransactionService: publishing ${topic}${txEventInfo.tx ? "" : " (kick-off)"}`);
    return publish(topic, txEventInfo);
  }

  /**
   * Subscribe to the given topic.
   * 
   * The `topic` parameter defines a hierarchical scope that can be
   * anything from "txReceipts" to "txReceipts.[wrapperClassName].[functionName]":
   * 
   * - "txReceipts" subscribes to all events
   * - "txReceipts.[wrapperClassName]" subscribes to all txReceipts events for the given class
   * - "txReceipts.[wrapperClassName].[functionName]" subscribes to all txReceipts events for the given function in the given class
   * 
   * @param topic Identifies the scope of events to which you wish to subscribe
   * @param callback The function to call when the requested events are published
   * @returns A unique token that you can pass to [unsubscribe](TransactionService#unsubscribe)
   */
  public static subscribe(topic: string, callback: TransactionEventCallback): string {
    return subscribe(topic, callback);
  }

  /**
   * Remove all subscriptions
   */
  public static clearAllSubscriptions(): void {
    clearAllSubscriptions();
  }

  /** 
   * Removes a subscription.
   * 
	 * When passed a token, removes a specific subscription,
   * when passed a callback, removes all subscriptions for that callback, 
	 * when passed a topic, removes all subscriptions for the topic hierarchy.
	 *
	 * @param subscriptionSpecifier - A token, function or topic to unsubscribe.
	 */
  public static unsubscribe(subscriptionSpecifier: string | TransactionEventCallback): void {
    unsubscribe(subscriptionSpecifier);
  }
}

/**
 * Information supplied to the [TransactionEventCallback](README/#transactioneventcallback) when an event is published.
 */
export interface TransactionEventInfo {
  /**
   * A value that is unique to the invocation of the function that is publishing the event.
   * This is useful for grouping events by a single function invocation.
   */
  invocationKey: symbol;
  /**
   * The options that were passed to the function that is publishing the event, if any.
   * This will have default values filled in.
   */
  options?: any;
  /**
   * The receipt for the transaction that has completed.  Note that the tx may not necessarily have
   * completed successfully in the case of errors or rejection.
   * 
   * If null then this is a "kick-off" event that announces to the subscriber that more events
   * are to follow for the given invocationKey.  Every function will publish a kick-off event before
   * firing events with a tx.
   */
  tx: TransactionReceiptTruffle | null;
  /**
   * The total expected number of transactions.
   */
  txCount: number;
}

/**
 * The callback supplied to a subscription and invoked when an event is published.  See [subscribe](classes/TransactionService#subscribe).
 */
export type TransactionEventCallback = (topic: string, txEventInfo: TransactionEventInfo) => void;
