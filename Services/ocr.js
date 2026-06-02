const { obtenerConfigComputerVision } = require("./config");

// Lee texto desde una imagen usando el endpoint Read de Azure Computer Vision.
exports.leerTextoImagen = async (imageUrl) => {
  try {
    const { key, endpoint } = obtenerConfigComputerVision();
    const URL = `${endpoint}/vision/v3.2/read/analyze`;

    // Primera peticion: envia la URL de la imagen e inicia el trabajo de OCR.
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
      throw new Error(errorData.error.message);
    }

    // Azure no devuelve el texto inmediatamente: entrega una URL para consultar el avance.
    const operationLocation = response.headers.get("operation-location");

    // Consulta la URL de seguimiento hasta que el trabajo termine correctamente.
    let result = null;
    while (true) {
      const checkResponse = await fetch(operationLocation, {
        headers: { "Ocp-Apim-Subscription-Key": key },
      });

      result = await checkResponse.json();

      if (result.status === "succeeded") break;
      if (result.status === "failed") throw new Error("Error procesando imagen");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Recorre paginas y lineas para dejar el resultado como un arreglo simple de textos.
    const lineasTexto = [];
    result.analyzeResult.readResults.forEach((page) => {
      page.lines.forEach((line) => {
        lineasTexto.push(line.text);
      });
    });

    return {
      imagenUrl: imageUrl,
      textoDetectado: lineasTexto,
      totalLineas: lineasTexto.length,
    };
  } catch (error) {
    throw error;
  }
};
