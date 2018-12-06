const DAOstackMigration = require('@daostack/migration');

const output = process.argv[2];

DAOstackMigration.migrateBase({
  output: output,
  force: true
});
