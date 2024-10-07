require('dotenv').config();
const Order = require('../models/order.model');
const Product = require("../models/product.model");

const getOrders = async (req, res) => {
    try {
        const { adminId } = req.params;
        let orders;

        if(adminId) {
             // Fetch orders only for the given adminId (shop admin)
            orders = await Order.find({ adminId });
        }else {
            // Fetch all orders (super admin)
            orders = await Order.find({}); 
        }
        res.status(200).json({
            message: "Orders retrieved successfully!",
            orders: orders,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve orders",
            error: error.message || error,
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const orders = await Order.findById(orderId);
        if(!orders) {
            return res.status(404).json({
                success: false,
                message: "ORDER_NOT_FOUND",
                error: "Order not found"
            });
        }
        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({
            message: "Fail to retrieve orders",
            error: error.message || error,
        });
    }
};

const getOrderByAdmin = async(req, res) => {
    try {
        const { adminId } = req.params;
        const orders = await Order.find({'items.adminId': adminId});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

const createOrder = async (req, res) => {
    try {
        const { address, phone, items, total, status } = req.body;
        const userId = req.body.userId; 
        const username = req.body.username; 

        if (!userId || !username) {
            return res.status(400).json({
                message: "User ID and username are required",
            });
        }

        // Create order object
        const newOrder = new Order({
            userId,
            username,
            address,
            phone,
            items,
            status,
            total,
        });

        // Save the order
        const savedOrder = await newOrder.save();
    
        res.status(201).json({
            message: "Order created successfully!",
            order: savedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create order",
            error: error.message || error,
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, items } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const defaultStatuses = ['completed', 'declined', 'canceled', 'pending'];

        if (!defaultStatuses.includes(status)) {
            order.status = status;
        } else {

            if (order.status === 'completed' && status === 'pending') {
                // Add the stock back when changing from completed to pending
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(item._id, {
                        $inc: { count: item.quantity }
                    });
                }
            }

            if (status === 'completed') {
                if (!items) {
                    return res.status(400).json({ message: "Items are required for confirmation" });
                }
    
                // Update the items and adjust stock
                order.items = order.items.map(orderItem => {
                    const incomingItem = items.find(item => item._id.toString() === orderItem._id.toString());
                    if (incomingItem) {
                        return { ...orderItem.toObject(), quantity: incomingItem.quantity };
                    }
                    return orderItem;
                });
    
                // Decrement stock for each item
                for (const item of items) {
                    await Product.findByIdAndUpdate(item._id, {
                        $inc: { count: -item.quantity }
                    });
                }
            }
    
            if (status === 'declined') {
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(item._id, {
                        $inc: { count: item.quantity }
                    });
                }
            }

            order.status = status;
        }

        const updatedOrder = await order.save();

        res.status(200).json({
            message: `Order status updated to ${status} successfully`,
            order: updatedOrder,
        });

    } catch (error) {
        res.status(500).json({
            message: `Failed to update the order`,
            error: error.message || error,
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getOrderByAdmin
};
