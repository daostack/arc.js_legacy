# Migrations

## Deploying Contracts to a Specified Network

To deploy contracts to a specified network, follow these steps:

1. Set the environment variable `arcjs_network` to the name of the network ("ganache", "kovan", "ropsten", "live"). The default is "ganache".  Truffle will use this setting to find the specified settings in truffle.js in the Arc.js package.

2. If you are deploying to ganache, skip this step, otherwise:  Set the environment variable `arcjs_providerConfig` to contain the path to a JSON file that contains specifications for how to connect to a node. The contents of the file should look like this:


    ```
    {
      "mnemonic" : "a 12-word BIP39-compliant account mnemonic",
      "providerUrl" : "examples: http://127.0.0.1:8545 or https://[network].infura.io/[token]"
    }
    ```

    An account generated from the mnemonic will be unlocked for signing and accepting the transactions that are generated during the migration.

    !!! warning
        The mnemonic won't work unless it confirms to [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).  You can generate a conformant mnemonic [here](https://iancoleman.io/bip39/).

    !!! info
        The migration script will use the gas settings defined in the Arc.js file `arc.js/gasLimits.js`.  The gas limit when migrating/creating Daos is computed dynamically as a function of the number of founders.

3. Provide a list of Genesis DAO founders as described in [configuring founders](#configuring-founders).

4. If deploying to ganache, then run `npm start ganache`, or from your application: `npm explore @daostack/arc.js -- npm start ganache`.

    Otherwise, make sure your node is all sync'd-up and listening at the providerUrl you supplied in step 2.

5. run `npm start migrateContracts`, or from your application: `npm explore @daostack/arc.js -- npm start migrateContracts`.

6. If you want to create the Genesis DAO then run `npm start migrateContracts.createGenesisDao`, or from your application: `npm explore @daostack/arc.js -- npm start migrateContracts.createGenesisDao`.


## Configuring Founders

When migrating to any network besides ganache you will need to supply a list of founders for the Genesis DAO that is created by the Arc.js migration script.  You must define an environment variable named `arcjs_foundersConfigurationLocation` that contains the path to a JSON file containing specifications for your founders. This JSON file defines a list of founders for one or more networks in a format that looks like the following (but with real addresses):

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
    The `tokens` amounts are in GDT for testnets, or GEN for "live", and the `reputation` are in units of the Genesis Reputation system.
