const dopts = require('default-options');

// Look for a daostack.json file which can override default settings

/* exported daostackSettings */
let daostackSettings;
try {
  daostackSettings = require('daostack.json');
  // do stuff
} catch (ex) {
  daostackSettings = {};
}

const defaultSettings = {
  providerUrl: "http://localhost:8545",
  network: "kovan", // Options are 'homestead', 'ropsten', 'rinkeby', 'kovan'
  gasLimit: 6900000
};

daostackSettings = dopts(daostackSettings, defaultSettings);

export { daostackSettings };