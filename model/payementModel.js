const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const { boolean } = require('zod');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    apartment: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    floor: {
        type: String,
        required: false
    },
    building: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    order_id: {
        type: String,
        required: true
    },
    checkout: {
        type: Boolean,
        default: false

    },
    paymentStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    is_refund: {
        type: Boolean,
        default: false

    },
    currency: {
        type: String,

    },
    transactionId: {
        type: String,

    },
    integration_id: {
        type: String,

    },
    amount_cents: {
        type: String,

    },
    success: {
        type: Boolean,
        default: false

    },
    pending: {
        type: Boolean,
        default: false

    },
    is_3d_secure: {
        type: Boolean,

    },

    created_at: {
        type: String,

    }




});


const PaymentDB = mongoose.model('Payment', paymentSchema);

module.exports = PaymentDB;





