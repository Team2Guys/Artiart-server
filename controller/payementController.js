const axios = require('axios');
const dotenv = require('dotenv');
const PaymentDB = require('../model/payementModel');
const {sendEmailHandler}= require('../utils/emailHandler')
dotenv.config();

const paymobAPI = axios.create({
    baseURL: process.env.PAYMOD_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


const gentereateToken = async()=>{
    try{
        const apiKey = process.env.PAYMOB_API_KEY;
        if (!apiKey) {
            console.log("API Key is not set in environment variables.");
            throw new Error("API Key is not set in environment variables.")
        }
        const response = await paymobAPI.post('/auth/tokens', {
            api_key: apiKey,
        });
        // console.log("Authentication response: ", response.data);
        const token = response.data.token;
        return token;
    }catch(err){
        throw new Error(err.message || JSON.stringify(err))
    }
}

exports.authenticate = async (req, res) => {

    try {
        let token = await gentereateToken()
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
        const orderId = orderResponse.data.id;
        console.log("orderResponse", orderResponse)
        res.status(200).json({ orderId });
    } catch (error) {

        res.status(500).json({ error: error.message });
    }
};

exports.generatePaymentKey = async (req, res) => {
    // console.log("Reached Payment Key generation");
    try {
        const { token, orderId, amount, billingData } = req.body;
  
        const paymentKeyResponse = await paymobAPI.post('/acceptance/payment_keys', {
            auth_token: token,
            amount_cents: amount * 100,
            expiration: 3600,
            order_id: orderId,
            billing_data: billingData,
            currency: process.env.PAYMOD_CURRENCY,
            integration_id: process.env.PAYMOB_INTEGRATION_ID,
        });
   
        const paymentKey = paymentKeyResponse.data.token;
        let name=billingData.first_name+ " " + billingData.last_name
       let email= billingData.email
        let phone=billingData.phone_number
         let Address =billingData.address
   
        sendEmailHandler(name, email, phone, Address,orderId )
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
        const transaction_id = orderId
        let token = await gentereateToken()

        const response = await paymobAPI.get(`https://pakistan.paymob.com/api/acceptance/transactions/${transaction_id}`, {
            headers: {
                Authorization: `Bearer token${token}`
            }
        });
        const status = response.data.status;
        console.log(response, "response ")
        res.status(200).json({ status });
    } catch (error) {
        console.log("ERROR during payment status check", error);
        console.log(error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
};

