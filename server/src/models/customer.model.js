const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema(
    {
        username: {
            type: 'String',
            required: true,
            unique: true,
        },
        password: {
            type: 'String',
            required: true,
        },
        address: {
            type: 'String',
            required: false,
        },
        phone: {
            type: 'String',
            required: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    },
);

const customer = mongoose.model('Customer', customerSchema);

module.exports = customer;

