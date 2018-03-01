const typedoc = require("typedoc");
const typeDocApp = new typedoc.Application();

typeDocApp.exclude = ["bignumber.js"];

const options = typeDocApp.options.getCompilerOptions();
Object.assign(options, {
  "target": "es6",
  "module": "commonjs",
  "exclude": "./lib/test/**/*"
});

typeDocApp.options.setValue("target", "es6");
typeDocApp.options.setValue("module", "commonjs");
typeDocApp.options.setValue("exclude", "./lib/test/**/*");
typeDocApp.options.setValue("excludeExternals", false);
typeDocApp.options.setValue("hideGenerator", true);

typeDocApp.generateDocs(["./custom_typings/system.d.ts", "./lib/utils.ts"], "./docs");

