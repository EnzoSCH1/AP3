const express = require('express');
const router = express.Router();
const articleController = require('../Controllers/articleController');
const authenticator = require('../Middleware/authentificator');
const isAdmin = require('../Middleware/isAdmin');
const upload = require('../Middleware/upload');

// 🔁 Ordre corrigé : multer AVANT les middlewares d'auth
router.get('/', articleController.getAllArticles);

router.post(
                '/create',
                upload.single('image'),        // d'abord multer
                authenticator,                 // ensuite authentification
                isAdmin,                       // ensuite vérification admin
                articleController.createArticle
);

module.exports = router;
