[![Build Status](https://api.travis-ci.org/daostack/arc.js.svg?branch=master)](http://travis-ci.org/daostack/arc.js)
[![NPM Package](http://img.shields.io/npm/v/@daostack/arc.js.svg?style=flat-square)](http://www.npmjs.org/package/@daostack/arc.js)

# DAOstack Arc.js

DAOstack Arc.js sits just above [DAOstack Arc](http://github.com/daostack/daostack) on the DAO stack.  It is a library that facilitates javascript application access to the DAOstack Arc ethereum smart contracts.

For more information about Arc contracts and the entire DAOstack ecosystem, please refer to the [Arc documentation](https://daostack.github.io/arc/).

## Table of Contents
<!-- Table of contents generated generated by http://tableofcontent.eu -->
- [DAOstack Arc.js](#daostack-arcjs)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
    - [Setting up a Testnet with Arc Contracts](#setting-up-a-testnet-with-arc-contracts)
    - [Using the Arc.js Library in your Code](#using-the-arcjs-library-in-your-code)
      - [Importing Arc.js](#importing-arcjs)
      - [Configuring Arc.js](#configuring-arcjs)
      - [Working with DAOs and Arc Contracts](#working-with-daos-and-arc-contracts)
  - [Working with DAOs](#working-with-daos)
    - [Create a new DAO with all defaults](#create-a-new-dao-with-all-defaults)
    - [Create a new DAO with founders](#create-a-new-dao-with-founders)
    - [Create a new DAO with schemes](#create-a-new-dao-with-schemes)
    - [Create a new DAO overriding the default voting machine](#create-a-new-dao-overriding-the-default-voting-machine)
      - [Root-level, applying to all schemes](#root-level-applying-to-all-schemes)
      - [With alternate AbsoluteVote voting machine address](#with-alternate-absolutevote-voting-machine-address)
      - [With GenesisProtocol](#with-genesisprotocol)
      - [Scheme-specific](#scheme-specific)
    - [Create a new DAO with a non-Universal Controller](#create-a-new-dao-with-a-non-universal-controller)
    - [Create a new DAO with a non-default DaoCreator scheme](#create-a-new-dao-with-a-non-default-daocreator-scheme)
    - [Get a previously-created DAO](#get-a-previously-created-dao)
    - [Get the DAOstack Genesis DAO](#get-the-daostack-genesis-dao)
  - [Using the Arc Contracts](#using-the-arc-contracts)
    - [Categories of Arc Contracts](#categories-of-arc-contracts)
      - [Schemes](#schemes)
      - [Voting Machines](#voting-machines)
      - [Global Constraints](#global-constraints)
      - [Others](#others)
    - [Obtain the names and addresses of a DAO's schemes](#obtain-the-names-and-addresses-of-a-daos-schemes)
    - [Obtain an Arc.js wrapper by its name](#obtain-an-arcjs-wrapper-by-its-name)
      - [The deployed contract](#the-deployed-contract)
      - [At a specific address](#at-a-specific-address)
      - [Via the DAO](#via-the-dao)
    - [Obtain a wrapper using the wrapper's factory class](#obtain-a-wrapper-using-the-wrappers-factory-class)
      - [deployed](#deployed)
      - [new](#new)
      - [at](#at)
    - [Obtain any Arc contract using Utils.requireContract](#obtain-any-arc-contract-using-utilsrequirecontract)
    - [Obtain a DAO scheme's parameters](#obtain-a-dao-schemes-parameters)
  - [Working with Arc.js Scripts](#working-with-arcjs-scripts)
  - [Deploying to Other Testnets](#deploying-to-other-testnets)
  - [Running Against a Ganache Database](#running-against-a-ganache-database)
  - [Contribute to Arc.js](#contribute-to-arcjs)
  - [Security](#security)
  - [License](#license)


## Getting Started

### Installation

Ensure that [NodeJS](http://nodejs.org/), v9.4.0 or greater, is installed.

Install the npm package into your project:

```script
npm install @daostack/arc.js --save
```

Now you can proceed with migrating contracts to a running testnet and configuring Arc.js in your application and environment.

### Setting up a Testnet with Arc Contracts

Arc.js runs against an Ethereum network where it assumes that the Arc contracts have been migrated.  Out of the box, Arc.js can find contracts migrated to the mainnet. But for testing, you will need to tell it to migrate the Arc contracts to a testnet of your choice.  You can do this by running a few Arc.js scripts.

**First a note**:  The following script examples assume you are running the scripts in the root folder of your application.  If you happen to be running the scripts in the context of a cloned Arc.js repository, omit the prefix `npm explore @daostack/arc.js -- `.

To deploy contracts to a Ganache testnet, run the following scripts:

Either synchronously in a separate shell window:
```script
npm explore @daostack/arc.js -- npm start test.ganache.run
```

Or asynchronously in the background of your current shell window:
```script
npm explore @daostack/arc.js -- npm start test.ganache.runAsync
```

If you are running the migration for the first time:

```script
npm explore @daostack/arc.js -- npm start migrateContracts.fetchFromArc
```

Now migrate the Arc contracts to Ganache:

```script
npm explore @daostack/arc.js -- npm start migrateContracts
```

Now when your app uses Arc.js, it will be running against Ganache and the contracts you just migrated.

For more on Arc.js scripts, see [Working with Arc.js Scripts](#working-with-arcjs-scripts).

See [Deploying to Other Testnets](#deploying-to-other-testnets) if you want to run against a testnet other-than Ganache.

### Using the Arc.js Library in your Code

#### Importing Arc.js

Import everything from ArcJs as follows:

```javascript
import * as ArcJs from '@daostack/arc.js';
```

#### Configuring Arc.js
The default configuration settings for Arc.js can be found in its `config/default.json` file. A few examples:

```json
{
  "providerUrl": "http://127.0.0.0:8545",
  "network": "ganache",
  "gasLimit": 6015000
}
```

To obtain a configuration setting:

```javascript
import { Config } from '@daostack/arc.js';
Config.get('network');
```

To override a configuration setting at runtime:
```javascript
import { Config } from '@daostack/arc.js';
Config.set('network', 'kovan');
```

You can also override the default configuration settings by setting values on properties of `node.env` (see [here](http://nodejs.org/dist/latest-v9.x/docs/api/process.html#process-process-env)) with the same name as the corresponding arc.js configuration setting.  This enables you to use environment variables to control the arc.js configuration.

#### Working with DAOs and Arc Contracts
Now that you've got Arc.js plugged into your application and configured, and contracts migrated to a running testnet, you are ready to start coding against DAOs and Arc contracts.  The following sections describe how.

One thing to remember:  All token and reputation amounts should be expressed in Wei.

## Working with DAOs

Arc.js provides a class named "DAO" that enables you to create new DAOs and obtain information about them.

### Create a new DAO with all defaults

The simplest example of how to create a new DAO uses all defaults:  no schemes nor founders, using the Universal Controller and default DaoCreator scheme.  See `NewDaoConfig`.

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT"
});
```

Add and remove schemes later using `SchemeRegistrar`.

### Create a new DAO with founders

Create a new DAO with founders by including a "founders" array.  This will automatically mint tokens and reputation to each founder.   See `NewDaoConfig`.

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

Create a new DAO with schemes by including a "schemes" array.  This will register the schemes with all default permissions and voting machines. See `SchemesConfig` and `SchemeConfig`.

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

By default, `DAO.new` assigns the AbsoluteVote voting machine to each scheme, with default parameter values for AbsoluteVote.  You may override the voting machine's default parameters by adding a "votingMachineParams" element, either at the root level or on individual schemes. You can also specify that you want to assign a completely different type of voting machine, such as GenesisProtocol.  See `NewDaoVotingMachineConfig` and `SchemesConfig`.

#### Root-level, applying to all schemes

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

#### With alternate AbsoluteVote voting machine address

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  votingMachineParams: {
    votePerc: 45,
    ownerVote:false
    votingMachineAddress: anAddress
  }
});
```

#### With GenesisProtocol

This will tell `DAO.new` to assign the Arc.js-deployed GenesisProtocol voting machine to every scheme, using default GenesisProtocol parameters.

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  votingMachineParams: {
    votingMachineName: "GenesisProtocol"
  }
});
```
**Important note**:  If you want to use GenesisProtocol on _any_ scheme, you must also add GenesisProtocol as scheme on the DAO itself (see [Create a new DAO with schemes](#create-a-new-dao-with-schemes)).

#### Scheme-specific

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

Create a DAO using the DAOstack `Controller` contract by passing `false` for `universalController`.

For more information about choosing between Universal an Single Controller, see [this article](https://daostack.github.io/arc/generated-docs/controller/UController/#universal-vs-single-controller).

```javascript
const newDao = await DAO.new({
  name: "My New DAO",
  tokenName: "My new Token",
  tokenSymbol: "MNT",
  universalController: false
});
```

### Create a new DAO with a non-default DaoCreator scheme

Create a DAO using an alternative `DaoCreator` scheme by passing its address for `daoCreatorScheme`.  The alternative scheme must implement the same interface as the Arc `DaoCreator` contract.

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
* GenesisProtocol

#### Voting Machines
* AbsoluteVote
* GenesisProtocol

#### Global Constraints

* TokenCapGC

#### Others
* DaoCreator

You can pull those categorizations into your code as follows:

```javascript
import * as ArcJs from '@daostack/arc.js';
const arcJsWrapperCategories = await ArcJs.Contracts.getDeployedContracts();
```

You may find that `getDeployedContracts()` is somewhat time-consuming to run the first time because it fetches all of the wrappers from the chain, but it does cache its results and run much faster thereafter.

`getDeployedContracts()` returns a object that contains a wrapper factory and address of each deployed contract that has a wrapper, keyed by the contract `name`.  See `ArcDeployedContracts`.  

The following sections show how you can obtain contract wrappers using factories, names and addresses.


### Obtain the names and addresses of a DAO's schemes

You may obtain the names and addresses of all of the schemes that are registered with a DAO using `DAO.getSchemes`:

```javascript
const daoSchemeInfos = await myDao.getSchemes();
```

Or info about a single scheme:

```javascript
const daoSchemeInfos =  = await myDao.getSchemes("UpgradeScheme");
const upgradeSchemeInfo = daoSchemeInfos[0];
```

`DAO.getSchemes` returns a object that contains `name` and `address` properties.  See `DaoSchemeInfo`.

The following sections show how you can get contract wrappers using names and addresses.

### Obtain an Arc.js wrapper by its Arc contract name

Recall from [Categories of Arc Contracts](#categories-of-arc-contracts) that `getDeployedContracts()` returns categorized factories, names and addresses of Arc contracts that have wrappers. That information can be used to obtain the wrappers themselves.

#### The deployed contract

```javascript
import * as ArcJs from '@daostack/arc.js';
const upgradeScheme = await ArcJs.Contracts.getScheme("UpgradeScheme");
```

#### At a specific address
```javascript
import * as ArcJs from '@daostack/arc.js';
const upgradeScheme = await ArcJs.Contracts.getScheme("UpgradeScheme", anAddress);
```

#### Via the DAO

The identical method is available on the DAO class:

```javascript
const upgradeScheme = await DAO.getScheme("UpgradeScheme");
```

### Obtain a wrapper using the wrapper's factory class 

Each wrapper has a factory that provides static `.new()`, `.deployed()` and `.at()` methods.  These methods are implemented by `ContractWrapperFactory`.

Examples of their use:

#### deployed

Obtain the instance of the contract as deployed by Arc.js:

```javascript
import { UpgradeScheme } from "@daostack/arc.js";
const deployedContract = await UpgradeScheme.deployed();
```

#### new

Call `new()` to migrate a new instance of the contract:

```javascript
import { UpgradeScheme } from "@daostack/arc.js";
const newInstance = await UpgradeScheme.new();
```

#### at

Obtain the wrapper from a given address:

```javascript
import { UpgradeScheme } from "@daostack/arc.js";
const newInstance = await UpgradeScheme.at(anAddress);
```

### Obtain any Arc contract using Utils.requireContract

Not all Arc contracts have been given wrapper classes, for example, `Avatar`, `UController` and many more.  But you can obtain a raw TruffleContract for any contract, enabling you to work with the contract:

```javascript
import { Utils } from "@daostack/arc.js";
const truffleContract = await Utils.requireContract("Avatar");
```

### Obtain a DAO scheme's parameters

Although you can always register your own schemes with a DAO, whether they be totally custom non-Arc schemes, or redeployed Arc schemes, by default a DAO is created with Arc schemes that are universal in the sense that the code is implemented in one place, without redundancy.  But every scheme registered with a DAO is configured with its own DAO-scoped parameter values, and references DAO-scoped data, such as proposals. All are stored in the DAO's controller where each universal scheme is able to find them.  (If the controller is the Universal Controller then the parameters and data are keyed by the DAO's avatar address.)

If you want to obtain a DAO scheme's parameters, you can do it like this, using a method on the DAO class:

```
const schemeParameters = DAO.getSchemeParameters(schemeWrapper);
```

This will return an array of the scheme's parameter values where the order of values in the array corresponds to the order in which they are defined in the structure in which they are stored in the scheme contract.

## Working with Arc.js Scripts
Arc.js contains a set of scripts for building, publishing, running tests and migrating contracts to any network.  These scripts are meant to be accessible and readily usable by client applications.

Typically an application will run an Arc.js script by prefixing "`npm explore @daostack/arc.js -- `" to the Arc.js script.  For example, to run the Arc.js script `npm start test.ganache.run` from your application, you would run:
```
npm explore @daostack/arc.js -- npm start test.ganache.run
```

Otherwise, when running the scripts at the root of Arc.js, you must omit the `npm explore @daostack/arc.js -- `.

All of the scripts are defined in the package-scripts.js file.  You have already seen their [most typical use in an application context](#setting-up-a-testnet-with-arc-contracts).

See also  [Running Against a Ganache Database](#running-against-a-ganache-database), [Deploying to Other Testnets](#deploying-to-other-testnets) and [Run Lint and Tests](#run-lint-and-tests)

## Deploying to Other Testnets
The "network" environment variable defines which network arc.js understands you to be deploying to when you run the "migrateContracts" script.  For safety it assumes a different HTTP port for each network. Can be "live" (the mainnet), "kovan" or "ganache".  The default is "ganache".

## Running Against a Ganache Database

It can be very handy to run Arc.js tests or your application against a Ganache database that persists the state of the chain across instances of Ganache.  Please refer [here for how to do it](./docs/GanacheDb.md).

## Run Lint and Tests

To run lint and the Arc.js tests, run the following script in the Arc.js root folder, assuming you have already
[installed all the npm packages](#installation), are [running a testnet with migrated Arc contracts](#setting-up-a-testnet-with-arc-contracts):

```
npm test
```

### Stop on the first failure

```
npm start test.bail
```

### Run an individual test module

Sometimes you want to run just a single test module:

```
npm start "test.automated test/[filename]"
```

To bail:

```
npm start "test.automated test/[filename] --bail"
```

## Contribute to Arc.js

PRs are welcome but please first consult with the [Contribution guide](https://github.com/daostack/arc/blob/master/CONTRIBUTING.md).

Join us on [Slack](https://daostack.slack.com/)!

Join us on [Telegram](https://t.me/daostackcommunity)!

## Security
DAOstack Arc.js is still on its alpha version.  It is meant to provide secure, tested and community-audited code, but please use common sense when doing anything that deals with real money! We take no responsibility for your implementation decisions and any security problem you might experience.

## License
This is an open source project ([GPL license](https://github.com/daostack/arc.js/blob/master/LICENSE)).
