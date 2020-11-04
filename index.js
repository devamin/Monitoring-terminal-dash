const interaction = require("./src/interaction/terminal")
const migrate = require("./src/migration");

async function main() {
    await migrate();
    interaction();
}

main();