const {series, crossEnv, concurrent, rimraf, copy, ifWindows, runInNewWindow, mkdirp} = require('nps-utils')
const env = require('env-variable')();
const joinPath = require('path.join');
const cwd = require('cwd')();
/**
 * environment variables you can use to configure stuff like migrateContracts
 */
const pathArcJs = env.pathArcJs || cwd;
const pathArcJsContracts = env.pathArcJsContracts || "./contracts";
const pathDaostackArcRepo = env.pathDaostackArcRepo || "../daostack";
const pathDaostackArcRepoContracts = env.pathDaostackArcRepoContracts || joinPath(pathDaostackArcRepo,"build/contracts");
const pathDaostackArcPackageContracts = "./node_modules/daostack-arc/build/contracts";
const pathDaostackArcTestrpcDb = "./testrpcDb";
const pathDaostackArcTestrpcDbZip = "./testrpcDb.zip";
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
      default: series(
        "nps lint",
        "nps test.automated"
      ),
      automated: "mocha --require babel-register --require chai --timeout 15000",
      watch:   'nps "test --watch"',
      debug:   'nps "test --debug"',
      bail:   'nps "test --bail"',
      testrpc: {
        /** the same command as is used by default by daostack-arc */
        run: `testrpc -l 6500000 --account=\"0x0191ecbd1b150b8a3c27c27010ba51b45521689611e669109e034fd66ae69621,9999999999999999999999999999999999999999999\" --account=\"0x00f360233e89c65970a41d4a85990ec6669526b2230e867c352130151453180d,9999999999999999999999999999999999999999999\" --account=\"0x987a26abca7432016104ce2f24ce639340e25afe06ac69f68791399e7a5d1028,9999999999999999999999999999999999999999999\" --account=\"0x89af34b1b7347834048b99423dad174a14bf14540d720d72c16ae92e94b987cb,9999999999999999999999999999999999999999999\" --account=\"0xc867be647eb2bc51e4c0d61066859875cf3634fe949b6f5f85c69ab90e485b37,9999999999999999999999999999999999999999999\" --account=\"0xefabcc2377dee5e51b5a9e65a3854aec85fbbec3cb584d8ad4f9679869fb33c6,9999999999999999999999999999999999999999999\"`
      },
      testrpcDb: {
        /**
         * Full workflow to create custom contracts:
         * 
         *    npm start test.testrpcDb.clean
         * 
         * The following will open a window with testrpc running in it.
         * 
         *    npm start test.testrpcDb.runAsync
         * 
         * This will go into the daostack-arc repo, at pathDaostackArcRepo, and do a truffle migrate for the
         * network given by env.ETH_ENV.
         * 
         *    npm start test.testrpcDb.create
         * 
         * If you won't want to commit the data you just migrated, you can skip the next two steps.
         * But keep in mind that at minimum, everytime we integrate with and commit with a new version of daostack-arc, we *must*
         * regenerate this testrpc database so that it contains the associated contracts
         * for use by Travis in running the automated tests.
         * 
         *    Kill the window in which testrpc is running. (You have to do that yourself, in your OS.)
         * 
         * Zip up the virgin testrpc database that was just created, before anything changes.
         * The zip will fail in any case if testrpc is still running against it. The zip is used by
         * Travis automated tests when you commit the changes.
         * 
         *    npm start test.testrpcDb.zip
         * 
         * Now fetch the newly-compiled contract .json files from the daostack-arc repo into the local
         * installation of the daostack-arc package which is where the build expects the contracts to be:
         * 
         *    npm start migrateContracts.fetchContractsFromDaoStackRepo
         * 
         * Now we are ready to build daostack-arc-js using the newly-deployed contracts:
         * 
         *    npm start build (or deploy.pack or deploy.publish)
         * 
         * If you want you can run the tests:
         * 
         *    npm start test.testrpcDb.runAsync
         *    npm start test
         * 
         * (Note that Travis will use test.testrpcDb.run when it runs the tests.)
         */
        run: `testrpc --db ${pathDaostackArcTestrpcDb} --networkId 1512051714758 --mnemonic "behave pipe turkey animal voyage dial relief menu blush match jeans general"`
        , runAsync: series(
          mkdirp(pathDaostackArcTestrpcDb),          
          runInNewWindow(`npm start test.testrpcDb.run`)
        )
        , create: series(
          'nps migrateContracts.cleanDaoStackRepo'
          , 'nps migrateContracts'
        )
        , clean: rimraf(pathDaostackArcTestrpcDb)
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
     * It will look in pathDaostackArcRepo for the daostack repo, pathArcJs for daostack-arc-js (this library)
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
