const mongoose = require('mongoose');
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


});


const PaymentDB = mongoose.model('Payment', paymentSchema);

module.exports = PaymentDB;





