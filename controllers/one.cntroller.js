const Invoice = require("../models/Invoice");
const Customer = require("../models/Customer"); // Assuming you have a Customer model
const { StatusCodes } = require("http-status-codes");

// Controller to create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, amountDue, status, paidAmount, customerName, customerEmail, customerPhone, productName, } = req.body;
     

    // Check if the customer exists
    const customer = await Customer.findOne({ email: customerEmail });
    if (!customer) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Customer not found" });
    }
    exports.updateInvoice = async (req, res) => {
      try {
 
        const { id } = req.params;
        const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, { new: true });
        
        
    
        if (!updatedInvoice) {
          return res.status(404).json({ message: "Invoice not found" });
        }
    
        res.status(200).json({ message: "Invoice updated successfully", invoice: updatedInvoice });
      } catch (err) {
        console.error("Error updating invoice:", err.message);
        res.status(400).json({ error: err.message });
      }
    };

    // Create the new invoice
    const newInvoice = new Invoice({
      invoiceNumber,
      amountDue,
      status,
      paidAmount,
      customerName,
      customerEmail,
      customerPhone,
      customerId: customer._id,
      productName,
    });

    // Save the invoice to the database
    await newInvoice.save();

    // Return the created invoice as a response
    res.status(StatusCodes.CREATED).json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while creating the invoice" });
  }
};
