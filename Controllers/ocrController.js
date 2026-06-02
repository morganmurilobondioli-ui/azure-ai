const ocr = require("../Services/ocr");

// Controlador de la ruta POST /api/ocr/leer.
// Recibe una URL de imagen, la valida y pide al servicio que extraiga el texto.
const leerImagen = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Falta el campo "imageUrl"' });
    }

    const resultado = await ocr.leerTextoImagen(imageUrl);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { leerImagen };
