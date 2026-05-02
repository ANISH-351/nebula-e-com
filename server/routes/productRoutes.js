const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');

router.post('/addProduct', upload.single('image'), productController.addProduct);
router.get('/product', productController.getProducts);        // all products
router.get('/product/:id', productController.getProducts);    // category products
router.put('/updateProduct/:id', upload.single('image'), productController.updateProduct);
router.delete('/deleteProduct/:id', productController.deleteProduct);

module.exports = router;