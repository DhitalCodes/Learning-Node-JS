// controllers/pageController.js
function renderHome(req, res) {
    res.render('index');
}

function renderSignup(req, res) {
    res.render('signup');
}

function renderDashboard(req, res) {
    res.render('dashboard', { username: req.query.username });
}

module.exports = { renderHome, renderSignup, renderDashboard };