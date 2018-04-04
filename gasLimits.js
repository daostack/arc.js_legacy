/**
 * This is where we define the gas limit number for starting ganache, doing migrations and running
 * `DaoCreator.forgeOrg`.
 *
 * Since this module needs to be usable in several different contexts, and cannot depend on doing a build
 * (because one of the contexts in which is is used is the script that itself does the builds), we're
 * putting this at the root level and writing it in straight low-common-denominator ES5 javascript.
 */
const gasLimitsConfig =
  {
    /**
     * The gas limit used by Arc to create a DAO
     */
    "gasLimit_arc": 5300000,
    /**
     * The amount of gas needed for each founder when creating a DAO
     */
    "gasLimit_perFounder": 50000,
    /**
     * How many founders are already accounted-for in the gaslimit from Arc
     */
    "foundersInGasLimitArc": 3,
    /**
     * Gas limit appropriate for all other transactions besides creating DAOs
     */
    "gasLimit_runtime": 4543760,
  };

const computeGasLimit = function (numberFounders) {
  return gasLimitsConfig.gasLimit_arc +
    ((numberFounders - gasLimitsConfig.foundersInGasLimitArc) * gasLimitsConfig.gasLimit_perFounder);
};

module.exports = {
  computeGasLimit: computeGasLimit,
  gasLimitsConfig: gasLimitsConfig
};
