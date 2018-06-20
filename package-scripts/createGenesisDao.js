const GenesisDaoCreator = require("../dist/scripts/createGenesisDao.js").GenesisDaoCreator;
const Utils = require("../dist/utils.js").Utils;
const env = require("env-variable")();

Utils.getWeb3()
  .then((web3) => {

    const createGenesisDao = new GenesisDaoCreator(web3, env.arcjs_network || "ganache");

    return createGenesisDao.forge(env.arcjs_foundersConfigurationLocation)
      .then((daoCreationState) => {
        return createGenesisDao.setSchemes(daoCreationState).then(() => {
          console.log(`Successfully created ${daoCreationState.orgName}`);
        })
          .catch((ex) => {
            console.log(`Error setting schemes: ${daoCreationState.orgName}: ${ex}`);
          });
      })
      .catch((ex) => {
        console.log(`Error forging org: ${ex}`);
      });
  });
