const express = require('express');
const router = express.Router();
const imagenController = require('../Controllers/imagenController');

router.post('/analizar', imagenController.analizarImagen);

module.exports = router;