// Envía un texto a Azure Language Service y devuelve el sentimiento con porcentajes.
exports.analizarSentimiento = async (texto) => {
  try {
    const URL = `${process.env.AZURE_F_ENDPOINT}/language/:analyze-text?api-version=2023-04-01`;

    const documentosAnalizar = {
      kind: "SentimentAnalysis",
      analysisInput: {
        documents: [{ id: "1", language: "es", text: texto }],
      },
    };

    // La petición POST manda el documento a Azure junto con la clave del recurso.
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_F_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentosAnalizar),
    });

    if (!response.ok) {
      const DataError = await response.json();
      throw new Error(DataError.error.message);
    }

    const data = await response.json();
    // Azure devuelve documentos; como enviamos uno solo, tomamos el primero.
    const documento = data.results.documents[0];
    // confidenceScores llega en decimales, por eso se convierte a porcentaje.
    const scores = documento.confidenceScores;

    return {
      textoOriginal: texto,
      sentimiento: documento.sentiment,
      confianza: {
        positivo: (scores.positive * 100).toFixed(2),
        negativo: (scores.negative * 100).toFixed(2),
        neutral: (scores.neutral * 100).toFixed(2),
      },
    };
  } catch (error) {
    throw error;
  }
};
