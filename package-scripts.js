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
const path = require("path");
const cwd = require("cwd")();
const config = require("./config/default.json");
/**
 * environment variables you can use to configure stuff like migrateContracts
 */
const pathArcJsRoot = env.pathArcJsRoot || cwd;

const pathArcJsContracts =
  env.pathArcJsContracts || joinPath(pathArcJsRoot, "migrated_contracts");

const pathDaostackArcRepo =
  env.pathDaostackArcRepo ||
  joinPath(pathArcJsRoot, "node_modules/@daostack/arc");

const pathArcTest =
  env.pathArcTest ||
  joinPath(pathArcJsRoot, "test");

const pathArcTestBuild =
  env.pathArcTestBuild ||
  joinPath(pathArcJsRoot, "test-dist");

const pathDaostackArcGanacheDb = joinPath(pathArcJsRoot, "ganacheDb");
const pathDaostackArcGanacheDbZip = joinPath(pathArcJsRoot, "ganacheDb.zip");

const network = env.network || config.network || "ganache";

// this is needed to force travis to use our modified version of truffle
const truffleCommand = `node ${joinPath(pathArcJsRoot, "node_modules", "truffle-core-migrate-without-compile", "cli")}`;

const packagesAreInstalled = fs.existsSync(joinPath(pathArcJsRoot, "package-lock.json"));
const runningAsInstalledPackage = path.basename(joinPath(pathArcJsRoot, "../..")) === "node_modules";
/**
 * If running as a repo, then we'll do an npm build to make sure ConfigServices is up-to-date
 * Else running in an application and config settings will have to come from the environment.
 * Then make sure packages are installed locally, otherwise migrateContracts will fail (even if it looks
 * for truffle-core-migrate-without-compile in a sibling package)
 */
const migrationBuildCommand = runningAsInstalledPackage ? (packagesAreInstalled ? "" : "npm install") : "nps build";

const ganacheCommand = `ganache-cli -l ${config.gasLimit_deployment} --account="0x8d4408014d165ec69d8cc9f091d8f4578ac5564f376f21887e98a6d33a6e3549,9999999999999999999999999999999999999999999" --account="0x2215f0a41dd3bb93f03049514949aaafcf136e6965f4a066d6bf42cc9f75a106,9999999999999999999999999999999999999999999" --account="0x6695c8ef58fecfc7410bf8b80c17319eaaca8b9481cc9c682fd5da116f20ef05,9999999999999999999999999999999999999999999" --account="0xb9a8635b40a60ad5b78706d4ede244ddf934dc873262449b473076de0c1e2959,9999999999999999999999999999999999999999999" --account="0x55887c2c6107237ac3b50fb17d9ff7313cad67757e44d1be5eb7bbf9fc9ca2ea,9999999999999999999999999999999999999999999" --account="0xb16a587ad59c2b3a3f47679ed2df348d6828a3bb5c6bb3797a1d5a567ce823cb,9999999999999999999999999999999999999999999"`;
const ganacheDbCommand = `ganache-cli --db ${pathDaostackArcGanacheDb} -l ${config.gasLimit_deployment} --networkId 1512051714758 --mnemonic "behave pipe turkey animal voyage dial relief menu blush match jeans general"`;

module.exports = {
  scripts: {
    lint: {
      default: series(
        "nps lint.ts",
        "nps lint.js"
      ),
      ts: {
        default: "tslint lib/**/* custom_typings/system.d.ts index.d.ts",
        andFix: "nps \"lint.ts --fix\""
      },
      js: {
        default: "eslint .",
        andFix: "nps \"lint.js --fix\""
      },
      andFix: series(
        "nps lint.ts.andFix",
        "nps lint.js.andFix"
      )
    },
    test: {
      default: series("nps lint", "nps test.automated"),
      automated: {
        default: series(
          "nps test.build",
          "mocha --require babel-register --require babel-polyfill --require chai --timeout 999999"),
        bail: series(
          'nps "test.automated --bail"'
        ),
      },
      watch: series(
        'nps "test.automated --watch"'
      ),
      bail: (
        'nps test.automated.bail'
      ),
      ganache: {
        run: ganacheCommand,
      },
      ganacheDb: {
        run: series(
          mkdirp(pathDaostackArcGanacheDb),
          ganacheDbCommand,
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
      },
      build: {
        default: series(
          "nps test.build.clean",
          mkdirp(pathArcTestBuild),
          `node node_modules/typescript/bin/tsc --outDir ${pathArcTestBuild} --project ${pathArcTest}`
        ),
        clean: rimraf(joinPath(pathArcTestBuild, "*"))
      },
    },
    build: {
      default: series(
        "nps build.clean",
        mkdirp(joinPath(pathArcJsRoot, "dist")),
        `node node_modules/typescript/bin/tsc --outDir ${joinPath(pathArcJsRoot, "dist")}`
      ),
      clean: rimraf(joinPath(pathArcJsRoot, "dist"))
    },
    deploy: {
      pack: series("nps build", "npm pack"),
      publish: series("nps build", "npm publish")
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
       */
      default: series(
        migrationBuildCommand,
        `${truffleCommand} migrate --contracts_build_directory ${pathArcJsContracts} --without-compile --network ${network}`
      ),
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
       */
      fetchFromArc: copy(`${joinPath(pathDaostackArcRepo, "build", "contracts", "*")}  ${pathArcJsContracts}`)
    },
    docs: {
      api: {
        build: "node ./package-scripts/typedoc.js",
        /**
         * This is to create a list of all the API files for inclusion in mkdocs.yml
         * Whenever the set of API objects changes, you must copy the output of this
         * script and paste it into mkdocs.yml after the line:
         * `- Index : "api/README.md"`
         */
        createPagesList: `node ./package-scripts/createApiPagesList.js ./docs api/*/**`
      },
      website: {
        build: "mkdocs build",
        preview: "mkdocs serve",
        deploy: "mkdocs gh-deploy --force"
      },
      build: {
        default: series(
          "nps docs.api.build",
          "nps docs.website.build",
        ),
        andPreview: series("nps docs.build", "nps docs.website.preview"),
        andDeploy: series("nps docs.build", "nps docs.website.deploy")
      },
      clean: series(
        rimraf(joinPath(pathArcJsRoot, "docs", "api")),
        rimraf(joinPath(pathArcJsRoot, "site"))
      )
    }
  }
};
