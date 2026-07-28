const { findUserById } = require('../utils/fileHandler');

exports.getUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid user ID' });

    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ id: user.id, name: user.name, email: user.email, password: user.password });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};