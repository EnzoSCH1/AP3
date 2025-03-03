const express = require('express');
const router = express.Router();
const reservationController = require('../Controllers/reservationController');
const { authenticator } = require('../Middleware/authentificator');
const { isAdmin } = require('../Middleware/isAdmin');


router.post('/create', authenticator, isAdmin, reservationController.createReservation);




router.post('/cancel', authenticator, reservationController.cancelReservation);


router.get('/user-reservations', authenticator, reservationController.getUserReservations);

router.post('/check-availability', authenticator, reservationController.checkAvailability);

module.exports = router;





