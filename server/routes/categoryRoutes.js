const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/categoryController');

const upload = require('../middleware/upload');


router.post(
    '/addcategory',
    upload.single('image'),
    categoryController.addCategory
);

router.get(
    '/getCategory',
    categoryController.getCategory
);

router.put(
    '/category/:id',
    upload.single('image'),
    categoryController.updateCategory
);

router.delete(
    '/category/:id',
    categoryController.deleteCategory
);

module.exports = router;