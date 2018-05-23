[![Build Status](https://api.travis-ci.org/daostack/arc.js.svg?branch=master)](https://travis-ci.org/daostack/arc.js)
[![NPM Package](https://img.shields.io/npm/v/@daostack/arc.js.svg?style=flat-square)](https://www.npmjs.org/package/@daostack/arc.js)

# DAOstack Arc.js

[DAOstack Arc.js](https://github.com/daostack/arc.js) sits just above [DAOstack Arc](https://github.com/daostack/arc) on the DAOstack stack.  It is a library that facilitates javascript application access to the DAOstack Arc ethereum smart contracts.

For more information about Arc contracts and the entire DAOstack ecosystem, please refer to the [Arc documentation](https://daostack.github.io/arc/README/).

## Installation

Ensure that [NodeJS](https://nodejs.org/), v9.4.0 or greater, is installed.

Install the npm package into your project:

```script
npm install @daostack/arc.js --save
```

Now you can proceed with migrating contracts to a running testnet and configuring Arc.js in your application and environment.

## API Reference
You can find a [detailed reference for the entire Arc.js API here](/api/README.md).  Read on here for step-by-step examples on how to get started with Arc.js.

## Getting Started

The following sections describe the basic steps for setting up Arc.js in your application. These steps basically involve:

1. running a blockchain node.  We will use the ganache testnet as an example.
2. deploying the Arc contracts to the net
3. using the Arc.js code in your application

!!! note
    All of the script examples assume you are running the scripts in the root folder of your application.  If you happen to be running the scripts in the context of a cloned Arc.js repository, omit the prefix `npm explore @daostack/arc.js -- `. See [Working with Arc Contracts](#work-with-arc-contracts).

## Set up a Testnet with Arc Contracts

Arc.js runs against an Ethereum network where it assumes that the Arc contracts have been migrated.  Out of the box, Arc.js can find contracts migrated to the mainnet and to kovan. But for any other testnet, or to redeploy, you will need to tell it to migrate the Arc contracts to a testnet of your choice.  You can do this by running a few Arc.js scripts from the context of your application.

To deploy contracts to a Ganache testnet, run the following scripts:

In a separate shell window:
```script
npm explore @daostack/arc.js -- npm start ganache
```

Now migrate the Arc contracts to Ganache:

```script
npm explore @daostack/arc.js -- npm start migrateContracts
```

Now when your app uses Arc.js, it will be running against Ganache and the contracts you just migrated.

!!! note
    See [Work with Arc Contracts](#work-with-arc-contracts) and [Deploy to Other Testnets](#deploy-to-other-testnets).

## Use the Arc.js Library in your Code

### Typescript
Arc.js itself is written using Typescript. The Arc.js library includes Typescript type definitions defined in an index.d.ts.

### JavaScript
The javascript included in the Arc.js library is ES6 in a commonjs module format.

### Import Arc.js

Import everything from ArcJs as follows:

```javascript
import * as ArcJs from '@daostack/arc.js';
```
### Configure Arc.js

Refer here for [complete documentation on Arc.js configuration settings](Configuration.md).

### Initialize Arc.js at Runtime

Your application must invoke `InitializeArcJs` once at runtime before doing anything else.

```javascript
import { InitializeArcJs } from "@daostack/arc.js";

await InitializeArcJs();
```

#### Minimize contract loading

`InitializeArcJs` will load all of the wrapped Arc contracts as deployed by the running version of Arc.js.  As this operation can be time-consuming, you may want to tell `InitializeArcJs` to only load the contracts that you expect to use.  The following is enough to create a new DAO with no schemes:

```javascript
await InitializeArcJs({
    filter: {
      "AbsoluteVote": true,
      "DaoCreator": true,
    }
  });
```
   
If you want to add schemes to your DAO, you would include each scheme in the filter:

```javascript
await InitializeArcJs({
    filter: {
      "AbsoluteVote": true,
      "DaoCreator": true,
      "SchemeRegistrar": true,
    }
  });
```

If are not creating DAOs and only want to use some schemes, then reference the schemes as well as whichever voting machine(s) the schemes are using:

```javascript
await InitializeArcJs({
    filter: {
      "GenesisProtocol": true,
      "ContributionReward": true,
    }
  });
```

#### Use default network settings

You can use the Arc.js [ConfigService](Configuration) to set the provider host and port that web3 uses to connect your applicaton to the net when not using MetaMask.  But you can also tell `InitializeArcJs` to use default Arc.js settings for mainnet (live), kovan, ropsten and ganache.  Here is an example of telling Arc.js to use its default settings for Kovan:

```javascript
await InitializeArcJs({
  "useNetworkDefaultsFor": "kovan"
  });
```

!!! info
    For safety, Arc.js specifies a different default HTTP port for each network.  You will need to make sure that the testnet you are using is listening on that port.  The port values are:

    <table style="margin-left:2.5rem">
    <tr style="text-align:left"><th>Network</th><th>Port</th></tr>
    <tr><td>Ganache</td><td>8545</td></tr>
    <tr><td>Kovan</td><td>8547</td></tr>
    <tr><td>Ropsten</td><td>8548</td></tr>
    <tr><td>Live (Mainnet)</td><td>8546</td></tr>
    </table>

### Working with Arc Contracts
Now that you've got Arc.js plugged into your application, configured, and contracts migrated to a running testnet, you are ready to start coding against DAOs and other Arc entities.

You will likely start by creating or referencing one or more DAOs.  Arc.js provides a class called [DAO](api/classes/DAO) that facilitates creating and working with DAOs.  Refer here for [all about the DAO class](Daos).

Once you have a DAO or set of DAOs, you can start working with them, most often using schemes to work with proposals. Arc.js facilitates working with proposals, schemes and other entities such as events, global constraints and voting machines by providing contract "wrapper" classes.  Refer here for [all about Arc.js contract wrapper classes](Wrappers).

### Working with Events

Arc.js supports events of various types that you can handle, including events from Arc contracts and events that enable you to track transaction as they occur.  Refer here for [all about events in Arc.js](Events).

### Other Service Classes

Arc.js provides a few "service" classes that can be helpful, including:

- [ConfigService](api/classes/ConfigService) - for working with Arc.js configuration settings. [Read more here](Configuration.md).
- [LoggingService](api/classes/LoggingService) - for logging.  See also the [`logLevel` configuration setting](Configuration.md).
- [Utils](api/classes/Utils) - miscellaneous API for working with web3, truffle contracts and transactions.
