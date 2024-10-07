const Shop = require("../models/shop.model");

const createShop = async(req, res) => {
    try {
        const shops = await Shop.create(req.body);
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

const getShops = async(req, res) => {
    try {
        const shops = await Shop.find({});
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getShopByName = async(req, res) => {
    try {
        const { shopName } = req.params;
        const name = await Shop.findOne({shopName});

        if(!name) {
            res.status(404).json({ message: "Shop not found"});
        }

        res.status(200).json(name);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateShop = async(req, res) => {
    try {
        const { id } = req.params;

        const shops = await Shop.findByIdAndUpdate(id, req.body, {
            new:true,
        });

        if(!shops) {
            res.status(404).json({ message: "Shop not found"});
        }

        const updateShop = await Shop.findById(id);

        res.status(200).json(updateShop);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteShop = async(req, res) => {
    try {
        const { id } = req.params;

        const shops = await Shop.findByIdAndDelete(id);

        if(!shops) {
            res.status(404).json({ message: "Shop not found"});
        }

        res.status(200).json({ message: "Shop deleted successful"});

    } catch (error) {
        res.status(500).json({ mesage: error.mesage });
    }
}

module.exports = {
    createShop,
    getShops,
    getShopByName,
    updateShop,
    deleteShop
}