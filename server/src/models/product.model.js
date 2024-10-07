const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema (
    {
        name: {
            type: 'String',
            required: true,
            unique: true,
        },
        content: {
            type: 'String',
            required: true,
        },
        imgURLs: {
            type: [String],
            required: true,
        },
        unit: {
            type: 'String',
            required: true,
        },
        count: {
            type: 'Number',
            require: true,
            default: 0,
        },
        price: {
            type: 'Number',
            require: true,
        },
        weight: {
            type: [String],
            require: true,
        },
        color: {
            type: [String],
            require: true,
        },
        adminId: {
            type: 'String',
            require: true,
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

const product = mongoose.model('Product', productSchema);

module.exports = product;