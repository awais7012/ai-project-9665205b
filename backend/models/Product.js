const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  // Add more fields as needed, such as:
  // - quantity: Number
  // - attributes: Object (e.g., size, color)
}, { timestamps: true });

// Indexes can improve query performance
// ProductSchema.index({ name: 'text', description: 'text' }); // Text index for searching
// ProductSchema.index({ category: 1 }); // Index on category for filtering

exports.Product = mongoose.model('Product', ProductSchema);