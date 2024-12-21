const mongoose = require('mongoose');
const {feedbackSchema} = require('./feedbackModel')

// User Schema
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  addresses: [
    {
      deliveryAddress: String,
      buildingName: String,
      floorNumber: String,
      doorNumber: String,
      deliveryLocation: { lat: Number, lng: Number },
    },
  ],
  orders: [
    {
      restaurantId: String,
      items: [
        {
          name: String,
          price: Number,
          quantity: Number,
        },
      ],
      totalPrice: Number,
      deliveryDetails: {
        deliveryAddress: String,
        deliveryLocation: { lat: Number, lng: Number },
        deliveryPrice: Number,
        deliveryDistance: Number,
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  feedbacks: { type: [feedbackSchema], default: [] }, // Use feedbackSchema here
});

const User = mongoose.model('User', userSchema);

module.exports = User;