const mongoose = require('mongoose');

/**
 * Plan Schema
 */
const Plan = new mongoose.Schema({
  _paddleProductId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    default: 'active',
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  tier: {
    type: Number,
    required: true,
  },
  billingInterval: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * @typedef Plan
 */
module.exports = mongoose.model('Plan', Plan);
