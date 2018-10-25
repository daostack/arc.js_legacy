const env = require("env-variable")();
/**
 * `truffle migrate` will lock and use this account.
 * 
 * Must look like this:
 * {
 *   "mnemonic" : "an account mnemonic",
 *   "providerUrl" : "like http://127.0.0.1:8545 or https://[net].infura.io/[token]"
 *  }
 */
let providerConfig;
let provider;

if (env.arcjs_providerConfig) {
  console.log(`providerConfig at: ${env.arcjs_providerConfig}`);
  providerConfig = require(env.arcjs_providerConfig);

  if (providerConfig) {
    const HDWalletProvider = require("truffle-hdwallet-provider");
    console.log(`Provider: '${providerConfig.providerUrl}'`);
    console.log(`Account: '${providerConfig.mnemonic}'`);
    global.provider = provider = new HDWalletProvider(providerConfig.mnemonic, providerConfig.providerUrl);
  }
}

module.exports = {
  networks: {
    live: {
      provider: function () {
        return provider;
      },
      gas: 4543760,
      gasPrice: 10000000000,
      network_id: 1,
      websockets: true
    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 4543760,
      websockets: true
    },
    ropsten: {
      provider: function () {
        return provider;
      },
      gas: 4543760,
      network_id: 3,
      websockets: true
    },
    kovan: {
      provider: function () {
        return provider;
      },
      gas: 4543760,
      network_id: 42,
      websockets: true
    }
  },
  rpc: {
    host: "127.0.0.1",
    port: 8545,
    websockets: true
  }
};
