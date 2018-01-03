const decompress = require("decompress");
const pathDaostackArcTestrpcDbZip = process.argv[2];
const pathDaostackArcTestrpcDb = process.argv[3];
// console.log(`unArchiveTestrpcDb(${pathDaostackArcTestrpcDbZip}, ${pathDaostackArcTestrpcDb}`);
decompress(pathDaostackArcTestrpcDbZip, pathDaostackArcTestrpcDb);
