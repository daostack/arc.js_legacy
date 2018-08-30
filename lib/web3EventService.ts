import { DecodedLogEntryEvent, LogTopic } from "web3";
import { fnVoid, Hash } from "./commonTypes";
import { IEventSubscription, PubSubEventService } from "./pubSubEventService";
import { TransactionService } from "./transactionService";
import { Utils } from "./utils";
import { UtilsInternal } from "./utilsInternal";

/**
 * Support for working with events that originate from Arc contracts
 * and are served up by Web3.
 *
 * For more information, see [Web3 Events](/Events#web3events).
 */
export class Web3EventService {
  /**
   * Returns a function that creates an EventFetcher<TEventArgs>.
   * For subclasses to use to create their event handlers.
   * This is identical to what you get with Truffle, except with enhancements.
   *
   * Note that the callback parameter of `EventFetcher.get` is optional; you
   * may alternatively obtain the promise of a `Array<TEventArgs>` from the return value
   * of `get`.
   *
   * For more information, see [Web3 Events](/Events#web3events).
   *
   * @param baseEvent - the event from the Truffle contract.
   * @param preProcessEvent - optionally supply this to modify the err and log arguments before they are
   * passed to the `get`/`watch` callback.
   * @param baseArgFilter arg filter to always merge into any supplied argFilter.
   * @type TEventArgs - name of the event args (EventResult) interface, like NewProposalEventResult
   */
  public createEventFetcherFactory<TEventArgs>(
    baseEvent: any,
    preProcessEvent?: PreProcessEventCallback<TEventArgs>,
    baseArgFilter: any = {}
  ): EventFetcherFactory<TEventArgs> {

    if (!baseEvent) {
      throw new Error("baseEvent was not supplied");
    }
    /**
     * This is the function that returns the EventFetcher<TEventArgs>
     * argFilter - Optional event argument filter, like `{ _proposalId: [someHash] }`.
     * filterObject - Optional event filter.  Default is `{ fromBlock: "latest" }`
     * callback.
     * immediateWatchCallback - when supplied, starts watch immediately
     * immediateRequiredDepth - only used when immediateWatchCallback is supplied. If set
     * then will not invoke the callback until the transaction has been mined to the requiredDepth.
     */
    return (
      argFilter: any = {},
      filterObject: EventFetcherFilterObject = {},
      immediateWatchCallback?: EventWatchCallback<TEventArgs>,
      immediateRequiredDepth: number = 0
    ): EventFetcher<TEventArgs> => {

      const handleEvent = this.createBaseWeb3EventHandler(
        filterObject.suppressDups,
        preProcessEvent);

      const baseFetcher: EventFetcher<TEventArgs> =
        baseEvent(Object.assign(argFilter, baseArgFilter), filterObject);

      /**
       * If `immediateWatchCallback` is defined then we should start watching immediately.
       */
      if (immediateWatchCallback) {
        baseFetcher.watch(
          async (error: Error, log: DecodedLogEntryEvent<TEventArgs> | Array<DecodedLogEntryEvent<TEventArgs>>) => {
            await handleEvent(error, log, true, immediateWatchCallback, immediateRequiredDepth);
          });
      }

      /**
       * return the fetcher
       */
      return {

        get(callback?: EventGetCallback<TEventArgs>, requiredDepth: number = 0)
          : Promise<Array<DecodedLogEntryEvent<TEventArgs>>> {
          return new Promise<Array<DecodedLogEntryEvent<TEventArgs>>>(
            (resolve: (
              result: Array<DecodedLogEntryEvent<TEventArgs>>) => void,
              reject: (error: Error) => void): void => {

              baseFetcher.get(
                async (
                  error: Error,
                  log:
                    DecodedLogEntryEvent<TEventArgs> | Array<DecodedLogEntryEvent<TEventArgs>>): Promise<void> => {
                  if (error) {
                    return reject(error);
                  }
                  resolve(await handleEvent(error, log, false, callback, requiredDepth));
                });
            });
        },

        watch(callback: EventWatchCallback<TEventArgs>, requiredDepth: number = 0): void {
          baseFetcher.watch(
            async (error: Error, log: DecodedLogEntryEvent<TEventArgs> | Array<DecodedLogEntryEvent<TEventArgs>>) => {
              await handleEvent(error, log, true, callback, requiredDepth);
            });
        },

        subscribe(
          eventName: string,
          callback?: EventWatchSubscriptionCallback<TEventArgs>,
          requiredDepth: number = 0): Web3EventSubscription<TEventArgs> {

          if (!callback) {
            /* tslint:disable-next-line:no-empty */
            callback = (): void => { };
          }

          const subscription = PubSubEventService.subscribe(eventName, callback);

          this.watch((error: Error, args: DecodedLogEntryEvent<TEventArgs>) => {
            PubSubEventService.publish(eventName, args);
          }, requiredDepth);

          return new Web3EventSubscription(subscription, baseFetcher);
        },
        stopWatching(callback?: fnVoid): void {
          baseFetcher.stopWatching(callback);
        },
        stopWatchingAsync(): Promise<void> {
          return UtilsInternal.stopWatchingAsync(baseFetcher);
        },
      };
    };
  }

