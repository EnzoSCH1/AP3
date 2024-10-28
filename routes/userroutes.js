const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')

//Route pour voir tout ls cotroller

router.get('/user'.userController.getAlluser)
router.get('/user/:id'.userController.getuserById)

//Ajouter d'autre routes aux esois
module.exports = router;    