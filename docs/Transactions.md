# Tracking Transactions

Many Arc.js functions cause transactions to be generated asynchronously in the chain, and each transaction proceeds asychronously through a "lifecycle" of state changes.  Each transaction requires manual attention from the application user, and depending on the speed of the net, there may be substantial delays before the result of a transaction becomes available.  Some operations may involve multiple transactions, with significant delays between each transaction until the operation has fully completed.

So you may wish to give the user a visual sense of progress during such a lengthy asynchronous process.

Using [TransactionService](api/classes/TransactionService), you can be notified when transactions are about to be generated, how many transactions there will be, and when each transaction has completed each phase in its lifecycle.

For example, out of all functions in Arc.js, [DAO.new](api/classes/DAO#new) generates the most transactions.  Suppose you want to feed back to the user how many transaction to expect, and when each one has completed.  Here is how you can do that:

```typescript
import { TransactionService } from "@daostack/arc.js";

const subscription = TransactionService.subscribe("TxTracking.DAO.new", 
  (eventName: string, txEventInfo: TransactionReceiptsEventInfo) => {
    // the options you passed into the function (DAO.new in this case)
    const optionsWithDefaults = txEventInfo.options;
    // the expected number of transactions
    const expectedNumTransactions = txEventInfo.txCount;
    // a key that is unique to a single invocation of the function (DAO.new in this case)
    const uniqueInvocationKey = txEventInfo.invocationKey;
    // Transaction hash for `sent` transaction.
    // Will be null in the `kickoff` event.
    const txHash = txEventInfo.tx;
    // TransactionReceiptTruffle for mined and confirmed transactions.
    // Will be null in the `kickoff` and `sent` events.
    const txReceipt = txEventInfo.txReceipt;
    // Stage of the transaction.  See `TransactionStage`.
    const stage = txEventInfo.txStage;
    // Error, if this is a failed transaction.
    const error = txEventInfo.error;
});
```

Now you are ready to handle "TxTracking.DAO.new" events whenever you call `DAO.new`.

!!! warning "Important"
    You must unsubscribe to the subscription or you risk memory leaks and excessive CPU usage:
    ```javascript
    subscription.unsubscribe();
    ```

To let you know in advance the expected count of transactions, a single "kick-off" event is published at the beginning of each function invocation and before any transactions have begun.  In that event, `txEventInfo.tx` will be null.  The property `txEventInfo.uniqueInvocationKey` uniquely identifies the "thread" of events associated with a single function invocation.

You can supply anything you want in the options passed to the invoked function.  The entire object will be passed back to you in the event callback (`txEventInfo.options`, above). For example, you may desire a tighter coupling between the events and a specific function invocation, so for you the kick-off event and invocationKey may not suffice.  In that case you could generate a key like this:

```javascript
options.myInvocationkey = TransactionService.generateInvocationKey("DAO.new");
```

!!! Note
    Note that every call to `generateInvocationKey` generates a unique value, regardless of the input. In any case, this is just a convenience method, you can use whatever means you want to generate a key.  

`txEventInfo.options` will usually contain the options you passed in, with default values added.  But in the case of `DAO.new`, it will not contain the default values.  If you need to see the default values for `DAO.new` then instead of subscribing to "TxTracking.DAO.new" you can subscribe to "TxTracking.DaoCreator" and receive events published by  [DaoCreatorWrapper.forgeOrg](api/classes/DaoCreatorWrapper#forgeOrg) and [DaoCreatorWrapper.setSchemes](api/classes/DaoCreatorWrapper#setSchemes).  This would otherwise be the same as subscribing to "TxTracking.DAO.new".

!!! Tip
    See more about how to use the Pub/Sub event system, including how to scope your subscriptions to whole sets of events, [here](/Events/#pubsub-events).

## Transaction Lifecycle
All transactions proceed through three stages:  sent, mined and confirmed.  In the example above, when we subscribed to `TxTracking.DAO.new`, we are actually subscribing to four distinct events: 

1. TxTracking.DAO.new.kickoff
2. TxTracking.DAO.sent
3. TxTracking.DAO.mined
4. TxTracking.DAO.confirmed

You can identify the stage of the event using the the event name (topic) parameter of the callback, or by the `txStage` property of the `txEventInfo` (payload).  See the code example above.

Errors may occur at any point in the lifecycle.  When they do you will receive an event with ".failed" appended to the event name (topic) parameter of the callback,
and the `error` property will contain the `Error` that describes what happened.  The txStage will represent the stage at which the error occurred, and you will receive no further events on the transaction.

## Estimating Gas Limits
Arc.js contains an experimental feature that automatically estimates the gas cost of any transaction executed using the contract wrappers.  The estimate will appear in a client like MetaMask, giving the user a more accurate sense of how much the transaction is going to cost when they are decided whether to approve the transaction, and putting fewer of the user's funds at risk in case of an error.

This feature is disabled by default.  You can enable it at any time with the following line:

```javascript
ConfigService.set("estimateGas", true);
```

And you may similarly disable it at any time.
