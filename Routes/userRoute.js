// Routes/userRoute.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { authentificator } = require('../Middleware/authentificator');
const { isAdmin } = require('../Middleware/isAdmin');

// Routes accessibles uniquement aux administrateurs
router.get('/users', authentificator, isAdmin, userController.getAlluser);

// Routes publiques
router.post('/register', userController.Register);
router.post('/login', userController.Login);

// Routes accessibles aux utilisateurs authentifiés
router.get('/profile', authentificator, userController.getProfile);


module.exports = router;