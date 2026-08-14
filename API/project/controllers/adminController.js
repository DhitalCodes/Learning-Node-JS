const { findUserById } = require('../utils/fileHandler');
const { isValidUserId } = require('../utils/validation');

exports.getUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!isValidUserId(id)) {
      return res.status(400).json({ message: 'Invalid user ID – must be a positive integer' });
    }

    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // NEVER expose password (hashed or otherwise)
    res.status(200).json({ 
      id: user.id, 
      username: user.username,
      name: user.name, 
      email: user.email, 
      phone: user.phone
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};