const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { authenticator } = require('../Middleware/authentificator');
const { isAdmin } = require('../Middleware/isAdmin');

router.get('/users', authenticator, isAdmin, userController.getAlluser);
router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.get('/profile', authenticator, userController.getProfile);
router.post('/refresh', userController.refreshToken);
router.put('/complement', authenticator, userController.complementProfile);

module.exports = router;