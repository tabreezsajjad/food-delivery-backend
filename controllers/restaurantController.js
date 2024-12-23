const Restaurant = require('../models/restaurantModel');

// Utility function to normalize addresses
const normalizeAddress = (address) => address.trim().toLowerCase();

//Add a new restaurant

const addRestaurant = async(req, res) =>{
  try {
    const menu = req.body.menu.map((item) => ({
      description: item.description,
      price: item.price,
      image: item.image || '',
    }));

    const restaurant = new Restaurant({
      name: req.body.name,
      address: req.body.address,
      contact: req.body.contact,
      location: req.body.location,
      menu,
    });

    await restaurant.save();
    res.status(201).json({ message: 'Restaurant added successfully!' });
  } catch (error) {
    console.error('Error saving restaurant:', error);
    res.status(500).json({ error: 'Error saving restaurant.' });
  }
}

//Get Nearby Restaurant

const getNearbyRestaurants = async (req, res) => {
  const { lat, lng, radius, query } = req.query;

  try {
    // Build the base query for nearby restaurants
    const baseQuery = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(radius) * 1000, // Convert km to meters
        },
      },
    };

    // Add search query for name or menu description
    if (query) {
      baseQuery.$or = [
        { name: { $regex: query, $options: 'i' } }, // Search in restaurant name
        { 'menu.description': { $regex: query, $options: 'i' } }, // Search in menu items
      ];
    }

    const restaurants = await Restaurant.find(baseQuery);
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    res.status(500).json({ error: 'Error fetching nearby restaurants' });
  }
};


//Get Restaurant By Id

const getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: 'Error fetching restaurant' });
  }
}


// Get restaurant location by ID

const getRestaurantLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id, { location: 1 });
    if (!restaurant) {
      return res.status(404).send({ error: 'Restaurant not found' });
    }
    res.json({
      lat: restaurant.location.coordinates[1], // Latitude
      lng: restaurant.location.coordinates[0], // Longitude
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Error fetching location' });
  }
};

module.exports = {
    normalizeAddress,
    addRestaurant,
    getNearbyRestaurants,
    getRestaurantById,
    getRestaurantLocation,
};