const express = require('express');
const Cart = require('../models/Cart');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const router = express.Router();

// ===== POST /api/carts - Add item to cart (protected) =====
router.post('/', auth, async (req, res) => {
  try {
    const { itemId } = req.body;

    // Validation
    if (!itemId) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Add item to cart
    if (!cart.items.includes(itemId)) {
      cart.items.push(itemId);
    } else {
      return res.status(400).json({ error: 'Item already in cart' });
    }

    await cart.save();
    res.status(201).json({ message: 'Item added to cart', cartSize: cart.items.length });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Error adding to cart' });
  }
});

// ===== GET /api/carts - Get user's cart (protected) =====
router.get('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items');
    const cartData = cart || { items: [], _id: null };
    res.status(200).json(cartData);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Error fetching cart' });
  }
});

// ===== DELETE /api/carts/:itemId - Remove item from cart (protected) =====
router.delete('/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Remove item from cart
    cart.items = cart.items.filter(id => id.toString() !== itemId);
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cartSize: cart.items.length });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ error: 'Error removing from cart' });
  }
});

// ===== DELETE /api/carts - Clear entire cart (protected) =====
router.delete('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ error: 'Error clearing cart' });
  }
});

module.exports = router;