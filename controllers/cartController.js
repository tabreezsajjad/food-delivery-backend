const Cart = require('../models/cartModel');

//Fetch Cart

const getCart = async (req, res) => {
    const { uid } = req.params;
    try {
      let cart = await Cart.findOne({ uid });
      if (!cart) {
        cart = new Cart({ uid, items: [], restaurantId: null });
        await cart.save();
      }
      res.status(200).json({ items: cart.items, restaurantId: cart.restaurantId });
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  };
  
//Add items to the cart

const addItemToCart = async (req, res) => {
    const { userId, item, restaurantId } = req.body;
  
    // Validate required fields
    if (!userId || !item || !restaurantId) {
      return res.status(400).json({ error: 'Missing required fields: userId, item, or restaurantId' });
    }
  
    try {
      // Find or create the cart
      let cart = await Cart.findOne({ uid: userId });
      if (!cart) {
        cart = new Cart({ uid: userId, items: [], restaurantId: null });
      }
  
      // Reset the cart if the restaurantId changes
      if (cart.restaurantId && cart.restaurantId !== restaurantId) {
        cart.items = [];
      }
  
      cart.restaurantId = restaurantId;
  
      // Check if item exists in the cart
      const existingItem = cart.items.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        cart.items.push({ ...item, quantity: 1 });
      }
  
      await cart.save();
      res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  };
  
  //Clear Cart

  const clearCart = async (req, res) => {
    const { userId } = req.body;
    try {
      await Cart.deleteOne({ uid: userId });
      res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  };
  
  
  //get the total price of items in the cart

  const getCartTotal = async (req, res) => {
    const { uid } = req.params;
  
    try {
      // Find the cart for the given user ID
      const cart = await Cart.findOne({ uid });
  
      if (!cart || cart.items.length === 0) {
        // If no cart or cart is empty, return total price as 0
        return res.status(200).json({ totalPrice: 0 });
      }
  
      // Calculate the total price by summing up price * quantity for each item
      const totalPrice = cart.items.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1)); // Default quantity is 1
      }, 0);
  
      // Respond with the calculated total price
      res.status(200).json({ totalPrice });
    } catch (error) {
      console.error('Error fetching cart total:', error);
      res.status(500).json({ error: 'Failed to fetch cart total' });
    }
  };
  
  
module.exports = {
    getCart,
    addItemToCart,
    clearCart,
    getCartTotal,
};
