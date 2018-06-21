import { LoggingService } from "./loggingService";
import { PubSubEventService } from "./pubSubEventService";
import { UtilsInternal } from "./utilsInternal";

export class PromiseEventService {
  /**
   * Publish to the given topics the result of the given promise.
   * The payload of the event will beof type TResult.
   * @param topics
   * @param promise
   */
  public static publish<TResult>(topics: Array<string> | string, promise: Promise<TResult>): void {
    const topicsArray = UtilsInternal.ensureArray(topics);
    promise
      .then((result: TResult) => {
        topicsArray.forEach((topic: string) => {
          PubSubEventService.publish(topic, result);
        });
      })
      .catch((error: Error) => {
        LoggingService.error(
          `PromiseEventService.publish: unable to publish result of rejected promise: ${error.message}`);
      });
  }
}
