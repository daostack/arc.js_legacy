const glob = require("glob");
const path = require("path");
const fs = require("fs");

/**
 * "touch" the migrated contracts to prevent trffle migrate from trying to compile them
 */
console.log(`touching contracts...`);

/* eslint-disable no-console */
const files = glob.sync('./migrated_contracts/*.json', {
  nodir: true
});

const futureDate = "2300-01-01T00:00:00.00Z";

files.map((file) => {
  const abi = require(`../migrated_contracts/${path.basename(file)}`);
  abi.updatedAt = futureDate;
  let data = JSON.stringify(abi, null, 2);
  fs.writeFile(file, data, (err) => {
    if (err) throw err;
  });
});
