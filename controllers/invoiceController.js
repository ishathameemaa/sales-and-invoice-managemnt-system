require("dotenv").config();
const Invoice = require("../model/models.invoice");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

// Create a new invoice
const createInvoice = async (req, res) => {
  try {
    const {
      amountDue,
      paidAmount,
      customerName,
      customerEmail,
      customerPhone,
      status,
      products,
    } = req.body;
    console.log(products,"**",req.body);
    
    const invoiceNumber = `INV${Date.now()}`;
    const newInvoice = new Invoice({
      invoiceNumber,
      amountDue,
      paidAmount,
      customerName,
      customerEmail,
      customerPhone,
      products,
      status,

    });

    await newInvoice.save();
    res
      .status(201)
      .json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all invoices
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json({ invoices });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const updateInvoice = async (req, res) => {
  try {
    console.log(req.body, "****");
    const { id } = req.params;
    const { paidAmount } = req.body;

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Convert values to numbers
    const newPaidAmount = Number(invoice.paidAmount) + Number(paidAmount);
    const amountDue = Number(invoice.amountDue);

    // Determine status based on the new paid amount
    let status = "Partially Paid";
    if (newPaidAmount >= amountDue) {
      status = "Paid";
    }
    console.log(newPaidAmount,status,id);
    

    // Update the invoice
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { paidAmount: newPaidAmount, status },
      { new: true }
    );

    res.status(200).json({ message: "Invoice updated successfully", invoice: updatedInvoice });
  } catch (err) {
    console.error("Error updating invoice:", err.message);
    res.status(400).json({ error: err.message });
  }
};



// Filter invoices by status or search query
const filterInvoices = async (req, res) => {
  try {
    const { statusFilter, searchQuery } = req.query;
    let filterConditions = {};

    if (statusFilter && statusFilter !== "All") {
      filterConditions.status = statusFilter;
    }

    if (searchQuery) {
      filterConditions.invoiceNumber = { $regex: searchQuery, $options: "i" }; // Case insensitive search
    }

    const invoices = await Invoice.find(filterConditions);
    res.status(200).json({ invoices });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Send a payment failure notification
const sendPaymentFailureNotification = async (invoice) => {
  try {
    if (invoice.status === "Pending") {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: invoice.customerEmail,
        subject: "Payment Pending for Invoice " + invoice.invoiceNumber,
        text: `Dear ${invoice.customerName},\n\nWe noticed that the payment for Invoice ${invoice.invoiceNumber} is still pending. Please make the payment as soon as possible.\n\nThank you!`,
      };

      await transporter.sendMail(mailOptions);
      console.log(
        `Payment failure notification sent for invoice: ${invoice.invoiceNumber}`
      );
    }
  } catch (err) {
    console.error("Error sending payment failure notification:", err.message);
  }
};

// Cron job to send reminders for pending invoices
cron.schedule("0 0 * * *", async () => {
  try {
    const pendingInvoices = await Invoice.find({ status: "Pending" });
    pendingInvoices.forEach(sendPaymentFailureNotification);
  } catch (err) {
    console.error("Error fetching pending invoices:", err.message);
  }
});

module.exports = {
  createInvoice,
  updateInvoice,
  getInvoices,
  filterInvoices,
  sendPaymentFailureNotification,
};
