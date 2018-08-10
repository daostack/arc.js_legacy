import { BigNumber } from "bignumber.js";
import { promisify } from "es6-promisify";
import abi = require("ethereumjs-abi");
import Contract = require("truffle-contract");
import { providers as Web3Providers, Web3 } from "web3";
import { gasLimitsConfig } from "../gasLimits.js";
import { Address, Hash, SchemePermissions } from "./commonTypes";
import { ConfigService } from "./configService";
import { LoggingService } from "./loggingService";
// haven't figured out how to get web3 typings to properly expose the Web3 constructor.
// v1.0 may improve on this entire Web3 typings experience
/* tslint:disable-next-line:no-var-requires */
const webConstructor = require("web3");

export class Utils {

  static get NULL_ADDRESS(): Address { return "0x0000000000000000000000000000000000000000"; }
  static get NULL_HASH(): Hash { return "0x0000000000000000000000000000000000000000000000000000000000000000"; }
  /**
   * Returns Truffle contract wrapper given the name of the contract (like "SchemeRegistrar").
   * Optimized for synchronicity issues encountered with MetaMask.
   * Throws an exception if it can't load the contract.
   * Uses the asynchronous web.eth.getAccounts to obtain the default account (good with MetaMask).
   * @param contractName like "SchemeRegistrar"
   */
  public static async requireContract(contractName: string): Promise<any> {
    try {
      const artifact = require(`../migrated_contracts/${contractName}.json`);
      const contract = new Contract(artifact);
      const myWeb3 = await Utils.getWeb3();

      contract.setProvider(myWeb3.currentProvider);
      contract.defaults({
        from: await Utils.getDefaultAccount(),
        gas: gasLimitsConfig.gasLimit_runtime,
      });
      LoggingService.debug(`requireContract: loaded ${contractName}`);
      this.setTruffleTimeout(contract);
      return contract;
    } catch (ex) {
      LoggingService.error(`requireContract failing: ${ex}`);
      throw Error(`requireContract: unable to load solidity contract: ${contractName}: ${ex}`);
    }
  }

  /**
   * Returns the web3 object.
   * When called for the first time, web3 is initialized from the Arc.js configuration.
   * Throws an exception when web3 cannot be initialized.
   */
  public static async getWeb3(): Promise<Web3> {
    if (Utils.web3) {
      return Utils.web3;
    }

    LoggingService.debug("Utils.getWeb3: getting web3");

    let preWeb3;

    let globalWeb3;

    if ((typeof global !== "undefined") && (global as any).web3) {
      LoggingService.debug("Utils.getWeb3: found web3 in global");
      globalWeb3 = (global as any).web3;
    } else if ((typeof window !== "undefined") && (window as any).web3) {
      LoggingService.debug("Utils.getWeb3: found web3 in window");
      globalWeb3 = (window as any).web3;
    }

    if (typeof globalWeb3 !== "undefined") {
      LoggingService.debug("Utils.getWeb3: instantiating web3 with currentProvider");
      // Look for injected web3 e.g. by truffle in migrations, or MetaMask in the browser window
      // Instead of using the injected Web3.js directly best practice is to use the version of web3.js we have bundled
      /* tslint:disable-next-line:max-line-length */
      // see https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#partly_sunny-web3---ethereum-browser-environment-check
      preWeb3 = new webConstructor(globalWeb3.currentProvider);
    } else if (Utils.alreadyTriedAndFailed) {
      // then avoid time-consuming and futile retry
      throw new Error("Utils.getWeb3: already tried and failed");
    } else {
      let url = ConfigService.get("providerUrl");
      const port = ConfigService.get("providerPort");
      if (port) {
        url = `${url}:${port}`;
      }
      /* tslint:disable-next-line:max-line-length */
      LoggingService.debug(`Utils.getWeb3: instantiating web3 with configured provider at ${url}`);
      // No web3 is injected, look for a provider at providerUrl:providerPort (which defaults to localhost)
      // This happens when running tests, or in a browser that is not running MetaMask
      preWeb3 = new webConstructor(new Web3Providers.HttpProvider(url));
    }

    const connected = await promisify(preWeb3.net.getListening)()
      .then((isListening: boolean) => {
        return isListening;
      })
      .catch((error: Error) => {
        return false;
      });

    if (!connected) {
      Utils.alreadyTriedAndFailed = true;
      throw new Error("Utils.getWeb3: web3 is not connected to a net");
    }

    if (typeof window !== "undefined") {
      // Add to window for easy use in the console
      (window as any).web3 = preWeb3;
    }

    Utils.networkId = await promisify(preWeb3.version.getNetwork)() as string;

    return (Utils.web3 = preWeb3);
  }

  /**
   * Returns the address of the default user account.
   *
   * Has the side-effect of setting web3.eth.defaultAccount.
   *
   * Throws an exception on failure.
   */
  public static async getDefaultAccount(): Promise<string> {
    const localWeb3 = await Utils.getWeb3();

    return promisify(localWeb3.eth.getAccounts)().then((accounts: Array<any>) => {
      const defaultAccount = localWeb3.eth.defaultAccount = accounts[0];

      if (!defaultAccount) {
        throw new Error("accounts[0] is not set");
      }

      return defaultAccount;
    });
  }

