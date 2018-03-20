# Configuring Arc.js
The default configuration settings for Arc.js can be found in its `config/default.json` file.  Here is a description of the settings:

**defaultVotingMachine**
  The voting machine used by default by `Dao.new` when creating new DAOs.  Default is "AbsoluteVote".

**gasLimit_deployment**
Gas sent to transactions when migrating contracts and when creating DAOs that don't use a Unversal Controller.  A number like 4543760. The default number changes with most new releases of Arc.js  You can find the current value for your Arc.js installation by looking in the `config/default.json` file.

**gasLimit_runtime**
Gas sent to transactions in all cases except  those covere by gasLimit_deployment.  A number like 4543760. The default number changes with most new releases of Arc.js  You can find the current value for your Arc.js installation by looking in the `config/default.json` file.

**network**
Name of the blockchain network used during Arc contract migration.  Other information like url and port come from Arc.js's truffle.js file.  Default is "ganache".

**providerUrl**
The url to use when connecting to the blockchain network at runtime.  Default is http://127.0.0.1.

**providerPort**
The port to use when connecting to the blockchain network at runtime.  Default is 8545.

**logLevel**
The level of logging.  Default is 8 (error).  The available log levels, which may be combined, are:

```
  none = 0
  info = 1
  warn = 2
  debug = 4
  error = 8
  all = 15
  ```

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


