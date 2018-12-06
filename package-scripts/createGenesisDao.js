const GenesisDaoCreator = require("../dist/scripts/createGenesisDao.js").GenesisDaoCreator;
const Utils = require("../dist/utils.js").Utils;

Utils.getWeb3()
  .then((web3) => {
    const createGenesisDao = new GenesisDaoCreator(web3);
    return createGenesisDao.run()
      .catch((ex) => {
        console.log(`Error forging org: ${ex}`);
      });
  });
