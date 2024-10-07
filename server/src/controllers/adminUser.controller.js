require('dotenv').config();
const { encryptPassword, decryptPassword } = require('../helper/common.helper');
const jwt = require("jsonwebtoken");
const adminUser = require('../models/adminUser.model');

const getAdminUsers = async(req, res) => {
    try {
        const adminUsers = await adminUser.find({});
        res.status(200).json(adminUsers);
    } catch (error) {
        res.status(500).json({
            success: false,
            message:"GET_ADMIN_USERS_FAILED",
            error: error.message,
        });
    }
};

const getAdminUserByName = async(req, res) => {
    try {
        const { username } = req.params;
        const adminuser = await adminUser.findOne({ username });

        if(!adminuser) {
            return res.status(404).json({
                success:false,
                message: "USERNAME_NOT_FOUND",
                error: "Username not found",
            });
        } 
        res.status(200).json(adminuser);

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message:"SEARCH_ADMIN_USER_FAILED",
            error: error.message,
        });
    }
};

const createAdminUser = async (req, res) => {
    try {
        const { username, password, role, shopName, shopAddress, shopPhone, shopLogo } = req.body;
        const existedUser = await adminUser.findOne({ username });
        if(existedUser) {
            return res.status(400).json({
                success: false,
                message: "USERNAME_ALREADY_EXISTED",
                error: "Username is already existed",
            });
        }

        const hashPassword = encryptPassword(password);
        const newAdminUser = await adminUser.create({
            username,
            password: hashPassword,
            role,
            shopName,
            shopAddress,
            shopPhone,
            shopLogo
        });
        res.status(201).json({ 
            data: newAdminUser,
            success: true,
            message: "SUCCESS",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message:"CREATED_ADMIN_USER_FAILED",
            error: error.message,
        });
    }
};

const loginAdminUser = async(req, res) => {
    try {
        const { username, password} = req.body;
        const existedUser = await adminUser.findOne({ username });
        if(!existedUser) {
            return res.status(401).json({
                success: false,
                message: "USERNAME_NOT-FOUND",
                error: "Username is not found",
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
                role: existedUser.role,
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
    getAdminUsers,
    getAdminUserByName,
    createAdminUser,
    loginAdminUser
};