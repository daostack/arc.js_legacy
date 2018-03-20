# Deploying Contracts to a Specified Network

To deploy contracts to a specified network, follow these steps:

1. Set the environment variable "arcjs_network" (or "network" in /config/defaults.json in the Arc.js package) to the name of the network ("ganache", "kovan", "ropsten", "live"). The default is "ganache".  Truffle will use this setting to find the specified settings in truffle.js in the Arc.js package.  The migration script will also use this setting just to feedback to you which network truffle is using.
2. The migration script will use `arcjs_gasLimit_deployment` (or "gasLimit_deployment" in /config/defaults.json in the Arc.js package), allowing you to customize the gas amount if needed.
3. make sure that /migrations/founders.json in the Arc.js package folder has an entry for your test network with the founders to add to the Genesis DAO.
4. run `npm start migrateContracts`

For safety, truffle.js specifies a different HTTP port for each network.  You will need to make sure that the testnet you are using is listening on that port.  The port values are:

| Network  | Port  |
|---|---|
| Ganache  | 8545  |
| Kovan  | 8547  |
| Ropsten  | 8548  |
| Live (Mainnet)  | 8546  |
