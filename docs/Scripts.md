# Working with Arc.js Scripts
Arc.js contains a set of scripts for building, publishing, running tests and migrating contracts to any network.  These scripts are meant to be accessible and readily usable by client applications.

Typically an application will run an Arc.js script by prefixing "`npm explore @daostack/arc.js -- `" to the Arc.js script.  For example, to run the Arc.js script `npm start ganache` from your application, you would run:

```script
npm explore @daostack/arc.js -- npm start ganache
```

Otherwise, when running the scripts at the root of an Arc.js repo, you must omit the `npm explore @daostack/arc.js -- ` so it looks like this.

```script
npm start ganache
```

!!! info "More Scripts"
    More scripts than are described here are defined in the `package-scripts.js` file.  The Arc.js package uses `nps` run these scripts. If you install `nps` globally you can substitute `npm start` with `nps`, so, at the root of an Arc.js repo, it looks like this:

    ```javascript
    nps ganache
    ```


## Deploying to Testnets

Refer here for instructions on [migrating to Ganache](Home#set-up-a-testnet-with-arc-contracts) and [migrating contracts to other test networks](Migration).

## Running Against a Ganache Database

It can be very handy to run Arc.js tests or your application against a Ganache database that persists the state of the chain across instances of Ganache.  Refer here for [how to use a Ganache database](GanacheDb).

## Run Lint

Run lint on both library and test code like this:

```
npm start lint
```

!!! info
    The above script runs `npm start lint.code` and `npm start lint.test`

To lint and fix:

```
npm start lint.andFix
```

!!! info
    You can also fix code and test separately: `npm start lint.code.andFix` and `npm start lint.test.andFix`


## Run Tests

To run the Arc.js tests, run the following script in the Arc.js root folder, assuming you have already
[installed all the npm packages](Home#installation), and are [running a testnet with migrated Arc contracts](Home#set-up-a-testnet-with-arc-contracts):

```script
npm start test
```

This script builds all of the code and runs all of the tests.

!!! info
    Both application and test code are written in TypeScript.

### Stop tests on the first failure

```script
npm start test.bail
```

### Run tests defined in a single test module

Sometimes you want to run just a single test module:

```script
npm start "test.run test-build/test/[filename]"
```

To bail:

```script
npm start "test.run --bail test-build/test/[filename]"
```

Unlike `test`, the script `test.run` does not build the code first, it assumes the code has already been built, which you can do like this:

```
npm start test.build
```
