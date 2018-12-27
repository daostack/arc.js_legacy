/* eslint-disable quotes */
const fs = require("fs");
const {
  series,
  rimraf,
  copy,
  mkdirp
} = require("nps-utils");
const joinPath = require("path.join");
const cwd = require("cwd")();

const runningInRepo = fs.existsSync(".git");
const migrationsExist = fs.existsSync("migration.json");
const pathArcJsRoot = cwd;

const pathNodeModules = runningInRepo ? joinPath(".", "node_modules") : joinPath("..", "..", "node_modules");

const pathDaostackArcRepo = runningInRepo ?
  joinPath(pathNodeModules, "@daostack", "arc") :
  joinPath("..", "arc");

const pathDaostackMigrationsRepo = runningInRepo ?
  joinPath(pathNodeModules, "@daostack", "migration") :
  joinPath("..", "migration");

const pathArcJsContracts = joinPath(".", "migrated_contracts");
const pathArcTest = joinPath(".", "test");
const pathArcTestBuild = joinPath(".", "test-build");
const pathArcDist = joinPath(".", "dist");
const pathDaostackArcGanacheDb = joinPath(".", "ganacheDb");
const pathDaostackArcGanacheDbZip = joinPath(".", "ganacheDb.zip");
const pathTypeScript = joinPath(pathNodeModules, "typescript/bin/tsc");

const ganacheGasLimit = 8000000; // something reasonably close to live
const ganacheCommand = `ganache-cli -l ${ganacheGasLimit} --networkId 1512051714758 --defaultBalanceEther 999999999999999 --deterministic`;
const ganacheDbCommand = `ganache-cli --db ${pathDaostackArcGanacheDb} --networkId 1512051714758 -l ${ganacheGasLimit} --defaultBalanceEther 999999999999999 --deterministic`;

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
          copy(`${joinPath(pathArcJsRoot, "migration.json")} ${pathArcTestBuild}`),
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
      ensureMigrations: migrationsExist ? "" : `node  ${joinPath(".", "package-scripts", "fail")} "migrations.json doesn't exist"`,
      pack: series(
        "nps deploy.ensureMigrations",
        "nps build",
        "npm pack"),
      publish: series(
        "nps deploy.ensureMigrations",
        "nps build",
        "npm publish")
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
       * Run migrateContracts.fetchContracts first if you want to start with fresh unmigrated contracts from @daostack/arc.
       *
       * use --reset for ganacheDb if it is crashing on re-migration.
       */
      default: series(
        `node ${joinPath(".", "package-scripts", "migrateContracts.js")} "${joinPath(pathArcJsRoot, "migration.json")}"`
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
      clean: rimraf(joinPath(pathArcJsContracts, "*")),

      fetchContracts: series(
        "nps migrateContracts.clean",
        "nps migrateContracts.fetchFromArc",
        "nps migrateContracts.fetchFromDaostack"
      ),
      /**
       * Fetch the unmigrated contract json files from DAOstack Arc.
       * Run this ONLY when you want to start with fresh UNMIGRATED contracts from DAOstack Arc.
       * Best to run "migrateContracts.clean" first.
       * If run from the context of an application, then the application must have installed
       * the proper version of Arc sibling to the Arc.js package.
       */
      fetchFromArc: series(
        copy(`${joinPath(pathDaostackArcRepo, "build", "contracts", "*")}  ${pathArcJsContracts}`)
      ),
      /**
       * fetch contract addresses from the DAOstack migrations package.
       */
      fetchFromDaostack: series(
        copy(`${joinPath(pathDaostackMigrationsRepo, "migration.json")}  ${pathArcJsRoot}`),
        `node ${joinPath(".", "package-scripts", "cleanMigrationJson.js")}`,
      ),
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
    }
  }
};
