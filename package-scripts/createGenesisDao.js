const GenesisDaoCreator = require("../dist/migrations/createGenesisDao.js").GenesisDaoCreator;
const Utils = require("../dist/utils.js").Utils;
const env = require("env-variable")();

Utils.getWeb3()
  .then((web3) => {

    const createGenesisDao = new GenesisDaoCreator(web3, env.arcjs_network || "ganache");

    return createGenesisDao.forge(env.arcjs_foundersConfigurationLocation)
      .then((daoCreationState) => {
        return createGenesisDao.setSchemes(daoCreationState);
      });
  });
