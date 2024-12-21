const express = require('express');
const {
  addRestaurant,
  getNearbyRestaurants,
  getRestaurantById,
  getRestaurantLocation,
} = require('../controllers/restaurantController');

const router = express.Router();

router.post('/', addRestaurant); // Route to add a new restaurant
router.get('/near', getNearbyRestaurants); // Route to get nearby restaurants
router.get('/:id', getRestaurantById); // Route to get restaurant details by ID
router.get('/:id/location', getRestaurantLocation); // Route to get restaurant location by ID

module.exports = router;
