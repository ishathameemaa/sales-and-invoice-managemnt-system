const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Customer routes
router.post('/', customerController.addCustomer);
router.get('/', customerController.getCustomers);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
