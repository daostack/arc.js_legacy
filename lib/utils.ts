import { BigNumber } from "bignumber.js";
import { promisify } from "es6-promisify";
import abi = require("ethereumjs-abi");
import Contract = require("truffle-contract");
import { providers as Web3Providers, Web3 } from "web3";
import { Address, Hash, SchemePermissions } from "./commonTypes";
import { ConfigService } from "./configService";
import { LoggingService } from "./loggingService";

export class Utils {

  static get NULL_ADDRESS(): Address { return "0x0000000000000000000000000000000000000000"; }
  static get NULL_HASH(): Hash { return "0x0000000000000000000000000000000000000000000000000000000000000000"; }

  public static setDeployedAddresses(addresses: any): void {
    this.deployedContractAddresses = addresses;
    for (const name of Object.keys(this.deployedContractAddresses)) {
      // be consistent with Truffle which returns all lowercase
      this.deployedContractAddresses[name] = `0x${this.deployedContractAddresses[name].substring(2).toLowerCase()}`;
    }
  }

  public static getDeployedAddress(contractName: string): Address | undefined {
    return Utils.deployedContractAddresses[contractName];
  }

  /**
   * Returns Truffle contract wrapper given the name of the contract (like "SchemeRegistrar").
   * Optimized for synchronicity issues encountered with MetaMask.
   * Throws an exception if it can't load the contract.
   * Uses the asynchronous web.eth.getAccounts to obtain the default account (good with MetaMask).
   * @param contractName like "SchemeRegistrar"
   */
  public static async requireContract(contractName: string): Promise<any> {
    try {
      let contract = Utils.contractCache.get(contractName);
      if (contract) {
        LoggingService.debug(`requireContract: loaded from cache ${contractName}`);
        return contract;
      }

      const artifact = require(`../migrated_contracts/${contractName}.json`);
      contract = new Contract(artifact);
      const myWeb3 = await Utils.getWeb3();

      contract.setProvider(myWeb3.currentProvider);
      contract.setNetwork(await Utils.getNetworkId());
      contract.defaults({
        from: await Utils.getDefaultAccount(),
        gas: ConfigService.get("defaultGasLimit"),
      });

      /**
       * Use the supplied contract deployment addresses.
       * Arc.js is not doing migrations anymore, so the truffle artifact files contain no
       * deployment addresses.
       */
      contract.deployed = (): any => {
        return contract.at(Utils.getDeployedAddress(contractName))
          .then((result: any) => result)
          .catch((ex: Error) => {
            throw ex;
          });
      };

      Utils.contractCache.set(contractName, contract);
      LoggingService.debug(`requireContract: loaded ${contractName}`);
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
   * @param - Optional when true to refetch web3, in case the network has changed.
   */
  public static async getWeb3(refetch: boolean = false): Promise<Web3> {
    if (!refetch && Utils.web3) {
      return Utils.web3;
    }

    LoggingService.debug("Utils.getWeb3: getting web3");

    Utils.clearContractCache();

    let preWeb3;

    let globalWeb3;

    // haven't figured out how to get web3 typings to properly expose the Web3 constructor.
    // v1.0 may improve on this entire Web3 typings experience
    /* tslint:disable-next-line:no-var-requires */
    const webConstructor = require("web3");

    if ((typeof global !== "undefined") &&
      (global as any).web3 &&
      ((typeof window === "undefined") || (global as any).web3 !== (window as any).web3)) {

      /**
       * `global.web3` is set and either `window.web3` is not set or the two values for web3 are not equal.
       * In either case we take `global.web3` as apparently it has been provided by an application,
       * either manually or via `InitializeArcJs`. We'll "provide" it further down.
       */
      LoggingService.debug("Utils.getWeb3: found web3 in global");
      globalWeb3 = (global as any).web3;
    } else if (typeof window !== "undefined") {
      /**
       * we didn't take `global.web` or it wasn't available, and `window` is set
       */
      if ((window as any).ethereum && ConfigService.get("useMetamaskEthereumWeb3Provider")) {
        /**
         * `windows.ethereum`-provided web3 takes precedence if available.
         * "Provide" it right here.
         */
        LoggingService.debug("Utils.getWeb3: creating Web3 using window.ethereum provider");
        preWeb3 = (window as any).web3 = new webConstructor((window as any).ethereum);
      } else if ((window as any).web3) {
        /**
         * else take `window.web3` and "provide" it further down
         */
        LoggingService.debug("Utils.getWeb3: found web3 in window");
        globalWeb3 = (window as any).web3;
      }
    }
    // else no `web` was found

    if (!preWeb3) {
      if (globalWeb3) {
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
        // No web3 is injected, look for a provider at providerUrl:providerPort (which defaults to 127.0.0.1)
        // This happens when running tests, or in a browser that is not running MetaMask
        let url = `http://${ConfigService.get("providerUrl")}`;
        const port = ConfigService.get("providerPort");
        if (port) {
          url = `${url}:${port}`;
        }
        /* tslint:disable-next-line:max-line-length */
        LoggingService.debug(`Utils.getWeb3: instantiating web3 with configured provider at ${url}`);
        preWeb3 = new webConstructor(new Web3Providers.HttpProvider(url));
      }
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

    Utils.networkId =
      Number.parseInt(await promisify(preWeb3.version.getNetwork)() as string, 10) as number | undefined;

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
      const defaultAccount = localWeb3.eth.defaultAccount =
        (accounts && (accounts.length > 0)) ? accounts[0] : undefined;

      if (!defaultAccount) {
        throw new Error("accounts[0] is not set");
      }

      return defaultAccount;
    });
  }

  /**
   * Ask MetaMask to prompt the user for permission to access their wallet. MetaMask
   * will insert the user's accounts into the existing Web3 object.  If you are watching
   * for account changes then you will receive a notification
   * (see [AccountService.initiateAccountWatch](/arc.js/api/classes/AccountService#initiateAccountWatch)).
   *
   * Note that this won't work if you have passed `false` for `InitializeArcOptions.useMetamaskEthereumWeb3Provider`
   * when you called `InitializeArcJs`.
   *
   * @returns true or false depending on whether the user approves of account sharing.
   */
  public static async getUserApprovalForAccounts(): Promise<boolean> {
    const ethereumProvider = (window as any).ethereum;
    if (ethereumProvider) {
      try {
        await ethereumProvider.enable();
      } catch {
        return Promise.resolve(false);
      }
    } else {
      try {
        await Utils.getDefaultAccount();
      } catch {
        // no accounts found
        return Promise.resolve(false);
      }
    }
    return Promise.resolve(true);
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
   *   - `bytes[N]` - fails if (N < 1 || N > 32)
   *   - `string`
   *   - `bool`
   *   - `address`
   *   - `uint[N]`  - fails if ((N % 8) || (N < 8) || (N > 256))
   *   - `int[N]`   - fails if ((N % 8) || (N < 8) || (N > 256))
   *
   * Use `bytes32` for a Hash value
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
   * Returns address of the global GEN token.
   */
  public static getGenTokenAddress(): string {
    return this.deployedContractAddresses.DAOToken;
  }

  /**
   * Returns promise of the name of the current or given network
   * @param id Optional id of the network
   */
  public static async getNetworkName(id?: number): Promise<string> {

    if (!id) {
      id = await Utils.getNetworkId();
    }

    switch (id) {
      case 1:
        return "Live";
      case 2:
        return "Morden";
      case 3:
        return "Ropsten";
      case 4:
        return "Rinkeby";
      case 42:
        return "Kovan";
      // the id that arc.js hardwires for ganache
      case 1512051714758:
        return "Ganache";
      default:
        return "Private";
    }
  }

  /**
   * Returns promise of the id of the current network
   * @param - Optional when true to refetch the network id, in case
   * it has changed.
   */
  public static async getNetworkId(): Promise<number> {
    if (!Utils.networkId) {
      await Utils.getWeb3();
    }
    return Utils.networkId;
  }

  private static contractCache: Map<string, Contract> = new Map<string, string>();

  private static web3: Web3 = undefined;
  private static alreadyTriedAndFailed: boolean = false;
  private static networkId: number;
  private static deployedContractAddresses: any;

  private static clearContractCache(): void {
    Utils.contractCache.clear();
  }
}

export { Web3 } from "web3";
