const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/addcategory', categoryController.addCategory);
router.get('/getCategory', categoryController.getCategory);
router.put('/category/:id', categoryController.updateCategory);
router.delete('/category/:id', categoryController.deleteCategory);

module.exports = router;