  /**
   * Converts a `EventFetcherFactory<TEventArgs>` into a
   * `EntityFetcherFactory<TEntity, TEventArgs>`.  So whenever a web3 event
   * is received by the given `EventFetcherFactory`, we transform the `TEventArgs`
   * into `TEntities`.
   *
   * Note that the callback parameter of `EntityFetcher.get` is optional; you
   * may alternatively obtain the promise of a `Array<TEntity>` from the return value
   * of `get`.
   *
   * See [Arc Web3 Events in Arc.js](/Events#web3events).
   *
   * @param eventFetcherFactory
   * @param transformEventCallback Function to convert an instance of TEventArgs into
   * the promise of an instance of TEntity.  If it returns `undefined` then no entity
   * is returned for that event, so this is a programatic way in which events
   * can be filtered.
   * @param givenCallback Function that will be invoked upon the receipt of each event,
   * @param baseArgFilter arg filter to always merge into any supplied argFilter.
   */
  public createEntityFetcherFactory<TEntity, TEventArgs>(
    eventFetcherFactory: EventFetcherFactory<TEventArgs>,
    transformEventCallback: TransformEventCallback<TEntity, TEventArgs>,
    baseArgFilter: any = {}
  ): EntityFetcherFactory<TEntity, TEventArgs> {

    if (!eventFetcherFactory) {
      throw new Error("eventFetcherFactory was not supplied");
    }

    if (!transformEventCallback) {
      throw new Error("transformEventCallback was not supplied");
    }

    /**
     * This is the function that returns the EntityFetcher<TEventArgs>
     * argFilter - Optional event argument filter, like `{ _proposalId: [someHash] }`.
     * filterObject - Optional event filter.  Default is `{ fromBlock: "latest" }`
     * callback.
     * immediateWatchCallback - when supplied, starts watch immediately
     * immediateRequiredDepth - only used when immediateWatchCallback is supplied. If set
     * then will not invoke the callback until the transaction has been mined to the requiredDepth.
     */
    return (
      argFilter: any = {},
      filterObject: EventFetcherFilterObject = {},
      immediateWatchCallback?: EntityWatchCallback<TEntity>,
      immediateRequiredDepth: number = 0
    ): EntityFetcher<TEntity, TEventArgs> => {

      // handler that takes the events and issues givenCallback appropriately
      const handleEvent =
        (error: Error,
          log: DecodedLogEntryEvent<TEventArgs> | Array<DecodedLogEntryEvent<TEventArgs>>,
          // singly true to issue callback on every arg rather than on the array
          singly: boolean,
          /*
           * invoke this callback on every event (watch)
           * or on the array of events (get), depending on the value of singly.
           * when singly, callback gets the entity.
           * watch is always singly.
           * when not singly, callback gets a promise of the array of entities.
           * get is not singly.  so get gets a promise of an array.
           */
          callback?: (error: Error, args: TEntity | Promise<Array<TEntity>>) => void):
          Promise<Array<TEntity>> => {

          const promiseOfEntities: Promise<Array<TEntity>> =
            new Promise(
              async (resolve: (result: Array<TEntity>) => void, reject: (error: Error) => void): Promise<void> => {

                if (error) {
                  return reject(error);
                }

                // it's not an array when singly
                if (!Array.isArray(log)) {
                  log = [log];
                }

                const entities = new Array<TEntity>();
                // transform all the log entries into entities
                for (const event of log) {
                  const transformedEntity = await transformEventCallback(event);
                  if (typeof transformedEntity !== "undefined") {
                    if (callback && singly) {
                      callback(error, transformedEntity);
                    }
                    entities.push(transformedEntity);
                  }
                }
                resolve(entities);
              });
          // invoke the given callback with the promise of an array of entities
          if (callback && !singly) {
            callback(error, promiseOfEntities);
          }
          return promiseOfEntities;
        };

      const baseFetcher: EventFetcher<TEventArgs> = eventFetcherFactory(
        Object.assign(argFilter, baseArgFilter), filterObject);

      /**
       * If `immediateWatchCallback` is defined then we should start watching immediately.
       */
      if (immediateWatchCallback) {
        baseFetcher.watch((error: Error, log: DecodedLogEntryEvent<TEventArgs>) => {
          handleEvent(error, log, true, immediateWatchCallback);
        }, immediateRequiredDepth);
      }

      /**
       * return the fetcher
       */
      return {

        get(callback?: EntityGetCallback<TEntity>, requiredDepth: number = 0)
          : Promise<Array<TEntity>> {
          // remember get is singly, so there is a promise of an array
          return new Promise<Array<TEntity>>(
            (resolve: (result: Array<TEntity>) => void, reject: (error: Error) => void): void => {
              baseFetcher.get(async (error: Error, log: Array<DecodedLogEntryEvent<TEventArgs>>): Promise<void> => {
                if (error) {
                  return reject(error);
                }
                resolve(await handleEvent(error, log, false, callback));
              }, requiredDepth);
            });
        },

        watch(callback?: EntityWatchCallback<TEntity>, requiredDepth: number = 0): void {
          // remember watch is singly, no promises
          baseFetcher.watch((error: Error, log: DecodedLogEntryEvent<TEventArgs>) => {
            handleEvent(error, log, true, callback);
          }, requiredDepth);
        },

        subscribe(
          eventName: string,
          callback?: EntityWatchSubscriptionCallback<TEntity>,
          requiredDepth: number = 0): Web3EventSubscription<TEventArgs> {

          if (!callback) {
            /* tslint:disable-next-line:no-empty */
            callback = (): void => { };
          }

          const subscription = PubSubEventService.subscribe(eventName, callback);

          this.watch((error: Error, entity: TEntity) => {
            PubSubEventService.publish(eventName, entity);
          }, requiredDepth);

          return new Web3EventSubscription(subscription, baseFetcher);
        },

        stopWatching(callback?: fnVoid): void {
          baseFetcher.stopWatching(callback);
        },
        stopWatchingAsync(): Promise<void> {
          return UtilsInternal.stopWatchingAsync(baseFetcher);
        },
      };
    };
  }

