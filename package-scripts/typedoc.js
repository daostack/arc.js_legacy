const TypeDoc = require("typedoc");
const fs = require("fs-extra");
const glob = require("glob");
require("colors");

const LogLevel = {
  Verbose: 0,
  Info: 1,
  Warn: 2,
  Error: 3,
  Success: 4,
}

const tsFiles = glob.sync("./lib/**/*", {
  nodir: true,
  ignore: "./lib/test/**/*"
});

tsFiles.unshift("./custom_typings/system.d.ts");

// tsFiles.map((file) => {
//   console.log(file);
// });

if (tsFiles.length == 0) {
  throw new Error('No source files found.');
}

var out = "./docs/Api";
var json = undefined;

const options = {
  "target": "es6",
  "module": "commonjs",
  "hideGenerator": true,
  "readme": "none",
  "LogLevel": "Success",
  "mode": "file",
  "excludeProtected": true,
  "name": "@DAOstack/Arc.js API Reference",
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
        // console.log.orange(message);
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

var app = new TypeDoc.Application(options);
var project = app.convert(tsFiles);
if (project) {
  if (out) app.generateDocs(project, out);
  if (json) app.generateJson(project, json);
}
