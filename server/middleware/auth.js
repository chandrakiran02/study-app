const jwt = require('jsonwebtoken');

function isLoggedIn(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'You must be logged in' });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userID = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = isLoggedIn; 