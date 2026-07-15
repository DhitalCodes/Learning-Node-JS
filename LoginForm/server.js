const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// ========== VIEW ENGINE SETUP ==========
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ========== BUILT-IN MIDDLEWARE ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));   // for CSS, JS, images

// ========== APPLICATION-LEVEL MIDDLEWARE ==========

// 1. Logger
app.use((req, res, next) => {
    console.log(`📝 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// 2. Authentication guard (for protected routes)
app.use((req, res, next) => {
    // Skip public pages
    if (req.path === '/' || req.path === '/login' || req.path === '/signup') {
        return next();
    }
    
    // For dashboard, check if user is logged in (via query param)
    if (req.path === '/dashboard') {
        const username = req.query.username;
        if (!username) {
            return res.redirect('/?error=Please login first');
        }
        // You could also validate against the users list here
    }
    next();
});

// 3. Request timer
app.use((req, res, next) => {
    req.startTime = Date.now();
    next();
});

// ========== ROUTE-SPECIFIC MIDDLEWARE ==========

// Signup validation
const validateSignup = (req, res, next) => {
    const { username, password, confirmPassword } = req.body;
    
    if (!username || !password || !confirmPassword) {
        return res.redirect('/signup?error=Please fill all fields');
    }
    
    if (!/^[a-zA-Z0-9]{3,20}$/.test(username)) {
        return res.redirect('/signup?error=Username must be 3-20 characters (letters & numbers only)');
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
};

// Login validation
const validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.redirect('/?error=Please fill all fields');
    }
    next();
};

// ========== HELPER FUNCTIONS ==========

function getUsers() {
    try {
        const data = fs.readFileSync('users.json', 'utf8');
        return JSON.parse(data).users || [];
    } catch {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync('users.json', JSON.stringify({ users }, null, 2));
}

// ========== ROUTES ==========

// Login page (home)
app.get('/', (req, res) => {
    const error = req.query.error || '';
    const success = req.query.success || '';
    res.render('login', { error, success });
});

// Signup page
app.get('/signup', (req, res) => {
    const error = req.query.error || '';
    res.render('signup', { error });
});

// Signup POST
app.post('/signup', validateSignup, (req, res) => {
    const { username, password } = req.body;
    
    const users = getUsers();
    if (users.some(u => u.username === username)) {
        return res.redirect('/signup?error=Username already taken');
    }
    
    users.push({ username, password });
    saveUsers(users);
    
    console.log(`✅ New user registered: ${username}`);
    res.redirect('/?success=Account created! Please login');
});

// Login POST
app.post('/login', validateLogin, (req, res) => {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        console.log(`✅ User logged in: ${username}`);
        res.redirect(`/dashboard?username=${username}`);
    } else {
        res.redirect('/?error=Invalid username or password');
    }
});

// Dashboard (protected)
app.get('/dashboard', (req, res) => {
    const username = req.query.username || 'Guest';
    res.render('dashboard', { username });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).send(`
        <h1>Something went wrong!</h1>
        <p>Error: ${err.message}</p>
        <a href="/">Go back home</a>
    `);
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log('📝 Custom middleware used:');
    console.log('   1. Logger');
    console.log('   2. Auth guard');
    console.log('   3. Timer');
    console.log('   4. validateSignup');
    console.log('   5. validateLogin');
    console.log('   6. Error handler');
});