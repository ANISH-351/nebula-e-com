const express = require('express');
const router = express.Router();
const orderController = require('../controllers/Ordercontroller');

router.post('/placeOrder', orderController.placeOrder);
router.get('/getOrders/:user_id', orderController.getOrders);

module.exports = router;