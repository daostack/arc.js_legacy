# Migrations

## Deploying Contracts to a Specified Network

To deploy contracts to a specified network, follow these steps:

1. Set the environment variable `arcjs_network` to the name of the network ("ganache", "kovan", "ropsten", "live"). The default is "ganache".  Truffle will use this setting to find the specified settings in truffle.js in the Arc.js package.  The migration script will also use this setting just to feedback to you which network truffle is using.

2. The migration script will use the gas settings defined in the Arc.js file `arc.js/gasLimits.js`.  The gas limit when migrating/creating Daos is computed dynamically as a function of the number of founders.

3. Provide a list of founders. Refer here on [configuring founders](#configuring-founders).

4. Make sure you have your testnet running and listening on the right port. 

      For safety, truffle.js specifies a different HTTP port for each network.  You will need to make sure that the testnet you are using is listening on that port.  The port values are:

      <table style="margin-left:2.5rem">
      <tr style="text-align:left"><th>Network</th><th>Port</th></tr>
      <tr><td>Ganache</td><td>8545</td></tr>
      <tr><td>Kovan</td><td>8547</td></tr>
      <tr><td>Ropsten</td><td>8548</td></tr>
      <tr><td>Live (Mainnet)</td><td>8546</td></tr>
      </table>

5. run `npm start migrateContracts`, or from your application: `npm explore @daostack/arc.js -- npm start migrateContracts`

!!! tip
    If you want to start from scratch with brand-new contracts, run: `npm start migrateContracts.clean.andMigrate`.

!!! tip
    When migrating to Kovan, the migration will not succeed until your node is completely caught up syncing with the net.  If you still have problems and you are running Parity, try suppling `--no-warp`.

## Configuring Founders

For any network besides ganache you will need to supply a list of founders for the Genesis DAO created by the Arc.js migration script.  You can define a list of founders using json that looks like the following (but with real addresses):

```json
{
  "founders": {
    "ropsten": [
      {
        "address": "0x1000000000000000000000000000000000000000",
        "tokens": 1000,
        "reputation": 1000
      }
    ],
    "kovan": [
      {
        "address": "0x1000000000000000000000000000000000000000",
        "tokens": 1000,
        "reputation": 1000
      },
      {
        "address": "0x1000000000000000000000000000000000000000",
        "tokens": 1000,
        "reputation": 1000
      }
    ]
  }
}
```

!!! info
    The `tokens` are in GEN and the `reputation` are in units of the Genesis Reputation system.

Place the above json in a file and use the Arc.js [foundersConfigurationLocation configuration setting](Configuration) to tell Arc.js where to find the file.

!!! note "Remember"
    You can set Arc.js configuration settings in your OS environment by prefixing the name with "arcjs_".
