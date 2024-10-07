const express = require('express');

const unitRouter = express.Router();
const { getUnits, createUnit, updateUnit, deleteUnit } = require('../controllers/Unit.controller');
const verifyToken = require('../middlewares/authJwtVerify');


unitRouter.get('/', verifyToken, getUnits);

unitRouter.post('/', verifyToken, createUnit);

unitRouter.put('/:id', verifyToken, updateUnit);

unitRouter.delete('/:id',verifyToken, deleteUnit);

module.exports = unitRouter;


