import * as PubSub from "pubsub-js";
import { LoggingService } from "./loggingService";
import { UtilsInternal } from "./utilsInternal";

/**
 * A Pub/Sub event system that enables you to subscribe to various events published by Arc.js.
 * See [Events](/Events).
 */
export class PubSubEventService {

  /**
   * Send the given payload to subscribers of the given topic.
   * @param topic See [subscribe](PubSubEventService#subscribe)
   * @param payload Sent in the subscription callback.
   * @returns True if there are any subscribers
   */
  public static publish(topic: string, payload: any): boolean {
    LoggingService.debug(`PubSubEventService: publishing ${topic}`);
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
      PubSubEventService.aggregate(topics, callback) :
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
   * Return whether topic is specified by matchTemplates.
   *
   * Examples:
   *
   * matchTemplates: ["foo"]
   * topic: "foo.bar"
   * result: true
   *
   * matchTemplates: ["foo.bar"]
   * topic: "foo"
   * result: false
   *
   * Or a wildcard:
   *
   * matchTemplates: "*"
   * topic: "foo"
   * result: true
   *
   * @param matchTemplates
   * @param topic
   */
  public static isTopicSpecifiedBy(
    matchTemplates: Array<string> | string,
    topic: string): boolean {

    if (!topic) { return false; }
    if (!matchTemplates) { return false; }

    if ((typeof matchTemplates === "string") && (matchTemplates === "*")) { return true; }

    matchTemplates = UtilsInternal.ensureArray(matchTemplates);

    const topicWords = topic.split(".");

    for (const template of matchTemplates) {

      if (!template) { continue; }
      if (template === topic) { return true; }
      if (template.length > topic.length) { continue; }
      if (template[0] === ".") { continue; }

      const templateWords = template.split(".");

      if (templateWords.length > topicWords.length) { continue; }

      let matches = false;

      for (let i = 0; i < templateWords.length; ++i) {
        const templateWord = templateWords[i];
        const topicWord = topicWords[i];
        if ((templateWord === "*") || (templateWord === topicWord)) { matches = true; } else { matches = false; break; }
      }

      if (!matches) { continue; }

      // else matches
      return true;
    }

    return false;
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

    topics = UtilsInternal.ensureArray(topics);

    topics.forEach((topic: string) => {
      const subscriptionKey = PubSub.subscribe(topic, callback);
      this.subscriptions.add(new EventSubscription(subscriptionKey));
    });
  }

  /**
   * Unsubscribe from all of the events
   */
  public unsubscribe(): void {
    this.subscriptions.forEach((s: EventSubscription) => {
      s.unsubscribe();
    });
    this.subscriptions.clear();
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
    // timeout to allow lingering events to be handled before unsubscribing
    setTimeout(() => { PubSub.unsubscribe(this.key); }, 0);
  }
}
