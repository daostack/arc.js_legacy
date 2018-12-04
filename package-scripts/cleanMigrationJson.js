const fs = require("fs");

const migrationJson = require("../migration.json");

/**
 * Remove the DAO entries, not supporting the migrations database for now.
 */
for (let netName in migrationJson) {
  delete migrationJson[netName].dao;
}

let data = JSON.stringify(migrationJson, null, 2);

fs.writeFile("./migration.json", data, (err) => {
  if (err) throw err;
});
