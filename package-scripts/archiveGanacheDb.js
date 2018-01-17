const archiver = require("archiver");
const fs = require("fs");

const pathDaostackArcGanacheDbZip = process.argv[2];
const pathDaostackArcGanacheDb = process.argv[3];
const _archiver = archiver("zip", {
  zlib: { level: 9 } /* Sets the compression level. */
});

const stream = fs.createWriteStream(pathDaostackArcGanacheDbZip);

_archiver.pipe(stream);

_archiver.directory(pathDaostackArcGanacheDb, "GanacheDb").finalize();
