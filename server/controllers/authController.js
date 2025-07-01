const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/*
 * POST /auth/signup
 */
exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows } = await db.query('SELECT 1 FROM users WHERE username = $1', [username]);
    if (rows.length) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hash]);

    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', path: '/' });

    return res.json({ success: true });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * POST /auth/login
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { rows } = await db.query('SELECT password FROM users WHERE username = $1', [username]);
    if (!rows.length) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const hash = rows[0].password;
    const match = await bcrypt.compare(password, hash);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', path: '/' });

    return res.json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * GET /auth/check
 */
exports.check = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ success: false });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ success: true, userID: data.user });
  } catch (err) {
    return res.json({ success: false });
  }
};


//  POST /auth/logout
exports.logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', path: '/' });
  return res.json({ success: true });
}; 