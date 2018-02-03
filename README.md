[![Build Status](http://travis-ci.org/daostack/daostack.svg?branch=master)](http://travis-ci.org/daostack/arc.js)
[![NPM Package](http://img.shields.io/npm/v/daostack-arc.svg?style=flat-square)](http://www.npmjs.org/package/daostack-arc.js)

# DAOstack Arc.js

Daostack Arc.js is a library that faciliates javascript application access to ethereum smart contracts provided by [DAOstack Arc](http://github.com/daostack/daostack). Arc.js sits just above DAOstack Arc on the lower layer of the DAO stack.

## Contribute to Arc.js

Contributions and pull requests are very welcome. Join us on [Slack](http://daostack.slack.com/messages).

If you want to contribute to the code, check out  [CONTRIBUTING.md](CONTRIBUTING.md).

## Security
DAOstack Arc.js is still on its alpha version.  It is meant to provide secure, tested and community-audited code, but please use common sense when doing anything that deals with real money! We take no responsibility for your implementation decisions and any security problem you might experience.

## Getting Started

### Installation

Ensure that [NodeJS](http://nodejs.org/), v9.4.0 or greater, is installed.

Install the npm package into your project:

```script
npm install daostack-arc.js --save
```

Now you can proceed with migrating contracts to a running testnet and configuring Arc.js in your application and environment.

### Setting up a Testnet with Arc Contracts

Arc.js runs against an Ethereum network where it assumes that the Arc contracts have been migrated.  Out of the box, Arc.js can find contracts migrated to the mainnet. But for testing, you will need to tell it to migrate the Arc contracts to a testnet of your choice.  You can do this by running a few Arc.js scripts.

For example, to deploy contracts to a ganache testnet, run the following scripts from the root of your application:

On Linux and others [until runAsync is fixed for Linux](http://github.com/daostack/arc.js/issues/64), run this in a separate window of your own creation:

```script
npm explore daostack-arc.js -- npm start test.ganache.run
```

On Windows: 
```script
npm explore daostack-arc.js -- npm start test.ganache.runAsync
```

Now migrate the Arc contracts to ganache:

```script
npm explore daostack-arc.js -- npm start migrateContracts
```

Now when your app uses Arc.js, it will be running against ganache and the contracts you just migrated.

For more on Arc.js scripts, see [Working with Arc.js Scripts](#working-with-arcjs-scripts).

### Using the Arc.js Library in your Code

#### Importing Arc.js
```javascript
import * as ArcJs from 'daostack-arc.js';
```

#### Configuring Arc.js
The default configuration settings for Arc.js can be found in its `config/default.json` file. A few  examples:

```json
{
  "providerUrl": "http://127.0.0.0:8545",
  "network": "ganache",
  "gasLimit": 6015000
}
```

To obtain a configuration setting:

```javascript
import { config } from '@daostack/arc.js';
config.get('network');
```

To override a configuration setting at runtime:
```javascript
import { config } from '@daostack/arc.js';
config.set('network', 'ropsten');
import { config } from 'daostack-arc.js';
config.set('network', 'kovan');
```

You can also override the default configuration settings by setting values on properties of `node.env` (see [here](http://nodejs.org/dist/latest-v9.x/docs/api/process.html#process_process_env)) with the same name as the corresponding arc.js configuration setting.  This enables you to use environment variables to control the arc.js configuration.

Heads up: Soon will be required to [prefix env variable names](http://github.com/daostack/arc.js/issues/42)

#### Using the Arc Contracts
Now that you've got Arc.js plugged into your application and configured, and contracts migrated to a running testnet, you are ready to start coding against the Arc contracts.  The following sections describe how to work with the Arc contracts.

## Using the Arc Contracts


Arc.js wraps every Arc contract in a JavaScript class.

You can pull those wrappers into your code as follows:

```javascript
let arcContracts = await ArcJs.getDeployedContracts();
```
Heads up: [the above API may change](http://github.com/daostack/arc.js/issues/8)

To Come: [automated generation and references to API documentation](http://github.com/daostack/arc.js/issues/63)

Every contract wrapper class inherits from `ExtendTruffleContract` which provides common functions for all contract wrappers.

The Arc contracts and associated Arc.js contract wrapper classes can be categorized as follows.

### Schemes
* SchemeRegistrar
* UpgradeScheme
* GlobalConstraintRegistrar
* ContributionReward
* VoteInOrganizationScheme
* VestingScheme

### Voting Machines
* AbsoluteVote
* GenesisProtocol

### Global Constraints

* TokenCapGC

### Others
* GenesisScheme (Heads up:  Soon to be "DaoCreator")

## Working with DAOs

Arc.js provides a class called "DAO" that lets you create a new DAO and obtain information about DAOs.

To come: [reference to automated API documentation using comments in arc.d.ts](http://github.com/daostack/arc.js/issues/63)


## Working with Arc.js Scripts
Arc.js contains a set of scripts for building, publishing, running tests and migrating contracts to any network.  These scripts are meant to be accessible and readily usable by client applications.

Typically an application will run an Arc.js script by prefixing `npm explore daostack-arc.js -- `  to the Arc.js script.  For example, to run the Arc.js script `npm start test.ganache.run` from your application, you would run:
```
npm explore daostack-arc.js -- npm start test.ganache.run
```

All of the scripts are defined and documented in the package-scripts.js file.  You have already seen their [most typical use in an application context](#setting-up-a-testnet-with-arc-contracts).

See also  [Running Against a Ganache Database](#running-against-a-ganache-database), [Deploying to Other Testnets](#deploying-to-other-testnets) and [Run Lint and Tests](#run-lint-and-tests)

## Deploying to Other Testnets
The "network" environment variable defines which network arc.js understands you to be deploying to when you run the "migrateContracts" script.  For safety it assumes a different HTTP port for each network. Can be "live" (the mainnet), "kovan" or "ganache" (To Come: [Support for Ropsten and Rinkeby testnets](http://github.com/daostack/arc.js/issues/50)).  The default is "ganache".

## Running Against a Ganache Database

It can be very handy to run against a ganache database that persists the state of the chain across instances of ganache.  The file package-scripts.js contains a number of scripts to help you manage this process.  Most simply, follow the steps above for building and running the application, except when you bring up ganache, use this script:

On Linux and others [until runAsync is fixed for Linux](http://github.com/daostack/arc.js/issues/64), run this in a separate window of your own creation:

```shell
npm explore daostack-arc.js -- npm start test.ganacheDb.run
```

On Windows:
 
 ```shell
npm explore daostack-arc.js -- npm start test.ganacheDb.runAsync
```

## Run Lint and Tests

To run lint and the Arc.js tests, run the following script in the Arc.js root folder:

```
npm install
npm start test.ganache.runAsync
npm start migrateContracts
npm test
```

TODO:  Should we include a description of the Arc.Js file structure in this readme, as was done [here](http://docs.google.com/document/d/1GcdMe5STaXoKadaIAX-Sg6EODSLWx3n-C11i05iwQK4?)?