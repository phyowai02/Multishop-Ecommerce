const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema (
    {
        userId: {
            type: 'String',
            required: true,
        },
        username: {
            type: 'String',
            required: true,
        },
        address: {
            type: 'String',
            required: true,
        },
        phone: {
            type: 'String',
            required: true,
        },
        items: [
            {
                productId: 'String',
                productName: 'String',
                quantity: 'Number',
                selectedColor: 'String',
                selectedSize: 'String',
                price: 'Number',
                imgURL: [String],
                stocks: 'Number',
                uniqueId: { 
                    type: String,
                    unique: true 
                },
                adminId: 'String',
            }
        ],
        total: {
            type: 'Number',
            required: true,
        },
        status: {
            type: 'String',
            default: 'pending',
        },
        createAt: {
            type: Date,
            default: Date.now,
        },
        updateAt: {
            type: Date,
            default: Date.now,
        }
    },
);

const order = mongoose.model('Order', orderSchema);

module.exports = order;