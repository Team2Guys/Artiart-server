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
        console.log("Token");
        console.log(token);
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
        console.log("Order Id");
        console.log(orderId);
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
        // const newOrder = new PaymentDB(billingData);
        // await newOrder.save();
        console.log("Payment key")
        console.log(paymentKey);
        res.status(200).json({ paymentKey });
    } catch (error) {
        console.log("ERROR during payment key generation");
        console.log(error.response ? error.response.data : error.message); // Detailed error logging
        res.status(500).json({ error: error.message });
    }
};

exports.checkPaymentStatus = async (req, res) => {
    console.log("Checking payment status");
    // res.status(200).json(req.body)
    // const { orderId, auth_token } = req.body;
    // console.log(orderId);
    // console.log(auth_token);
    try {

        const { orderId, auth_token } = req.body;
        const response = await paymobAPI.get(`/api/acceptance/transactions/151646`, {
            headers: {
                Authorization: `Bearer ${auth_token}`
            }
        });
        console.log("Response status is here:");
        const status = response.data.status;
        console.log(response);
        res.status(200).json({ status });
    } catch (error) {
        console.log("ERROR during payment status check");
        console.log(error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
};

