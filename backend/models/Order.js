const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: { // Store the price at the time of order
      type: Number,
      required: true,
    },
  }],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: {
    type: Object, // Store address details
    required: false, // Allow null for digital products or specific cases
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    required: false, // Adjust based on payment integration
  },
  transactionId: {
    type: String,
    required: false, // Store transaction ID from payment gateway
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming sellers are also users
    required: false, // Can be null if the platform manages the sale
  },
}, { timestamps: true });

OrderSchema.index({ customerId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ orderDate: -1 });

exports.Order = mongoose.model('Order', OrderSchema);