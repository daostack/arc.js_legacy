/* eslint-disable quotes */
const fs = require("fs");
const {
  series,
  //  crossEnv,
  //  concurrent,
  rimraf,
  copy,
  //  ifWindows,
  runInNewWindow,
  mkdirp
} = require("nps-utils");
const env = require("env-variable")();
const joinPath = require("path.join");
const cwd = require("cwd")();
const config = require('./lib/config.js').config;
/**
 * environment variables you can use to configure stuff like migrateContracts
 */
const pathArcJsRoot = env.pathArcJsRoot || cwd;

const pathArcJsContracts =
  env.pathArcJsContracts || joinPath(pathArcJsRoot, "migrated_contracts");

const pathDaostackArcRepo =
  env.pathDaostackArcRepo ||
  joinPath(pathArcJsRoot, "node_modules/daostack-arc");

const pathDaostackArcGanacheDb = joinPath(pathArcJsRoot, "ganacheDb");
const pathDaostackArcGanacheDbZip = joinPath(pathArcJsRoot, "ganacheDb.zip");

const network = env.network || config.get('network');

// this is needed to force travis to use our modified version of truffle
const truffleIsInternal = fs.existsSync(joinPath("node_modules", "truffle-core-migrate-without-compile"));
const truffleCommand = `node ${joinPath(truffleIsInternal ? "node_modules" : "../", "truffle-core-migrate-without-compile", "cli")}`;

module.exports = {
  scripts: {
    lint: {
      default: "eslint .",
      fix: 'nps "lint --fix ."'
    },
    test: {
      default: series("nps lint", "nps test.automated"),
      automated: {
        default: "mocha --require babel-register --require babel-polyfill --require chai --timeout 15000",
        bail: 'nps "test.automated --bail"'
      },
      watch: 'nps "test.automated --watch"',
      bail: 'nps test.automated.bail',
      ganache: {
        run: `ganache-cli -l ${config.get("gasLimit")} --account="0x0191ecbd1b150b8a3c27c27010ba51b45521689611e669109e034fd66ae69621,9999999999999999999999999999999999999999999" --account="0x00f360233e89c65970a41d4a85990ec6669526b2230e867c352130151453180d,9999999999999999999999999999999999999999999" --account="0x987a26abca7432016104ce2f24ce639340e25afe06ac69f68791399e7a5d1028,9999999999999999999999999999999999999999999" --account="0x89af34b1b7347834048b99423dad174a14bf14540d720d72c16ae92e94b987cb,9999999999999999999999999999999999999999999" --account="0xc867be647eb2bc51e4c0d61066859875cf3634fe949b6f5f85c69ab90e485b37,9999999999999999999999999999999999999999999" --account="0xefabcc2377dee5e51b5a9e65a3854aec85fbbec3cb584d8ad4f9679869fb33c6,9999999999999999999999999999999999999999999"`,
        runAsync: runInNewWindow("npm start test.ganache.run")
      },
      ganacheDb: {
        /**
         * ganacheDb scripts are handy for doing development against ganache, enabling you to
         * take a snapshot (the database of the chain at any point, such as right after migration,
         * and easily reuse it.
         *
         * Follow these steps to set up the database:
         *
         * This can take a long time as there may be thousands of files to delete:
         *
         *    npm start test.ganacheDb.clean
         *
         * The following will open a window with ganache running in it:
         *
         *    npm start test.ganacheDb.runAsync
         *
         * This will migrate the contracts and pull them into the project where they need to be:
         *
         *    npm start migrateContracts
         *
         * Now zip database for later reuse.
         * But first you must close the window in which ganache is running.
         * (You must do this yourself, in your OS.)
         *
         *    npm start test.ganacheDb.zip
         *
         * Now you can restart ganache against the new database:
         *
         *    npm start test.ganacheDb.runAsync
         *
         * And run tests or your application:
         *
         *    npm start test
         */
        run: `ganache-cli --db ${pathDaostackArcGanacheDb} -l ${config.get("gasLimit")} --networkId 1512051714758 --mnemonic "behave pipe turkey animal voyage dial relief menu blush match jeans general"`,
        runAsync: series(
          mkdirp(pathDaostackArcGanacheDb),
          runInNewWindow("npm start test.ganacheDb.run")
        ),
        clean: rimraf(pathDaostackArcGanacheDb),
        zip: `node ./package-scripts/archiveGanacheDb.js ${pathDaostackArcGanacheDbZip} ${pathDaostackArcGanacheDb}`,
        unzip: series(
          "nps test.ganacheDb.clean",
          `node ./package-scripts/unArchiveGanacheDb.js  ${pathDaostackArcGanacheDbZip} ${pathArcJsRoot}`
        ),
        restoreFromZip: series(
          "nps test.ganacheDb.clean",
          "nps test.ganacheDb.unzip"
        )
      }
    },
    build: {
      default: series(
        rimraf(joinPath(pathArcJsRoot, "dist")),
        mkdirp(joinPath(pathArcJsRoot, "dist")),
        copy(`${joinPath(pathArcJsRoot, "lib", "*")} ${joinPath(pathArcJsRoot, "dist")}`)
      )
    },
    deploy: {
      pack: series("nps build", "npm pack"),
      publish: series("nps build", "npm publish")
    },
    /**
     *
     * Typical workflow for migrating to ganache (Ganache):
     *
     * Fire up ganache (Ganache) in a separate window.
     *
     *    npm start test.ganache.runAsync
     *
     * If the window didn't fire up in your OS, then run this
     * in a separate window of your own creation:
     *
     *    npm start test.ganache.run
     *
     * Then run the migrations:
     *
     *    npm start migrateContracts
     *
     * And you're ready to run arc-js tests or your application against arc-js.
     *
     * Notes:
     *
     * If you want to migrate to another network, kovan for example:
     *
     *    Set the "network" config value to "kovan" (see "Arc Configuration" in the root readme.md)
     *    Start a local network node listening at http://127.0.0.1:8584
     *    Run:  npm start migrateContracts
     *
     * To deploy to the mainnet, Set the "network" config value to "live" and proceed as above.
     * (see "Arc Configuration" in the root readme.md)
     */
    migrateContracts: {
      /**
       * Migrate contracts.
       *
       * Truffle will merge this migration with whatever previous ones are already present in the contract json files.
       *
       * Run migrateContracts.fetchFromArc first if you want to start with fresh unmigrated contracts from daostack-arc.
       */
      default: `${truffleCommand} migrate --contracts_build_directory ${pathArcJsContracts} --without-compile ${network ? `--network ${network}` : "ganache"}`,
      /**
       * Clean the outputted contract json files, optionally andMigrate.
       *
       * IMPORTANT! Only do this if you aren't worried about losing
       * previously-performed migrations to other networks.  By cleaning, you'll lose them, starting
       * from scratch.  Otherwise, truffle will merge your migrations into whatever  previous
       * ones exist.
       */
      clean: {
        default: rimraf(joinPath(pathArcJsContracts, "*")),
        andMigrate: series("nps migrateContracts.clean", "nps migrateContracts.fetchFromArc", "nps migrateContracts")
      },
      /**
       * Fetch the unmigrated contract json files from DAOstack-Arc.
       * Run this only when we want to start with fresh unmigrated contracts from daostack-arc.
       */
      fetchFromArc: copy(`${joinPath(pathDaostackArcRepo, "build", "contracts", "*")}  ${pathArcJsContracts}`)
    }
  }
};
