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

1. optionally running a blockchain node.  We will use the Ganache testnet as an example.
2. optionally migrating the Arc contracts to the testnet, necessary for Ganache but not for Kovan or MainNet.
3. using the Arc.js code in your application

We'll continue by assuming you want to run your application against Ganache.

<a name="migratetoganache"></a>
## Set up Ganache with Arc Contracts

Arc.js runs against an Ethereum network where it assumes that the Arc contracts have been migrated.  Out of the box, Arc.js gives you the Arc contracts already-migrated to the MainNet and to Kovan, so your web application may use MetaMask to connect to these networks and Arc.js will automatically find the migrated contracts. For any other testnet, particularly Ganache, or to re-migrate for any reason, you will need to fire up your testnet and tell Arc.js to migrate the Arc contracts to it.  Arc.js provides a migration script that you can run from the context of your own application.

!!! note "Please Review First"
    Please review [Running Arc.js Scripts](Scripts) before proceeding.

To deploy contracts to a Ganache testnet, in a separate shell window start up Ganache:

```script
npm explore @daostack/arc.js -- npm start Ganache
```

And migrate the Arc contracts to Ganache:

```script
npm explore @daostack/arc.js -- npm start migrateContracts
```

Now when your app uses Arc.js, it will by default be running against Ganache and the Arc contracts you just migrated.  Since Ganache is running, you don't need MetaMask, though you could point MetaMask to this Ganache instance if you wanted.

!!! info "Related Information"
    Find related information at [Migrations](Migration), [Network Configuration](Configuration#networksettings) and [Running against a Ganache Db](GanacheDb).

!!! tip "Wrong Nonce?"
    Arc.js always starts Ganache with the same network id and set of accounts, and with a fake GEN token.  If you ever find MetaMask complaining about the nonce when generating a transaction, take the following steps:

    1. In the MetaMask home window, click the properties icon in the upper right.
    2. Select "Settings" in the dropdown menu
    3. Scroll to the bottom and select "Reset Account"

## Use the Arc.js Library in your Code

### Language
Arc.js itself is written using Typescript. The Arc.js library includes Typescript type definitions defined in index.d.ts.  The javascript included in the Arc.js library is ES6 in a commonjs module format.  Your application may thus be written in any language that knows how to work with JavaScript coming from an NPM module in ES6 commonjs module format.

### Import Arc.js

In your code, import everything from Arc.js as follows:

```javascript
import * as ArcJs from '@daostack/arc.js';
```

Or import specific bits like this:

```javascript
import { WrapperService } from '@daostack/arc.js';
```

### Configure Arc.js

You may optionally reconfigure certain default aspects of Arc.js functionality. For more information, refer to [Configuring Arc.js](Configuration).

### Initialize Arc.js

To take advantage of the full functionality of Arc.js, your application must invoke [InitializeArcJs](/api/README/#initializearcjs) once at runtime.

```javascript
import { InitializeArcJs } from "@daostack/arc.js";

await InitializeArcJs();
```

!!! note "Options"
    `InitializeArcJs` takes [optional arguments](/api/interfaces/InitializeArcOptions/) allowing you to configure certain aspects of Arc.js, including [optimized contract loading](Configuration#optimizedcontractloading), [network settings](Configuration#networksettings) and [Account Changes](Configuration#accountchanges).

### Work with Arc Contracts
Now that you've got Arc.js plugged into your application and contracts migrated to a running testnet, you are ready to start coding against DAOs and Arc contracts.

You may start by creating or referencing one or more DAOs.  Arc.js provides a class called [DAO](api/classes/DAO) that facilitates creating and working with DAOs.  For more information, refer to [Working With DAOs](Daos).

Once you have a DAO or set of DAOs, you can work with proposals, schemes and other entities such as events, global constraints and voting machines using the  contract "wrapper" classes provided by Arc.js.  For more information, refer to [Arc Contract Wrappers](Wrappers).

### Work with Events

A significant aspect of working with Arc contracts, and the Ethereum blockchain in general, involves working with the events that they emit.  Arc.js provides plenty of support for working with events. For more information, refer to [Working with Events](Events).

## Logging

Arc.js can emit console messages that can be helpful in understanding what is going on under the hood.  There are various or-able "LogLevels".  The default is to emit "info" and "error" information.  For more information, see the [LoggingService](/api/classes/LoggingService).

!!! tip "Custom Loggers"
    You can plugin custom loggers to send output elsewhere besides the javascript console.

## Service Classes

Arc.js provides a variety of helpful "service" classes, including:


Service | Description
---------|----------
 [AccountService](api/classes/AccountService) | for working with accounts, such as being notified when the default account changes (see [Account Changes](Configuration/#accountchanges))
[AvatarService](api/classes/AvatarService) | handy functions for getting information about an avatar (DAO)
[ConfigService](api/classes/ConfigService) | for working with Arc.js configuration settings. [Read more here](Configuration)
[ControllerService](api/classes/ControllerService) | handy functions for getting information about an avatar's controller.
[LoggingService](api/classes/LoggingService) | for logging.  See also the [`logLevel` configuration setting](Configuration#logging)
[ProposalService](api/classes/ProposalService) | helper functions relating to proposals. [Read more here](Proposals/#proposals)
[PubSubEventService](api/classes/PubSubEventService) | helper functions relating to PubSub Events. [Read more here](Events/#pubsub-events)
[TransactionService](api/classes/TransactionService) | helper functions relating to transactions. [Read more here](Transactions)
[Utils](api/classes/Utils) | miscellaneous helper function for working with Arc.js, Truffle contracts and Web3.
[Web3EventService](api/classes/Web3EventService) | helper functions relating to Web3 events. [Read more here](Events/#web3-events)
