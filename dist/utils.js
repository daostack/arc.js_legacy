'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendTruffleContract = exports.NULL_HASH = exports.NULL_ADDRESS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // some utility functions


exports.requireContract = requireContract;
exports.getWeb3 = getWeb3;
exports.getValueFromLogs = getValueFromLogs;
exports.getDefaultAccount = getDefaultAccount;
exports.SHA3 = SHA3;

var _config = require('./config.js');

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TruffleContract = require('truffle-contract');

var abi = require('ethereumjs-abi');

var NULL_ADDRESS = exports.NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
var NULL_HASH = exports.NULL_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';

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
function requireContract(contractName) {
  try {
    var myWeb3 = getWeb3();

    var artifact = require('../contracts/' + contractName + '.json');
    var contract = new TruffleContract(artifact);

    contract.setProvider(myWeb3.currentProvider);
    contract.defaults({
      from: getDefaultAccount(),
      gas: _config.nconf.get('gasLimit')
    });
    return contract;
  } catch (ex) {
    return undefined;
  }
}

var _web3 = void 0;
var alreadyTriedAndFailed = false;

/**
 * throws an exception when web3 cannot be initialized or there is no default client
 */
function getWeb3() {

  if (typeof web3 !== 'undefined') {
    return web3; // e.g. set by truffle in test and migration environments
  } else if (_web3) {
    return _web3;
  } else if (alreadyTriedAndFailed) {
    // then avoid time-consuming and futile retry
    throw new Error("already tried and failed");
  }

  var preWeb3 = void 0;

  // already defined under `window`?
  if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
    // console.log(`Connecting via currentProvider`)
    preWeb3 = new _web2.default(windowWeb3.currentProvider);
  } else {
    // console.log(`Connecting via http://localhost:8545`)
    preWeb3 = new _web2.default(new _web2.default.providers.HttpProvider(_config.nconf.get('daostack.providerUrl')));
  }

  if (!preWeb3) {
    alreadyTriedAndFailed = true;
    throw new Error("web3 not found");
  }

  return _web3 = preWeb3;
}

/**
 * @param tx The transaction
 * @param argName The name of the property whose value we wish to return, from  the args object: tx.logs[index].args[argName]
 * @param eventName Overrides index, identifies which log, where tx.logs[n].event  === eventName
 * @param index Identifies which log, when eventName is not given
 */
function getValueFromLogs(tx, arg, eventName) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

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
   *     transactionHash: '0x999e51b4124371412924d73b60a0ae1008462eb367db45f8452b134e5a8d56c8',
   *     blockHash: '0xe35f7c374475a6933a500f48d4dfe5dce5b3072ad316f64fbf830728c6fe6fc9',
   *     blockNumber: 294,
   *     address: '0xd6a2a42b97ba20ee8655a80a842c2a723d7d488d',
   *     type: 'mined',
   *     event: 'NewOrg',
   *     args: { _avatar: '0xcc05f0cde8c3e4b6c41c9b963031829496107bbb' } } ]
   */
  if (!tx.logs || !tx.logs.length) {
    throw new Error('getValueFromLogs: Transaction has no logs');
  }

  if (eventName !== undefined) {
    for (var i = 0; i < tx.logs.length; i++) {
      if (tx.logs[i].event === eventName) {
        index = i;
        break;
      }
    }
    if (index === undefined) {
      var msg = 'getValueFromLogs: There is no event logged with eventName ' + eventName;
      throw new Error(msg);
    }
  } else if (index === undefined) {
    index = tx.logs.length - 1;
  }
  if (tx.logs[index].type !== 'mined') {
    var _msg = 'getValueFromLogs: transaction has not been mined: ' + tx.logs[index].event;
    throw new Error(_msg);
  }
  var result = tx.logs[index].args[arg];

  if (!result) {
    var _msg2 = 'getValueFromLogs: This log does not seem to have a field "' + arg + '": ' + tx.logs[index].args;
    throw new Error(_msg2);
  }
  return result;
}

/**
 * side-effect is to set web3.eth.defaultAccount.
 * throws an exception on failure.
 */
function getDefaultAccount() {
  var web3 = getWeb3();
  var defaultAccount = web3.eth.defaultAccount = web3.eth.defaultAccount || web3.eth.accounts[0];

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
function SHA3(str) {
  var result = '0x' + abi.soliditySHA3(["string"], [str]).toString('hex');
  // console.log("SHA3: " + result);
  return result;
}

var ExtendTruffleContract = exports.ExtendTruffleContract = function ExtendTruffleContract(superclass) {
  return function () {
    function _class(contract) {
      _classCallCheck(this, _class);

      this.contract = contract;
      for (var i in this.contract) {
        if (this[i] === undefined) {
          this[i] = this.contract[i];
        }
      }
      // for (var prop in this.contract) {
      //   if (!this.hasOwnProperty(prop)) {
      //     this[prop] = superclass[prop];
      //   }
      // }
    }

    _createClass(_class, [{
      key: 'setParams',


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
      // eslint-disable-next-line no-unused-vars
      value: async function setParams(params) {
        return await '';
      }
    }, {
      key: '_setParameters',
      value: async function _setParameters() {
        var _contract, _contract2;

        var parametersHash = await (_contract = this.contract).getParametersHash.apply(_contract, arguments);
        await (_contract2 = this.contract).setParameters.apply(_contract2, arguments);
        return parametersHash;
      }

      /**
       * The subclass must override this for there to be any permissions at all, unless caller provides a value.
       */

    }, {
      key: 'getDefaultPermissions',
      value: function getDefaultPermissions(overrideValue) {
        return overrideValue || '0x00000000';
      }
    }], [{
      key: 'new',
      value: async function _new() {
        var _this = this;

        return superclass.new().then(function (contract) {
          return new _this(contract);
        }, function (ex) {
          throw ex;
        });
      }
    }, {
      key: 'at',
      value: async function at(address) {
        var _this2 = this;

        return superclass.at(address).then(function (contract) {
          return new _this2(contract);
        }, function (ex) {
          throw ex;
        });
      }
    }, {
      key: 'deployed',
      value: async function deployed() {
        var _this3 = this;

        return superclass.deployed().then(function (contract) {
          return new _this3(contract);
        }, function (ex) {
          throw ex;
        });
      }
    }]);

    return _class;
  }();
};