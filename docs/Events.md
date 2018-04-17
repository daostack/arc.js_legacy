# Events

## Blockchain Contract Events

All of the Arc.js contract wrapper classes expose the contract's events that look just like the events as exposed by [Truffle contracts](https://github.com/trufflesuite/truffle-contract), but with a couple of advantages:

1. If you are using TypeScript then the event arguments (`_args`) will by typed, so you will see suggestions and errors in Intellisense and the TypeScript compiler.
2. With Truffle, the callback to `get` or `watch` may or may not receive an array of events.  Sometimes it can be a single event.  The Arc.js wrapper always gives you an array.  Arc.js also eliminates duplicate events that can occur while the chain settles down (a feature that can be suppressed if desired).

## Arc.js Pub/Sub Events

Arc.js has a pub/sub event system accessible using the [EventService](api/classes/EventService).  You can use a subclass of [EventService](api/classes/EventService) called [TransactionService](api/classes/TransactionService) to track transactions as they complete.

### Tracking Transactions

Many Arc.js functions cause transactions to occur in the chain.  Each transaction requires manual attention from the application user, and depending on the speed of the net, there may be substantial delays between each transaction and before all of the transactions in a given function have completed. So you may wish to give the user a visual sense of progress as a function proceeds towards completion.

Using [TransactionService](api/classes/TransactionService), you can track when transactions are about to start happening, how many transactions there will be, and when each transaction has completed.

For example, out of all functions in Arc.js, [DAO.new](api/classes/DAO#new) generates the most transactions.  Suppose you want to feed back to the user how many transaction to expect, and when each one has completed:.  Here is how you can do that:

```javascript
import { TransactionService } from "@daostack/arc.js";

const subscription = TransactionService.subscribe("txReceipts.DAO.new", 
  (topic, txEventInfo) => {
    // the options you passed into the function (DAO.new in this case)
    const optionsWithDefaults = txEventInfo.options;
    // the expected number of transactions
    const expectedNumTransactions = txEventInfo.txCount;
    // a key that is unique to a single invocation of the function (DAO.new in this case)
    const uniqueInvocationKey = txEventInfo.invocationKey;
    // TransactionReceiptTruffle for the just-completed transaction.
    // This will be null the first time the event is fired.
    const transaction = txEventInfo.tx;
});
```

Now you are ready to handle "txReceipts.DAO.new" events whenever you call `DAO.new`.  To let you know in advance the expected count of transactions, a "kick-off" event will be published once at the beginning of each function invocation before any transactions have begun.  In that event, `txEventInfo.tx` will be null.  The property `txEventInfo.uniqueInvocationKey` will identify the "thread" of events associated with a single function invocation.

You can supply additional information in the options passed to the invoked function which are then passed back to you in the event callbacks (`txEventInfo.options`, above). For example, you may desire a tighter coupling between the events and a specific function invocation, and for you the kick-off event and invocationKey may not suffice.  In that case you could do something like:

```javascript
options.myInvocationkey = TransactionService.generateInvocationKey("DAO.new");
```

to generate a unique invocationKey.  Every call to `generateInvocationKey` generates a unique `Symbol`, regardless of the input.

!!! warning "Important"
    You must unsubscribe to the subscription or you risk memory leaks and excessive CPU usage:
    ```javascript
    subscription.unsubscribe();
    ```

!!! note
    `txEventInfo.options` will usually contain the options you passed in, with default values added.  But in the case of `DAO.new`, it will not contain the default values.  If you need the default values then instead of subscribing to "txReceipts.DAO.new" you can subscribe to "txReceipts.DaoCreator" and receive events published by  [DaoCreatorWrapper.forgeOrg](api/classes/DaoCreatorWrapper#forgeOrg) and [DaoCreatorWrapper.setSchemes](api/classes/DaoCreatorWrapper#setSchemes).  Currently this would otherwise be the same as subscribing to "txReceipts.DAO.new", though it cannot be guaranteed it will always be the case in future versions of Arc.js.

### Mapping tx
### Specifying Events
You specify which event to which you wish to subscribe using a string as an event specifier (or in the code, the event "topic").  The event specifier typically incorporates an Arc contract name which will map to events published by a wrapper class for that contract.  For example, the event specifier "txReceipts.DaoCreator" refers to "txReceipts" events published by [DaoCreatorWrapper](api/classes/DaoCreatorWrapper).

!!! note
    There are a couple of exceptions when a specific contract is not involved, namely with `DAO.new` and `ContractWrapper.setParameters` (the latter covers all calls to [ContractWrapperBase.setParameters](api/classes/ContractWrapperBase#setParameters).

Event specifiers are hierachical. So for example: 
   
   - "txReceipts" subscribes to all events published with that prefix (which in this case means those using [TransactionService](api/classes/TransactionService))
   - "txReceipts.[ContractName]" subscribes to all "txReceipts" events published by the "[ContractName]Wrapper" class
   - "txReceipts.[ContractName].[functionName]" subscribes to all "txReceipts" events published by the given function in the "[ContractName]Wrapper" class
