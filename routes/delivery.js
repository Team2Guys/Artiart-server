const express = require('express');
const deliveryRouter = express.Router();
const orderController = require('../controller/orderDelivery');

deliveryRouter.post('/order', orderController.createOrder);


module.exports = deliveryRouter;
