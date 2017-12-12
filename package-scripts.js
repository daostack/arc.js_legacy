const {series, crossEnv, concurrent, rimraf, copy, ifWindows} = require('nps-utils')
const env = require('env-variable')();
const joinPath = require('path.join');
const cwd = require('cwd')();

console.log(`cwd: ${cwd}`);

/**
 * environment variables you can use to configure stuff like deployContracts
 */
const pathArcJs = env.pathArcJs || cwd;
console.log(`pathArcJs: ${pathArcJs}`);

const pathArcJsContracts = env.pathArcJsContracts || joinPath(pathArcJs, "/contracts");
console.log(`pathArcJsContracts: ${pathArcJsContracts}`);

const pathDaostackArc = env.pathDaostackArc || "../daostack-arc";
console.log(`pathDaostackArc: ${pathDaostackArc}`);

const pathDaostackArcContracts = env.pathDaostackArcContracts || joinPath(pathDaostackArc,"build/contracts");
console.log(`pathDaostackArcContracts: ${pathDaostackArcContracts}`);

const network = env.ETH_ENV;
console.log(`network: ${network ? network: "testrpc"}`);

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
      bail:   'nps "test --bail"'
      // warning: this is copied from daostack-arc and could become obsolete.  It is primarily here for travis tests
      // , testrpc: "testrpc -l 6500000 --account=\"0x0191ecbd1b150b8a3c27c27010ba51b45521689611e669109e034fd66ae69621,9999999999999999999999999999999999999999999\" --account=\"0x00f360233e89c65970a41d4a85990ec6669526b2230e867c352130151453180d,9999999999999999999999999999999999999999999\" --account=\"0x987a26abca7432016104ce2f24ce639340e25afe06ac69f68791399e7a5d1028,9999999999999999999999999999999999999999999\" --account=\"0x89af34b1b7347834048b99423dad174a14bf14540d720d72c16ae92e94b987cb,9999999999999999999999999999999999999999999\" --account=\"0xc867be647eb2bc51e4c0d61066859875cf3634fe949b6f5f85c69ab90e485b37,9999999999999999999999999999999999999999999\" --account=\"0xefabcc2377dee5e51b5a9e65a3854aec85fbbec3cb584d8ad4f9679869fb33c6,9999999999999999999999999999999999999999999\"",
    },
    build: {
      default: series(
        rimraf('dist'),
        "babel lib --presets babel-preset-es2015 --out-dir dist",
        "nps build.fetchDaoStackContractsFromNodeModules"
        )
      /**
       * fetch the countracts out of node_modules/daostack-arc into our local contracts folder
       * which is where we look for them at runtime.
       */
      , fetchDaoStackContractsFromNodeModules: series(
        rimraf("./contracts"),
        copy(`./node_modules/daostack-arc/build/contracts/* ${pathArcJsContracts}`)
      )
      /**
       * deployContracts requires that you have installed the daostack-arc repo, or equivalent,
       * wherein the .sol and deploy*.js files can be found in the folder structure
       * that truffle expects.
       * 
       * Will look in pathDaostackArc for daostack-arc, pathArcJs for arc-js (this library)
       * 
       * Will delete and  replace all the contract js files in pathDaostackArcContracts
       */
      , deployContracts: series(
        `cd ${pathDaostackArc}`,
        rimraf(pathDaostackArcContracts,'*'),
        `truffle migrate ${network ? `--network ${network}` : ''} --reset --compile-all`,
        `cd ${pathArcJs}`, 
        // the build expects to find the contracts in node_modules, so copy them to there
        copy(`${joinPath(pathDaostackArc, "/build/contracts/*")}  ${joinPath(pathArcJs, "node_modules/daostack-arc/build/contracts")}`)
      )
    },
    publish: {
      default: series(
        "nps build",
        "npm publish",
      ),
      pack: series(
        "nps build",
        "npm pack"
      )      
    }
  },
}
