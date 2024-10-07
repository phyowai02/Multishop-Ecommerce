const express = require("express");

const { getCustomers, getCustomerByName, createCustomer, loginCustomer } = require('../controllers/customer.controller');
const customerRouter = express.Router();

customerRouter.get('/', getCustomers);
customerRouter.get('/name/:username', getCustomerByName);

customerRouter.post('/create', createCustomer);

customerRouter.post('/login', loginCustomer);

module.exports = customerRouter;