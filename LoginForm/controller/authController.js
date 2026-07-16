// controllers/authController.js
const UserModel = require('../models/userModel');

function handleSignup(req, res) {
    const { username, password } = req.body;
    const user = UserModel.create(username, password);
    if (!user) {
        return res.redirect('/signup?error=Username already exists');
    }
    console.log(`User Registered: ${username}`);
    res.redirect('/?success=Account created! Please log in.');
}

function handleLogin(req, res) {
    const { username, password } = req.body;
    const user = UserModel.validateCredentials(username, password);
    if (!user) {
        return res.redirect('/?error=Invalid username or password');
    }
    console.log(`User Logged In: ${username}`);
    res.redirect(`/dashboard?username=${username}`);
}

module.exports = { handleSignup, handleLogin };