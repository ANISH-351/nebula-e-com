const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/cart', cartController.addCart);

// pass user_id in URL
router.get('/cartList/:user_id', cartController.getCart);


router.delete('/removeCart/:id', cartController.deleteCart);

router.put('/increaseQuantity/:id', cartController.increaseQuantity)

router.put('/decreaseQuantity/:id', cartController.decreaseQuantity)

module.exports = router;