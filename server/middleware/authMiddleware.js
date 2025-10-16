const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  // Demo token fallback to support optional hardcoded login
  if (token === 'demo-jwt-token') {
    req.user = { id: 'demo', email: 'testuser01@gmail.com', role: 'Admin', name: 'Test User' };
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email, name }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}