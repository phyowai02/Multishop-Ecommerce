const express = require("express");

const shopRouter = express.Router();
const { getShops, getShopByName, updateShop, deleteShop, createShop } = require("../controllers/shop.controller");
const verifyToken = require("../middlewares/authJwtVerify");

shopRouter.get('/', getShops);
shopRouter.get('/name/:name', getShopByName);

shopRouter.post('/', createShop);

shopRouter.put('/:id', updateShop);

shopRouter.delete('/:id', deleteShop);


module.exports = shopRouter;