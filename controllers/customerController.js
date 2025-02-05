const Customer = require("../model/customerModel.js");

// Add a new customer
exports.addCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
    });

    await newCustomer.save();
    res
      .status(201)
      .json({ message: "Customer added successfully", customer: newCustomer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding customer", error: err.message });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching customers", error: err.message });
  }
};

// Edit a customer
exports.updateCustomer = async (req, res) => {
  try {
   
    const { _id, name, email, phone, address } = req.body;

    console.log(req.body,_id);

    const updatedCustomer = await Customer.findByIdAndUpdate(
      _id,
      { name, email, phone, address },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({
        message: "Customer updated successfully",
        customer: updatedCustomer,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating customer", error: err.message });
  }
};

// Delete a customer

exports.deleteCustomer = async (req, res) => {
  try {
     const { id } = req.params;
    console.log(req.body,id);
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting customer", error: err.message });
  }
};
