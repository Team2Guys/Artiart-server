const express = require('express');
const paymentRouter = express.Router();
const PaymentController = require('../controller/payementController');

paymentRouter.post('/authenticate', PaymentController.authenticate);
paymentRouter.post('/order', PaymentController.createOrder);
paymentRouter.post('/payment_key', PaymentController.generatePaymentKey);
paymentRouter.get('/status', PaymentController.checkPaymentStatus);
paymentRouter.get('/postPayhnalder', PaymentController.postPayhnalder);

module.exports = paymentRouter;
