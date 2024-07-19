const axios = require('axios');
const dotenv = require('dotenv');
const PaymentDB = require('../model/payementModel');
const qs = require('qs');
let data = qs.stringify({
    'grant_type': process.env.NEXT_PUBLIC_FENIX_GRANT_TYPE,
    'client_id': process.env.NEXT_PUBLIC_FENIX_CLIENT_ID,
    'client_secret': process.env.NEXT_PUBLIC_FENIX_CLIENT_SECRET
});

let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.NEXT_PUBLIC_FENIX_BASEURL}/user/token`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Set the Content-Type header
    },
    data: data
};

const generateToken = async () => {
    try {
        const response = await axios.request(config);
        return response.data.access_token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw error;
    }
};

const orderProcess = async (token, orderData) => {
    let createOrderConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.NEXT_PUBLIC_FENIX_BASEURL}/express/order`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(orderData)
    };

    try {
        const response = await axios.request(createOrderConfig);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}

const transformOrderData = (data) => {
    return {
        merchant_id: process.env.NEXT_PUBLIC_MERCHANT_ID,
        pickup_address: {
            address: "Building Villa: Khalil Al Sayegh Building, Apartment/Office: Office No. 5 ",
            details: "Artiart UAE",
            coordinates: {
                latitude: 25.24073448593297,
                longitude: 55.30862134089627
            },
            city: "Dubai",
            country: "United Arab Emirates"
        },
        dropoff_address: {
            address: data.address,
            city: data.state,
            country: data.country
        },
        customer_details: {
            customer_full_name: `${data.first_name} ${data.last_name}`,
            email: data.email,
            phone_number: data.phone_number,
        },
        service_type: "NEXT_DAY_DELIVERY",
        payment_method_type: "CREDIT_BALANCE",
        reference_order_number: data.order_id,
        payment_method: {
            method: "ONLINE",

        }
    };
};

exports.createOrder = async (req, res) => {
    console.log("createOrder triggered");
    try {
        let token = await generateToken();
        console.log("Generated Token:", token);
        let orderData = req.body;
        console.log(orderData)
        let transformedData = await transformOrderData(orderData);

        let orderResponse = await orderProcess(token, transformedData);
        console.log("Order Response:", orderResponse);
        let existingOrder = await PaymentDB.findOne({ 'order_id': orderData.order_id });
        // console.log(existingOrder);
        if (existingOrder) {
            existingOrder.deliveryDetails = {
                order_id: orderResponse.order_id,
                order_status: orderResponse.order_status,
                tracking_number: orderResponse.tracking_number,
                airways_bill_url: orderResponse.airways_bill_url,
                tracking_url: orderResponse.tracking_url
            };
            existingOrder.deliveryStatus = true;
            await existingOrder.save();
        }

        res.status(200).send(orderResponse);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Failed to create order.");
    }
};