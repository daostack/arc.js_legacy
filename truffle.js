require("babel-polyfill");
require("babel-register")({
  "presets": ["es2015"],
  "plugins": ["syntax-async-functions", "transform-regenerator"]
});

module.exports = {
  networks: {
    live: {
      host: "localhost",
      port: 8546,
      network_id: "1",
      gas: 4543760
    },
    ganache: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 4543760
    },
    ropsten: {
      host: "localhost",
      port: 8548,
      network_id: "3",
      gas: 4543760
    },
    kovan: {
      host: "localhost",
      port: 8547,
      network_id: "42",
      gas: 4543760
    }
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
