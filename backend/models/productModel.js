import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: [String],
  sizes: [String],
  colors: [String],
  discountPercentage: { type: Number, default: 0 },
  originalPrice: { type: Number, default: 0 },
  gender: { type: String, default: 'Unisex' },
  material: { type: String, default: 'Standard' },
  fit: { type: String, default: 'Regular' },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  }
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
