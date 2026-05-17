const express = require('express');
const { verifyToken } = require('./auth');
const db = require('../db');

const orderRouter = express.Router();

// GET all orders for a user
orderRouter.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const query = 'SELECT * FROM orders WHERE user_id = $1';
    const values = [userId];
    const result = await db.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST a new order
orderRouter.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, total_amount, shipping_address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || !total_amount || !shipping_address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO orders (user_id, items, total_amount, shipping_address, order_date)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `;
    const values = [userId, JSON.stringify(items), total_amount, shipping_address];
    const result = await db.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = { orderRouter };