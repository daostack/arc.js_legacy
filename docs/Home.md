[![Build Status](https://api.travis-ci.org/daostack/arc.js.svg?branch=master)](http://travis-ci.org/daostack/arc.js)
[![NPM Package](http://img.shields.io/npm/v/@daostack/arc.js.svg?style=flat-square)](http://www.npmjs.org/package/@daostack/arc.js)

# DAOstack Arc.js

[DAOstack Arc.js](http://github.com/daostack/arc.js) sits just above [DAOstack Arc](http://github.com/daostack/arc) on the DAO stack.  It is a library that facilitates javascript application access to the DAOstack Arc ethereum smart contracts.

For more information about Arc contracts and the entire DAOstack ecosystem, please refer to the [Arc documentation](https://daostack.github.io/arc/README/).

## Getting Started

### Installation

Ensure that [NodeJS](http://nodejs.org/), v9.4.0 or greater, is installed.

Install the npm package into your project:

```script
npm install @daostack/arc.js --save
```

Now you can proceed with migrating contracts to a running testnet and configuring Arc.js in your application and environment.

### API Reference
You can find a [detailed reference for the entire Arc.js API here](/api/README.md).  Read on here for step-by-step examples on how to get started with Arc.js.

### Set up Arc.js

The following sections describe the basic steps for setting up Arc.js in your application. These steps basically involve:

1. running a blockchain node.  We will use the ganache testnet as an example.
2. deploying the Arc contracts to the net
3. using the Arc.js code in your application

**Note:** All of the script examples assume you are running the scripts in the root folder of your application.  If you happen to be running the scripts in the context of a cloned Arc.js repository, omit the prefix `npm explore @daostack/arc.js -- `. See [more about working with Arc.js Scripts](#working-with-arcjs-scripts).

### Setting up a Testnet with Arc Contracts

Arc.js runs against an Ethereum network where it assumes that the Arc contracts have been migrated.  Out of the box, Arc.js can find contracts migrated to the mainnet. But for testing, you will need to tell it to migrate the Arc contracts to a testnet of your choice.  You can do this by running a few Arc.js scripts.

To deploy contracts to a Ganache testnet, run the following scripts:

In a separate shell window:
```script
npm explore @daostack/arc.js -- npm start test.ganache.run
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

#### TypeScript
Arc.js itself is written using TypeScript. The Arc.js library includes TypeScript type definitions defined in an index.d.ts.

#### Javascript
The javascript included in the Arc.js library is ES6 in a commonjs module format.

#### Importing Arc.js

Import everything from ArcJs as follows:

```javascript
import * as ArcJs from '@daostack/arc.js';
```

#### Configuring Arc.js

Please refer [here](./Configuration.md) for complete documentation on configuration settings.

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

For more information about choosing between Universal an Single Controller, see [this article](http://daostack.github.io/arc/contracts/controller/UController/).

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
const upgradeScheme = await ArcJs.Contracts.getContractWrapper("UpgradeScheme");
```

#### At a specific address
```javascript
import * as ArcJs from '@daostack/arc.js';
const upgradeScheme = await ArcJs.Contracts.getContractWrapper("UpgradeScheme", anAddress);
```

#### Via the DAO

The identical method is available on the DAO class:

```javascript
const upgradeScheme = await DAO.getContractWrapper("UpgradeScheme");
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

If you want to obtain a DAO scheme's parameters, you can do it like this:

```
const schemeParameters = schemeWrapper.getSchemeParameters(avatarAddress);
```

This will return an object containing the scheme's parameter values.  The object will be the same as that which one passes to `schemeWrapper.setParameters` when setting parameters on any contract.

For example, to obtain the voting machine address for a scheme that has one as a parameter:

```
const schemeParameters = schemeWrapper.getSchemeParameters(avatarAddress);
const votingMachineAddress = schemeParameters.votingMachineAddress;
```


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

Please refer [here](./Migration.md) for instructions on migrating contracts to other test networks.

## Running Against a Ganache Database

It can be very handy to run Arc.js tests or your application against a Ganache database that persists the state of the chain across instances of Ganache.  Please refer [here for how to do it](./GanacheDb.md).

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
