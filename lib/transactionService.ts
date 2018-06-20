import { TransactionReceiptTruffle } from "./contractWrapperBase";
import { LoggingService } from "./loggingService";
import { PubSubEventService } from "./pubSubEventService";
import { UtilsInternal } from "./utilsInternal";

/**
 * Enables you to track the completion of transactions triggered by Arc.js functions.
 * You can subscribe to events that tell you how many transactions are anticipated when
 * the transactions have completed.  For more information, see [Tracking Transactions](/Transactions).
 */
export class TransactionService extends PubSubEventService {

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
   */
  public static publishKickoffEvent(
    topic: string,
    options: any,
    txCount: number): TransactionReceiptsEventInfo {

    const payload = TransactionService.createPayload(topic, options, txCount);
    /**
     * publish the "kick-off" event
     */
    TransactionService.publishTxEvent(topic, payload);

    return payload;
  }

  /**
   * Send the given payload to subscribers of the given topic.
   *
   * @param topic See [subscribe](PubSubEventService#subscribe)
   * @param payload Sent in the subscription callback.
   * @param tx the transaction.  Don't supply for kick-off event.
   * @returns True if there are any subscribers
   */
  public static publishTxEvent(
    topic: string,
    payload: TransactionReceiptsEventInfo,
    tx?: TransactionReceiptTruffle): boolean {

    if (tx) {
      payload = Object.assign({}, payload, { tx });
    }
    const result = PubSubEventService.publish(topic, payload);

    /**
     * Trigger the context topic as appropriate in every context on the stack.  Note recursion, as each
     * triggered topic must itself be checked for further triggering.
     */
    if (tx) {
      for (let i = TransactionService.contextStack.length - 1; i >= 0; --i) {
        const currentContext = TransactionService.contextStack[i];
        if (PubSubEventService.isTopicSpecifiedBy(currentContext.topicTriggerFilter, topic, false)) {
          payload = Object.assign({}, currentContext.payload, { tx });
          TransactionService.publishTxEvent(currentContext.payload.topic, payload, tx);
        }
      }
    } // don't resend kick-off events

    return result;
  }

  /**
   * Push an event triggering context.  The presence of this context sets a scope within which events matching the
   * filter will trigger the event topic given in the payload.  Contexts may be nested within one another.  Thus
   * topic A may trigger topic B which may trigger topic C.  Thus the contexts are represented as a stack.
   * @param topicTriggerFilter topic(s) that should be trigger the publishing of the topic given in the payload.
   * @param payload The topic payload for the triggered topic.  The payload contains the topic string itself.
   */
  public static pushContext(
    topicTriggerFilter: Array<string> | string,
    payload: TransactionReceiptsEventInfo): EventContext {

    const eventContext = {
      payload,
      topicTriggerFilter: UtilsInternal.ensureArray(topicTriggerFilter),
    };
    TransactionService.contextStack.push(eventContext);
    LoggingService.debug(`TransactionService.pushContext: length: ${TransactionService.contextStack.length}`);

    return eventContext;
  }

  /**
   * Pop the current context off the stack.  Logs a warning when the stack is already empty.
   */
  public static popContext(): void {
    if (TransactionService.contextStack.length === 0) {
      LoggingService.warn(`popContext: TransactionService.eventContext is already empty`);
    }
    // give queued events a chance to go out before popping the context
    setTimeout(() => {
      TransactionService.contextStack.pop();
      LoggingService.debug(`TransactionService.popContext: length: ${TransactionService.contextStack.length}`);
    }, 0);
  }

  private static contextStack: Array<EventContext> = new Array<EventContext>();

  private static createPayload(
    topic: string,
    options: any,
    txCount: number
  ): TransactionReceiptsEventInfo {

    const payload = {
      invocationKey: TransactionService.generateInvocationKey(topic),
      options,
      topic,
      tx: null,
      txCount,
    };

    return payload;
  }
}

/**
 * Information supplied to the event callback when the event is published.
 */
export interface TransactionReceiptsEventInfo {
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
   * The topic to which we're publishing
   */
  topic: string;
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

export interface EventContext {
  payload: TransactionReceiptsEventInfo;
  topicTriggerFilter: Array<string>;
}
