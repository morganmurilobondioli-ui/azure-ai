// Analiza una imagen con Azure Computer Vision y devuelve descripción, etiquetas y color.
exports.analizarImagen = async (imageUrl) => {
  try {
    // La URL incluye visualFeatures para pedir categorías, descripción y color.
    const URL = `${process.env.AZURE_CV_ENDPOINT}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`;

    // Envía a Azure la URL pública de la imagen que se quiere analizar.
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_CV_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error ? errorData.error.message : "Error al analizar la imagen");
    }

    const data = await response.json();

    // Usa optional chaining porque Azure puede omitir campos si no detecta información.
    const descripcion = data.description?.captions?.[0]?.text || "Sin descripción";
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
