const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  amountDue: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  status: { type: String, required: true, enum: ['Pending', 'Paid', 'Payment Successful'] },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
