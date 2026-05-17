const express = require('express')
const productRouter = express.Router()
const db = require('../db')
const { verifyToken } = require('../middleware/auth')

// GET /api/products - Get all products
productRouter.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/products/:id - Update a product (requires JWT)
productRouter.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params
  const { name, description, price, image_url, quantity } = req.body

  try {
    // Check if the product exists
    const checkProductQuery = 'SELECT * FROM products WHERE id = $1'
    const checkProductResult = await db.query(checkProductQuery, [id])

    if (checkProductResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Update the product
    const updateProductQuery = `
      UPDATE products
      SET name = $1, description = $2, price = $3, image_url = $4, quantity = $5
      WHERE id = $6
      RETURNING *
    `
    const updateProductValues = [name, description, price, image_url, quantity, id]
    const updateProductResult = await db.query(updateProductQuery, updateProductValues)

    res.json(updateProductResult.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = { productRouter }