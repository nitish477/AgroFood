import express from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart
} from '../controller/Cart.controller.js';

const router = express.Router();

// Route to get the cart by user ID
router.get('/:userId', getCart);

// Route to add an item to the cart
router.post('/:userId/items', addItemToCart);

// Route to update the quantity of a specific item in the cart
router.put('/:userId/items/:productId', updateCartItem);

// Route to remove an item from the cart
router.delete('/:userId/items/:productId', removeItemFromCart);

// Route to clear all items in the cart
router.delete('/:userId/clear', clearCart);

export default router;
