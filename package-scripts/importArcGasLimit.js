const fs = require("fs-extra");

const arcPackage = require("../node_modules/@daostack/arc/package.json");
const gasLimit = arcPackage.config.gasLimit;

fs.writeFileSync("./arcConstants.js", `const ARC_GAS_LIMIT = ${gasLimit};\r\nmodule.exports = { ARC_GAS_LIMIT };\r\n`);
