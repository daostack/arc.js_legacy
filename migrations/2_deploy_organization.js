const arcJsDeployer = require("../dist/migrations/2_deploy_organization").arcJsDeployer;

/**
 * Migration callback
 */
module.exports = async (deployer) => {
  try {
    await arcJsDeployer(web3, artifacts, deployer);
  } catch (ex) {
    console.log(ex);
  }
};
