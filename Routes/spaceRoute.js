const express = require('express');
const router = express.Router();
const spaceController = require('../Controllers/spacesController');

console.log(" Fichier spacesRoute.js chargé !");

router.get('/:id', spaceController.getSpaceById);

module.exports = router;
