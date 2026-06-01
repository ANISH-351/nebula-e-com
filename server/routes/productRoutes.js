const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');

router.post('/addProduct', upload.single('image'), productController.addProduct);
router.get('/product', productController.getProducts);        // all products
router.get('/search', productController.searchProducts);
router.get('/product/:id', productController.getProducts);    // category products
router.put('/updateProduct/:id', upload.single('image'), productController.updateProduct);
router.delete('/deleteProduct/:id', productController.deleteProduct);
router.get('/featuredProducts', productController.getFeaturedProducts);
router.put('/makeFeatured/:id', productController.makeFeatured);
router.get('/newArrivals', productController.getNewArrivals);
router.get('/relatedProducts/:id/:category_id', productController.getRelatedProducts);



module.exports = router;