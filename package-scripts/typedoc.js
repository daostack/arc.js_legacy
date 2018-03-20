const TypeDoc = require("typedoc");
const Reflection = require("typedoc").Reflection;
const glob = require("glob");
require("colors");

/**
 * Hack typedoc to retain character case with file names.
 * The alternative requires forking typedoc and typedoc-plugin-markdown,
 * and typedoc-plugin-markdown in that case requires major onerous changes,
 * particularly to its test code which is doing case-sensitive assertions.
 */
Reflection.prototype.getAlias = function () {
  if (!this._alias) {
    let alias = this.name.replace(/[^a-z0-9]/gi, "_");
    if (alias === "") {
      alias = "reflection-" + this.id;
    }
    let target = this;
    while (target.parent && !target.parent.isProject() && !target.hasOwnDocument) {
      target = target.parent;
    }
    if (!target._aliases) {
      target._aliases = [];
    }
    let suffix = "", index = 0;
    while (target._aliases.indexOf(alias + suffix) !== -1) {
      suffix = "-" + (++index).toString();
    }
    alias += suffix;
    target._aliases.push(alias);
    this._alias = alias;
  }
  return this._alias;
};

/* eslint-disable no-console */

const LogLevel = {
  Verbose: 0,
  Info: 1,
  Warn: 2,
  Error: 3,
  Success: 4,
};

const tsFiles = glob.sync("./lib/**/*", {
  nodir: true,
  ignore: "./lib/test/**/*"
});

tsFiles.unshift("./custom_typings/system.d.ts");

if (tsFiles.length === 0) {
  throw new Error("No source files found.");
}

const out = "./docs/Api";
const json = undefined;

const options = {
  "target": "es6",
  "module": "commonjs",
  "hideGenerator": true,
  "readme": "none",
  "LogLevel": "Success",
  "mode": "file",
  "excludeProtected": true,
  "excludePrivate": true,
  "name": "API Reference",
  "theme": "markdown"
};

options.logger = function (message, level, newLine) {
  switch (level) {
    case LogLevel.Success:
      console.log(message.green);
      break;
    case LogLevel.Info:
    case LogLevel.Warn:
      if (newLine) {
        console.log(message.yellow);
      } else {
        process.stdout.write(message.yellow);
      }
      break;
    case LogLevel.Error:
      console.log(message.red);
      break;
    default:
      console.log(message);
      break;
  }
};

const app = new TypeDoc.Application(options);
const project = app.convert(tsFiles);
if (project) {
  if (out) { app.generateDocs(project, out); }
  if (json) { app.generateJson(project, json); }
}
