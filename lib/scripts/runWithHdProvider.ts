/* tslint:disable:no-console */
/* tslint:disable:no-var-requires */
import { Web3 } from "web3";
import { Utils } from "../utils";

/**
 * Call the given method in the given script connecting to a chain network according
 * to the given providerConfiguration.
 *
 * Example from the arc.js root:
 *
 *   `node ./dist/scripts/runWithHdProvider.js [pathToProviderConfig] [pathToScript] [methodNameInScript]`
 *
 * The providerConfiguration looks something like this:
 *
 * ```
 *   {
 *    "mnemonic": "...",
 *    "providerUrl": "https://kovan.infura.io/..."
 *   }
 * ```
 *
 * The method will be invoked with two parameters: `web3` and the name of the network in lowercase.
 * `web3` will also be global.
 *
 * The method must return a promise that it has completed.
 *
 * The method may invoke `InitializeArcJs` to use Arc.js to access Arc contracts.
 *
 * If the script shows provider status output but then exits without executing your script,
 * check to ensure that a node is listening at the Url given in your provider configuration.
 */
const usage = (): void => {
  console.log(`usage: 'node runWithProvider.js [providerConfiguration] [script] [method]'`);
  console.log(`  providerConfiguration: path to json provider configuration file`);
  console.log(`  script: path to javascript script file`);
  console.log(`  method: name of the method to execute`);
};

let provider;

const exit = (code: number = 0): void => {
  if (provider) {
    console.log("stopping provider engine...");
    // see: https://github.com/trufflesuite/truffle-hdwallet-provider/issues/46
    provider.engine.stop();
  }
  process.exit(code);
};

if (process.argv.length !== 5) {
  usage();
  exit(1);
}

const providerConfigPath = process.argv[2];
const script = require(process.argv[3]);
const method = process.argv[4];

const connectToNetwork = async (): Promise<void> => {
  const webConstructor = require("web3");

  let providerConfig;

  console.log(`providerConfig at: ${providerConfigPath}`);
  providerConfig = require(providerConfigPath);

  const HDWalletProvider = require("truffle-hdwallet-provider");
  console.log(`Provider: '${providerConfig.providerUrl}'`);
  console.log(`Account: '${providerConfig.mnemonic}'`);
  provider = new HDWalletProvider(providerConfig.mnemonic, providerConfig.providerUrl);
  (global as any).web3 = new webConstructor(provider);
};

try {

  const runScript = async (): Promise<void> => {

    await connectToNetwork();

    /**
     * Note that if no node is listening at the provider's url, particularly with ganache, this
     * may disappear into la-la land.  In that case web3.net.getListening will not have invoked its
     * given callback, leaving us adrift.
     */
    return Utils.getWeb3()
      .then(async (web3: Web3) => {
        const networkName = await Utils.getNetworkName();
        console.log(`Executing ${method}`);

        return script[method](web3, networkName)
          .then(() => {
            console.log(`Completed ${method}`);
            exit(0);
          })
          .catch((ex: any) => {
            console.log(`Error in ${method}: ${ex}`);
            exit(-1);
          });
      })
      .catch((ex: any) => {
        console.log(`Error: ${ex}`);
        exit(-1);
      });
  };

  runScript();
} catch (ex) {
  console.log(`an error occurred: ${ex}`);
}
