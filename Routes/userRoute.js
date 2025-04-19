// Routes/userRoute.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { authenticator } = require('../Middleware/authentificator');

// Routes publiques
router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.post('/refresh', userController.refreshToken);

// Routes protégées
router.get('/profile', authenticator, userController.getProfile);
router.put('/complement', authenticator, userController.complementProfile);

module.exports = router;
