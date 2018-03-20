# Deploying Contracts to a Specified Network

To deploy contracts to a specified network, follow these steps:

1. set the environment variable "network" to the name of the network ("ganache", "kovan", "live"). The default is "ganache".  Truffle will use this to find the specified network settings in truffle.js.
2. if needed, set `network`, and `gasLimit_deployment` in /config/default.json.
3. make sure that /migrations/founders.json has an entry for your network, with the appropriate founders
4. run `npm start migrateContracts`

Note: For safety, truffle.js specifies a different HTTP port for each network.
