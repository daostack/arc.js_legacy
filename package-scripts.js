const {series, crossEnv, concurrent, rimraf, copy, ifWindows} = require('nps-utils')

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
    },
    build: {
      default: series(
        rimraf('dist'),
        "babel lib --presets babel-preset-es2015 --out-dir dist",
        "nps build.fetchContracts"
        )
      , fetchContracts: series(
        rimraf("./contracts"),
        copy("./node_modules/daostack-arc/build/contracts/* ./contracts")
      )
      , deployTestrpc: series(
        "cd ../daostack-arc",
        "truffle migrate",
        "cd ../arc-js", 
        copy("../daostack-arc/build/contracts/* ./node_modules/daostack-arc/build/contracts"),
        "nps build.fetchContracts"
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
