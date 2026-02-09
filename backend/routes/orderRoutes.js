const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

const router = express.Router();

// ===== POST /api/orders - Place order from cart (protected) =====
router.post('/', auth, async (req, res) => {
  try {
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items');

    // Validation
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Add items before placing an order.' });
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + (item.price || 0), 0);

    // Create order
    const order = new Order({
      user: req.user._id,
      items: cart.items,
      total: parseFloat(total.toFixed(2)),
      createdAt: new Date(),
    });

    await order.save();

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
      total: order.total,
      itemCount: order.items.length,
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ error: 'Error placing order' });
  }
});

// ===== GET /api/orders - Get user's order history (protected) =====
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// ===== GET /api/orders/:orderId - Get specific order details (protected) =====
router.get('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('items');

    // Verify order belongs to authenticated user
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to view this order' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Error fetching order' });
  }
});

module.exports = router;