  /**
   * Returns a function that we will use internally to handle each Web3 event
   * @param suppressDups
   * @param preProcessEvent
   */
  private createBaseWeb3EventHandler<TEventArgs>(
    suppressDups: boolean,
    preProcessEvent?: PreProcessEventCallback<TEventArgs>)
    : BaseWeb3EventCallback<TEventArgs> {

    let receivedEvents: Set<Hash>;

    if (!!suppressDups) {
      receivedEvents = new Set<Hash>();
    }

    return async (
      error: Error,
      log: DecodedLogEntryEvent<TEventArgs> | Array<DecodedLogEntryEvent<TEventArgs>>,
      // singly true to issue callback on every arg rather than on the array
      singly: boolean,
      /*
       * invoke this callback on every event (watch)
       * or on the array of events (get), depending on the value of singly
       */
      callback?: (
        error: Error,
        args: DecodedLogEntryEvent<TEventArgs> | Array<DecodedLogEntryEvent<TEventArgs>>) => void,
      requiredDepth: number = 0)
      : Promise<Array<DecodedLogEntryEvent<TEventArgs>>> => {
      /**
       * convert to an array
       */
      if (!!error) {
        log = [];
      } else if (!Array.isArray(log)) {
        log = [log];
      }

      /**
       * optionally prune duplicate events (see https://github.com/ethereum/web3.js/issues/398)
       */
      if (receivedEvents && log.length) {
        log = log.filter((evt: DecodedLogEntryEvent<TEventArgs>) => {
          if (!receivedEvents.has(evt.transactionHash)) {
            receivedEvents.add(evt.transactionHash);
            return true;
          } else {
            return false;
          }
        });
      }

      if (preProcessEvent) {
        const processedResult = preProcessEvent(error, log);
        error = processedResult.error;
        log = processedResult.log;
      }

      // invoke callback if there is one
      if (callback) {
        for (const e of log) {
          if (requiredDepth) {
            if (requiredDepth === -1) { requiredDepth = undefined; } // to use the default value
            await TransactionService.watchForConfirmedTransaction(e.transactionHash, null, requiredDepth);
          }
          if (singly) {
            callback(error, e);
          }
        }
        if (!singly) {
          callback(error, log);
        }
      }

      // return array of DecodedLogEntryEvents in any case
      return log;
    };
  }
}

