const mongoose = require("mongoose");
const { Schema } = mongoose;

const statusSchema = new Schema (
    {
        status: {
            type: String,
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
);

const status = mongoose.model('Status', statusSchema);

module.exports = status;