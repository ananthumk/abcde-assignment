const express = require('express');
const Item = require('../models/Item');

const router = express.Router();

// ===== GET /api/items - List all items =====
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Error fetching items' });
  }
});

// ===== POST /api/items/seed - Seed sample items (for testing) =====
router.post('/seed', async (req, res) => {
  try {
    // Clear existing items
    await Item.deleteMany({});

    const items = [
      {
        name: 'Laptop Pro',
        price: 1299,
        description: 'High-performance laptop with 16GB RAM, 512GB SSD, Intel i7',
      },
      {
        name: 'Wireless Headphones',
        price: 199,
        description: 'Noise-cancelling Bluetooth headphones with 30-hour battery life',
      },
      {
        name: 'Smartphone X',
        price: 999,
        description: '6.7" AMOLED display, 256GB storage, 48MP camera',
      },
      {
        name: 'Smartwatch',
        price: 299,
        description: 'Fitness tracking, heart rate monitor, 5-day battery life',
      },
      {
        name: 'Tablet Plus',
        price: 599,
        description: '12.9" display, 128GB storage, great for creative work',
      },
      {
        name: 'Wireless Charger',
        price: 49,
        description: 'Fast charging pad compatible with all Qi-enabled devices',
      },
    ];

    await Item.insertMany(items);
    res.status(201).json({ message: 'Sample items seeded successfully', count: items.length });
  } catch (err) {
    console.error('Error seeding items:', err);
    res.status(500).json({ error: 'Error seeding items' });
  }
});

module.exports = router;