export interface EventPreProcessorReturn<TEventArgs> { error: Error; log: Array<DecodedLogEntryEvent<TEventArgs>>; }
export type PreProcessEventCallback<TEventArgs> =
  (error: Error, log: Array<DecodedLogEntryEvent<TEventArgs>>) => EventPreProcessorReturn<TEventArgs>;

export type TransformEventCallback<TDest, TSrc> = (event: DecodedLogEntryEvent<TSrc>) => Promise<TDest | undefined>;

/**
 * Function that returns an `EntityFetcher<TEntity>`.
 *
 * @type TEntity The type returns to the callback.
 */
export type EntityFetcherFactory<TDest, TSrc> =
  (
    /**
     * Arg values by which you wish to filter the web3 event logs, e.g.
     * `{'valueA': 1, 'valueB': [myFirstAddress, mySecondAddress]}`.
     *
     * Note this always applies to the underlying web3 event values
     * not to property values of transformed entities.
     */
    argsFilter?: any,
    /**
     * Web3 event filter options.  Typically something like `{ fromBlock: 0 }`.
     * Note if you don't want Arc.js to suppress duplicate events, set `suppressDups` to false.
     */
    filterObject?: EventFetcherFilterObject,
    /**
     * Optional callback to immediately start start watching.
     * Without this you will call `get` or `watch`.
     */
    callback?: EntityWatchCallback<TDest>,
    /**
     * Optional and only used when callback is supplied. If set
     * then will not invoke the callback until the transaction has been mined to the requiredDepth.
     */
    requiredDepth?: number
  ) => EntityFetcher<TDest, TSrc>;

export type EntityWatchCallback<TEntity> = (error: Error, entity: TEntity) => void;
export type EntityGetCallback<TEntity> = (error: Error, entity: Promise<Array<TEntity>>) => void;
export type EntityWatchSubscriptionCallback<TEntity> = (eventName: string, payload: TEntity) => void;
/**
 * Returned by EntityFetcherFactory<TDest, TSrc>.
 */
export interface EntityFetcher<TDest, TSrc> {
  /**
   * Get an array of `TDest` from Web3, given the filter supplied to the EntityFetcherFactory.
   * You may supply a callback, which will be given the array, or you may
   * accept the promise of the array from the return value of `get`.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.
   */
  get: (callback?: EntityGetCallback<TDest>, requiredDepth?: number) => Promise<Array<TDest>>;
  /**
   * Watch for `TDest`s from Web3, given the filter supplied to the EntityFetcherFactory.
   * The callback is invoked once per event firing.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.
   */
  watch: (callback: EntityWatchCallback<TDest>, requiredDepth?: number) => void;
  /**
   * Watch for `TDest`s from Web3, given the filter supplied to the EntityFetcherFactory.
   * The Pub.Sub is published once per event firing.
   * `subscribe` returns the subscription on which you must remember to call `unsubscribe` when you are
   * done watching.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.
   *
   * Supply whatever name you want for `eventName`.  This enables you to scope
   * event handlers across event types and schemes.
   */
  subscribe: (
    eventName: string,
    callback?: EntityWatchSubscriptionCallback<TDest>,
    requiredDepth?: number) => IEventSubscription;
  /**
   * Stop watching the event.
   */
  stopWatching(callback?: fnVoid): void;
  /**
   * Asynchronously stop watching the event, for environments where
   * synchronous methods are not allowed.
   */
  stopWatchingAsync(): Promise<void>;
}

/**
 * Function that returns an `EventFetcher<TEventArgs>`.
 *
 * @type TEventArgs The type of the `args` object.
 */
export type EventFetcherFactory<TEventArgs> =
  (
    /**
     * Values by which you wish to filter the logs, e.g.
     * `{'valueA': 1, 'valueB': [myFirstAddress, mySecondAddress]}`.
     */
    argsFilter?: any,
    /**
     * Additional filter options.  Typically something like `{ fromBlock: 0 }`.
     * Note if you don't want Arc.js to suppress duplicate events, set `suppressDups` to false.
     */
    filterObject?: EventFetcherFilterObject,
    /**
     * Optional callback to immediately start start watching.
     * Without this you will call `get` or `watch`.
     */
    callback?: EventWatchCallback<TEventArgs>,
    /**
     * Optional and only used when callback is supplied. If set
     * then will not invoke the callback until the transaction has been mined to the requiredDepth.
     */
    requiredDepth?: number
  ) => EventFetcher<TEventArgs>;

