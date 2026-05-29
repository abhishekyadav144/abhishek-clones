import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, cartItems: [] });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, size, color } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, cartItems: [] });
    }

    // Match exact variant (product + size + color)
    const existItemIndex = cart.cartItems.findIndex(item => 
      item.product.toString() === productId && 
      item.size === size && 
      item.color === color
    );

    if (existItemIndex !== -1) {
      cart.cartItems[existItemIndex].quantity += quantity;
      // Ensure it doesn't exceed stock
      if (cart.cartItems[existItemIndex].quantity > product.countInStock) {
        cart.cartItems[existItemIndex].quantity = product.countInStock;
      }
    } else {
      cart.cartItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity: quantity,
        size: size || '',
        color: color || ''
      });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const existItemIndex = cart.cartItems.findIndex(item => item.product.toString() === req.params.productId);

    if (existItemIndex !== -1) {
      cart.cartItems[existItemIndex].quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.cartItems = [];
      await cart.save();
      res.json(cart);
    } else {
      res.status(404);
      throw new Error('Cart not found');
    }
  } catch (error) {
    next(error);
  }
};

export { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
