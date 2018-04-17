import * as PubSub from "pubsub-js";
import { LoggingService } from "./loggingService";

export class EventService {

  /**
   * Send the given payload to subscribers of the given topic.
   * @param topic See [subscribe](EventService#subscribe)
   * @param payload Sent in the subscription callback.
   * @returns True if there are any subscribers
   */
  public static publish(topic: string, payload: any): boolean {
    LoggingService.debug(`EventService: publishing ${topic}`);
    return PubSub.publish(topic, payload);
  }

  /**
   * Subscribe to the given topic or array of topics.
   * @param topics Identifies the event(s) to which you wish to subscribe
   * @param callback The function to call when the requested events are published
   * @returns An interface with `.unsubscribe()`.  Be sure to call it!
   */
  public static subscribe(topics: string | Array<string>, callback: EventSubscriptionCallback): IEventSubscription {
    return Array.isArray(topics) ?
      EventService.aggregate(topics, callback) :
      new EventSubscription(PubSub.subscribe(topics, callback));
  }

  /**
   * Remove all subscriptions
   */
  public static clearAllSubscriptions(): void {
    PubSub.clearAllSubscriptions();
  }

  /**
   * Removes a subscription.
   * When passed a token, removes a specific subscription,
   * when passed a callback, removes all subscriptions for that callback,
   * when passed a topic, removes all subscriptions for the topic hierarchy.
   *
   * @param key - A token, function or topic to unsubscribe.
   */
  public static unsubscribe(key: EventSubscriptionKey): void {
    PubSub.unsubscribe(key);
  }

  /**
   * Subscribe to multiple topics with the single given callback.
   * @param topics topic or collection of topics
   * @param callback Callback to handle them all
   * @returns An interface with `.unsubscribe()`.  Be sure to call it!
   */
  private static aggregate(
    topics: Array<string>,
    callback: EventSubscriptionCallback): IEventSubscription {

    return new SubscriptionCollection(topics, callback);
  }
}

/**
 * Creates a collection of subscriptions to which one can unsubscribe all at once.
 */
export class SubscriptionCollection implements IEventSubscription {

  /**
   * Collection of values returned by `subscribe`, or the token, or the handler function
   */
  private subscriptions: Set<IEventSubscription>;

  constructor(topics?: string | Array<string>, callback?: EventSubscriptionCallback) {
    this.subscriptions = new Set<IEventSubscription>();
    if (topics) {
      if (!callback) { throw new Error("SubscriptionCollection: callback is not set"); }
      this.subscribe(topics, callback);
    }
  }

  /**
   * Subscribe a single callback to a set of events
   * @param topics
   * @param callback
   */
  public subscribe(topics: string | Array<string>, callback: EventSubscriptionCallback): void {

    if (!Array.isArray(topics)) { topics = [topics]; }

    topics.forEach((topic: string) => {
      const subscriptionKey = PubSub.subscribe(topic, callback);
      this.subscriptions.add(new EventSubscription(subscriptionKey));
    });
  }

  /**
   * Unsubscribe from all of the events
   */
  public unsubscribe(): void {
    // timeout to allow lingering events to be handled before unsubscribing
    setTimeout(() => {
      this.subscriptions.forEach((s: EventSubscription) => {
        s.unsubscribe();
      });
      this.subscriptions.clear();
    }, 0);
  }
}

export type EventSubscriptionCallback = (topic: string, payload: any) => any;
export type EventSubscriptionKey = string | EventSubscriptionCallback;

export interface IEventSubscription {
  unsubscribe(): void;
}

export class EventSubscription implements IEventSubscription {
  public constructor(private key: EventSubscriptionKey) {
  }
  public unsubscribe(): void {
    PubSub.unsubscribe(this.key);
  }
}
