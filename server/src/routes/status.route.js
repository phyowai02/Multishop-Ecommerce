const express = require('express');

const statusRouter = express.Router();
const { getAllStatus, createStatus, updateStatus, deleteStatus, getStatusById } = require('../controllers/status.controller');
const verifyToken = require('../middlewares/authJwtVerify');


statusRouter.get('/', verifyToken, getAllStatus);
statusRouter.get('/:id', verifyToken, getStatusById);

statusRouter.post('/', verifyToken, verifyToken, createStatus);

statusRouter.put('/:id', verifyToken, updateStatus);

statusRouter.delete('/:id', verifyToken, deleteStatus);

module.exports = statusRouter;


