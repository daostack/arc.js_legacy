# Working with Events

Arc.js offers two types of event systems, [Web3](web3events) and [Pub/Sub](#pubsubevents):

- **Web3 Events** enable you to get and watch events as they originate from Web3 and Arc contracts.    The Web3 events system also contains a hybrid of the two systems, enabling you to watch a Web3 event by subscribing to a [Pub/Sub event](#pubsubevents).

- **Pub/Sub Events** enable you to subscribe to various events published by Arc.js itself (or even by your own application if you want).

The following sections describe how you can use these two types of events.

<a name="web3events"></a>
## Web3 Events

We refer to "Web3 events" as the events that originate from blockchain events (especially events from Arc contracts) and that are served up by Web3. (see the [Web3 documentation on contract events](https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events)). Web3 events map directly to events emitted by contracts on the blockchain and thus allow you to filter by event parameters and ranges of block numbers.

Arc.js exposes Web3 events in an format virtually the same as Web3 and Truffle, but with enhancements.  In some cases Arc.js goes further by exposing Web3 event arguments as entities (objects) that are simpler to use and may provide more information and functionality than the original raw event.

The following sections describe enhanced Web3 events, entity events, and how to subscribe to Web3 events as Pub/Sub events.

<a name="enhancedweb3events"></a>
### Enhanced Web3 Events
Every Arc contract wrapper in Arc.js exposes all of the events fired by the wrapped contract,  events look just like those exposed by [Web3](https://github.com/ethereum/wiki/wiki/JavaScript-API#contract-events), so you can get, watch and filter these events in the same way you would using Web3 or Truffle.

Arc.js enhances these events in several ways:

- If you are using TypeScript then the event data supplied to your callback will by typed, so you will see suggestions and errors in Intellisense and the TypeScript compiler.
- The callback to `get` is invoked once for the entire array of fired events, always returning an array.  The callback to `watch` is invoked once for each value, always returning the event.
- The `get` method directly returns a promise of an array containing every event fetched, bypassing the need for a callback.
- Optionally you can use `subscribe` instead of `watch` to use the Pub/Sub event mechanism as an alternate means of watching events as they fire. See [Pub/Sub Web3 Events](#pubsubweb3).
- You need not worry about duplicate events, Arc.js eliminates them.  (Duplicate events can occur while the chain is still in the process of reorganizing). This feature can be suppressed if desired when you create an `EventFetcher` (see [EventFetcherFilterObject](/api/interfaces/EventFetcherFilterObject)).

The enhanced event functionality is provided by [Web3EventService.createEventFetcherFactory(...)](api/classes/Web3EventService#createEventFetcherFactory) which returns an [EventFetcherFactory](api/README/#eventfetcherfactory) function which returns an [EventFetcher](api/interfaces/eventfetcher) which gives you the `get`, `watch` and `subscribe` methods.

Here is an example of the above flow, resulting in calling `get` without a callback to get all `ChangeUpgradeSchemeProposal` events pertaining to a given DAO:

```javascript
const web3EventService = new Web3EventService();

const eventFetcherFactory = 
web3EventService.createEventFetcherFactory(upgradeContract.contract.ChangeUpgradeSchemeProposal);

const eventFetcher = eventFetcherFactory(
  { _avatar: someAddress }, { fromBlock: 0});

const events = await eventFetcher.get();

events.forEach((event) => { console.log(`proposal id: ${event._proposalId}`); } );
```

All of Arc.js contract wrappers already provide an `EventFetcherFactory` method for each of the Arc events in the contract they wrap.  So the code example given above is simplified:

```javascript
const eventFetcher = upgradeScheme.ChangeUpgradeSchemeProposal(
  { _avatar: someAddress }, { fromBlock: 0});

const events = await eventFetcher.get();

events.forEach((event) => { console.log(`proposal id: ${event._proposalId}`); } );
```

<a name="entityevents"></a>
### Entities for Web3 Events

In some cases Arc.js exposes Web3 event arguments as entities (objects) that are cleaner to use and may provide more information and functionality than the original raw event.  Web3 event entities can include any parts of the raw Web3 event information as well as additional relevant information and useful functions.



Making extensive use of this feature, [Proposal-related events](Proposals#proposalevents) return entities instead of the raw Web3 event data.

That is really all you need to know about entities for Web3 events, so the following is optional reading in case you find yourself wanting to convert for yourself a regular enhanced Web3 event into an entity event.

You can use [Web3EventService](api/classes/Web3EventService) to turn any [EventFetcherFactory](api/README/#eventfetcherfactory) into an [EntityFetcherFactory](api/README/#entityfetcherfactory) providing cleaner and potentially richer entities than what you get from Web3 and [EventFetcherFactory](api/README/#eventfetcherfactory).

The [EntityFetcherFactory](api/README/#entityfetcherfactory) creates an [EntityFetcher](api/interfaces/entityfetcher) which gives you the `get`, `watch` and `subscribe` methods.

Here is how you can turn `ChangeUpgradeSchemeProposal` into an `EntityFetcherFactory` whose events give you the promise of an object ("entity") with a single `avatarAddress` property:

```javascript
const entityFetcherFactory = web3EventService.createEntityFetcherFactory(
  upgradeScheme.ChangeUpgradeSchemeProposal,
  (event) => {
    return Promise.resolve({ avatarAddress: event.args._avatar });
  });

const eventFetcher = entityFetcherFactory({}, { fromBlock: 0});

eventFetcher.watch(
  (error, event) => { 
    if (!error) {
      console.log(`avatarAddress: ${entity.avatarAddress}`); 
    }
);
```

Just like regular events, when you are done with fetching entity events you can stop watching:

```javascript
eventFetcher.stopWatching();
```

### Comparing Enhanced Web3 with Entity for Web3 Events

Enhanced Web3 ([EventFetcherFactory](api/README/#eventfetcherfactory)) and entity ([EntityFetcherFactory](api/README/#entityfetcherfactory)) events each have relative pros and cons.  

Enhanced Web3 events give you all of the information that Web3 provides about an event.  These events closely match what you may be accustomed-to if you have been working with Web3 and Truffle.

Entity events only give you an entity, a javascript object providing information about the event, but the event entities can include additional relevant information and useful functions that you won't get from the enhanced Web3 events.

Otherwise there is little difference between the two.   They both enjoy the enhancments provided by Arc.js.

!!! note
    If you prefer to use the unenhanced events supplied by Web3 via Truffle, you can access them via the contract handler property `contract`, which is the original [Truffle contract](http://truffleframework.com/docs/getting_started/contracts).

<a name="pubsubweb3"></a>
### Pub/Sub Web3 Events

Both `EventFetcher` and `EntityFetcher` provide a `subscribe` function, sibling to `get` and `watch`, that enables you specify the topic of a [Pub/Sub event](#pubsubevents) that will be published whenever the underlying Web3 event is fired.

When you specify the topic for such a subscription you are effectively creating your own Pub/Sub event.  This gives you wide flexibility in scoping your event handling across different Arc.js contract wrappers and events, including leveraging the hierarchical structure that you can build into your topic strings.  Further, any number of your code components can use [PubSubEventService.subscribe](/api/classes/PubSubEventService#subscribe) to subscribe to a single Pub/Sub Web3 event.  You just need to have called `EntityFetcher.subscribe` once to initiate fetching of the Web3 event and subsequent publishing to the given Pub/Sub topic.

<a name="pubsubevents"></a>
## Pub/Sub Events

The [PubSubEventService](api/classes/PubSubEventService) provides a Pub/Sub event system that enables you to subscribe to various events published by Arc.js (or even by your own application if you want).


Uses of pub/sub events:

- Tracking transactions as they complete  (see [Transactions](Transactions)).

- Being notified whenever the current account changes (see [Account Changes](Configuration#accountchanges)).

- Watching events in the Web3 event system using the `subscribe` function implemented by [EventFetcher](api/interfaces/EventFetcher/) and [EntityFetcher](api/interfaces/EntityFetcher/) (see [Pub/Sub Web3 Events](#pubsubweb3))

- Any other custom purpose for which you wish to apply the `PubSubEventService` in publishing and subscribing to events in the context of your own application

When subscribing to a Pub/Sub event we specify the event to which we want to subscribe using a string called the event "topic". Event topics may be hierachically scoped by levels separated by periods ('.'). So for example: 
   
   - "A.B.C" subscribes to all "A.B.C" events
   - "A.B" subscribes to all events prefixed by "A.B"
   - "A" subscribes to all events prefixed by "A"

You can subscribe to a Pub/Sub event using  `PubSubEventService`, like this:

```javascript
const subscription = PubSubEventService.subscribe("aTopic", (topic, payload) =>
{
  console.log(`received event ${topic}` with: ${payload.someImportantProperty});
})
```

You can subscribe to multiple events at once by passing the topics in an array:

```javascript
const subscription = PubSubEventService.subscribe(
  ["aTopic 1", "aTopic 2"], (topic, payload) =>
{
  console.log(`received event ${topic}` with: ${payload.someImportantProperty});
})
```

When you are done, be sure to unsubscribe to the event(s) or you risk memory leaks and excessive CPU usage:

```javascript
subscription.unsubscribe();
```

Or unsubscribe by topic: 

```javascript
PubSubEventService.unsubscribe("aTopic");
```

Or by the callback you passed in when you subscribed:

```javascript
PubSubEventService.unsubscribe(aCallback);
```
