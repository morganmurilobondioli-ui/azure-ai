const sentimiento = require("../Services/sentimiento");

// Controlador de la ruta POST /api/sentimiento/analizar.
// Recibe el texto del navegador, valida que exista y delega el análisis al servicio.
const analizarTexto = async (req, res) => {
  try {
    const { texto } = req.body;

    //Validacion
    if (!texto) {
      return res.status(400).json({ error: 'Falta el campo "texto"' });
    }

    //Resultado
    const resultado = await sentimiento.analizarSentimiento(texto);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { analizarTexto };
