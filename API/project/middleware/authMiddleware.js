function isAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(403).json({ message: 'Admin access required' });
}

function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ message: 'Please log in first' });
}

module.exports = { isAdmin, isLoggedIn };