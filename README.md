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

Import everything from ArcJs as follows:

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

#### Working with DAOs and Arc Contracts
Now that you've got Arc.js plugged into your application and configured, and contracts migrated to a running testnet, you are ready to start coding against DAOs and Arc contracts.  The following sections describe how.

One thing to remember:  All token and reputation amounts should be expressed in Wei.

[API docs to come](http://github.com/daostack/arc.js/issues/63)

## Working with DAOs

Arc.js provides a class named "DAO" that enables you to create new DAOs and obtain information about them.

To come: [reference to automated API documentation using comments in arc.d.ts](http://github.com/daostack/arc.js/issues/63)

To create a new DAO, use `DAO.new`.

### Create a new DAO with all defaults

The simplest example will create a DAO with all defaults:  no schemes nor founders, using the Universal Controller and default DaoCreator scheme.  See `NewDaoConfig`.

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT"
});
```

You can add and remove schemes later using `SchemeRegistrar`.

### Create a new DAO with founders

You may create a new DAO with founders by including a "founders" array.  This will automatically mint tokens and reputation to each founder.   See `NewDaoConfig`.

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  founders: [
    {
      // the current user
      address: accounts[0],
      reputation: web3.toWei(1000),
      tokens: web3.toWei(40)
    },
    {
      address: anyAddress,
      reputation: web3.toWei(1000),
      tokens: web3.toWei(40)
    },
    {
      address: anyAddress,
      reputation: web3.toWei(1000),
      tokens: web3.toWei(40)
    }
  ]
});
```

### Create a new DAO with schemes

You may create a new DAO with schemes by including a "schemes" array.  This will register the schemes with all default permissions and voting machines. See `SchemesConfig` and `SchemeConfig`.

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  schemes: [
    { name: "SchemeRegistrar" },
    { name: "UpgradeScheme" },
    { name: "GlobalConstraintRegistrar" }
  ]
});
```

### Create a new DAO overriding the default voting machine

You may override the default voting machine by adding a "votingMachines" element.  This will override the default voting machine, either at the root level to apply to all schemes, or within each scheme element to override for the specific scheme. See `NewDaoVotingMachineConfig` and `SchemesConfig`.

#### Default root-level override for all schemes

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  votingMachineParams: {
    votePerc: 45,
    ownerVote:false
  }
});
```

#### Scheme-specific override

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  schemes: [
    { name: "SchemeRegistrar" },
    { name: "UpgradeScheme" },
    {
      name: "GlobalConstraintRegistrar",
      votingMachineParams: {
        votePerc: 30,
      }
    }
  ]
});
```

### Create a new DAO with a non-Universal Controller

You can create a DAO using the DAOstack `Controller` contract by passing `false` for `universalController`.

TODO:  Pros and Cons?

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  universalController: false
});
```

### Create a new DAO with a non-default DaoCreator scheme.

You can create a DAO using an alternative `DaoCreator` scheme by passing its address for `daoCreatorScheme`.  The alternative scheme must implement the same interface as the Arc `DaoCreator` contract.

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  daoCreatorScheme: anAddress
});
```

### Get a previously-created DAO

Get a previously-created DAO using the avatar address:

```javascript
const dao = await DAO.at(daoAvatarAddress);
```

### Get all the DAOs ever created

[To Come](https://github.com/daostack/arc.js/issues/40)

### Get the DAOstack Genesis DAO

The DAOstack DAO is named "Genesis".  Obtain it like this:

```javascript
const genesisDao = await DAO.getGenesisDao();
```

## Using the Arc Contracts

Arc.js wraps every Arc contract in a JavaScript "wrapper" class.  Every wrapper class inherits from `ExtendTruffleContract` which provides a common set of functions in addition to all of the functions implemented by the specific Arc contract being wrapped.

### Categories of Arc Contracts
Arc contracts and associated Arc.js contract wrapper classes can be categorized as follows:

#### Schemes
* SchemeRegistrar
* UpgradeScheme
* GlobalConstraintRegistrar
* ContributionReward
* VoteInOrganizationScheme
* VestingScheme

#### Voting Machines
* AbsoluteVote
* GenesisProtocol

#### Global Constraints

* TokenCapGC

#### Others
* DaoCreator

You can pull those categorizations into your code as follows:

```javascript
import * as ArcJs from 'daostack-arc.js';
const arcJsWrappers = await ArcJs.getDeployedContracts();
```

Note `getDeployedContracts()` does not currently cache its results and is fairly time-consuming to run, so best to cache the results yourself.

Heads up: [getDeployedContracts is going to change](http://github.com/daostack/arc.js/issues/8)

See also [Obtaining a wrapper from getDeployedContracts](#obtaining-a-wrapper-from-getdeployedcontracts) and the following sections for several ways of instantiating Arc.js contract wrappers.

### Obtaining a DAO's Scheme

You may obtain the wrapper for a scheme that is registered with a DAO using `DAO.getScheme`.  Here is how to get the wrapper for the `UpgradeScheme` registered with a DAO:

```javascript
const upgradeScheme = await myDao.getScheme("UpgradeScheme);
```

### Obtaining a wrapper using the wrapper's factory class 

Each wrapper has a factory that provides static `.new()`, `.deployed()` and `.at()` methods.  These methods are implemented by `ExtendTruffleContract`.

Examples of their use:

#### deployed

Obtain the instance of the contract as deployed by Arc.js:

```javascript
import { UpgradeScheme } from "daostack-arc.js";
const deployedContract = await UpgradeScheme.deployed();
```

#### new

Call `new()` to migrate a new instance of the contract:

```javascript
import { UpgradeScheme } from "daostack-arc.js";
const newInstance = await UpgradeScheme.new();
```

#### at

Obtain the wrapper from a given address:

```javascript
import { UpgradeScheme } from "daostack-arc.js";
const newInstance = await UpgradeScheme.at(anAddress);
```

### Obtaining a wrapper from getDeployedContracts

Recall from [Categories of Arc Contracts](#categories-of-arc-contracts) that `getDeployedContracts()` returns categories of Arc contract wrappers.   You can use this information to obtain the wrappers themselves:

```javascript
import * as ArcJs from 'daostack-arc.js';
const arcJsWrappers = ArcJs.getDeployedContracts();
const contractAddress = arcJsWrappers.allContracts.UpgradeScheme.address;
const contractFactory = arcJsWrappers.allContracts.UpgradeScheme.contract;
const upgradeScheme = await contractFactory.contract.at(contractAddress);
```

Heads up: [getDeployedContracts is going to change](http://github.com/daostack/arc.js/issues/8)


### Obtainined any Arc contract using Utils.requireContract

Not all Arc contracts have been given wrapper classes, for example, `Avatar`, `UController` and many more.  But you can still obtain a raw TruffleContract enabling you to work with these contracts:

```javascript
import { Utils } from "daostack-arc.js";
const truffleContract = await Utils.requireContract("Avatar");
```

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