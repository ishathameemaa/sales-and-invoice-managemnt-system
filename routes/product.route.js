const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/product.cntroller');

// Route to get all products
router.get('/', getProducts);

// Route to create a new product
router.post('/', createProduct);

// Route to update a product by ID
router.put('/:id', updateProduct);

// Route to delete a product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
