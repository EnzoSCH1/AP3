const express = require('express');
const router = express.Router();
const reservationController = require('../Controllers/reservationController');
console.log("✅ Fichier reservationRoute.js chargé !");
const { authenticator } = require('../Middleware/authentificator');

// ✅ Supprimé `isAdmin` pour que TOUS les utilisateurs puissent réserver
router.post('/create', authenticator, reservationController.createReservation);
router.post('/check-availability', authenticator, reservationController.checkAvailability);
router.post('/cancel', authenticator, reservationController.cancelReservation);


module.exports = router;
