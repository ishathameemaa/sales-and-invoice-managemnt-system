const express = require("express");
const router = express.Router();
const {updateInvoice, createInvoice,} = require("../controllers/invoiceController");

// Route to create an invoice
router.post("/create", createInvoice);
router.put("/update/:id", updateInvoice);

module.exports = router;
