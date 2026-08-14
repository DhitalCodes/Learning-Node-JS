const { findUserById } = require('../utils/fileHandler');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const user = await findUserById(userId);
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