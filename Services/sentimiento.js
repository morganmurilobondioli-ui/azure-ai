const { obtenerConfigLanguage } = require("./config");

// Envia un texto a Azure Language Service y devuelve el sentimiento con porcentajes.


exports.analizarSentimiento = async (texto) => { //guardamos funcion asc en el objeto 
  try {
    const { key, endpoint } = obtenerConfigLanguage(); //sacamos 2 valores del objeto 
    const URL = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

    const documentosAnalizar = { //Preparamos el documento para enviarlo azure
      kind: "SentimentAnalysis",
      analysisInput: {
        documents: [{ id: "1", language: "es", text: texto }],
      },
    };

    // La peticion POST manda el documento a Azure junto con la clave del recurso. 
    const response = await fetch(URL, { //enviar o recibimos datos
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/json",
      }, //manejar las peticiones, cabeceras
      body: JSON.stringify(documentosAnalizar),
    }); //convertimos de objeto a json

    if (!response.ok) {
      const DataError = await response.json();
      throw new Error(DataError.error.message);
    }

    const data = await response.json(); //convertimos rpt guardar
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
