const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const adminModel = require('../model/adminModel');

// Token Blacklist (In-memory storage, use Redis for production)
let blacklistedTokens = new Set();

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      data: { token },
    });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// ✅ Logout Admin
const logoutAdmin = (req, res) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "No token provided" });

    // Add token to blacklist
    blacklistedTokens.add(token);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Middleware to check blacklisted tokens
const checkBlacklistedToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: "Token has been invalidated" });
  }
  next();
};

module.exports = { loginAdmin, logoutAdmin, checkBlacklistedToken };
