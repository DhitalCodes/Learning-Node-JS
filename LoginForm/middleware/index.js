// middleware/index.js
const fs = require('fs');
const path = require('path');

// Logger
function logger(req, res, next) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
}

// Auth: ensure username is present for /dashboard
function requireUsername(req, res, next) {
    if (req.path === '/dashboard' && !req.query.username) {
        return res.redirect('/?error=Please login first');
    }
    next();
}

// Validation for signup
function validateSignup(req, res, next) {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) {
        return res.redirect('/signup?error=Please fill all fields');
    }
    if (!/^[a-zA-Z0-9]{3,20}$/.test(username)) {
        return res.redirect('/signup?error=Invalid username (3-20 letters & numbers only)');
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (password.length < 4 || !hasLetter || !hasNumber) {
        return res.redirect('/signup?error=Password must be min 4 chars with letter and number');
    }
    if (password !== confirmPassword) {
        return res.redirect('/signup?error=Passwords do not match');
    }
    next();
}

// Validation for login
function validateLogin(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.redirect('/?error=Please enter username and password');
    }
    next();
}

module.exports = { logger, requireUsername, validateSignup, validateLogin };