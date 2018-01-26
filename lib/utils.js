// some utility functions
import { config } from "./config.js";
const TruffleContract = require("truffle-contract");

import Web3 from "web3";
const abi = require("ethereumjs-abi");

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const NULL_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

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
export function requireContract(contractName) {
  try {
    const myWeb3 = getWeb3();

    const artifact = require(`../migrated_contracts/${contractName}.json`);
    const contract = new TruffleContract(artifact);

    contract.setProvider(myWeb3.currentProvider);
    contract.defaults({
      from: getDefaultAccount(),
      gas: config.get("gasLimit")
    });
    return contract;
  } catch (ex) {
    return undefined;
  }
}

let _web3;
let alreadyTriedAndFailed = false;

/**
 * throws an exception when web3 cannot be initialized or there is no default client
 */
export function getWeb3() {
  if (_web3) {
    return _web3;
  }

  let preWeb3;

  if (typeof web3 !== "undefined") {
    // e.g. set by truffle in test and migration environments, or MetaMask in the window
    preWeb3 = new Web3(web3.currentProvider);
  } else if (alreadyTriedAndFailed) {
    // then avoid time-consuming and futile retry
    throw new Error("already tried and failed");
  } else {
    preWeb3 = new Web3(
      new Web3.providers.HttpProvider(config.get("providerUrl"))
    );
  }

  if (!preWeb3) {
    alreadyTriedAndFailed = true;
    throw new Error("web3 not found");
  }

  if (typeof window !== "undefined") {
    // Add to window for easy use in the console
    window.web3 = preWeb3;
  }

  return (_web3 = preWeb3);
}

/**
 * @param tx The transaction
 * @param argName The name of the property whose value we wish to return, from  the args object: tx.logs[index].args[argName]
 * @param eventName Overrides index, identifies which log, where tx.logs[n].event  === eventName
 * @param index Identifies which log, when eventName is not given
 */
export function getValueFromLogs(tx, arg, eventName, index = 0) {
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

  if (eventName !== undefined) {
    for (let i = 0; i < tx.logs.length; i++) {
      if (tx.logs[i].event === eventName) {
        index = i;
        break;
      }
    }
    if (index === undefined) {
      const msg = `getValueFromLogs: There is no event logged with eventName ${eventName}`;
      throw new Error(msg);
    }
  } else if (index === undefined) {
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
export function getDefaultAccount() {
  const web3 = getWeb3();
  const defaultAccount = (web3.eth.defaultAccount =
    web3.eth.defaultAccount || web3.eth.accounts[0]);

  if (!defaultAccount) {
    throw new Error("eth.accounts[0] is not set");
  }

  // TODO: this should be the default sender account that signs the transactions
  return defaultAccount;
}

/**
 * Hash a string the same way solidity does, and to a format that will be properly translated into a bytes32 that solidity expects
 * @param str a string
 */
export function SHA3(str) {
  const result = `0x${abi.soliditySHA3(["string"], [str]).toString("hex")}`;
  return result;
}

export const ExtendTruffleContract = superclass =>
  class {
    constructor(contract) {
      superclass.setProvider(getWeb3().currentProvider);
      superclass.defaults({
        from: getDefaultAccount(),
        gas: config.get("gasLimit")
      });
      this.contract = contract;
      for (const i in this.contract) {
        if (this[i] === undefined) {
          this[i] = this.contract[i];
        }
      }
    }

    static async new() {
      return superclass.new().then(
        contract => {
          return new this(contract);
        },
        ex => {
          throw ex;
        }
      );
    }

    static async at(address) {
      return superclass.at(address).then(
        contract => {
          return new this(contract);
        },
        ex => {
          throw ex;
        }
      );
    }

    static async deployed() {
      return superclass.deployed().then(
        contract => {
          return new this(contract);
        },
        ex => {
          throw ex;
        }
      );
    }

    /**
     * Call setParameters on this scheme.
     * Returns promise of parameters hash.
     * If there are any parameters, then this function must be overridden by the subclass to provide them.
     * @param overrides -- object with properties whose names are expected by the scheme to correspond to parameters.  Overrides the defaults.
     *
     * Should have the following properties:
     *
     *  for all:
     *    voteParametersHash
     *    votingMachine -- address
     *
     *  for ContributionReward:
     *    orgNativeTokenFee -- number
     *    schemeNativeTokenFee -- number
     */
    async setParams(params) {
      params; // avoid lint error
      return await "";
    }

    async _setParameters(...args) {
      const parametersHash = await this.contract.getParametersHash(...args);
      await this.contract.setParameters(...args);
      return parametersHash;
    }

    /**
     * The subclass must override this for there to be any permissions at all, unless caller provides a value.
     */
    getDefaultPermissions(overrideValue) {
      return overrideValue || "0x00000000";
    }
  };
