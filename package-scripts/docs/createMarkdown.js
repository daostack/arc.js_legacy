const typedoc = require("typedoc");
const typeDocApp = new typedoc.Application();

typeDocApp.exclude = ["bignumber.js"];

const options = typeDocApp.options.getCompilerOptions();
Object.assign(options, {
  "target": "es6",
  "module": "commonjs"
});

typeDocApp.options.setValue("includeDeclarations", true);
// typeDocApp.options.setValue("externalPattern", "node_modules");
typeDocApp.options.setValue("excludeExternals", true);
typeDocApp.options.setValue("hideGenerator", true);

typeDocApp.generateDocs(["./lib/arc.d.ts"], "./docs");

