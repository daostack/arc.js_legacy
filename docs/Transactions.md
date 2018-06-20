# Tracking Transactions

Many Arc.js functions cause transactions to occur in the chain.  Each transaction requires manual attention from the application user, and depending on the speed of the net, there may be substantial delays between each transaction and before all of the transactions in a given function have completed. So you may wish to give the user a visual sense of progress as a function proceeds towards completion.

Using [TransactionService](api/classes/TransactionService), you can track when transactions are about to start happening, how many transactions there will be, and when each transaction has completed.

For example, out of all functions in Arc.js, [DAO.new](api/classes/DAO#new) generates the most transactions.  Suppose you want to feed back to the user how many transaction to expect, and when each one has completed.  Here is how you can do that:

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

Now you are ready to handle "txReceipts.DAO.new" events whenever you call `DAO.new`.

!!! warning "Important"
    You must unsubscribe to the subscription or you risk memory leaks and excessive CPU usage:
    ```javascript
    subscription.unsubscribe();
    ```

The event topic string defines a hierarchical scope and identifies the contract from which the transactions are generated:

- "txReceipts" subscribes to all events published by [TransactionService](api/classes/TransactionService)
- "txReceipts.[ContractName]" subscribes to all events published by [TransactionService](api/classes/TransactionService) and the "ContractName]Wrapper" class
- "txReceipts.[ContractName].[functionName]" subscribes to all events published by [TransactionService](api/classes/TransactionService), the "ContractName]Wrapper" class and the given function

To let you know in advance the expected count of transactions, a single "kick-off" event is published at the beginning of each function invocation and before any transactions have begun.  In that event, `txEventInfo.tx` will be null.  The property `txEventInfo.uniqueInvocationKey` uniquely identifies the "thread" of events associated with a single function invocation.

You can supply anything you want in the options passed to the invoked function.  The entire object will be passed back to you in the event callback (`txEventInfo.options`, above). For example, you may desire a tighter coupling between the events and a specific function invocation, so for you the kick-off event and invocationKey may not suffice.  In that case you could generate a key like this:

```javascript
options.myInvocationkey = TransactionService.generateInvocationKey("DAO.new");
```

Note that every call to `generateInvocationKey` generates a unique `Symbol`, regardless of the input.
In any case, this is just a convenience method, you can use whatever means you want to generate a key.  

`txEventInfo.options` will usually contain the options you passed in, with default values added.  But in the case of `DAO.new`, it will not contain the default values.  If you need to see the default values for `DAO.new` then instead of subscribing to "txReceipts.DAO.new" you can subscribe to "txReceipts.DaoCreator" and receive events published by  [DaoCreatorWrapper.forgeOrg](api/classes/DaoCreatorWrapper#forgeOrg) and [DaoCreatorWrapper.setSchemes](api/classes/DaoCreatorWrapper#setSchemes).  This would otherwise be the same as subscribing to "txReceipts.DAO.new".

!!! Tip
    You can see the actual values passed to most of the Arc contract functions by setting the LogLevel to `LogLevel.debug`.  See the [LoggingService](api/classes/LoggingService).
