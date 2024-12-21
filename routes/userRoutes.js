const express = require('express');
const {
    createUser, 
    getOrder,
    saveOrder,
    getAddresses,
    saveAddress,
    getOrderDeliveryLocation
} = require("../controllers/userController");


const router = express.Router();

router.post('/', createUser);
router.get('/:uid/order/:orderId', getOrder); // Fetch specific order
router.post('/order', saveOrder); // Save a new order
router.get('/:uid/addresses', getAddresses); // Fetch saved addresses
router.post('/address', saveAddress); // Save a new address
router.get('/:uid/order/:orderId/delivery-location', getOrderDeliveryLocation); // Fetch delivery location for a specific order



module.exports = router;