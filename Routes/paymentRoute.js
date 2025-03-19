const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/paymentController');
const { authenticator } = require('../Middleware/authentificator');

router.post('/payment-intent', authenticator, paymentController.createPaymentIntent);
router.post('/confirm-payment', authenticator, paymentController.confirmPayment);

module.exports = router;
