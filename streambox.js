const fs = require("fs");
const path = require("path");
const Transform = require("stream").Transform;

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

function transform(filename, re, fn, in_stdout = true) {
  const readable = fs.createReadStream(filename);

  if (in_stdout) {
    readable.on("data", (chunk) => {
      const std = chunk.toString();
      console.log(std.replace(re, fn));
    });
  } else {
    const file = path.basename(filename);
    const ext = path.extname(file);
    const shortName = file.replace(ext, "");
    const newfileName = `${shortName}.transform${ext}`;

    const writable = fs.createWriteStream(newfileName);

    const trans = new Transform({
      transform(chunk, encoding, callback) {
        const newStd = chunk.toString().replace(re, fn);
        this.push(newStd);
        callback();
      },
    });

    writable.on("finish", () => {
      console.log("File:", filename, "successfully transformed!");
    });

    readable.pipe(trans).pipe(writable);
  }
}

module.exports = {
  duplicate,
  transform,
};
