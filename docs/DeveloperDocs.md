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

## Services
Services are classes that are dedicated to particular tasks.

Examples of services:


**AccountService** - provides notifications when the current account changes

**AvatarService** - avatar helper functions

**ConfigService** - global configuration system

**LoggingService** - logging system

**ProposalService** - helper methods for proposals

**PubSubEventService** - PubSub event system

**TransactionService** - helper methods for transactions.  Also includes the TxTracking subsystem (but this [will change](https://github.com/daostack/arc.js/issues/272))

**Web3EventService** - helper methods for web3 events

**WrapperService** - provides easy access to wrapper classes and their factories

## Other classes

**[utils.ts](https://github.com/daostack/arc.js/blob/master/lib/utils.ts)** - provides miscellaneous functionality, including initializing `web3`, creating a truffle contract from a truffle contract artifact (json) file, and others.

**[utilsInternal.ts](https://github.com/daostack/arc.js/blob/master/lib/utilsInternal.ts)** -- internal helper functions not exported to the client.

**[Dao.ts](https://github.com/daostack/arc.js/blob/master/lib/dao.ts)** -- not a wrapper, nor defined as a service, more like an entity, it provides helper functions for DAOs, particularly `DAO.new` and `DAO.at`.

## Arc.js initialization

Arc.js typings are available to application via [index.ts](https://github.com/daostack/arc.js/blob/master/lib/index.ts).

At runtime, applications must initialize Arc.js by calling `InitializeArcJs` which is defined in [index.ts](https://github.com/daostack/arc.js/blob/master/lib/index.ts).  This might be viewed as the entry-point to Arc.js.

## Migrations
A folder called "migrations" provides a structure that is expected by `truffle contract` when running migrations.  It contains a single stage that does little but invoke other  [code generated from typescript](https://github.com/daostack/arc.js/blob/master/lib/migrations/2_deploy_schemes.ts) at build time.

