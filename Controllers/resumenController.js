const resumen = require("../Services/resumen");

// Controlador de la ruta POST /api/resumen/resumir.
// Lee el texto y la cantidad de oraciones, luego pide el resumen al servicio.
const resumirTexto = async (req, res) => {
    try {
        const { texto, numOraciones } = req.body;

        // Validación básica
        if (!texto) {
            return res.status(400).json({ error: 'Falta el campo "texto"' });
        }

        // Resultado
        const resultado = await resumen.resumirTexto(texto, numOraciones || 2);
        res.json({ success: true, data: resultado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { resumirTexto };
