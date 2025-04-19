// Routes/reservationRoute.js
const express = require('express');
const router = express.Router();
const { authenticator } = require('../Middleware/authentificator');
const reservationController = require('../Controllers/reservationController');

router.post('/create', authenticator, reservationController.createReservation);
router.post('/cancel', authenticator, reservationController.cancelReservation);

module.exports = router;
