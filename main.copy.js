const { empty, withArgs } = require("./eventbox");
const { duplicate } = require("./streambox");

//e01
// empty();

//e02
// withArgs(["Luffy", "Zoro", "Usopp", "Robin", "Nami", "Sanji", "Ch0pper"]);

//e03
duplicate(process.argv[2]);
