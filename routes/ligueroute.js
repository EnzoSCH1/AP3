const express = require('express');
const router = express.Router();
const ligueController = require('../controllers/ligueController')

//Route pour voir tout ls cotroller

router.get('/ligues', ligueController.getAllligue)
//router.get('/ligue/:id', ligueController.getligueById)

//Ajouter d'autre routes aux esois
module.exports = router;   