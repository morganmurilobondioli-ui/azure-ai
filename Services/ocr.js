// Lee texto desde una imagen usando el endpoint Read de Azure Computer Vision.
exports.leerTextoImagen = async (imageUrl) => {
  try {
    const URL = `${process.env.AZURE_CV_ENDPOINT}/vision/v3.2/read/analyze`;

    // Primera petición: envía la URL de la imagen e inicia el trabajo de OCR.
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
      throw new Error(errorData.error.message);
    }

    // Azure no devuelve el texto inmediatamente: entrega una URL para consultar el avance.
    const operationLocation = response.headers.get("operation-location");

    // Consulta la URL de seguimiento hasta que el trabajo termine correctamente.
    let result = null;
    while (true) {
      const checkResponse = await fetch(operationLocation, {
        headers: { "Ocp-Apim-Subscription-Key": process.env.AZURE_CV_KEY },
      });

      result = await checkResponse.json();

      if (result.status === "succeeded") break; //Escapar del While
      if (result.status === "failed")
        throw new Error("Error procesando imagen");

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Recorre páginas y líneas para dejar el resultado como un arreglo simple de textos.
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
