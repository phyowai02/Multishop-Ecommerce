const express = require("express");

const orderRouter = express.Router();
const verifyToken = require('../middlewares/authJwtVerify');

const { createOrder, getOrders, getOrderById, updateOrderStatus, getOrderByAdmin } = require('../controllers/order.controller');

orderRouter.get('/', verifyToken, getOrders);
orderRouter.get('/admin/:adminId', verifyToken, getOrderByAdmin);

orderRouter.get('/:orderId',verifyToken, getOrderById);

orderRouter.post('/create', verifyToken, createOrder);

orderRouter.put('/:orderId/status', verifyToken, updateOrderStatus);

module.exports = orderRouter;