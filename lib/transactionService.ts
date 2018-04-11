import { TransactionReceiptTruffle } from "./contractWrapperBase";
import { EventService, IEventSubscription } from "./eventService";

/**
 * Enables you to track the completion of transactions triggered by Arc.js functions.
 * You can subscribe to events that tell you how many transactions are anticipated when
 * the transactions have completed.  For more information, see [subscribe](TransactionService#subscribe).
 */
export class TransactionService extends EventService {

  /**
   * Generate a new invocation key for the given topic and function.
   * Topic should look like "[classname][functionname]".
   * @param topic
   */
  public static generateInvocationKey(topic: string): symbol {
    return Symbol(topic);
  }

  /**
   * Publish the kick-off event and return the payload that should be used for the ensuing
   * events that will carry an actual tx in the payload for the invoked function.
   * `invocationKey` is a unique key for the returned payload that can be used for scoping
   * the events.
   * @param topic
   * @param options
   * @param txCount
   * @param suppressKickOff
   */
  public static publishKickoffEvent(
    topic: string,
    options: any,
    txCount: number,
    suppressKickOff: boolean = false): TransactionEventInfo {

    const payload = {
      invocationKey: TransactionService.generateInvocationKey(topic),
      options,
      tx: null,
      txCount,
    };

    if (!suppressKickOff) {
      /**
       * publish the "kick-off" event
       */
      TransactionService.publishTxEvent(topic, payload);
    }

    return payload;
  }

  /**
   * Send the given payload to subscribers of the given topic.
   *
   * @param topic See [subscribe](EventService#subscribe)
   * @param payload Sent in the subscription callback.
   * @param tx the transaction.  Don't supply for kick-off event.
   * @returns True if there are any subscribers
   */
  public static publishTxEvent(topic: string, payload: TransactionEventInfo, tx?: TransactionReceiptTruffle): boolean {
    if (tx) {
      payload = Object.assign({}, payload, { tx });
    }
    return EventService.publish(topic, payload);
  }

  /**
   * Subscribe to all given topics and resend as the given supertopic with superPayload.
   * @param topics Collection of topics
   * @param superTopic topic to substitute
   * @returns A single subscription
   */
  public static aggregateTxEvents(
    topics: string | Array<string>,
    superTopic: string,
    superPayload: TransactionEventInfo): IEventSubscription {

    return EventService.aggregate(topics, (topic: string, txEventInfo: TransactionEventInfo) => {
      if (txEventInfo.tx) { // skip kick-off events
        TransactionService.publishTxEvent(superTopic, superPayload, txEventInfo.tx);
      }
    });
  }
}

/**
 * Information supplied to the event callback when the event is published.
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
