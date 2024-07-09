const axios = require('axios');
const dotenv = require('dotenv');
const PaymentDB = require('../model/payementModel');
dotenv.config();

const paymobAPI = axios.create({
    baseURL: process.env.PAYMOD_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

exports.authenticate = async (req, res) => {


    const apiKey = process.env.PAYMOB_API_KEY;
    if (!apiKey) {
        console.log("API Key is not set in environment variables.");
        return res.status(500).json({ error: "API Key is not set in environment variables." });
    }

    console.log("API Key: ", apiKey);  // Log the API key for debugging purposes

    try {
        const response = await paymobAPI.post('/auth/tokens', {
            api_key: apiKey,
        });
        // console.log("Authentication response: ", response.data);
        const token = response.data.token;
        res.status(200).json({ token });
    } catch (error) {
        // console.log("ERROR during authentication");
        // console.log(error.response ? error.response.data : error.message); // Detailed error logging
        res.status(500).json({ error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    console.log("Reached Order creation");
    try {
        const { token, amount, items } = req.body;
        const orderResponse = await paymobAPI.post('/ecommerce/orders', {
            auth_token: token,
            delivery_needed: false,
            amount_cents: amount * 100,
            currency: process.env.PAYMOD_CURRENCY,
            merchant_id: process.env.PAYMOB_MERCHANT_ID,
            items,
        });
        // console.log("Order creation response: ", orderResponse.data);
        const orderId = orderResponse.data.id;
        res.status(200).json({ orderId });
    } catch (error) {
        // console.log("ERROR during order creation");
        // console.log(error.response ? error.response.data : error.message); // Detailed error logging
        res.status(500).json({ error: error.message });
    }
};

exports.generatePaymentKey = async (req, res) => {
    // console.log("Reached Payment Key generation");
    try {
        const { token, orderId, amount, billingData } = req.body;
        console.log(billingData);

        const paymentKeyResponse = await paymobAPI.post('/acceptance/payment_keys', {
            auth_token: token,
            amount_cents: amount * 100,
            expiration: 3600,
            order_id: orderId,
            billing_data: billingData,
            currency: process.env.PAYMOD_CURRENCY,
            integration_id: process.env.PAYMOB_INTEGRATION_ID,
        });
        console.log("Payment Key generation response: ", paymentKeyResponse.data);
        const paymentKey = paymentKeyResponse.data.token;
        const newOrder = new PaymentDB(billingData);
        await newOrder.save();

        res.status(200).json({ paymentKey });
    } catch (error) {
        console.log("ERROR during payment key generation");
        console.log(error.response ? error.response.data : error.message); // Detailed error logging
        res.status(500).json({ error: error.message });
    }
};

exports.checkPaymentStatus = async (req, res) => {
    console.log("Checking payment status");
    console.log(req.query);
    try {
        const { orderId } = req.query;

        const response = await paymobAPI.get(`/ecommerce/orders/${orderId}/transactions_count`, {
            headers: {
                Authorization: `Bearer ${req.headers.authorization}`
            }
        });
        const status = response.data.status;
        res.status(200).json({ status });
    } catch (error) {
        console.log("ERROR during payment status check");
        console.log(error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
};

