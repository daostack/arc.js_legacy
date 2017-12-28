'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDeployedContracts = exports.daostackSettings = undefined;

var _utils = require('./utils.js');

var _globalconstraintregistrar = require('./globalconstraintregistrar.js');

var _schemeregistrar = require('./schemeregistrar.js');

var _contributionreward = require('./contributionreward.js');

var _absoluteVote = require('./absoluteVote.js');

var _tokenCapGC = require('./tokenCapGC.js');

var _upgradescheme = require('./upgradescheme.js');

var dopts = require('default-options');


var GenesisScheme = (0, _utils.requireContract)("GenesisScheme");

/**
   * These are uninitialized instances of ExtendTruffleContract,
   * effectively class factories.
 */


// Look for a daostack.json file which can override default settings
var daostackSettings = require('daostack.json');

var defaultSettings = {
  providerUrl: "http://localhost:8545",
  network: "kovan", // Options are 'homestead', 'ropsten', 'rinkeby', 'kovan'
  gasLimit: 6900000
};

exports.daostackSettings = daostackSettings = dopts(daostackSettings, defaultSettings);

var getDeployedContracts = async function getDeployedContracts() {
  /**
   * These are deployed contract instances represented by their respective Arc
   * javascript wrappers (ExtendTruffleContract).
   *
   * `deployed()` is a static method on each of those classes.
   **/
  var contributionReward = await _contributionreward.ContributionReward.deployed();
  var genesisScheme = await GenesisScheme.deployed();
  var globalConstraintRegistrar = await _globalconstraintregistrar.GlobalConstraintRegistrar.deployed();
  var schemeRegistrar = await _schemeregistrar.SchemeRegistrar.deployed();
  var tokenCapGC = await _tokenCapGC.TokenCapGC.deployed();
  var upgradeScheme = await _upgradescheme.UpgradeScheme.deployed();
  var absoluteVote = await _absoluteVote.AbsoluteVote.deployed();

  /**
   * `contract` here is an uninitialized instance of ExtendTruffleContract,
   * basically the class factory.
   * Calling contract.at() (a static method on the class) will return a
   * the properly initialized instance of ExtendTruffleContract.
   */
  var contracts = {
    ContributionReward: {
      contract: _contributionreward.ContributionReward,
      address: contributionReward.address
    },
    GenesisScheme: {
      contract: GenesisScheme,
      address: genesisScheme.address
    },
    GlobalConstraintRegistrar: {
      contract: _globalconstraintregistrar.GlobalConstraintRegistrar,
      address: globalConstraintRegistrar.address
    },
    SchemeRegistrar: {
      contract: _schemeregistrar.SchemeRegistrar,
      address: schemeRegistrar.address
    },
    TokenCapGC: {
      contract: _tokenCapGC.TokenCapGC,
      address: tokenCapGC.address
    },
    UpgradeScheme: {
      contract: _upgradescheme.UpgradeScheme,
      address: upgradeScheme.address
    },
    AbsoluteVote: {
      contract: _absoluteVote.AbsoluteVote,
      address: absoluteVote.address
    }
  };

  return {
    allContracts: contracts,
    defaultVotingMaching: contract.AbsoluteVote,
    schemes: [contracts.SchemeRegistrar, contracts.UpgradeScheme, contracts.GlobalConstraintRegistrar, contracts.ContributionReward],
    votingMachines: [contracts.AbsoluteVote],
    globalConstraints: [contracts.TokenCapGC]
  };
};

exports.daostackSettings = daostackSettings;
exports.getDeployedContracts = getDeployedContracts;