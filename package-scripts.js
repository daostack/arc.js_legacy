/* eslint-disable quotes */
const fs = require("fs");
const {
  series,
  rimraf,
  copy,
  mkdirp
} = require("nps-utils");
const env = require("env-variable")();
const joinPath = require("path.join");
const cwd = require("cwd")();
const config = require("./config/default.json");

const runningInRepo = fs.existsSync(".git");
const pathArcJsRoot = cwd;

const pathNodeModules = runningInRepo ? joinPath(".", "node_modules") : joinPath("..", "..", "node_modules");

const pathDaostackArcRepo = runningInRepo ?
  joinPath(pathNodeModules, "@daostack", "arc") :
  joinPath("..", "arc");

const pathArcJsContracts = joinPath(pathArcJsRoot, "migrated_contracts");
const pathArcTest = joinPath(".", "test");
const pathArcTestBuild = joinPath(".", "test-build");
const pathArcDist = joinPath(".", "dist");
const pathDaostackArcGanacheDb = joinPath(".", "ganacheDb");
const pathDaostackArcGanacheDbZip = joinPath(".", "ganacheDb.zip");
const pathTypeScript = joinPath(pathNodeModules, "typescript/bin/tsc");

const network = env.arcjs_network || config.network || "ganache";

let truffleCommand;
// if (runningInRepo) {
// truffleCommand = `node ${joinPath("..", "..", "truffle-core", "cli")}`;
truffleCommand = `truffle`;
// } else { // assume we are running in application context
//   truffleCommand = `node ${joinPath("..", "..", "truffle-core-migrate-without-compile", "cli")}`;
// }

const ganacheGasLimit = 8000000; // something reasonably close to live
const ganacheCommand = `ganache-cli -l ${ganacheGasLimit}  --networkId 1512051714758 --account="0x8d4408014d165ec69d8cc9f091d8f4578ac5564f376f21887e98a6d33a6e3549,9999999999999999999999999999999999999999999" --account="0x2215f0a41dd3bb93f03049514949aaafcf136e6965f4a066d6bf42cc9f75a106,9999999999999999999999999999999999999999999" --account="0x6695c8ef58fecfc7410bf8b80c17319eaaca8b9481cc9c682fd5da116f20ef05,9999999999999999999999999999999999999999999" --account="0xb9a8635b40a60ad5b78706d4ede244ddf934dc873262449b473076de0c1e2959,9999999999999999999999999999999999999999999" --account="0x55887c2c6107237ac3b50fb17d9ff7313cad67757e44d1be5eb7bbf9fc9ca2ea,9999999999999999999999999999999999999999999" --account="0xb16a587ad59c2b3a3f47679ed2df348d6828a3bb5c6bb3797a1d5a567ce823cb,9999999999999999999999999999999999999999999"`;
const ganacheDbCommand = `ganache-cli --db ${pathDaostackArcGanacheDb} -l ${ganacheGasLimit} --networkId 1512051714758 --mnemonic "behave pipe turkey animal voyage dial relief menu blush match jeans general"`;

const migrationScriptExists = fs.existsSync(joinPath(".", "dist", "migrations", "2_deploy_schemes.js"));
const web3TypesExist = fs.existsSync(joinPath(".", "node_modules", "web3", "index.d.ts"));

