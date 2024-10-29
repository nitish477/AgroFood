import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  patchProduct,
  deleteProductById,
} from './../controller/product.controller.js';

const router = express.Router();

router.post('/products', createProduct);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.patch('/products/:id', patchProduct);
router.delete('/products/:id', deleteProductById);


export default router;
