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

const pathArcJsContracts = env.pathArcJsContracts || joinPath(pathArcJs, "node_modules/daostack-arc/build/contracts");
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
    },
    build: {
      default: series(
        rimraf('dist'),
        "babel lib --presets babel-preset-es2015 --out-dir dist"
        )
    },
    /**
     * deployContracts requires that you have installed the daostack-arc repo, or equivalent,
     * wherein the .sol and deploy*.js files can be found in the folder structure
     * that truffle expects.
     * 
     * Will look in pathDaostackArc for daostack-arc, pathArcJs for arc-js (this library)
     * 
     * Will delete and replace all the contract js files in pathDaostackArcContracts
     * 
     * The final output goes to the daostack-arc node_modules folder
     */
    deployContracts: {
      default: series(
        `cd ${pathDaostackArc}`,
        `truffle migrate ${network ? `--network ${network}` : ''} --reset`,
        `cd ${pathArcJs}`, 
        // everything expects to find the contracts in node_modules, so copy them to there
        copy(`${joinPath(pathDaostackArcContracts, "*")}  ${pathArcJsContracts}`)
      )
      , clean: series(
        rimraf(pathDaostackArcContracts,'*'),
        "nps deployContracts"
      )
    }
  }
}
