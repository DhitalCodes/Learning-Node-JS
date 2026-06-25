const getInput = require("./input");
const solve = require("./quadratic");

console.log("Quadratic Equation Solver");

getInput(function(num1, num2, num3) {

    if (num1 === 0) {
        console.log("Not a quadratic equation");
        return;
    }

    let result = solve(num1, num2, num3);

    console.log("\nResult:");
    console.log("Type:", result.type);
    console.log("Root 1:", result.root1);
    console.log("Root 2:", result.root2);
});