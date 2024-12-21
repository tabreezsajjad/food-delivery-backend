const mongoose = require('mongoose');


// Restaurant Schema
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  menu: [
    {
      description: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
});

// Add the 2dsphere index for geospatial queries
restaurantSchema.index({ location: '2dsphere' });

// Restaurant Model
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;