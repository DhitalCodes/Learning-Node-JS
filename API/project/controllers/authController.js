const { readUsers, writeUsers, findUserByEmail, findUserByUsername, findUserByPhone } = require('../utils/fileHandler');
const { isValidEmail, isValidPassword, isValidUsername, isValidName, isValidPhone } = require('../utils/validation');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    let { username, name, email, password, confirmPassword, phone } = req.body;

    // Sanitize
    username = (username || '').trim();
    name = (name || '').trim();
    email = (email || '').trim();
    phone = (phone || '').trim();
    password = (password || '').trim();
    confirmPassword = (confirmPassword || '').trim();

    // ----- Basic presence -----
    if (!username || !name || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ----- Backend confirm password -----
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // ----- Validate username -----
    if (!isValidUsername(username)) {
      return res.status(400).json({ 
        message: 'Username must be 5-30 characters, alphanumeric or underscore only, no special characters like @ or .' 
      });
    }
    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // ----- Validate email -----
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format (max 100 characters, must contain @)' });
    }
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // ----- Validate phone -----
    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: 'Phone must be exactly 10 digits' });
    }
    const existingPhone = await findUserByPhone(phone);
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // ----- Validate password (with username for comparison) -----
    if (!isValidPassword(password, username)) {
      return res.status(400).json({ 
        message: 'Password must be 8-64 characters, contain at least one digit, at least 2 uppercase and 2 lowercase letters, and not be the same as username' 
      });
    }

    // ----- Validate name -----
    if (!isValidName(name)) {
      return res.status(400).json({ message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, apostrophes, or dots.' });
    }

    // ----- Generate ID -----
    const users = await readUsers();
    const nextId = users.length === 0 ? 1 : Math.max(...users.map(u => u.id)) + 1;

    // ----- Hash password -----
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ----- Create user -----
    const newUser = {
      id: nextId,
      username,
      name,
      email,
      phone,
      password: hashedPassword   // stored as hash
    };

    users.push(newUser);
    await writeUsers(users);

    // Auto-login
    req.session.userId = newUser.id;
    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    let { identifier, password, isAdmin } = req.body;

    identifier = (identifier || '').trim();
    password = (password || '').trim();

    // Admin login (hardcoded)
    if (isAdmin) {
      if (identifier === 'admin' && password === 'admin123') {
        req.session.isAdmin = true;
        return res.status(200).json({ message: 'Admin login successful', redirect: '/admin' });
      }
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Normal user login
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }

    // Determine what the identifier is: email, phone, or username
    let user = null;
    if (identifier.includes('@')) {
      // Treat as email
      user = await findUserByEmail(identifier);
    } else if (/^\d{10}$/.test(identifier)) {
      // Exactly 10 digits -> phone
      user = await findUserByPhone(identifier);
    } else {
      // Otherwise username
      user = await findUserByUsername(identifier);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    return res.status(200).json({
      message: 'Login successful',
      redirect: '/dashboard'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out' });
  });
};