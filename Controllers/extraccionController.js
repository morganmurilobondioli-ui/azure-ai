const extraccion = require('../Services/extraccion')

// Controlador de la ruta POST /api/extraccion/analizar.
// Valida el texto recibido y solicita al servicio la detección de entidades.
const analizarTexto = async (req, res) => {
    try {
        const {texto} = req.body

        //Validacion
        if(!texto){
            return res.status(400).json({error: 'Falta Texto'})
        }

        const response = await extraccion.extraerDatos(texto)
        res.json({success: true, data: response})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = { analizarTexto }
