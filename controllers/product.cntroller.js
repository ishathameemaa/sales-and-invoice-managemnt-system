const Product = require("../model/product.model");

// Get all products
const getProducts = async (req, res) => {
  try {
    console.log("Received request to fetch products.");
    const products = await Product.find();
    // console.log("Fetched products:", products);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  const { name, category, price, stock } = req.body;

  if (!name || !category || !price || !stock) {
    console.warn("Missing fields in product creation:", req.body);
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = new Product({ name, category, price, stock,  });
    await product.save();
    console.log("Created product:", product);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

// Update a product

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  console.log(req.body,"kjdkedjnekwfdnewf");

  // Remove _id from updateData if it exists
 
  
  delete updateData._id;

  try {
    console.log("Received request to update product with ID:", id);
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
      console.warn("Product not found:", id);
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Updated product:", product);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Received request to delete product with ID:", id);
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      console.warn("Product not found:", id);
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("Deleted product:", product);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
