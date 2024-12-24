const User = require('../models/userModel');
const Restaurant = require('../models/restaurantModel');

// Create a new user
const createUser = async (req, res) => {
  const { uid, email } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ error: 'Missing required fields: uid or email' });
  }

  try {
    const existingUser = await User.findOne({ uid });

    if (existingUser) {
      return res.status(200).json({ message: 'User already exists', user: existingUser });
    }

    const newUser = new User({ uid, email });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
};

// Fetch a specific order by user ID and order ID
const getOrder = async (req, res) => {
  const { uid, orderId } = req.params;

  try {
    const user = await User.findOne({ uid, 'orders._id': orderId }, { 'orders.$': 1 });
    if (!user || !user.orders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = user.orders[0];
    const restaurant = await Restaurant.findById(order.restaurantId, { location: 1 });
    if (!restaurant || !restaurant.location) {
      return res.status(404).json({ error: 'Restaurant location not found' });
    }

    res.status(200).json({
      restaurant: {
        id: restaurant._id,
        location: {
          lat: restaurant.location.coordinates[1],
          lng: restaurant.location.coordinates[0],
        },
      },
      deliveryDetails: order.deliveryDetails,
      items: order.items,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
};

// Save a new order for a user
const saveOrder = async (req, res) => {
  const { uid, order } = req.body;

  if (!uid || !order || !Array.isArray(order.items) || order.items.length === 0) {
    return res.status(400).json({ error: 'Invalid payload: UID, order, and items are required' });
  }

  try {
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newOrder = {
      restaurantId: order.restaurantId,
      items: order.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      totalPrice: order.totalOrderPrice,
      deliveryDetails: order.deliveryDetails,
      timestamp: new Date(),
    };

    user.orders.push(newOrder);
    await user.save();

    res.status(201).json({ message: 'Order saved successfully', orderId: user.orders.at(-1)._id });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order', details: error.message });
  }
};

// Fetch all saved addresses for a user
const getAddresses = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Failed to fetch addresses', details: error.message });
  }
};

// Save a new address for a user
const saveAddress = async (req, res) => {
  const { uid, address } = req.body;

  if (!uid || !address) {
    return res.status(400).json({ error: 'Missing required fields: UID or address' });
  }

  try {
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isDuplicate = user.addresses.some(addr => {
      const existing = addr.deliveryAddress.trim().toLowerCase();
      const incoming = address.deliveryAddress.trim().toLowerCase();

      const areLocationsClose = (loc1, loc2) => {
        const threshold = 0.0001; // Adjust threshold for floating-point differences
        return (
          Math.abs(loc1.lat - loc2.lat) <= threshold &&
          Math.abs(loc1.lng - loc2.lng) <= threshold
        );
      };

      return (
        existing === incoming &&
        areLocationsClose(addr.deliveryLocation, address.deliveryLocation)
      );
    });

    if (isDuplicate) {
      return res.status(400).json({ error: 'Address already exists' });
    }

    user.addresses.push(address);
    await user.save();
    res.status(201).json({ message: 'Address saved successfully', addresses: user.addresses });
  } catch (error) {
    console.error('Error saving address:', error);
    res.status(500).json({ error: 'Failed to save address', details: error.message });
  }
};


const getOrderDeliveryLocation= async (req, res) => {
  const { uid, orderId } = req.params;

  try {
    // Retrieve the user and order
    const user = await User.findOne({ uid, 'orders._id': orderId }, { 'orders.$': 1 });

    if (!user || !user.orders || user.orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = user.orders[0];

    // Validate delivery details
    if (!order.deliveryDetails || !order.deliveryDetails.deliveryLocation) {
      return res.status(400).json({ error: 'Delivery location not provided for this order.' });
    }

    // Fetch restaurant details
    const restaurant = await Restaurant.findById(order.restaurantId, { location: 1, name: 1 });
    if (!restaurant || !restaurant.location) {
      return res.status(404).json({ error: 'Restaurant location not found' });
    }

    // Return delivery and restaurant locations
    res.status(200).json({
      deliveryLocation: order.deliveryDetails.deliveryLocation,
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        location: {
          lat: restaurant.location.coordinates[1],
          lng: restaurant.location.coordinates[0],
        },
      },
    });
  } catch (error) {
    console.error('Error fetching delivery location:', error);
    res.status(500).json({ error: 'Failed to fetch delivery location' });
  }
};


module.exports = {
  createUser,
  getOrder,
  saveOrder,
  getAddresses,
  saveAddress,
  getOrderDeliveryLocation
};
