const promisify = require("es6-promisify").promisify;
const arcForgeOrgGasLimit = require("./arcConstants.js").ARC_GAS_LIMIT;
/**
 * Defines some useful gas limit constants, provides some useful gasLimit-related utilities.
 *
 * Since this module needs to be usable in several different contexts, and cannot depend on doing a build
 * (because one of the contexts in which it is used is the script that itself does the builds), we're
 * putting this at the root level and writing it in straight low-common-denominator ES5 javascript.
 */
const gasLimitsConfig =
{
  /**
   * The gas limit used by Arc to forge a DAO with foundersInGasLimitArc founders
   */
  "gasLimit_arc": arcForgeOrgGasLimit,
  /**
   * The amount of gas needed for each founder when creating a DAO
   */
  "gasLimit_perFounder": 50000,
  /**
   * How many founders are already accounted-for in the gaslimit from Arc
   */
  "foundersInGasLimitArc": 3,
  /**
   * Gas limit sufficient (though not necessarily optimal) for all other transactions
   * besides creating DAOs
   */
  "gasLimit_runtime": 4543760,
};

/**
 * Compute a reasonable gasLimit for forging a DAO with the given number of founders.
 * @param {*} numberFounders 
 */
const computeForgeOrgGasLimit = function (numberFounders) {
  return gasLimitsConfig.gasLimit_arc +
    ((numberFounders - gasLimitsConfig.foundersInGasLimitArc) * gasLimitsConfig.gasLimit_perFounder);
};

/**
 * Returns promise of the maximum gasLimit that we dare to ever use, given the
 * current state of the chain.
 * @param {} web3 
 */
const computeMaxGasLimit = function (web3) {
  return promisify((callback) => web3.eth.getBlock("latest", false, callback))()
    .then((block) => {
      return block.gasLimit - 100000;
    });
}

module.exports = {
  computeForgeOrgGasLimit: computeForgeOrgGasLimit,
  computeMaxGasLimit: computeMaxGasLimit,
  gasLimitsConfig: gasLimitsConfig,
};
