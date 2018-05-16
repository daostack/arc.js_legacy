
const migrationScript  = "../dist/migrations/2_deploy_organization";
//for alchemy needed contracts set migrationScript with "../dist/migrations/2_deploy_alchemy"
const arcJsDeployer = require(migrationScript).arcJsDeployer;


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
