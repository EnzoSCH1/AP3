const express = require('express');
const { createInvoice } = require('../Controllers/invoiceController');
const { authenticator } = require('../Middleware/authentificator'); // Changed from authenticate

const router = express.Router();

router.post('/create', authenticator, createInvoice);

module.exports = router;