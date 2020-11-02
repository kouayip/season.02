const fs = require("fs");
const path = require("path");
const Transform = require("stream").Transform;

//Function use to generate new file name
const fileParser = (filename, actionName, newExt = null) => {
  const file = path.basename(filename);
  const ext = path.extname(file);
  const shortName = file.replace(ext, "");
  let newfileName = `${shortName}${actionName ? "." + actionName : ""}${
    newExt ? newExt : ext
  }`;
  return { file, newfileName };
};

function duplicate(filename) {
  const { file, newfileName } = fileParser(filename, "copy");

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
    const { newfileName } = fileParser(filename, "transform");

    const writable = fs.createWriteStream(newfileName);
    writable.on("finish", () => {
      console.log("File:", filename, "successfully transformed!");
    });

    const trans = new Transform({
      transform(chunk, encoding, callback) {
        const newStd = chunk.toString().replace(re, fn);
        this.push(newStd);
        callback();
      },
    });
    readable.pipe(trans).pipe(writable);
  }
}

function csv2json(filename) {
  const { newfileName } = fileParser(filename, "", ".json");

  const writable = fs.createWriteStream(newfileName);
  const readable = fs.createReadStream(filename);
  const trans = new Transform({
    transform(chunk, encoding, callback) {
      const dataObj = [];

      //Split on line
      const valueParser = chunk.toString().split(/\r\n/);

      //Split on ; to obtain the header values
      const header = valueParser[0].split(";");

      //format header values as specific value
      const keyName = header[0];
      const keyBirst = header[1];
      const keyDeath = header[2];
      const keyActivity = header[3];

      //iterated on all the data from the second value on, to ignore the header
      for (let index = 1; index < valueParser.length; index++) {
        const obj = {};

        //Split on ; to obtain the data values
        const values = valueParser[index].split(";");

        const valName = values[0];
        const valBirth = values[1]; //Date format
        const valDeath = values[2]; //Date format
        const valActivities = values[3]
          .split(",")
          .map((activity) => activity.toLowerCase());

        //associating the keys with their respective values
        obj[keyName] = valName;
        obj[keyBirst] = valBirth;
        obj[keyDeath] = valDeath;
        obj[keyActivity] = valActivities;

        dataObj.push(obj);
      }

      this.push(JSON.stringify(dataObj));
      callback();
    },
  });

  writable.on("finish", () => {
    console.log("File:", newfileName, "successfully created!");
  });

  readable.pipe(trans).pipe(writable);
}

module.exports = {
  duplicate,
  transform,
  csv2json,
};
