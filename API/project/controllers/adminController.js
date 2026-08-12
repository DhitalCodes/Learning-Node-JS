const { findUserById } = require('../utils/fileHandler');
const { isValidUserId } = require('../utils/validation');

exports.getUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    // Validate ID
    if (!isValidUserId(id)) {
      return res.status(400).json({ message: 'Invalid user ID – must be a positive integer' });
    }

    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Expose all fields (including password) – original behaviour
    res.status(200).json({ id: user.id, name: user.name, email: user.email, password: user.password });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};