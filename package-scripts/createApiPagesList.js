const fs = require("fs");
const glob = require("glob");
const path = require("path");

let rootDir = process.argv[2];
let searchSpec = process.argv[3];

process.chdir(rootDir);

const files = glob.sync(searchSpec, {
  nodir: true
});

files.map((file) => {
  console.log(`  - ${path.basename(file.replace(".md", ""))} : '${file}'`);
});
