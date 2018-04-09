# Working with Arc.js Scripts
Arc.js contains a set of scripts for building, publishing, running tests and migrating contracts to any network.  These scripts are meant to be accessible and readily usable by client applications.

Typically an application will run an Arc.js script by prefixing "`npm explore @daostack/arc.js -- `" to the Arc.js script.  For example, to run the Arc.js script `npm start test.ganache.run` from your application, you would run:

```script
npm explore @daostack/arc.js -- npm start test.ganache.run
```

Otherwise, when running the scripts at the root of an Arc.js repo, you must omit the `npm explore @daostack/arc.js -- ` so it looks like this.

```script
npm start test.ganache.run
```

!!! info "More Scripts"
    More scripts than are described here are defined in the `package-scripts.js` file.  The Arc.js package uses `nps` run these scripts. If you install `nps` globally you can substitute `npm start` with `nps`, so, at the root of an Arc.js repo, it looks like this:
    ```javascript
    nps test.ganache.run
    ```


## Deploying to Testnets

Refer here for instructions on [migrating to Ganache](Home#set-up-a-testnet-with-arc-contracts) and [migrating contracts to other test networks](Migration).

## Running Against a Ganache Database

It can be very handy to run Arc.js tests or your application against a Ganache database that persists the state of the chain across instances of Ganache.  Refer here for [how to use a Ganache database](GanacheDb).

## Run Lint and Tests

To run lint and the Arc.js tests, run the following script in the Arc.js root folder, assuming you have already
[installed all the npm packages](Home#installation), and are [running a testnet with migrated Arc contracts](Home#set-up-a-testnet-with-arc-contracts):

```script
npm test
```

### Stop tests on the first failure

```script
npm start test.bail
```

### Run tests defined in a single test module

Sometimes you want to run just a single test module:

```script
npm start "test.automated test/[filename]"
```

To bail:

```script
npm start "test.automated test/[filename] --bail"
```
