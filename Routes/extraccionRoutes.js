const express = require('express')

//Enrutador
const router = express.Router()

const extraccionController = require('../Controllers/extraccionController')

router.post('/analizar', extraccionController.analizarTexto)

module.exports = router