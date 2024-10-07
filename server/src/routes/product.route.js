const express  = require('express');

const productRouter = express.Router();
const { getProducts, getProductByName, createProduct, updateProduct, deleteProduct, getProductByAdminId } = require('../controllers/product.controller');
const verifyToken = require('../middlewares/authJwtVerify');

productRouter.get('/', verifyToken, getProducts);

productRouter.get('/name/:name', verifyToken, getProductByName);
productRouter.get('/admin/:adminId', verifyToken, getProductByAdminId);

productRouter.post('/',verifyToken, createProduct);

productRouter.put('/:id', verifyToken,  updateProduct);

productRouter.delete('/:id',verifyToken,  deleteProduct);

module.exports = productRouter;
