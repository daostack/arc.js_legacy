master: [![Build Status](https://travis-ci.org/daostack/arc-js/images/dao-icon.png?branch=master)](https://travis-ci.org/daostack/arc-js)

# Mission Statement

DaoStack-Arc-Js is a javascript library providing access to DAOStack Arc ethereum smart contracts (Daostack-Arc).

Daostack-Arc is a widely open collaboration to build the basic framework for [Decentralized Autonomous Organizations](https://en.wikipedia.org/wiki/Decentralized_autonomous_organization) (DAO) through bootstrap, or dogfooding.  Find the DaoStack-Arc repository [here](https://github.com/daostack/daostack).


# Contributing

Contributions and pull requests are very welcome. Join us on [Slack](daostack.slack.com).

If you want to contribute to the code, check out  [CONTRIBUTING.md](CONTRIBUTING.md).


# DAO Stack Configuration
If you want to override the default configuration you can add a daostack.json file to your project. Here are the possible configuration values with their default values

  {
    "providerUrl": "http://localhost:8545",
    "network": "kovan", // Options are 'homestead', 'ropsten', 'rinkeby', 'kovan'
    "apiToken": "" // Required for Infura or Etherscan
    "gasLimit": 6900000
  }
