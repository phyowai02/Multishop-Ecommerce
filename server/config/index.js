const merge = require("merge-deep");
const config = require("./config");
const mongodb = require("./mongodb");

const configs = merge(config);

module.exports = {
    configs,
    mongodb,
}