import { config } from "./config.js";
import Web3 from "web3";
const TruffleContract = require("truffle-contract");
const abi = require("ethereumjs-abi");

export class Utils {

  static get NULL_ADDRESS() { return "0x0000000000000000000000000000000000000000"; }
  static get NULL_HASH() { return "0x0000000000000000000000000000000000000000000000000000000000000000"; }

  /**
   * Returns TruffleContract given the name of the contract (like "SchemeRegistrar"), or undefined
   * if not found or any other error occurs.
   *
   * This is not an Arc javascript wrapper, rather it is the straight TruffleContract
   * that one references in the Arc javascript wrapper as ".contract".
   *
   * Side effect:  It initializes (and uses) `web3` if a global `web3` is not already present, which
   * happens when running in the context of an application (as opposed to tests or migration).
   *
   * @param contractName
   */
  static requireContract(contractName) {
    try {
      const myWeb3 = Utils.getWeb3();

      const artifact = require(`../migrated_contracts/${contractName}.json`);
      const contract = new TruffleContract(artifact);

      contract.setProvider(myWeb3.currentProvider);
      contract.defaults({
        from: Utils.getDefaultAccount(),
        gas: config.get("gasLimit")
      });
      return contract;
    } catch (ex) {
      return undefined;
    }
  }

  /**
   * throws an exception when web3 cannot be initialized or there is no default client
   */
  static getWeb3() {
    if (Utils._web3) {
      return Utils._web3;
    }

    let preWeb3;

    if (typeof web3 !== "undefined") {
      // Look for injected web3 e.g. by truffle in migrations, or MetaMask in the browser window
      // Instead of using the injected Web3.js directly best practice is to use the version of web3.js we have bundled
      // see https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#partly_sunny-web3---ethereum-browser-environment-check
      preWeb3 = new Web3(web3.currentProvider);
    } else if (Utils._alreadyTriedAndFailed) {
      // then avoid time-consuming and futile retry
      throw new Error("already tried and failed");
    } else {
      // No web3 is injected, look for a provider at providerUrl (which defaults to localhost)
      // This happens when running tests, or in a browser that is not running MetaMask
      preWeb3 = new Web3(
        new Web3.providers.HttpProvider(config.get("providerUrl"))
      );
    }

    if (!preWeb3) {
      Utils._alreadyTriedAndFailed = true;
      throw new Error("web3 not found");
    }

    if (typeof window !== "undefined") {
      // Add to window for easy use in the console
      window.web3 = preWeb3;
    }

    return (Utils._web3 = preWeb3);
  }

  /**
   * @param tx The transaction
   * @param arg The name of the property whose value we wish to return, from  the args object: tx.logs[index].args[argName]
   * @param eventName Overrides index, identifies which log, where tx.logs[n].event  === eventName
   * @param index Identifies which log, when eventName is not given
   */
  static getValueFromLogs(tx, arg, eventName = null, index = 0) {
    /**
     *
     * tx is an object with the following values:
     *
     * tx.tx      => transaction hash, string
     * tx.logs    => array of decoded events that were triggered within this transaction
     * tx.receipt => transaction receipt object, which includes gas used
     *
     * tx.logs look like this:
     *
     * [ { logIndex: 13,
     *     transactionIndex: 0,
     *     transactionHash: "0x999e51b4124371412924d73b60a0ae1008462eb367db45f8452b134e5a8d56c8",
     *     blockHash: "0xe35f7c374475a6933a500f48d4dfe5dce5b3072ad316f64fbf830728c6fe6fc9",
     *     blockNumber: 294,
     *     address: "0xd6a2a42b97ba20ee8655a80a842c2a723d7d488d",
     *     type: "mined",
     *     event: "NewOrg",
     *     args: { _avatar: "0xcc05f0cde8c3e4b6c41c9b963031829496107bbb" } } ]
     */
    if (!tx.logs || !tx.logs.length) {
      throw new Error("getValueFromLogs: Transaction has no logs");
    }

    if (eventName && (eventName.length)) {
      for (let i = 0; i < tx.logs.length; i++) {
        if (tx.logs[i].event === eventName) {
          index = i;
          break;
        }
      }
      if (typeof index === "undefined") {
        const msg = `getValueFromLogs: There is no event logged with eventName ${eventName}`;
        throw new Error(msg);
      }
    } else if (typeof index === "undefined") {
      index = tx.logs.length - 1;
    }
    if (tx.logs[index].type !== "mined") {
      const msg = `getValueFromLogs: transaction has not been mined: ${tx.logs[index].event}`;
      throw new Error(msg);
    }
    const result = tx.logs[index].args[arg];

    if (!result) {
      const msg = `getValueFromLogs: This log does not seem to have a field "${arg}": ${tx.logs[index].args}`;
      throw new Error(msg);
    }
    return result;
  }

  /**
   * side-effect is to set web3.eth.defaultAccount.
   * throws an exception on failure.
   */
  static getDefaultAccount() {
    const web3 = Utils.getWeb3();
    const defaultAccount = (web3.eth.defaultAccount =
      web3.eth.defaultAccount || web3.eth.accounts[0]);

    if (!defaultAccount) {
      throw new Error("eth.accounts[0] is not set");
    }
    return defaultAccount;
  }

  /**
   * Hash a string the same way solidity does, and to a format that will be properly translated into a bytes32 that solidity expects
   * @param str a string
   */
  static SHA3(str) {
    return `0x${abi.soliditySHA3(["string"], [str]).toString("hex")}`;
  }

  /**
   * Convert scheme permissions string to a number
   * @param {string} permissions
   */
  static permissionsStringToNumber(permissions) {
    if (!permissions) { return 0; }
    return Number(permissions);
  }

  /**
   * Convert number to a scheme permissions string
   * @param {Number} permissions
   */
  static numberToPermissionsString(permissions) {
    if (!permissions) { return "0x00000000"; }
    return `0x${("00000000" + permissions.toString(16)).substr(-8)}`;
  }
}

/**
 * static members
 */
Utils._web3 = undefined;
Utils._alreadyTriedAndFailed = false;
