// Servicio FOUNDRY (AZURE) - ANALISIS DE SENTIMIENTOS
require('dotenv').config()
const suscriptionKey = process.env.suscriptionKey
const endpoint = process.env.endpoint

const URL = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

async function analizarSentimientos() {
  try {
    //Podemos enviar mas de un documento
    const documentosAnalizar = {
      kind: "SentimentAnalysis",
      analysisInput: {
        documents: [
          {
            id: "1",
            language: "es",
            text: "Estoy muy contento porque obtuve una promoción y un descuento en su proxima compra",
          },
          {
            id: "2",
            language: "es",
            text: "Estoy muy frustrado, el sistema de ventas falló y perdimos tiempo y dinero en el proceso",
          },
          {
            id: "3",
            language: "es",
            text: "El reporte del área de logística esta listo para su descarga",
          },
        ],
      },
    };

    console.log("Enviando múltiples documentos a AZURE...");

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentosAnalizar),
    });

    if (!response.ok) {
      const ErrorData = await response.json();
      throw new Error(`Error en: ${ErrorData.error.message}`);
    }

    const data = await response.json();

    //Enviar los Resultado..
    data.results.documents.forEach((documento) => {
      //Se muestra el ID de cada Documento
      console.log(`Documento # ${documento.id}`);

      //Contenido Analizado
      const contenidoOriginal = documentosAnalizar.analysisInput.documents.find(
        (d) => d.id === documento.id,
      ).text;
      console.log(`ConenidoOriginal: ${contenidoOriginal}`);

      //Resultados
      //Sentimiento PREDOMINANTE
      console.log(`Sentimiento Predominante: ${documento.sentiment}`)

      //Puntuaciones de Confianza
      const scores = documento.confidenceScores
      console.log("Puntuaciones de Confianza:")
      console.log(` - Positivo: ${(scores.positive * 100).toFixed(2)}%`)
      console.log(` - Negativo: ${(scores.negative * 100).toFixed(2)}%`)
      console.log(` - Neutral: ${(scores.neutral * 100).toFixed(2)}%`)
    });
  } catch (error) {
    console.error(error.message);
  }
}

analizarSentimientos();