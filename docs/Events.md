# Working with Events

All of the Arc.js contract wrapper classes expose the contract's events that look just like the events as exposed by TruffleContracts, but with a couple of advantages:

1. If you are using TypeScript then the event arguments (`_args`) will by typed, so you will see suggestions and errors in Intellisense and the TypeScript compiler.
2. With Truffle, the callback to `get` or `watch` may or may not receive an array of events.  Sometimes it can be a single event.  The Arc.js wrapper always gives you an array.  Arc.js also eliminates duplicate events that can occur while the chain settles down (a feature that can be suppressed if desired).
