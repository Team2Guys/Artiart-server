const express = require('express');
const paymentRouter = express.Router();
const PaymentController = require('../controller/payementController');

paymentRouter.post('/authenticate', PaymentController.authenticate);
paymentRouter.post('/order', PaymentController.createOrder);
paymentRouter.post('/payment_key', PaymentController.generatePaymentKey);
paymentRouter.post('/status', PaymentController.checkPaymentStatus);

module.exports = paymentRouter;
