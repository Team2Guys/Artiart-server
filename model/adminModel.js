const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    canAddProduct: {
        type: Boolean,
        default: false
    },
    canDeleteProduct: {
        type: Boolean,
        default: false
    },
    canAddCategory: {
        type: Boolean,
        default: false
    },
    canDeleteCategory: {
        type: Boolean,
        default: false
    }
});


const Admin = mongoose.model("Admins", adminSchema);

module.exports = { Admin };
