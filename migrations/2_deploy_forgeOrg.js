const arcJsDeployer = require("../dist/migrations/2_deploy_forgeOrg").arcJsDeployer;

/* eslint-disable no-console */

/**
 * Migration callback
 */
module.exports = (deployer) => {
  try {
    arcJsDeployer(web3, artifacts, deployer, false);
  } catch (ex) {
    console.log(ex);
  }
};
