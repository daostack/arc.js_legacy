const GenesisDaoCreator = require("../dist/scripts/createGenesisDao.js").GenesisDaoCreator;
const Utils = require("../dist/utils.js").Utils;
const env = require("env-variable")();
let provider;

const setupForNonGanacheNet = () => {
  const webConstructor = require("web3");

  let providerConfig;

  console.log(`providerConfig at: ${env.arcjs_providerConfig}`);
  providerConfig = require(env.arcjs_providerConfig);

  const HDWalletProvider = require("truffle-hdwallet-provider");
  console.log(`Provider: '${providerConfig.providerUrl}'`);
  console.log(`Account: '${providerConfig.mnemonic}'`);
  provider = new HDWalletProvider(providerConfig.mnemonic, providerConfig.providerUrl);
  // Utils.getWeb3() will use this
  global.web3 = new webConstructor(provider);
};

const exit = () => {
  if (provider) {
    console.log("stopping provider engine...");
    // see: https://github.com/trufflesuite/truffle-hdwallet-provider/issues/46
    provider.engine.stop();
  }
};

if (env.arcjs_providerConfig) {
  // note this can be ganache too
  setupForNonGanacheNet();
}

Utils.getWeb3()
  .then((web3) => {
    const createGenesisDao = new GenesisDaoCreator(web3, env.arcjs_network || "ganache");
    return createGenesisDao.run()
      .catch((ex) => {
        console.log(`Error forging org: ${ex}`);
        exit();
      });
  });
