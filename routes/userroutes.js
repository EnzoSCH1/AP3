const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController')


router.get('/user', userController.getAlluser);
router.post('/register', userController.Register);
router.post('/login', userController.Login);


module.exports = router;    