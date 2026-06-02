const express = require('express')
//Enrutador
const router = express.Router()

const sentimientoController = require('../Controllers/sentimientoController')

router.post('/analizar', sentimientoController.analizarTexto)

module.exports = router