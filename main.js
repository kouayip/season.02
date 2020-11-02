const { empty, withArgs } = require("./eventbox");
const { duplicate, transform, csv2json } = require("./streambox");

//e01
// empty();

//e02
// withArgs(["Luffy", "Zoro", "Usopp", "Robin", "Nami", "Sanji", "Ch0pper"]);

//e03
// duplicate(process.argv[2]);

//e04
// transform(process.argv[2], /[a-z]/g, (c) => {
//   return c.toUpperCase();
// });

//e05
// transform(
//   process.argv[2],
//   /[a-z]/g,
//   (c) => {
//     return c.toUpperCase();
//   },
//   false
// );

//e06
csv2json(process.argv[2]);
