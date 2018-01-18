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

If you want to override these default configuration settings you can add an arc-js.config.json file to your project. Any values set there will override the above defaults. You can pass in a path to a different file using a `--arcConfigFile pathToFile` command line argument, or setting environment variable `arcConfigFile=pathToFile`.

You can also override these settings on the command line or through environment variables, with command line arguments taking precedence over environment variables which take precedence over the arc-js.config.json config file.

The configuration object uses the [nconf](https://github.com/indexzero/nconf) library so you can override configuration settings at runtime with:
```javascript
import { config } from 'daostack-arc-js';
config.set('network', 'ropsten');
```

### Command line:

```javascript
node yourprojectindex.js --gasLimit 7000000
```

### Environment variable:

```javascript
gasLimit=7000000 node yourprojectindex.js
```

