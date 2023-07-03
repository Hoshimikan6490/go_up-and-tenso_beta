const fs = require("fs")

const file = fs.readFileSync("data.json");

let sorted_data = JSON.parse(file).reverse();

fs.writeFileSync("temp.json", JSON.stringify(sorted_data))