const mongoose = require("mongoose");
const { Schema } = mongoose;

const unitSchema = new Schema (
    {
        name: {
            type: 'String',
            required: true,
            unique: true,
        },
        short: {
            type: 'String',
            required: true,
            unique: true,
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

const unit = mongoose.model('Unit', unitSchema);

module.exports = unit;