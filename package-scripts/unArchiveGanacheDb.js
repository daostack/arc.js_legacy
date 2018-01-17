const decompress = require("decompress");
const pathDaostackArcGanacheDbZip = process.argv[2];
const pathDaostackArcGanacheDb = process.argv[3];
// console.log(`unArchiveGanacheDb(${pathDaostackArcGanacheDbZip}, ${pathDaostackArcGanacheDb}`);
decompress(pathDaostackArcGanacheDbZip, pathDaostackArcGanacheDb);
