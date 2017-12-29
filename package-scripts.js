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
      watch:   'nps "test.automated --watch"',
      debug:   'nps "test.automated --debug"',
      bail:   'nps "test.automated --bail"',
      testrpc: {
        /** the same command as is used by default by daostack-arc */
        run: `testrpc -l 6500000 --account=\"0x0191ecbd1b150b8a3c27c27010ba51b45521689611e669109e034fd66ae69621,9999999999999999999999999999999999999999999\" --account=\"0x00f360233e89c65970a41d4a85990ec6669526b2230e867c352130151453180d,9999999999999999999999999999999999999999999\" --account=\"0x987a26abca7432016104ce2f24ce639340e25afe06ac69f68791399e7a5d1028,9999999999999999999999999999999999999999999\" --account=\"0x89af34b1b7347834048b99423dad174a14bf14540d720d72c16ae92e94b987cb,9999999999999999999999999999999999999999999\" --account=\"0xc867be647eb2bc51e4c0d61066859875cf3634fe949b6f5f85c69ab90e485b37,9999999999999999999999999999999999999999999\" --account=\"0xefabcc2377dee5e51b5a9e65a3854aec85fbbec3cb584d8ad4f9679869fb33c6,9999999999999999999999999999999999999999999\"`
      },
      testrpcDb: {
        /**
         * Full workflow to create custom contracts.  This can take a long time as there may
         * be thousands of files to delete.
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
         * If the contracts haven't for practical purposes changed, you can skip the next two steps.
         * Otherwise we must regenerate this testrpc database so that Travis tests will be running against
         * the correct contracts.
         * 
         *    Kill the window in which testrpc is running. (You have to do that yourself, in your OS.)
         * 
         * Zip up the virgin testrpc database that was just created, before anything changes.
         * The zip will fail in any case if testrpc is still running against it. The zip is used by
         * Travis automated tests when you commit the changes.
         * 
         *    npm start test.testrpcDb.zip
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
          'nps migrateContracts.cleanDaoStackRepoContracts'
          , 'nps migrateContracts.andFetch'
        )
        , clean: rimraf(pathDaostackArcTestrpcDb)
        , zip: `node ./package-scripts/archiveTestrpcDb.js ${pathDaostackArcTestrpcDbZip} ${pathDaostackArcTestrpcDb}`
        , unzip: `node ./package-scripts/unArchiveTestrpcDb.js  ${pathDaostackArcTestrpcDbZip} ${pathArcJs}`
        , restoreFromZip: series(
          'nps test.testrpcDb.clean'
          , 'nps test.testrpcDb.unzip'
        )
      }
    },
    build: {
      default: series(
          rimraf('dist')
         , "babel lib --presets babel-preset-es2015 --out-dir dist"
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
     * The final output goes to the local contracts folder after running migrateContracts.fetchContractsFromDaoStackRepo.
     */
    , migrateContracts: {
      default: series(
          `cd ${pathDaostackArcRepo}`
        , `truffle migrate ${network ? `--network ${network}` : ''}`
        , `cd ${pathArcJs}`
      )
      , cleanDaoStackRepoContracts: rimraf(joinPath(pathDaostackArcRepoContracts,'*'))
      , cleanArcContracts: rimraf(joinPath(pathArcJsContracts,'*'))
      /**
       * Fetch the newly-compiled contract .json files from the daostack-arc repo into the local
       * contracts folder which is where the code expects to find them.
       */
      , fetchContractsFromDaoStackRepo: series(
        'nps migrateContracts.cleanArcContracts'
        , copy(`${joinPath(pathDaostackArcRepoContracts, "*")}  ${pathArcJsContracts}`)
      )
      , andFetch: series(
        "nps migrateContracts",
        "nps migrateContracts.fetchContractsFromDaoStackRepo"
      )
    }
  }
}
