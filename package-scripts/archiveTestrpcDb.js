const archiver = require("archiver");
const fs = require("fs");

const pathDaostackArcTestrpcDbZip = process.argv[2];
const pathDaostackArcTestrpcDb = process.argv[3];
const _archiver = archiver("zip", {
  zlib: { level: 9 } /* Sets the compression level. */
});

// console.log(`archiveTestrpcDb(${pathDaostackArcTestrpcDbZip}, ${pathDaostackArcTestrpcDb}`);

const stream = fs.createWriteStream(pathDaostackArcTestrpcDbZip);

// stream.on('end', function() {
//   console.log('stream end');
// });
// stream.on('close', function() {
//   console.log('stream close');
// });
// stream.on('finish', function() {
//   console.log('stream finish');
// });

_archiver.pipe(stream);

_archiver.directory(pathDaostackArcTestrpcDb, "testrpcDb").finalize();
