const { obtenerConfigComputerVision } = require("./config");

// Analiza una imagen con Azure Computer Vision y devuelve descripcion, etiquetas y color.
exports.analizarImagen = async (imageUrl) => {
  try {
    const { key, endpoint } = obtenerConfigComputerVision();
    // La URL incluye visualFeatures para pedir categorias, descripcion y color.
    const URL = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`;

    // Envia a Azure la URL publica de la imagen que se quiere analizar.
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error ? errorData.error.message : "Error al analizar la imagen");
    }

    const data = await response.json();

    // Usa optional chaining porque Azure puede omitir campos si no detecta informacion.
    const descripcion = data.description?.captions?.[0]?.text || "Sin descripcion";
    const confianza = data.description?.captions?.[0]?.confidence
      ? (data.description.captions[0].confidence * 100).toFixed(2)
      : "0.00";
    const etiquetas = data.description?.tags || [];

    return {
      imageUrl,
      descripcion,
      confianza,
      etiquetas,
      categorias: data.categories || [],
      color: data.color || {},
    };
  } catch (error) {
    throw error;
  }
};
