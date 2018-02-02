[![Build Status](https://travis-ci.org/daostack/daostack.svg?branch=master)](https://travis-ci.org/daostack/arc-js)
[![NPM Package](https://img.shields.io/npm/v/daostack-arc.svg?style=flat-square)](https://www.npmjs.org/package/daostack-arc-js)

# DAOstack Arc-Js

Daostack Arc-Js is a library that faciliates javascript application access to ethereum smart contracts provided by [DAOstack Arc](https://github.com/daostack/daostack). Arc-Js sits just above DAOstack Arc on the lower layer of the DAO stack.

## Contribute to Arc-Js

Contributions and pull requests are very welcome. Join us on [Slack](daostack.slack.com).

If you want to contribute to the code, check out  [CONTRIBUTING.md](CONTRIBUTING.md).

## Security
DAOstack Arc-Js is still on its alpha version.  It is meant to provide secure, tested and community-audited code, but please use common sense when doing anything that deals with real money! We take no responsibility for your implementation decisions and any security problem you might experience.

## Getting Started

### Installation

Ensure that [NodeJS](http://nodejs.org/), v9.4.0 or greater, is installed.

Install the npm package in your project:

```script
npm install daostack-arc-js --save
```

Now you can proceed with migrating contracts to a running testnet and configuring Arc-Js in your application and environment.

### Setting up a Testnet with Arc Contracts

Arc-Js runs against an Ethereum network where it assumes that the Arc contracts have been migrated.  Out of the box, Arc-Js can find contracts migrated to the mainnet. But for testing, you will need to tell it to migrate the Arc contracts to a testnet of your choice.
To do this you can run a few scripts that Arc-Js provides.

For example, to deploy contracts to a ganache testnet, you can run the following scripts from the root of your application:

Bring up ganache in a separate window:

```script
npm explore daostack-arc-js -- npm start test.ganache.runAsync
```

If the window didn't fire up in your OS, then run this in a separate window of your own creation:

```script
npm explore daostack-arc-js -- npm start test.ganache.run
```

Now migrate the Arc contracts to ganache:

```script
npm explore daostack-arc-js -- npm start migrateContracts
```

Now when your app uses Arc-Js, it will run against the network you just fired up.

### Using the Arc-Js Library
In your application's JavaScript or TypeScript:

#### Import Arc-Js
```javascript
import * as ArcJs from 'daostack-arc-js';
```

#### Configure Arc-Js
The default configuration settings for Arc-Js can be found in its `config/default.json` file. A few  examples:

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
```

You can also override the default configuration settings by setting values on properties of `node.env` (see [here](https://nodejs.org/dist/latest-v9.x/docs/api/process.html#process_process_env)) with the same name as the corresponding arc-js configuration setting.  This enables you to use environment variables to control the arc-js configuration.

[TODO: prefix env variable names?]

#### Code against Arc-Js
Now that you've got Arc-Js plugged into your application and configured, and contracts migrated to a running testnet, you are ready to start coding against the Arc contracts.  The following sections describe how to do that.


## Working with Arc-Js Scripts
Arc-Js contains a set of scripts for building, publishing, running tests and migrating contracts to any network.  These scripts are meant to be accessible and readily usable by client applications.

Typically an application will run anArc-Js script by prefixing "npm explore daostack-arc-js -- "  to the Arc-Js script.  For example, to run the Arc-Js script `npm start test.ganache.run` from your application, you would run:
```
npm explore daostack-arc-js -- npm start test.ganache.run
```

All of the scripts are defined and documented in the package-scripts.js file.  You have already seen their most typical use in an application context in "Getting Started => Setting up a Testnet with Arc Contracts”.

## Working with Arc Contracts


Arc-Js wraps every Arc contract in a JavaScript class.

You can pull those wrappers into your code as follows:

```javascript
let arcContracts = await ArcJs.getDeployedContracts();
```
[TODO: the above is changing, need to update as refactoring proceeds]

Every contract wrapper class inherits from `ExtendTruffleContract` which provides common functions for all contract wrappers:

[TODO:  the following is copy/pasted from the arc.d.ts, which creates redundancy in documentation.  Can we instead create automated documentation from arc.d.ts and reference it here?]

```typescript
/**
 * Instantiate the class.  It will not yet be associated with a migrated contract.
 */
static new(): any;
/**
 * Instantiate the class as it was migrated to the given address on
 * the current network.
 * @param address 
 */
static at(address: string): any;
/**
 * Instantiate the class as it was migrated by Arc-Js on the given network.
 */
static deployed(): any;
/**
 * The underlying truffle contract object
 */
public contract: any;
/**
 * Call setParameters on this contract, returning promise of the parameters hash.
 * Creates a transaction.  [<= TODO: confirm]
 * @params Should contain property names expected by the specific contract type.
 */
public setParams(params: any): Promise<string>;
```

Scheme contracts also have the following:

```typescript
/**
 * Returns a string containing 1's and 0's representing the minimum 
 * permissions that the scheme may have, as follows:
 *
 * All 0: No permissions (note a scheme is always registered when added to a DAO)
 * 1st bit: Scheme is registered
 * 2nd bit: Scheme can register other schemes
 * 3th bit: Scheme can add/remove global constraints
 * 4rd bit: Scheme can upgrade the controller
 *
 */
public getDefaultPermissions(overrideValue: string): string;
```

The Arc contracts and associated Arc-Js contract wrapper classes can be categorized as follows.  For more information about each individual contract, see the file arc.d.ts.  [TODO <= automate some docs from arc.d.ts?]

### Schemes *
* SchemeRegistrar
* UpgradeScheme
* GlobalConstraintRegistrar
* ContributionReward
* VoteInOrganizationScheme
* VestingScheme

### Voting Machines
* AbsoluteVote
* Governance

### Global Constraints

* TokenCapGC

### Others
* GenesisScheme

\* Only Schemes implement `getDefaultPermissions`.

## Working with DAOs

[TODO: this is changing, need to update as refactoring proceeds]

Arc-Js provides a class called "DAO" that lets you create a new DAO and obtain information about DAOs.

[TODO: automate docs from arc.d.ts?]

## Deploying to Other Testnets
The "network" environment variable defines which network arc-js understands you to be deploying to.  For safety it assumes a different port for each network. Can be "live" (the mainnet), "kovan" or "ganache".  The default is "ganache".

## Run against a Ganache Database

It can be very handy to run against a ganache database that persists the state of the chain across instances of ganache.  The file package-scripts.js contains a number of scripts to help you manage this process.  Most simply, follow ths steps above for building and running the application, except when you bring up ganache, use this script:

 ```shell
npm start arc-js.ganacheDb.runAsync
```

    If the window didn't fire up in your OS, then run this in a separate window of your own creation:

```shell
npm start arc-js.ganacheDb.run
```

## Run Lint and Tests

To run lint and the Arc-Js tests, run the following script in the Arc-Js root folder:

```
npm install
npm start test.ganache.runAsync
npm start migrationContracts
npm test
```

See the "Scripts" section for more information about all of the scripts, including more test scripts.

[
  TODO:  should we include a description of the Arc-JS file structure in this readme, as was included here: https://docs.google.com/document/d/1GcdMe5STaXoKadaIAX-Sg6EODSLWx3n-C11i05iwQK4?
]