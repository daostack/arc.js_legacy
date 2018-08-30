# Configuring Arc.js Behavior and Special Features
You may configure Arc.js behavior and several special features using the [ConfigService](/api/classes/ConfigService).  Default configuration settings for Arc.js are contained in the `config/default.json` file.  The following section describes available features, settings and their default values.

## Available Configuration Settings

**autoApproveTokenTransfers**
Automatically approve token transfers for operations that require the sender pay tokens to the scheme.  Examples: [VestingScheme.create](api/classes/VestingSchemeWrapper#create), [GenesisProtocol.stake](api/classes/GenesisProtocolWrapper#stake), and [ContributionReward.proposeContributionReward](api/classes/ContributionRewardWrapper#proposeContributionReward).  Default is true.

**cacheContractWrappers**
`true` to cache contract wrappers obtained using the contract wrapper factory methods `.at` and `.new`.  The cache is local, it does not persist across application instances.  The default is `false`.

**defaultVotingMachine**
The voting machine used by default by `Dao.new` when creating new DAOs.  Default is "AbsoluteVote".

**estimateGas**
Set this to `true` to have Arc.js estimate the gas cost of each transaction.  See [Estimating Gas Limits](#gaslimits).

**foundersConfigurationLocation**
The location of a custom founders json configuration file, including the name of the file.  The default points to `founders.json` located in arc.js/migrations which defines default founders for ganache. If the value is given as a relative path, then it must be relative to arc.js/dist/migrations.  Refer here for [more about how to define founders](Migration#founders).

<a name="logging"></a>
**logLevel**
The level of logging.  Default is 9 (`LogLevel.error | LogLevel.info`).  The available log levels, which may be combined, are:

```
  none = 0
  info = 1
  warn = 2
  debug = 4
  error = 8
  all = 15
```

**gasPriceAdjustor**
Use this setting to supply Arc.js with the gas price for transactions. See [Setting the Gas Price](#gasprice).

**globalGenTokenAddresses**
Specifies the address of the GEN token on each network.  "globalGenTokenAddresses.ganache" for Ganache, "globalGenTokenAddresses.default" for all other networks.

**network**
Name of the blockchain network used during Arc contract migration.  Other information like url and port come from Arc.js's truffle.js file.  Default is "ganache".

**providerPort**
The port to use when connecting to the blockchain network at runtime.  Default is 8545.

**providerUrl**
The url to use when connecting to the blockchain network at runtime.  Default is http://127.0.0.1.

<a name="txDepthRequiredForConfirmation"></a>
**txDepthRequiredForConfirmation**
The default required depth, in terms of the number of blocks that have been added to the chain since a transaction has been mined, used by certain functions in `TransactionService`.  For more information, see [Transaction Depth](Transactions#transactiondepth).

## Obtain a Configuration Setting at Runtime

```javascript
import { ConfigService } from '@daostack/arc.js';
ConfigService.get('network');
```

## Override a Configuration Setting at Runtime

```javascript
import { ConfigService } from '@daostack/arc.js';
ConfigService.set('network', 'kovan');
```

## Override a Configuration using Environment Variables

You can override the default configuration settings by setting values on properties of `node.env` (see [here](https://nodejs.org/dist/latest-v9.x/docs/api/process.html#process-process-env)) with the same name as the corresponding arc.js configuration setting, **but with "arcjs_" prepended to the name**.  This enables you to use environment variables to control the arc.js configuration.

<a name="networksettings"></a>
## Network Configuration

In the context of a web application, if you are using MetaMask Arc.js will automatically detect which network it is running against because MetaMask will inject an appropriate instance of `Web3`.  In the case where your application is not using MetaMask, then Arc.js will instantiate `Web3` itself.  In this case Arc.js will need a url, including port number, to configure the provider for `Web3`.  It will construct this url from the `providerUrl` and `providerPort` configuration values described above.

You can override the default url and port values in two ways:

1) tell `InitializeArcJs` to use the default values for a given network.  Here is an example of telling Arc.js to use the  default settings for Kovan:

```javascript
import { InitializeArcJs } from "@daostack/arc.js";

await InitializeArcJs({
  "useNetworkDefaultsFor": "Kovan"
  });
```

2) configure the url and port values directly before you call `InitializeArcJs`:

```javascript
import { InitializeArcJs, ConfigService } from "@daostack/arc.js";

ConfigService.set("providerUrl", "http://my.custom.node");
ConfigService.set("providerPort", 8550);

await InitializeArcJs();
```

!!! info
    For safety, by default Arc.js specifies a different HTTP port for each network.  If you want to use the default network settings you need to make sure that the testnet your application is using is listening on the correct port.  The default port values are:

    <table style="margin-left:2.5rem">
    <tr style="text-align:left"><th>Network</th><th>Port</th></tr>
    <tr><td>Ganache</td><td>8545</td></tr>
    <tr><td>Kovan</td><td>8547</td></tr>
    <tr><td>Ropsten</td><td>8548</td></tr>
    <tr><td>Live (MainNet)</td><td>8546</td></tr>
    </table>

## Special Features

You can enable several special features using the configuration settings, as described in the following sections.

<a name="optimizedcontractloading"></a>
### Optimized Contract Loading

By default, [InitializeArcJs](/api/README/#initializearcjs) will load all of the wrapped Arc contracts as deployed by the running version of Arc.js.  This default behavior is perfectly fine for your application.  But as a performance consideration you may consider this to be too time-consuming, so you may want to tell `InitializeArcJs` to only load the contracts that you expect to use.  The following is enough to create a new DAO with no schemes:

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

If you are not creating DAOs and only want to use some schemes, then reference the schemes as well as whichever voting machine(s) the schemes are using:

```javascript
await InitializeArcJs({
    filter: {
      "GenesisProtocol": true,
      "ContributionReward": true,
    }
  });
```

<a name="accountchanges"></a>
### Account Changes
You can be notified whenever the current account changes by subscribing to a special PubSub event published by the [AccountService](/api/classes/AccountService).  To take advantage of this feature, first tell `InitializeArcJs` you want the feature turned on:

```javascript
import { InitializeArcJs } from "@daostack/arc.js";

await InitializeArcJs({
  watchForAccountChanges: true
});
```

Then subscribe to the Pub/Sub event, providing a callback:

```typescript
import { AccountService } from "@daostack/arc.js";

AccountService.subscribeToAccountChanges((account: Address) => { ... });
```

For more information, see [AccountService](/api/classes/AccountService).

<a name="gaslimits"></a>
### Estimating Gas Limits
Arc.js can automatically estimate the gas cost of any transaction executed using the contract wrappers.  The estimate is supplied to Web3 and will appear in a client like MetaMask, giving the user a more accurate sense of how much the transaction is going to cost when they are deciding whether to approve the transaction, and putting fewer of the user's funds at risk in case of an error.

The estimate depends on the network node.  The minimum value is always 21000, the maximum value is the current block gas limit minus 100000.  For Ganache, the feature always sets the gas limit to the maximum value.

This feature is disabled by default.  You can enable it at any time with the following line:

```javascript
ConfigService.set("estimateGas", true);
```

And you may similarly disable it at any time.

<a name="gasprice"></a>
### Setting the Gas Price

Arc.js enables you to set the gas price on transactions. At any time, set the value of this gasPriceAdjustor to a function with the signature [GasPriceAdjustor](/api/README/#gaspriceadjustor).  This function takes as an argument a value for price that is computed as the median gas price across the `x` latest blocks, where `x` is determined by the node you are using.

This feature is disabled by default.
