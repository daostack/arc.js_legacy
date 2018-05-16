const arcJsDeployer = require("../dist/migrations/2_deploy_alchemy").arcJsDeployer;

/* eslint-disable no-console */

/**
 * Migration callback
 */
module.exports = (deployer) => {
  try {
    arcJsDeployer(web3, artifacts, deployer);
  } catch (ex) {
    console.log(ex);
  }
};
