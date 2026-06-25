const readline = require("readline");

function getInput(callback) {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Enter num1: ", (num1) => {
        rl.question("Enter num2: ", (num2) => {
            rl.question("Enter num3: ", (num3) => {

                rl.close();

                callback(
                    Number(num1),
                    Number(num2),
                    Number(num3)
                );
            });
        });
    });
}

module.exports = getInput;