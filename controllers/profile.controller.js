// controllers/profileController.js

const Profile = require('../models/profileModel.js');
const path = require('path');

// Controller to get profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// Controller to update profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    let updatedData = { name, email };

    // Check if there's a new image uploaded
    if (req.file) {
      updatedData.image = req.file.path; // Update the image field with the file path
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      updatedData,
      { new: true }
    );

    res.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};

module.exports = { getProfile, updateProfile };
