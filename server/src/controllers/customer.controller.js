require('dotenv').config();
const { encryptPassword, decryptPassword } = require('../helper/common.helper');
const jwt = require("jsonwebtoken");
const customer = require('../models/customer.model');

const getCustomers = async(req, res) => {
    try {
        const customers = await customer.find({});
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({
            success: false,
            message:"GET_CUSTOMER_FAILED",
            error: error.message,
        });
    }
};

const getCustomerByName = async(req, res) => {
    try {
        const { username } = req.params;
        const cus = await customer.findOne({ username });

        if(!cus) {
            return res.status(404).json({
                success:false,
                message: "CUSTOMER_NOT_FOUND",
                error: "Customer not found",
            });
        } 
        res.status(200).json(cus);

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message:"SEARCH_CUSTOMER_FAILED",
            error: error.message,
        });
    }
};

const createCustomer = async (req, res) => {
    try {
        const { username, password, address, phone } = req.body;
        const existedUser = await customer.findOne({ username });
        if(existedUser) {
            return res.status(400).json({
                success: false,
                message: "USERNAME_ALREADY_EXISTED",
                error: "Username is already existed",
            });
        }

        const hashPassword = encryptPassword(password);
        const newCustomer = await customer.create({
            username,
            password: hashPassword,
            address,
            phone,
        });
        res.status(201).json({ 
            data: newCustomer,
            success: true,
            message: "SUCCESS",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message:"CREATED_CUSTOMER_FAILED",
            error: error.message,
        });
    }
};

const loginCustomer = async(req, res) => {
    try {
        const { username, password, address, phone } = req.body;
        const existedUser = await customer.findOne({ username });
        if(!existedUser) {
            return res.status(401).json({
                success: false,
                message: "CUSTOMER_NOT-FOUND",
                error: "Customer is not found",
            });
        }

        const dePassword = decryptPassword(existedUser.password);
        // console.log(dePassword);
        if( dePassword !== password) {
            return res.status(401).json({ 
                success: false,
                message: 'INVAILD_PASSWORD',
                error: "Password is not match",
            });
        }

        const token = jwt.sign(
            {
                id: existedUser._id,
                name: existedUser.username,
                password: existedUser.password,
                address: existedUser.address,
                phone: existedUser.phone,
            },
            process.env.SECRETKEY,
            {
                expiresIn: 86400,
            }
        );
        res.status(200).json({token});
        
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    getCustomers,
    getCustomerByName,
    createCustomer,
    loginCustomer
}
