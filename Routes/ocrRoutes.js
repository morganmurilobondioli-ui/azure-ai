const express = require('express')
const router = express.Router()

const ocrController = require('../Controllers/ocrController')

router.post('/leer', ocrController.leerImagen)

module.exports = router