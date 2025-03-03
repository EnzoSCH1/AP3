const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { authenticator } = require('../Middleware/authentificator');
const { isAdmin } = require('../Middleware/isAdmin');

router.get('/users', authenticator, isAdmin, userController.getAlluser);
router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.get('/profile', authenticator, userController.getProfile);
router.put('/update', authenticator, userController.updateProfile);
router.post('/refresh', userController.refreshToken);


module.exports = router;

