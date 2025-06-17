// Routes/userRoute.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { authenticator } = require('../Middleware/authentificator');
const { isAdmin } = require('../Middleware/isAdmin');

// Routes publiques
router.post('/register', userController.Register);
router.post('/login', userController.Login);
router.post('/refresh', userController.refreshToken);

// Routes protégées
router.get('/profile', authenticator, userController.getProfile);
router.put('/complement', authenticator, userController.complementProfile);
router.post('/request-admin', authenticator, userController.requestAdmin);

router.post('/approve-admin', authenticator, isAdmin, userController.approveAdmin);


router.get('/admin/demande-admins', authenticator, isAdmin, userController.getAdminRequests);


module.exports = router;
