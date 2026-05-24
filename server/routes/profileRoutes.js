const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');


router.get('/profile/:id', profileController.getProfile)

router.put('/updateProfile/:id', profileController.updateProfile)

router.put('/changePassword/:id', profileController.changePassword)

module.exports = router;