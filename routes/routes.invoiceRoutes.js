const express = require('express');
const { createInvoice, getInvoices, filterInvoices } = require('../controllers/invoiceController');
const router = express.Router();

// Route to create a new invoice
router.post('/create', createInvoice);

// Route to get all invoices
router.get('/', getInvoices);

// Route to filter invoices based on status or search query
router.get('/filter', filterInvoices);

module.exports = router;
