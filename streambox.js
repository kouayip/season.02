const fs = require("fs");
const path = require("path");

function duplicate(filename) {
  const file = path.basename(filename);
  const ext = path.extname(file);
  const shortName = file.replace(ext, "");
  const newfileName = `${shortName}.copy${ext}`;

  const readable = fs.createReadStream(filename);
  const writable = fs.createWriteStream(newfileName);

  writable.on("finish", () => {
    console.log("File:", file, "successfully duplicate!");
  });

  readable.pipe(writable);
}

function transform(filename, re, fn) {
  const readable = fs.createReadStream(filename);
  readable.on("data", (chunk) => {
    const std = chunk.toString();
    console.log(std.replace(re, fn));
  });
}

module.exports = {
  duplicate,
  transform,
};
