# Working with Arc.js Scripts
Arc.js contains a set of scripts for building, publishing, running tests and migrating contracts to any network.  These scripts are meant to be accessible and readily usable by client applications.

Typically an application will run an Arc.js script by prefixing "`npm explore @daostack/arc.js -- `" to the Arc.js script.  For example, to run the Arc.js script `npm start test.ganache.run` from your application, you would run:
```javascript
npm explore @daostack/arc.js -- npm start test.ganache.run
```

Otherwise, when running the scripts at the root of Arc.js, you must omit the `npm explore @daostack/arc.js -- `.

All of the scripts are defined in the package-scripts.js file.  You have already seen their [most typical use in an application context](#setting-up-a-testnet-with-arc-contracts).

See also  [Running Against a Ganache Database](#running-against-a-ganache-database), [Deploying to Other Testnets](#deploying-to-other-testnets) and [Run Lint and Tests](#run-lint-and-tests)

## Deploying to Other Testnets

Please refer [here](./Migration.md) for instructions on migrating contracts to other test networks.

## Running Against a Ganache Database

It can be very handy to run Arc.js tests or your application against a Ganache database that persists the state of the chain across instances of Ganache.  Please refer [here for how to do it](./GanacheDb.md).

## Run Lint and Tests

To run lint and the Arc.js tests, run the following script in the Arc.js root folder, assuming you have already
[installed all the npm packages](#installation), are [running a testnet with migrated Arc contracts](#setting-up-a-testnet-with-arc-contracts):

```script
npm test
```

### Stop on the first failure

```script
npm start test.bail
```

### Run an individual test module

Sometimes you want to run just a single test module:

```script
npm start "test.automated test/[filename]"
```

To bail:

```script
npm start "test.automated test/[filename] --bail"
```
