import {mongoose} from "mongoose"

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      'Seeds',
      'Fertilizers',
      'Pesticides',
      'Farm Tools',
      'Irrigation Equipment',
      'Organic Products',
      'Animal Feed',
      'Plant Protection',
      'Agricultural Machinery',
    ],
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  manufacturingDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ['kg', 'g', 'L', 'mL', 'pieces', 'packets', 'bags'],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  instructions: {
    type: String,
  },
  productImages: {
    type: [String], // Assuming URLs or paths to images
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product
