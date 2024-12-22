const Cart = require('../models/cartModel');

// Fetch Cart
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

// Add Items to Cart
const addItemToCart = async (req, res) => {
  const { userId, item, restaurantId } = req.body;

  if (!userId || !item || !restaurantId) {
    return res.status(400).json({ error: 'Missing required fields: userId, item, or restaurantId' });
  }

  try {
    let cart = await Cart.findOne({ uid: userId });
    if (!cart) {
      cart = new Cart({ uid: userId, items: [], restaurantId: null });
    }

    if (cart.restaurantId && cart.restaurantId !== restaurantId) {
      cart.items = [];
      cart.restaurantId = null;
      await cart.save();
      return res.status(409).json({
        message: 'Cart items cleared due to restaurant change.',
      });
    }

    cart.restaurantId = restaurantId;

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

// Update Item Quantity
const updateItemQuantity = async (req, res) => {
  const { userId, itemName, quantity } = req.body;

  if (!userId || !itemName || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Missing required fields: userId, itemName, or quantity' });
  }

  try {
    const cart = await Cart.findOne({ uid: userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find((cartItem) => cartItem.name === itemName);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    if (quantity < 1) {
      cart.items = cart.items.filter((cartItem) => cartItem.name !== itemName);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ message: 'Item quantity updated successfully' });
  } catch (error) {
    console.error('Error updating item quantity:', error);
    res.status(500).json({ error: 'Failed to update item quantity' });
  }
};

// Clear Cart
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

// Get Cart Total
const getCartTotal = async (req, res) => {
  const { uid } = req.params;

  try {
    const cart = await Cart.findOne({ uid });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ totalPrice: 0 });
    }

    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.price * (item.quantity || 1);
    }, 0);

    res.status(200).json({ totalPrice });
  } catch (error) {
    console.error('Error fetching cart total:', error);
    res.status(500).json({ error: 'Failed to fetch cart total' });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  clearCart,
  getCartTotal,
};
