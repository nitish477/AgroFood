import Product from './../modals/Product.modal.js';
import mongoose from 'mongoose';
import Joi from 'joi';

// Validation schema for product data
const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  category: Joi.string().required(),
  brand: Joi.string().allow(''),
  manufacturingDate: Joi.date().optional(),
  price: Joi.number().min(0).required(),
  unit: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
  description: Joi.string().min(10).max(1000).required(),
  instructions: Joi.string().allow('').max(1000),
  productImages: Joi.array().items(Joi.string().uri()).optional()
});

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new product
export const createProduct = async (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid product ID format' });

  try {
    const product = await Product.findById(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product (PUT)
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { error } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid product ID format' });

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Partially update a product (PATCH)
export const patchProduct = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid product ID format' });

  const productFields = productSchema.fork(Object.keys(req.body), (schema) => schema.optional());
  const { error } = productFields.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const patchedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (patchedProduct) {
      res.status(200).json(patchedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (deletedProduct) {
      res.status(200).json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};