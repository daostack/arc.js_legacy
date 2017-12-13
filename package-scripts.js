const {series, crossEnv, concurrent, rimraf, copy, ifWindows} = require('nps-utils')
const env = require('env-variable')();
const joinPath = require('path.join');
const cwd = require('cwd')();

/**
 * environment variables you can use to configure stuff like deployContracts
 */
const pathArcJs = env.pathArcJs || cwd;
const pathArcJsContracts = env.pathArcJsContracts || joinPath(pathArcJs, "/contracts");
const pathDaostackArcRepo = env.pathDaostackArcRepo || "../daostack-arc";
const pathDaostackArcRepoContracts = env.pathDaostackArcRepoContracts || joinPath(pathDaostackArcRepo,"build/contracts");
const pathDaostackArcPackageContracts = joinPath(pathArcJs,"node_modules/daostack-arc/build/contracts");
const network = env.ETH_ENV;

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
         * important, don't use this Db regularly or it will grow far too large for git (consider zipping it up?)
         * Only use it for creating a minimal DB containing the deployed contracts for use in Travis tests.
         */
        run: 'testrpc --db .\testrpc --networkId 1512051714758 --mnemonic "behave pipe turkey animal voyage dial relief menu blush match jeans general',
        create: series(
          'nps test.testrpcDb.clean',
          'nps deployContracts'
        ),
        clean: rimraf("./testrpc/*")
      }
    },
    build: {
      default: series(
        rimraf('dist'),
        "nps build.fetchDaoStackContractsFromNodeModules",
        "babel lib --presets babel-preset-es2015 --out-dir dist"
        )
      /**
       * fetch the countracts out of node_modules/daostack-arc into our local contracts folder
       * which is how we package them and where we look for them at runtime.
       */
      , fetchDaoStackContractsFromNodeModules: series(
        rimraf(joinPath(pathArcJsContracts, "*")),
        copy(`${joinPath(pathDaostackArcPackageContracts, "*")} ${pathArcJsContracts}`)
      )
    },
    deploy: {
      pack: series(
        "nps build",
        "npm pack"
      )
    },
    /**
     * deployContracts requires that you have installed the daostack-arc repo, or equivalent,
     * wherein the .sol and deploy*.js files can be found in the folder structure
     * that truffle expects.
     * 
     * It will look in pathDaostackArcRepo for daostack-arc, pathArcJs for arc-js (this library)
     * 
     * It delete and replace all the contract js files in pathDaostackArcRepoContracts
     * 
     * The final output goes to the daostack-arc node_modules folder.  Thereafter, to use the new contracts with tests,
     * to publish or pack, you need to run "npm start build", or at least "npm start build.fetchDaoStackContractsFromNodeModules"
     */
    deployContracts: {
      default: series(
        // "console.log(`cwd: ${cwd}`)"
          console.log(`network: ${network ? network: "testrpc"}`)
        , "console.log(`pathArcJs: ${pathArcJs}`)"
        , "console.log(`pathDaostackArcRepo: ${pathDaostackArcRepo}`)"
        // "console.log(`pathArcJsContracts: ${pathArcJsContracts}`)",
        // "console.log(`pathDaostackArcRepoContracts: ${pathDaostackArcRepoContracts}`)",
        , `cd ${pathDaostackArcRepo}`
        , `truffle migrate ${network ? `--network ${network}` : ''}`
        , `cd ${pathArcJs}`
        , 'nps deplyContracts.clean'
        // our build expects to find the contracts in node_modules, so copy them to there
        , copy(`${joinPath(pathDaostackArcRepoContracts, "*")}  ${pathDaostackArcPackageContracts}`)
      )
      , clean: rimraf(joinPath(pathDaostackArcRepoContracts,'*'))
    }
  }
}
