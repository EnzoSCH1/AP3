const express = require('express');
const router = express.Router();
const reservationController = require('../Controllers/reservationController');
const { authenticator } = require('../Middleware/authentificator');

// Routes pour les réservations
router.post('/create', authenticator, reservationController.createReservation);
router.post('/pay', authenticator, reservationController.payReservation);
router.post('/cancel', authenticator, reservationController.cancelReservation);
router.get('/my-reservations', authenticator, reservationController.getUserReservations);

module.exports = router;