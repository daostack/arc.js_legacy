module.exports = {
  networks: {
    live: {
      host: "127.0.0.1",
      port: 8546,
      network_id: "1",
      gas: 4543760
    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 4543760
    },
    ropsten: {
      host: "127.0.0.1",
      port: 8548,
      network_id: "3",
      gas: 4543760
    },
    kovan: {
      host: "127.0.0.1",
      port: 8547,
      network_id: "42",
      gas: 4543760
    }
  },
  rpc: {
    host: "127.0.0.1",
    port: 8545
  }
};
