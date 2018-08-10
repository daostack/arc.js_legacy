# Configuring Arc.js
The default configuration settings for Arc.js can be found in its `config/default.json` file.  Here is a description of the settings:

**autoApproveTokenTransfers**
Automatically approve token transfers for operations that require the sender pay tokens to the scheme.  Examples: [VestingScheme.create](api/classes/VestingSchemeWrapper#create), [GenesisProtocol.stake](api/classes/GenesisProtocolWrapper#stake), and [ContributionReward.proposeContributionReward](api/classes/ContributionRewardWrapper#proposeContributionReward).  Default is true.

**defaultVotingMachine**
The voting machine used by default by `Dao.new` when creating new DAOs.  Default is "AbsoluteVote".

**estimateGas**
If `true` Arc.js will, for every call that generates a transaction, call `estimateGas` to propose a minimum value.  See [Estimate Gas](Transactions#estimateGas).

**foundersConfigurationLocation**
The location of a custom founders json configuration file, including the name of the file.  The default points to `founders.json` located in arc.js/migrations which defines default founders for ganache. If the value is given as a relative path, then it must be relative to arc.js/dist/migrations.  Refer here for [more about how to define founders](Migration).

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

**network**
Name of the blockchain network used during Arc contract migration.  Other information like url and port come from Arc.js's truffle.js file.  Default is "ganache".

**providerPort**
The port to use when connecting to the blockchain network at runtime.  Default is 8545.

**providerUrl**
The url to use when connecting to the blockchain network at runtime.  Default is http://127.0.0.1.

**truffleTimeout**
The number in seconds that truffle waits to return a mined transaction, where 0 means no timeout.  Undefined (absent) to use truffle's default value.

### Obtain a configuration setting at runtime

```javascript
import { ConfigService } from '@daostack/arc.js';
ConfigService.get('network');
```

### Override a configuration setting at runtime

```javascript
import { ConfigService } from '@daostack/arc.js';
ConfigService.set('network', 'kovan');
```

### Environment variables

You can override the default configuration settings by setting values on properties of `node.env` (see [here](https://nodejs.org/dist/latest-v9.x/docs/api/process.html#process-process-env)) with the same name as the corresponding arc.js configuration setting, **but with "arcjs_" prepended to the name**.  This enables you to use environment variables to control the arc.js configuration.


