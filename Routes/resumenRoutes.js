const express = require('express');
const router = express.Router();

const resumenController = require('../Controllers/resumenController');

router.post('/resumir', resumenController.resumirTexto);

module.exports = router;