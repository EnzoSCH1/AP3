const express = require('express');
const router = express.Router();
const userController   = require('../controller/ligueController')

//Route pour voir tout ls cotroller

router.get('/ligue' .ligueController.getAlluser)
router.get('/ligue/:id' .ligueController.getligueById)

//Ajouter d'autre routes aux esois
module.exports = router;   