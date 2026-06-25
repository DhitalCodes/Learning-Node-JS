// This function solves a quadratic equation: ax² + bx + c = 0
// We pass in three numbers: a, b, and c
function solve(a, b, c) {

    // Step 1: Calculate the "discriminant"
    // The discriminant tells us what kind of roots (answers) the equation has
    // Formula: b² - 4ac
    let discriminant = (b * b) - (4 * a * c);

    // Step 2: Create an empty object to store our answer
    // We will fill this with the type of roots and the root values
    let result = {};

    // Step 3: Check the discriminant to decide which case we are in

    // CASE 1: Discriminant is positive → Two different real number roots
    if (discriminant > 0) {

        // Take the square root of the discriminant
        let squareRoot = Math.sqrt(discriminant);

        // Use the quadratic formula to find both roots
        let firstRoot = (-b + squareRoot) / (2 * a);
        let secondRoot = (-b - squareRoot) / (2 * a);

        // Save the results
        result.type = "Two Real Roots";
        result.root1 = firstRoot;
        result.root2 = secondRoot;

    }
    // CASE 2: Discriminant is zero → Both roots are the same number
    else if (discriminant === 0) {

        // When discriminant is 0, both roots equal -b / (2a)
        let onlyRoot = -b / (2 * a);

        // Save the results (both roots are the same)
        result.type = "Equal Roots";
        result.root1 = onlyRoot;
        result.root2 = onlyRoot;

    }
    // CASE 3: Discriminant is negative → Roots are imaginary (use "i")
    else {

        // The real part of the answer
        let realPart = -b / (2 * a);

        // The imaginary part of the answer
        // We use -discriminant to make it positive before taking the square root
        let imaginaryPart = Math.sqrt(-discriminant) / (2 * a);

        // Save the results as text, like "3 + 2i" and "3 - 2i"
        result.type = "Imaginary Roots";
        result.root1 = realPart + " + " + imaginaryPart + "i";
        result.root2 = realPart + " - " + imaginaryPart + "i";
    }

    // Step 4: Send the result back to whoever called this function
    return result;
}

// This line makes the function available to other files in your project
// So you can use it like: const solve = require('./solve');
module.exports = solve;
