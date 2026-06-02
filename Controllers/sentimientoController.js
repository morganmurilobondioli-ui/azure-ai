const sentimiento = require("../Services/sentimiento"); //para exportar el archivo o modulo

// Controlador de la ruta POST /api/sentimiento/analizar.
// Recibe el texto del navegador, valida que exista y delega el análisis al servicio.
const analizarTexto = async (req, res) => {
  try {
    const { texto } = req.body; //cuerpo peticion

    //Validacion
    if (!texto) {
      return res.status(400).json({ error: 'Falta el campo "texto"' }); //respuesta
    }

    //Resultado
    const resultado = await sentimiento.analizarSentimiento(texto); //los servicios es el encargado de negociar con azure
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { analizarTexto };
