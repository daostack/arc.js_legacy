# Deploying Contracts to a Specified Network

To deploy contracts to a specified network, follow these steps:

1. Set the environment variable "arcjs_network" to the name of the network ("ganache", "kovan", "ropsten", "live"). The default is "ganache".  Truffle will use this setting to find the specified settings in truffle.js in the Arc.js package.  The migration script will also use this setting just to feedback to you which network truffle is using.
2. The migration script will use `arcjs_gasLimit_deployment`, allowing you to customize the gas amount if needed.
3. make sure that /migrations/founders.json in the Arc.js package folder has an entry for your test network with the founders to add to the Genesis DAO.
4. make sure you have your testnet running and listening on the right port.

   For safety, truffle.js specifies a different HTTP port for each network.  You will need to make sure that the testnet you are using is listening on that port.  The port values are:

<table style="margin-left:2.5rem">
<tr style="text-align:left"><th>Network</th><th>Port</th></tr>
<tr><td>Ganache</td><td>8545</td></tr>
<tr><td>Kovan</td><td>8547</td></tr>
<tr><td>Ropsten</td><td>8548</td></tr>
<tr><td>Live (Mainnet)</td><td>8546</td></tr>
</table>

5. run `npm start migrateContracts`, or from your application: `npm explore @daostack/arc.js -- npm start migrateContracts`