  /**
   * Return the current token balance for the given token and agent.
   */
  public static async getTokenBalance(agentAddress: Address, tokenAddress: Address)
    : Promise<BigNumber> {

    if (!tokenAddress) {
      throw new Error("Utils.getTokenBalance: tokenAddress is not defined");
    }

    if (!agentAddress) {
      throw new Error("Utils.getTokenBalance: agentAddress is not defined");
    }

    const token = await (await Utils.requireContract("BasicToken")).at(tokenAddress);

    return token.balanceOf(agentAddress);
  }

  /**
   * Return the current ETH balance for the given agent.
   */
  public static async getEthBalance(agentAddress: Address)
    : Promise<BigNumber> {

    if (!agentAddress) {
      throw new Error("Utils.getEthBalance: agentAddress is not defined");
    }

    const web3 = await Utils.getWeb3();
    return promisify((callback: any) => web3.eth.getBalance(agentAddress, web3.eth.defaultBlock, callback))()
      .then((balance: BigNumber) => {
        return balance;
      });
  }

  /**
   * Return the hash of a string the same way solidity would, and to a format that will be
   * properly translated into a bytes32 that solidity expects
   * @param str a string
   */
  public static SHA3(str: string): string {
    return Utils.keccak256(["string"], [str]);
  }

  /**
   * Return the tightly-packed hash of any arbitrary array of
   * objects just as Solidity's `keccak256` function would do.
   *
   * Items in the `types` array must appear in the same order in which the values would be
   * passed to Solidity's `keccak256` function.
   *
   * Type names can be:
   *   "bytes[N]' - fails if (N < 1 || N > 32)
   *   "string'
   *   "bool'
   *   "address'
   *   "uint[N]'  - fails if ((N % 8) || (N < 8) || (N > 256))
   *   "int[N]'   - fails if ((N % 8) || (N < 8) || (N > 256))
   *
   * Use "bytes32" for a Hash value
   *
   * See: https://github.com/ethereumjs/ethereumjs-abi
   *
   * @param types array of type names.
   * @param values - the values to pack and hash.  These must appear in the same order in which the types are ordered.
   */
  public static keccak256(types: Array<string>, values: Array<any>): string {
    return `0x${abi.soliditySHA3(types, values).toString("hex")}`;
  }

  /**
   * Convert scheme permissions string to a number
   * @param {string} permissions
   */
  public static permissionsStringToNumber(permissions: string): SchemePermissions {
    if (!permissions) { return 0; }
    return Number(permissions) as SchemePermissions;
  }

  /**
   * Convert SchemePermissions | DefaultSchemePermissions to a scheme permissions string
   * @param {Number} permissions
   */
  public static numberToPermissionsString(
    permissions: SchemePermissions): string {

    if (!permissions) { permissions = SchemePermissions.None; }

    return `0x${("00000000" + (permissions as number).toString(16)).substr(-8)}`;
  }

  /**
   * Returns promise of the name of the current or given network
   * @param id Optional id of the network
   */
  public static async getNetworkName(id?: string): Promise<string> {

    if (!id) {
      id = await Utils.getNetworkId();
    }

    switch (id) {
      case "1":
        return "Live";
      case "2":
        return "Morden";
      case "3":
        return "Ropsten";
      case "4":
        return "Rinkeby";
      case "42":
        return "Kovan";
      // the id that arc.js hardwires for ganache
      case "1512051714758":
        return "Ganache";
      default:
        return "Unknown";
    }
  }

  /**
   * Returns promise of the id of the current network
   */
  public static async getNetworkId(): Promise<string> {
    if (!Utils.networkId) {
      await Utils.getWeb3();
    }
    return Utils.networkId;
  }

  /**
   * Returns promise of the address of the global GEN token.
   */
  public static async getGenTokenAddress(): Promise<string> {
    const networkName = (await Utils.getNetworkName()).toLowerCase();
    const addresses = ConfigService.get("globalGenTokenAddresses");

    const address = addresses[networkName];
    return address ? address : addresses.default;
  }

  /**
   * Returns a promise of the given account's GEN token balance.
   * @param agentAddress
   */
  public static async getGenTokenBalance(agentAddress: Address): Promise<BigNumber> {
    const genTokenAddress = await Utils.getGenTokenAddress();
    return Utils.getTokenBalance(agentAddress, genTokenAddress);
  }

  /**
   * Returns the truffle artifact json for the given contract
   * @param contractName
   */
  public static getTruffleArtifactForContract(contractName: string): any {
    return require(`../migrated_contracts/${contractName}.json`);
  }

  /**
   * The number in seconds that truffle waits to return a mined transaction, where 0 means no timeout.
   * Undefined (absent) to use truffle's default value.
   * @hidden - for internal use only
   * @param contract
   */
  public static setTruffleTimeout(contract: any): void {
    const truffleTimeout = ConfigService.get("truffleTimeout");
    if (typeof truffleTimeout !== "undefined") {
      // number in seconds where 0 means no timeout
      contract.constructor.synchronization_timeout = truffleTimeout;
    }
  }

  private static web3: Web3 = undefined;
  private static alreadyTriedAndFailed: boolean = false;
  private static networkId: string;
}

export { Web3 } from "web3";