export type EventWatchCallback<TEventArgs> =
  (error: Error, args: DecodedLogEntryEvent<TEventArgs>) => void;
export type EventGetCallback<TEventArgs> =
  (error: Error, args: Array<DecodedLogEntryEvent<TEventArgs>>) => void;
export type EventWatchSubscriptionCallback<TEventArgs> =
  (eventName: string, payload: DecodedLogEntryEvent<TEventArgs>) => void;

/**
 * Returned by EventFetcherFactory<TEventArgs>.
 * See web3 documentation article for more information about events:
 * https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events
 *
 * @type TEventArgs The type of the `args` object.
 */
export interface EventFetcher<TEventArgs> {
  /**
   * Get an array of `DecodedLogEntryEvent` from Web3, given the filter supplied to the EventFetcherFactory.
   * You may supply a callback, which will be given the array, or you may
   * accept the promise of the array from the return value of `get`.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.
   */
  get: (
    callback?: EventGetCallback<TEventArgs>,
    requiredDepth?: number) => Promise<Array<DecodedLogEntryEvent<TEventArgs>>>;
  /**
   * Watch for `DecodedLogEntryEvent`s from Web3, given the filter supplied to the EventFetcherFactory.
   * The callback is invoked once per event firing.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.
   */
  watch: (callback: EventWatchCallback<TEventArgs>, requiredDepth?: number) => void;
  /**
   * Watch for `DecodedLogEntryEvent`s from Web3, given the filter supplied to the EventFetcherFactory.
   * The Pub.Sub is published once per event firing.
   * `subscribe` returns the subscription on which you must remember to call `unsubscribe` when you are
   * done watching.
   * If `requiredDepth` is set then will not invoke the callback until the transaction has been mined to
   * the requiredDepth.
   *
   * Supply whatever name you want for `eventName`.  This enables you to scope
   * event handlers across event types and schemes.
   */
  subscribe: (
    eventName: string,
    callback?: EventWatchSubscriptionCallback<TEventArgs>,
    requiredDepth?: number) => IEventSubscription;
  /**
   * Stop watching the event.
   */
  stopWatching(callback?: fnVoid): void;
  /**
   * Asynchronously stop watching the event, for environments where
   * synchronous methods are not allowed.
   */
  stopWatchingAsync(): Promise<void>;
}

/**
 * As implemented by Web3
 */
export interface Web3EventFetcher {
  get: (callback: (error: Error, args: DecodedLogEntryEvent<any> | Array<DecodedLogEntryEvent<any>>) => void) => void;
  watch: (callback: (error: Error, args: DecodedLogEntryEvent<any> | Array<DecodedLogEntryEvent<any>>) => void) => void;
  stopWatching(callback?: fnVoid): void;
  stopWatchingAsync(): Promise<void>;
}

/**
 * Haven't figured out how to export EventFetcherFilterObject that extends FilterObject from web3.
 * Maybe will be easier with web3 v1.0, or perhaps using typescript's module augmentation feature.
 */

/**
 * Options supplied to `EventFetcherFactory` and thence to `get` and `watch`.
 */
export interface EventFetcherFilterObject {
  fromBlock?: number | string;
  toBlock?: number | string;
  address?: string;
  topics?: Array<LogTopic>;
  /**
   * true to suppress duplicate events (see https://github.com/ethereum/web3.js/issues/398).
   * The default is true.
   */
  suppressDups?: boolean;
}

export class Web3EventSubscription<TEventArgs> implements IEventSubscription {
  constructor(
    private subscription: IEventSubscription,
    private fetcher: EventFetcher<TEventArgs>) { }

  /**
   * Unsubscribe from all of the events
   * @param milliseconds number of milliseconds to timeout.
   * Default is -1 which means not to timeout at all.
   */
  public unsubscribe(milliseconds: number = -1): Promise<void> {
    return new Promise((resolve: fnVoid): Promise<void> => {
      return this.fetcher.stopWatchingAsync()
        .then((): void => {
          this.subscription.unsubscribe.call(this.subscription, milliseconds)
            .then(() => { resolve(); });
        });
    });
  }
}

type BaseWeb3EventCallback<T> =
  (
    error: Error,
    log: DecodedLogEntryEvent<T> | Array<DecodedLogEntryEvent<T>>,
    singly: boolean,
    callback?: (error: Error, args: DecodedLogEntryEvent<T> | Array<DecodedLogEntryEvent<T>>) => void,
    requiredDepth?: number
  ) => Promise<Array<DecodedLogEntryEvent<T>>>;
