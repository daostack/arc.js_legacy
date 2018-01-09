"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDeployedContracts = getDeployedContracts;

var _utils = require("./utils.js");

var _absoluteVote = require("./absoluteVote.js");

var _contributionreward = require("./contributionreward.js");

var _globalconstraintregistrar = require("./globalconstraintregistrar.js");

var _schemeregistrar = require("./schemeregistrar.js");

var _upgradescheme = require("./upgradescheme.js");

/**
 * These are uninitialized instances of ExtendTruffleContract,
 * effectively class factories.
 */
var GenesisScheme = (0, _utils.requireContract)("GenesisScheme");
async function getDeployedContracts() {
  /**
   * These are deployed contract instances represented by their respective Arc
   * javascript wrappers (ExtendTruffleContract).
   *
   * `deployed()` is a static method on each of those classes.
   **/
  var absoluteVote = await _absoluteVote.AbsoluteVote.deployed();
  var contributionReward = await _contributionreward.ContributionReward.deployed();
  var genesisScheme = await GenesisScheme.deployed();
  var globalConstraintRegistrar = await _globalconstraintregistrar.GlobalConstraintRegistrar.deployed();
  var schemeRegistrar = await _schemeregistrar.SchemeRegistrar.deployed();
  var upgradeScheme = await _upgradescheme.UpgradeScheme.deployed();

  /**
   * `contract` here is an uninitialized instance of ExtendTruffleContract,
   * basically the class factory.
   * Calling contract.at() (a static method on the class) will return a
   * the properly initialized instance of ExtendTruffleContract.
   */
  var contracts = {
    AbsoluteVote: {
      contract: _absoluteVote.AbsoluteVote,
      address: absoluteVote.address
    },
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
    UpgradeScheme: {
      contract: _upgradescheme.UpgradeScheme,
      address: upgradeScheme.address
    }
  };

  return {
    allContracts: contracts,
    defaultVotingMachine: contracts.AbsoluteVote,
    schemes: [contracts.SchemeRegistrar, contracts.UpgradeScheme, contracts.GlobalConstraintRegistrar, contracts.ContributionReward],
    votingMachines: [contracts.AbsoluteVote],
    globalConstraints: []
  };
}