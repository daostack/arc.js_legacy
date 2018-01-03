'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var dopts = require('default-options');

// Look for a daostack.json file which can override default settings

/* exported daostackSettings */
var daostackSettings = void 0;
try {
  exports.daostackSettings = daostackSettings = require('daostack.json');
  // do stuff
} catch (ex) {
  exports.daostackSettings = daostackSettings = {};
}

var defaultSettings = {
  providerUrl: "http://localhost:8545",
  network: "kovan", // Options are 'homestead', 'ropsten', 'rinkeby', 'kovan'
  gasLimit: 6900000
};

exports.daostackSettings = daostackSettings = dopts(daostackSettings, defaultSettings);

exports.daostackSettings = daostackSettings;