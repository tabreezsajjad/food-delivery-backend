const mongoose = require('mongoose');

//Feedback Schema
const feedbackSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true },
  orderId: { type: String, required: true },
  restaurantRating: { type: Number, required: true },
  deliveryRating: { type: Number, required: true },
  comments: { type: String },
  dishes: [
    {
      name: { type: String, required: true },
      rating: { type: Number, required: true },
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
