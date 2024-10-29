import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

// Calculate total price before saving cart item
cartItemSchema.pre('save', function(next) {
  this.totalPrice = this.pricePerUnit * this.quantity;
  next();
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Calculate subtotal before saving the cart
cartSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  next();
});

// Cart method to add or update items
cartSchema.methods.addItem = async function(productId, quantity) {
  const product = await mongoose.model('Product').findById(productId);
  if (!product) throw new Error('Product not found');
  if (product.stock < quantity) throw new Error(`Only ${product.stock} units available`);

  const existingItem = this.items.find(item => item.product.toString() === productId.toString());

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.totalPrice = existingItem.pricePerUnit * existingItem.quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      pricePerUnit: product.price,
      totalPrice: product.price * quantity
    });
  }

  return this.save();
};

// Cart method to clear all items
cartSchema.methods.clearCart = async function() {
  this.items = [];
  return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
