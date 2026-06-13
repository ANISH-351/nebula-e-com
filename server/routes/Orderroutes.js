const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/placeOrder', orderController.placeOrder);
router.get('/getOrders/:user_id', orderController.getOrders);

module.exports = router;