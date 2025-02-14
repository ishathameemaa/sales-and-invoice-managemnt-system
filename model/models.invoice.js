const mongoose = require('mongoose');

// Define the schema for an Invoice
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  amountDue: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Payment Successful'],
    default: 'Pending',
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  products: {
    type: [Object], 
    required: true,
},
}, {
  timestamps: true,
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
