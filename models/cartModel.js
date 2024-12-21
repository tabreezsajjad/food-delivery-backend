
const mongoose = require('mongoose');

// Cart Schema
const cartSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  restaurantId: { type: String, default: null },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart