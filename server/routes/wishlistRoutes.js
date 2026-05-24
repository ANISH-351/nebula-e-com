const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController')

router.get('/getWishlist/:user_id', wishlistController.getWishlist)

router.post('/addWishlist', wishlistController.addWishlist)

router.delete('/deleteWishlist/:id', wishlistController.deleteWishlist)

module.exports = router; 