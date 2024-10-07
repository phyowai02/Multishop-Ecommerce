const express = require("express");

const { getAdminUsers, getAdminUserByName, createAdminUser, loginAdminUser } = require('../controllers/adminUser.controller');
const adminUserRouter = express.Router();

adminUserRouter.get('/', getAdminUsers);
adminUserRouter.get('/name/:username', getAdminUserByName);

adminUserRouter.post('/create', createAdminUser);

adminUserRouter.post('/login', loginAdminUser);

module.exports = adminUserRouter;