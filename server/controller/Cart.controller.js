import mongoose from 'mongoose';
import Cart from '../modals/Cart.modal.js';
import Product from '../modals/Product.modal.js';

// Get cart by user ID
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Find cart with populated product data
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name price description productImages inStock' // Select relevant product fields
      });

    if (!cart) {
      // If no cart exists, return empty cart structure
      return res.status(200).json({
        user: userId,
        items: [],
        subtotal: 0,
        total: 0
      });
    }

    // Validate each item's data and remove invalid items
    cart.items = cart.items.filter(item => {
      return item.product && 
             item.quantity > 0 && 
             item.pricePerUnit > 0 && 
             item.totalPrice > 0;
    });

    // Recalculate totals to ensure consistency
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.totalPrice, 
      0
    );
    cart.total = cart.subtotal; // Add tax/shipping calculations if needed

    // Save if any items were filtered out
    if (cart.isModified()) {
      await cart.save();
    }

    res.status(200).json(cart);

  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ 
      message: 'Failed to fetch cart',
      error: error.message 
    });
  }
};
// Add item to cart
export const addItemToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    await cart.addItem(productId, quantity);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid user ID or product ID' });
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ message: 'Invalid quantity. Must be a positive number.' });
    }

    // Find cart with populated product data
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in cart
    const itemIndex = cart.items.findIndex(
      item => item.product._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // If quantity is 0, remove the item
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity and recalculate price
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].totalPrice = 
        cart.items[itemIndex].pricePerUnit * quantity;
    }

    // Recalculate cart totals
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.totalPrice, 
      0
    );
    cart.total = cart.subtotal; // Add tax/shipping calculations if needed

    // Save and return updated cart with populated data
    await cart.save();
    
    // Re-fetch cart to ensure we have all populated data
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    
    res.status(200).json(updatedCart);

  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ 
      message: 'Failed to update cart item',
      error: error.message 
    });
  }
};
// Remove item from cart
export const removeItemFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear all items in cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    await cart.clearCart();
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
