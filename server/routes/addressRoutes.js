const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');



router.post('/addAddress', addressController.addAddress)

router.get('/getAddress/:id', addressController.getAddress)

router.put('/updateAddress/:id', addressController.updateAddress)

router.delete('/deleteAddress/:id', addressController.deleteAddress)

module.exports = router;