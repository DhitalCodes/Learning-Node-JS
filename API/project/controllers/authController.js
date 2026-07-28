const { readUsers, writeUsers, findUserByEmail } = require('../utils/fileHandler');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Backend validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Check for duplicate email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate next sequential ID
    const users = await readUsers();
    const nextId = users.length === 0 ? 1 : Math.max(...users.map(u => u.id)) + 1;

    // Store password as plain text (for educational demo)
    const newUser = {
      id: nextId,
      name,
      email,
      password   // no hashing
    };

    users.push(newUser);
    await writeUsers(users);

    // Auto-login after registration
    req.session.userId = newUser.id;
    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    // Admin login
    if (isAdmin) {
      if (email === 'admin' && password === 'admin123') {
        req.session.isAdmin = true;
        return res.status(200).json({ message: 'Admin login successful', redirect: '/admin' });
      }
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Normal user login
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare plain text password
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Set session
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