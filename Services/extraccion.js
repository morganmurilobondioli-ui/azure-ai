// Detecta entidades nombradas en un texto usando Azure Language Service.
exports.extraerDatos = async (texto) => {
  try {
    const URL = `${process.env.AZURE_F_ENDPOINT}/language/:analyze-text?api-version=2023-04-01`;
    // Prepara el documento y le indica a Azure que queremos reconocimiento de entidades.
    const documentoProcesar = {
      kind: "EntityRecognition",
      analysisInput: {
        documents: [{ id: "1", language: "es", text: texto }],
      },
    };

    // Envía el documento a Azure con la clave de suscripción configurada en .env.
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": `${process.env.AZURE_F_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentoProcesar),
    });

    if (!response.ok) {
      const DataError = await response.json();
      throw new Error(DataError.error.message);
    }

    // Lee la respuesta JSON para extraer las entidades detectadas.
    const data = await response.json();

    if (data.errors > 0) {
      return [];
    }

    const primerDocumento = data.results.documents[0];

    // Simplifica la respuesta de Azure para que el frontend reciba solo lo necesario.
    return primerDocumento.entities.map((entidad) => {
      return {
        text: entidad.text,
        category: entidad.category,
        confidenceScore: (entidad.confidenceScore * 100).toFixed(0),
      };
    });
  } catch (error) {
    throw error;
  }
};
