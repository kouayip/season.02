const EventEmitter = require("events");
const myEmitter = new EventEmitter();

function empty() {
  myEmitter.on("hi", () => {
    console.log("Ch0ooooooper!");
  });
  myEmitter.emit("hi");
}

function withArgs(names) {
  myEmitter.on("newFellow", (name) => {
    console.log("Here come's a new prirate ->>", name);
  });

  names.map((name) => {
    myEmitter.emit("newFellow", name);
  });
}

module.exports = {
  empty,
  withArgs,
};
