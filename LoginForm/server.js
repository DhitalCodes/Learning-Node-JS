// server.js
const express = require('express');
const path = require('path');

// Middleware
const { logger, requireUsername, validateSignup, validateLogin } = require('./middleware');

// Controllers
const { renderHome, renderSignup, renderDashboard } = require('./controllers/pageController');
const { handleSignup, handleLogin } = require('./controllers/authController');

const app = express();
const PORT = 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Built‑in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger); // custom logger

// Routes
app.get('/', renderHome);
app.get('/signup', renderSignup);
app.get('/dashboard', requireUsername, renderDashboard);

app.post('/signup', validateSignup, handleSignup);
app.post('/login', validateLogin, handleLogin);

// 404 & error handlers
app.use((req, res) => res.status(404).send('Page not found'));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(`<h1>Error</h1><p>${err.message}</p><a href="/">Home</a>`);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));