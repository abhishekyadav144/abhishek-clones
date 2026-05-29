import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  countInStock: {
    type: Number,
    required: true,
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  cartItems: [cartItemSchema],
}, {
  timestamps: true,
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
