const express = require('express');

const router = express.Router();

const bannerController = require('../controllers/bannerController');

const upload = require('../middleware/upload');


router.post(
    '/addBanner',
    upload.single('image'),
    bannerController.addBanner
);

router.get(
    '/getBanners',
    bannerController.getBanners
);

router.put(
    '/updateBanner/:id',
    upload.single('image'),
    bannerController.updateBanner
);

router.delete(
    '/deleteBanner/:id',
    bannerController.deleteBanner
);

module.exports = router;