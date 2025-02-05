const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/Profile.model.js"); // Use require instead of import

const router = express.Router();

// Create a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user
    await newUser.save();

    // Generate a JWT token (optional, depending on your use case)
    const token = jwt.sign({ userId: newUser._id }, "your_jwt_secret_key", {
      expiresIn: "1h", // Token expiry (optional)
    });

    // Respond with the new user and token
    res.status(201).json({ message: "User created successfully", user: newUser, token });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ error: "Error creating user" });
  }
});

// Update profile (name and email)
router.put("/profile", async (req, res) => {
  const { userId, name, email } = req.body;

  if (!userId || !name || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    console.error(error);  // Log the error for further debugging
    res.status(400).json({ error: "Error updating profile" });
  }
});

// Toggle Two-Factor Authentication
router.put("/security/toggle-2fa", async (req, res) => {
  const { userId, twoFactorEnabled } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { twoFactorEnabled },
      { new: true }
    );
    res.status(200).json({ message: "Two-Factor Authentication updated", user });
  } catch (error) {
    res.status(400).json({ error: "Error updating 2FA" });
  }
});

// Change Password
router.put("/security/change-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json({ message: "Password changed", user });
  } catch (error) {
    res.status(400).json({ error: "Error changing password" });
  }
});

module.exports = router;
