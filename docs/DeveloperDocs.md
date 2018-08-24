# Arc.js Architecture Review

The following is a brief sketch of the primary structures of the code in Arc.js.

Git repository is [here](https://github.com/daostack/arc.js).

User documentation is [here](https://daostack.github.io/arc.js/Home/).

Both code and automated tests are written in TypeScript.

Code standards are enforced by TsLint rules defined in [tslint.json](https://github.com/daostack/arc.js/blob/master/tslint.json).

User documentation is generated using [TypeDoc](http://typedoc.org/) and [MkDocs](https://www.mkdocs.org/).  Typedocs is configured and executed using [typedoc.js](https://github.com/daostack/arc.js/blob/master/package-scripts/typedoc.js).  MkDocs is configured in [mkdocs.yml](https://github.com/daostack/arc.js/blob/master/mkdocs.yml).

(The user documentation is a little sketchy in how it addresses users versus developers.  There is [a ticket to clean this up](https://github.com/daostack/arc.js/issues/238).)

While some scripts are available in package.json, all are defined in [package-scripts.js](https://github.com/daostack/arc.js/blob/master/package-scripts.js).  Package-script.js leverages [nps](https://github.com/kentcdodds/nps) and defers to several custom javascript node scripts contained [here](https://github.com/daostack/arc.js/tree/master/package-scripts).

Code is located in the [lib folder](https://github.com/daostack/arc.js/tree/master/lib), tests under [test](https://github.com/daostack/arc.js/tree/master/test).

Most of the code modules define either an Arc contract wrapper class or a service class.

Arc contract wrapper classes are all located under [lib/wrappers](https://github.com/daostack/arc.js/tree/master/lib/wrappers).

Service classes are all located in lib (though there is a [ticket to move them](https://github.com/daostack/arc.js/issues/208))

More on wrappers and services follows.
## Arc Contract Wrappers
Every Arc contract wrapper class has as its root base the [ContractWrapperBase class](https://github.com/daostack/arc.js/blob/master/lib/contractWrapperBase.ts).

Each wrapper can be instantiated and hydrated using the [ContractWrapperFactory class](https://github.com/daostack/arc.js/blob/master/lib/contractWrapperFactory.ts).  The word “hydrated” means to initialize a wrapper instance with information from the chain using `.new`, `.at` or `.deployed`.

Not all wrapper classes inherit directly from `ContractWrapperBase`. The two voting machine classes inherit from [IntVoteInterfaceWrapper](https://github.com/daostack/arc.js/blob/master/lib/wrappers/intVoteInterface.ts) which in turn inherits from `ContractWrapperBase`.

## Other classes

**[utils.ts](https://github.com/daostack/arc.js/blob/master/lib/utils.ts)** - provides miscellaneous functionality, including initializing `web3`, creating a truffle contract from a truffle contract artifact (json) file, and others.

**[utilsInternal.ts](https://github.com/daostack/arc.js/blob/master/lib/utilsInternal.ts)** -- internal helper functions not exported to the client.

**[Dao.ts](https://github.com/daostack/arc.js/blob/master/lib/dao.ts)** -- not a wrapper, nor defined as a service, more like an entity, it provides helper functions for DAOs, particularly `DAO.new` and `DAO.at`.

## Arc.js initialization

Arc.js typings are available to application via [index.ts](https://github.com/daostack/arc.js/blob/master/lib/index.ts).

At runtime, applications must initialize Arc.js by calling `InitializeArcJs` which is defined in [index.ts](https://github.com/daostack/arc.js/blob/master/lib/index.ts).  This might be viewed as the entry-point to Arc.js.

## Migrations
A folder called "migrations" provides a structure that is expected by `truffle contract` when running migrations.  It contains a single stage that does little but invoke other  [code generated from typescript](https://github.com/daostack/arc.js/blob/master/lib/migrations/2_deploy_schemes.ts) at build time.

## Scripts


### Build

Build the distributable code like this:

```script
npm start build
```

Build the test code like this:

```script
npm start test.build
```

### Lint

Run lint on both library and test code like this:

```script
npm start lint
```

!!! info
    The above script runs `npm start lint.code` and `npm start lint.test`

To lint and fix:

```script
npm start lint.andFix
```

!!! info
    You can also fix code and test separately: `npm start lint.code.andFix` and `npm start lint.test.andFix`


### Tests

To run the Arc.js tests, run the following script in the Arc.js root folder, assuming you have already
[installed all the npm packages](Home#installation), and are [running a testnet with migrated Arc contracts](Home#set-up-a-testnet-with-arc-contracts):

```script
npm start test
```

This script builds all of the code and runs all of the tests.

!!! info
    Both application and test code are written in TypeScript.

#### Stop tests on the first failure

```script
npm start test.bail
```

#### Run tests defined in a single test module

Sometimes you want to run just a single test module:

```script
npm start "test.run test-build/test/[filename]"
```

To bail:

```script
npm start "test.run --bail test-build/test/[filename]"
```

Unlike `test`, the script `test.run` does not build the code first, it assumes the code has already been built, which you can do like this:

```script
npm start test.build
```

### Build Documentation

Build the documentation like this:

```script
npm start docs.build
```

Preview the documentation:

```script
npm start docs.build.andPreview
```

Publish the documentation:

```script
npm start docs.build.andPublish
```
