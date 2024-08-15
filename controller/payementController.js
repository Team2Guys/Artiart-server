const axios = require('axios');
const dotenv = require('dotenv');
const PaymentDB = require('../model/payementModel');
const Productdb = require('../model/productModel.js');

const { sendEmailHandler } = require('../utils/emailHandler')
dotenv.config();

const paymobAPI = axios.create({
    baseURL: process.env.PAYMOD_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


const gentereateToken = async () => {
    try {
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
    } catch (err) {
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
        console.log("Order Id");
        console.log(orderId);
        res.status(200).json({ orderId });
    } catch (error) {

        res.status(500).json({ error: error.message });
    }
};

exports.generatePaymentKey = async (req, res) => {

    try {
        const { token, orderId, amount, billingData, orderedProductDetails, shippment_Fee } = req.body;
        let orderRecord = await PaymentDB.findOne({ order_id: orderId });


        if (orderRecord) return res.status(401).json({ message: "order_id already exists" });
        console.log(orderedProductDetails, "orderedProductDetails")

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
        let checkout = true;
        let paymentStatus = false

        const newOrder = new PaymentDB({ ...billingData, order_id: orderId, checkout, paymentStatus, orderedProductDetails, shippment_Fee });
        await newOrder.save();

        return res.status(200).json({ paymentKey });
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
        console.log("Response status is here:");
        const status = response.data.status;
        console.log(response, "response ")
        res.status(200).json({ status });
    } catch (error) {
        console.log("ERROR during payment status check", error);
        console.log(error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.postPayhnalder = async (req, res) => {
    try {
        const { id,
            success,
            amount_cents,
            integration_id,
            currency,
            is_refund,
            order_id,
            pending,
            is_3d_secure,
            created_at
        } = req.body
        if (!id || !success || !amount_cents || !integration_id || !currency || !order_id || !pending || !is_3d_secure || !created_at) {
            return res.status(400).json({ message: 'Missing required fields in request body' });
        }

        let orderRecord = await PaymentDB.findOne({ order_id });

        if (!orderRecord) {
            return res.status(404).json({ message: 'Payment record not found' });
        }
        orderRecord.paymentStatus = success
        orderRecord.success = success
        orderRecord.amount_cents = amount_cents
        orderRecord.integration_id = integration_id
        orderRecord.currency = currency
        orderRecord.is_refund = is_refund
        orderRecord.is_3d_secure = is_3d_secure
        orderRecord.transactionDate = created_at
        orderRecord.transactionId = id
        orderRecord.pending = pending
        orderRecord.checkout = false
        let TotalProductsPrice = 0

        function formatProductDetails(products) {
            return products.map(product => {
                TotalProductsPrice += Number(product.totalPrice)
                return `Product: ${product.name}\nColor: ${product.color}\nCount: ${product.Count}\nTotal Price:${product.totalPrice}`;
            }).join('\n');
        }
        formatProductDetails(orderRecord.orderedProductDetails)
        const updateProductQuantity = async (orderedProductDetails) => {

            for (const orderedProduct of orderedProductDetails) {
                const { id, Count, color } = orderedProduct;

                // Find the product by ID
                let product = await Productdb.findById(id);
                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }

                // Update the total stock quantity
                product.totalStockQuantity -= Count;

                // Update the variant stock quantity
                let variant = product.variantStockQuantities.find(v => v.variant === color);
                if (variant) {
                    variant.quantity -= Count;
                }

                // Save the updated product
                await product.save();
        
            }

        }
  let successFlag= success.toLowerCase()==="true"
        console.log(typeof(successFlag), successFlag)

        if (successFlag) {
            sendEmailHandler(orderRecord.first_name + " " + orderRecord.last_name, orderRecord.email, orderRecord.phone_number, orderRecord.address, `${orderRecord.state}, ${orderRecord.country}`, TotalProductsPrice, orderRecord.orderedProductDetails, orderRecord.shippment_Fee, ' Order has been confirmed')
            sendEmailHandler(orderRecord.first_name + " " + orderRecord.last_name, orderRecord.email, orderRecord.phone_number, orderRecord.address,  `${orderRecord.state}, ${orderRecord.country}`, TotalProductsPrice, orderRecord.orderedProductDetails, orderRecord.shippment_Fee, ' Order has been confirmed', orderRecord.email)
            await orderRecord.save();
            await updateProductQuantity(orderRecord.orderedProductDetails)
            return res.status(200).json({ message: 'Payment record updated successfully' })
        } else {
            throw new Error("Payement not successfull")
        }

    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err });
    }
};