module.exports = {
  scripts: {
    ganache: {
      default: "nps ganache.run",
      run: ganacheCommand
    },
    ganacheDb: {
      default: "nps ganacheDb.run",
      run: series(
        mkdirp(pathDaostackArcGanacheDb),
        ganacheDbCommand,
      ),
      clean: rimraf(pathDaostackArcGanacheDb),
      zip: `node ./package-scripts/archiveGanacheDb.js ${pathDaostackArcGanacheDbZip} ${pathDaostackArcGanacheDb}`,
      unzip: series(
        `node ./package-scripts/unArchiveGanacheDb.js  ${pathDaostackArcGanacheDbZip} ${pathArcJsRoot}`
      ),
      restoreFromZip: series(
        "nps ganacheDb.clean",
        "nps ganacheDb.unzip"
      )
    },
    lint: {
      default: series(
        "nps lint.code",
        "nps lint.test"
      ),
      code: {
        default: `tslint ${joinPath("custom_typings", "web3.d.ts")} ${joinPath("custom_typings", "system.d.ts")} ${joinPath("lib", "**", "*.ts")}`,
        andFix: `nps "lint.code --fix"`
      },
      test: {
        default: `tslint ${joinPath("custom_typings", "web3_global.d.ts")} ${joinPath("custom_typings", "system.d.ts")} ${joinPath("test", "**", "*.ts")}`,
        andFix: `nps "lint.test --fix"`
      },
      andFix: series(
        "nps lint.code.andFix",
        "nps lint.test.andFix"
      ),
    },
    test: {
      default: series(
        `nps test.build`,
        `nps test.runAll`
      ),
      bail: series(
        `nps test.build`,
        `nps "test.runAll --bail"`
      ),
      // coming: the ability to more easily run a single test (awaiting a forthcoming release of nps).
      run: `mocha --require chai --timeout 999999`,
      runAll: `mocha --require chai --timeout 999999  ${joinPath(pathArcTestBuild, "test")}`,
      build: {
        default: series(
          "nps test.build.clean",
          mkdirp(joinPath(pathArcTestBuild, "config")),
          copy(`${joinPath(".", "config", "**", "*")} ${joinPath(pathArcTestBuild, "config")}`),
          copy(`${joinPath(pathArcJsContracts, "**", "*")} ${joinPath(pathArcTestBuild, "migrated_contracts")}`),
          mkdirp(pathArcTestBuild),
          `node ${pathTypeScript} --outDir ${pathArcTestBuild} --project ${pathArcTest}`
        ),
        clean: rimraf(joinPath(pathArcTestBuild, "*"))
      },
    },
    build: {
      default: series(
        "nps build.clean",
        mkdirp(pathArcDist),
        `node ${pathTypeScript} --outDir ${pathArcDist}`
      ),
      clean: rimraf(pathArcDist)
    },
    deploy: {
      pack: series("nps build", "npm pack"),
      publish: series("nps build", "npm publish")
    },
    createGenesisDao: {
      default: `node  ${joinPath(".", "package-scripts", "createGenesisDao.js")}`
    },
    /**
     * See README.md for how to use these scripts in a workflow to migrate contracts
     */
    migrateContracts: {
      /**
       * Migrate contracts.
       *
       * Truffle will merge this migration with whatever previous ones are already present in the contract json files.
       *
       * Run migrateContracts.fetchFromArc first if you want to start with fresh unmigrated contracts from @daostack/arc.
       *
       * use --reset for ganacheDb if it is crashing on re-migration.
       */
      default: series(
        migrationScriptExists ? `` : `nps build`,
        `${truffleCommand} migrate --reset --contracts_build_directory ${pathArcJsContracts} --network ${network}`
      ),
      andCreateGenesisDao: series(
        `nps migrateContracts`,
        `nps createGenesisDao`
      ),
      /**
       * Clean the output contract json files, optionally andMigrate.
       *
       * IMPORTANT! Only do this if you aren't worried about losing
       * previously-performed migrations to other networks.  By cleaning, you'll lose them, starting
       * from scratch.  Otherwise, truffle will merge your migrations into whatever  previous
       * ones exist.
       */
      clean: {
        default: rimraf(joinPath(pathArcJsContracts, "*")),
        /**
         * clean and fetch.
         * Run this ONLY when you want to start with fresh UNMIGRATED contracts from @daostack/arc.
         */
        andFetchFromArc: series(
          "nps migrateContracts.clean",
          "nps migrateContracts.fetchFromArc"
        ),
        /**
         * clean, fetch and migrate.
         * Run this ONLY when you want to start with fresh UNMIGRATED contracts from @daostack/arc.
         */
        andMigrate: series(
          "nps migrateContracts.clean.andFetchFromArc",
          "nps migrateContracts"
        )
      },
      /**
       * Fetch the unmigrated contract json files from DAOstack Arc.
       * Run this ONLY when you want to start with fresh UNMIGRATED contracts from DAOstack Arc.
       * Best to run "migrateContracts.clean" first.
       * If run from the context of an application, then the application must have installed
       * the proper version of Arc sibling to the Arc.js package.
       */
      fetchFromArc: series(
        copy(`${joinPath(pathDaostackArcRepo, "build", "contracts", "*")}  ${pathArcJsContracts}`),
        `nps migrateContracts.touch`, // so truffle won't try to compile them on migrate
      ),
      touch: `node ${joinPath(".", "package-scripts", "touchContracts.js")}`
    },
    docs: {
      api: {
        build: `node ${joinPath(".", "package-scripts", "typedoc.js")}`,
        /**
         * This is to create a list of all the API files for inclusion in mkdocs.yml
         * Whenever the set of API objects changes, you must copy the output of this
         * script and paste it into mkdocs.yml after the line:
         * `- Index : "api/README.md"`
         *
         * Easy Powershell command:  nps -s docs.api.createPagesList | ac .\mkdocs.yml
         */
        createPagesList: `node ${joinPath(".", "package-scripts", "createApiPagesList.js")} ./docs api/*/**`
      },
      website: {
        build: "mkdocs build",
        preview: "mkdocs serve",
        publish: "mkdocs gh-deploy --force"
      },
      build: {
        default: series(
          "nps docs.api.build",
          "nps docs.website.build",
        ),
        andPreview: series("nps docs.website.preview"),
        andPublish: series("nps docs.website.publish")
      },
      clean: series(
        rimraf(joinPath(".", "docs", "api")),
        rimraf(joinPath(".", "site"))
      )
    },
    /**
     * Because the web typings are defective.  Using @types/web3 instead.
     * This is automatically invoked whenever installing arc.js.
     * One should also manually run if you reinstall anything that requires web3,
     * like truffle-contract or truffle-hdwallet-provider
     */
    postInstall: web3TypesExist ? `rimraf node_modules/web3/*.d.ts` : ''
  }
};
