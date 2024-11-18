const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const middlewareAuth = require('../Middleware/authentificator');
const { isAdmin } = require('../Middleware/isAdmin');

// Route pour récupérer tous les utilisateurs - nécessitant une authentification
router.get('/users', middlewareAuth.authentificator, isAdmin, userController.getAlluser); // On applique `authentificator` puis `isAdmin`

// Route pour l'inscription
router.post('/register', userController.Register);

// Route pour la connexion
router.post('/login', userController.Login);

// Route pour le profil de l'utilisateur - nécessite d'abord une authentification puis un rôle administrateur
router.get('/profile', middlewareAuth.authentificator, isAdmin, userController.getProfile);

// Route pour mettre à jour le profil de l'utilisateur (requiert authentification seulement)
router.put('/update-profile', middlewareAuth.authentificator, userController.updateProfile);
module.exports = router;
