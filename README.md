master: [![Build Status](https://travis-ci.org/daostack/arc-js/images/dao-icon.png?branch=master)](https://travis-ci.org/daostack/arc-js)

# Mission Statement

DaoStack-Arc-Js is a javascript library providing access to DAOStack Arc ethereum smart contracts (Daostack-Arc).

Daostack-Arc is a widely open collaboration to build the basic framework for [Decentralized Autonomous Organizations](https://en.wikipedia.org/wiki/Decentralized_autonomous_organization) (DAO) through bootstrap, or dogfooding.  Find the DaoStack-Arc repository [here](https://github.com/daostack/daostack).


# Contributing

Contributions and pull requests are very welcome. Join us on [Slack](daostack.slack.com).

If you want to contribute to the code, check out  [CONTRIBUTING.md](CONTRIBUTING.md).


# Arc Configuration
The default configuration settings for Arc can be found in config/default.json, they are:

```javascript
{
  "providerUrl": "http://localhost:8545",
  "network": "kovan", // Options are 'homestead', 'ropsten', 'rinkeby', 'kovan'
  "gasLimit": [a number like 6015000]
}
```

To get a configuration setting use:
```javascript
import { config } from 'daostack-arc-js';
config.get('network');
```

You can override configuration settings at runtime with:
```javascript
import { config } from 'daostack-arc-js';
config.set('network', 'ropsten');
```

You can also override the default configuration settings with environment variables:
```javascript
gasLimit=7000000 node yourprojectindex.js
```

