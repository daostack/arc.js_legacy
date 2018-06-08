const arcJsDeployer = require("../dist/migrations/3_deploy_schemes").arcJsDeployer;

/* eslint-disable no-console */

/**
 * Migration callback
 */
module.exports = (deployer) => {
  try {
    arcJsDeployer(web3, artifacts, deployer, global.arcjsMigration);
  } catch (ex) {
    console.log(ex);
  }
};
