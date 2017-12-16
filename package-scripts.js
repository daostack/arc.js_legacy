const {series, crossEnv, concurrent, rimraf, copy, ifWindows, runInNewWindow, mkdirp} = require('nps-utils')
const env = require('env-variable')();
const joinPath = require('path.join');
const cwd = require('cwd')();
/**
 * environment variables you can use to configure stuff like migrateContracts
 */
const pathArcJs = env.pathArcJs || cwd;
const pathArcJsContracts = env.pathArcJsContracts || joinPath(pathArcJs, "/contracts");
const pathDaostackArcRepo = env.pathDaostackArcRepo || "../daostack";
const pathDaostackArcRepoContracts = env.pathDaostackArcRepoContracts || joinPath(pathDaostackArcRepo,"build/contracts");
const pathDaostackArcPackageContracts = joinPath(pathArcJs,"node_modules/daostack-arc/build/contracts");
const pathDaostackArcTestrpcDb = joinPath(pathArcJs,"testrpcDb");
const pathDaostackArcTestrpcDbZip = joinPath(pathArcJs, 'testrpcDb.zip');
const network = env.ETH_ENV;

// "console.log(`cwd: ${cwd}`)"
// console.log(`network: ${network ? network: "testrpc"}`)
// console.log(`pathArcJs: ${pathArcJs}`)
// console.log(`pathDaostackArcRepo: ${pathDaostackArcRepo}`)
// console.log(`pathArcJsContracts: ${pathArcJsContracts}`),
// console.log(`pathDaostackArcRepoContracts: ${pathDaostackArcRepoContracts}`),

module.exports = {
  scripts: {
    lint: {
      default: "eslint .",
      fix: 'nps "lint --fix ."'
    },
    test: {
      default: "mocha --require babel-register --require chai --timeout 15000",
      watch:   'nps "test --watch"',
      debug:   'nps "test --debug"',
      bail:   'nps "test --bail"',
      testrpcDb: {
        /**
         * important, don't use this database regularly or it will grow far too large for git (consider zipping it up?)
         * Only use it for creating a minimal DB containing the deployed contracts for use in Travis tests.
         * THEREFORE, this will clean the database each time you run it.
         * 
         * Full workflow:
         *  npm start test.testrpcDb.clean
         *  npm start test.testrpcDb.runAsync  # this will open a window with testrpc running in it.
         *  npm start test.testrpcDb.create
         * 
         *  Kill the window in which testrpc is running -- we don't want any further changes to the database we just created.
         *  Good idea at this point, before anything changes,  might be to run:
         * 
         *  npm start test.testrpcDb.zip
         * 
         *  This will zip up the virgin testrpc database that was just created
         *  that will be used by travis automated tests (assuming you will want it to use the 
         *  data you just migrated).
         * 
         *  Now grab the .json contracts you just compiled and poke them where they need to be:
         * 
         *  npm start build (or pack or publish)
         * 
         * Note that Travis will use test.testrpcDb.run.
         */
        run: `testrpc --db ${pathDaostackArcTestrpcDb} --networkId 1512051714758 --mnemonic "behave pipe turkey animal voyage dial relief menu blush match jeans general"`
        , runAsync: runInNewWindow(`nps test.testrpcDb.run`)
        , create: series(
          'nps migrateContracts.cleanDaoStackRepo'
          , 'nps migrateContracts'
        )
        , clean: rimraf(joinPath(pathDaostackArcTestrpcDb, "*"))
        , zip: `node ./package-scripts/archiveTestrpcDb.js ${pathDaostackArcTestrpcDbZip} ${pathDaostackArcTestrpcDb}`
        , unzip: `node ./package-scripts/unArchiveTestrpcDb.js  ${pathDaostackArcTestrpcDbZip} ${pathArcJs}`
      }
    },
    build: {
      default: series(
          rimraf('dist')
        , "nps build.fetchDaoStackContractsFromNodeModules"
        , "babel lib --presets babel-preset-es2015 --out-dir dist"
        )
      /**
       * fetch the countracts out of node_modules/daostack-arc into our local contracts folder
       * which is how we package them and where we look for them at runtime.
       */
      , fetchDaoStackContractsFromNodeModules: series(
        mkdirp(pathArcJsContracts),
        rimraf(joinPath(pathArcJsContracts, "*")),
        copy(`${joinPath(pathDaostackArcPackageContracts, "*")} ${pathArcJsContracts}`)
      )
    },
    deploy: {
      pack: series(
        "nps build",
        "npm pack"
      )
      , publish: series(
        "nps build",
        "npm publish"
      )
    }
    /**
     * migrateContracts requires that you have installed the daostack-arc repo, or equivalent,
     * wherein the .sol and deploy*.js files can be found in the folder structure
     * that truffle expects.
     * 
     * It will look in pathDaostackArcRepo for the daostack repo, pathArcJs for arc-js (this library)
     * 
     * It wil delete and replace all the contract js files in pathDaostackArcRepoContracts
     * 
     * The final output goes to the daostack-arc node_modules folder.  Thereafter, to use the new contracts with tests,
     * to publish or pack, you need to run "npm start build", or at least "npm start build.fetchDaoStackContractsFromNodeModules"
     */
    , migrateContracts: {
      default: series(
          `cd ${pathDaostackArcRepo}`
        , `truffle migrate ${network ? `--network ${network}` : ''}`
        , `cd ${pathArcJs}`
      )
      , cleanDaoStackRepo: rimraf(joinPath(pathDaostackArcRepoContracts,'*'))
      , cleanDaoStackPackage: rimraf(joinPath(pathDaostackArcPackageContracts,'*'))
      /**
       * get contract.json files from the daostack repo and copy them into daostack-arc node_modules folder
       * from where we will grab them when building.  You might want to do this after running migrateContracts if 
       * you want to use the contracts you just deployed.  But if you use migrateContracts to create the 
       * testrpc database, then you may not care about the generated json files.
       */
      , fetchContractsFromDaoStackRepo: series(
        'nps migrateContracts.cleanDaoStackPackage'
        , copy(`${joinPath(pathDaostackArcRepoContracts, "*")}  ${pathDaostackArcPackageContracts}`)
      )
      , andFetch: series(
        "nps migrateContracts",
        "nps migrateContracts.fetchContractsFromDaoStackRepo"
      )
    }
  }
}
