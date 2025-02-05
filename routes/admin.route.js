const express = require('express');
const { loginAdmin, logoutAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin); 

module.exports = router; // CommonJS export
