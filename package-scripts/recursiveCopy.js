const fs = require("fs-extra");

const src = process.argv[2];
const dest = process.argv[3];

fs.copySync(src, dest);
