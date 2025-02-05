const jwt = require("jsonwebtoken");
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store the user info in the request object
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is invalid or expired", error: err.message });
  }
};

module.exports = authMiddleware;
