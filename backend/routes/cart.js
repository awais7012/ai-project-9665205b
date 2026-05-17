const express = require('express');
const { verifyToken } = require('../middleware/auth');
const db = require('../db');

export const cartRouter = express.Router();

// GET /api/cart - Get cart for user
cartRouter.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch cart items from the database
    const query = `
      SELECT 
        cart_items.product_id, 
        cart_items.quantity, 
        products.name, 
        products.price,
        products.image_url
      FROM cart_items
      JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.user_id = $1;
    `;
    const { rows } = await db.query(query, [userId]);

    // Calculate total price
    const totalPrice = rows.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.status(200).json({ cartItems: rows, totalPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart - Add item to cart
cartRouter.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    // Check if the product exists
    const productQuery = 'SELECT * FROM products WHERE id = $1';
    const productResult = await db.query(productQuery, [productId]);

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the item is already in the cart
    const existingCartItemQuery = 'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2';
    const existingCartItemResult = await db.query(existingCartItemQuery, [userId, productId]);

    if (existingCartItemResult.rows.length > 0) {
      // Update the quantity if the item exists
      const newQuantity = existingCartItemResult.rows[0].quantity + quantity;
      const updateQuery = 'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3';
      await db.query(updateQuery, [newQuantity, userId, productId]);
    } else {
      // Add the item to the cart if it doesn't exist
      const insertQuery = 'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)';
      await db.query(insertQuery, [userId, productId, quantity]);
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});