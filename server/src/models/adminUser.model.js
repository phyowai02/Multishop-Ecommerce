const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminUserSchema = new Schema(
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
        role: {
            type: 'String',
            enum: ['super admin', 'shop admin'],
            required: true,
        },
        shopName: {
            type: 'String',
            required: false,
        },
        shopAddress: {
            type: 'String',
            required: false,
        },
        shopPhone: {
            type: 'String',
            required: false,
        },
        shopLogo: {
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

const adminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = adminUser;

