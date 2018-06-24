const GenesisDaoCreator = require("../dist/scripts/createGenesisDao.js").GenesisDaoCreator;
const env = require("env-variable")();
const webConstructor = require("web3");

let providerConfig;
let provider;

console.log(`providerConfig at: ${env.arcjs_providerConfig}`);
providerConfig = require(env.arcjs_providerConfig);

const HDWalletProvider = require("truffle-hdwallet-provider");
console.log(`Provider: '${providerConfig.providerUrl}'`);
console.log(`Account: '${providerConfig.mnemonic}'`);
provider = new HDWalletProvider(providerConfig.mnemonic, providerConfig.providerUrl);

const web3 = global.web3 = new webConstructor(provider);

const createGenesisDao = new GenesisDaoCreator(web3, env.arcjs_network || "ganache");

return createGenesisDao.forge(env.arcjs_foundersConfigurationLocation)
  .then((daoCreationState) => {
    return createGenesisDao.setSchemes(daoCreationState).then(() => {
      console.log(`Successfully created ${daoCreationState.orgName}`);
    })
      .catch((ex) => {
        console.log(`Error setting schemes: ${daoCreationState.orgName}: ${ex}`);
      });
  })
  .catch((ex) => {
    console.log(`Error forging org: ${ex}`);
  });
