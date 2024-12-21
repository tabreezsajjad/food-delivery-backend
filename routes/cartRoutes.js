const express = require('express');
const {
  getCart,
  addItemToCart,
  clearCart,
  getCartTotal,
} = require('../controllers/cartController');

const router = express.Router();

router.get('/:uid', getCart); // Fetch cart
router.post('/add', addItemToCart); // Add item to cart
router.post('/clear', clearCart); // Clear cart
router.get('/:uid/total', getCartTotal); // Get cart total price

module.exports = router;
