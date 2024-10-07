const mongoose = require("mongoose");
const { Schema } = mongoose;

const shopSchema = new Schema (
    {
        shopName: {
            type: 'String',
            required: true,
        },
        shopAddress: {
            type: 'String',
            required: true,
        },
        shopPhone: {
            type: 'String',
            required: true,
        },
        shopLogo: {
            type: 'String',
            required: true,
        },
        createAt: {
            type: Date,
            default: Date.now,
        },
        updateAt: {
            type: Date,
            default: Date.now,
        }
    }
)

const shop = mongoose.model("Shop", shopSchema);

module.exports = shop;