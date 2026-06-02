//Servicio FOUNDRY (AZURE) - OCULTAR DATOS SENSIBLES
require('dotenv').config()
const suscriptionKey = process.env.suscriptionKey
const endpoint = process.env.endpoint


const URL = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

async function anonimizarDatos() {
  try {
    const texto = `Hola, mi nombre es Juan Carlos Perez con DNI 45454646. Mi número de telefono es 956123123, vivo en Av. Miraflores 748, Arequipa. Pueden escribirme a juacarlos@gmail.com`;

    const documentoAnonimizar = {
      kind: "PiiEntityRecognition",
      analysisInput: {
        documents: [
          {
            id: "1",
            language: "es",
            text: texto,
          },
        ],
      },
      parameters: {
        redactionPolicy: {
          policyKind: "CharacterMask",
          redactionCharacter: "*",
        },
      },
    };

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentoAnonimizar),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en: ${errorData.error.message}`);
    }

    const data = await response.json();

    if (data.results.errors.length > 0) {
      console.log(data.results.errors); //mejorar
      return;
    }

    const primerDocumento = data.results.documents[0]
    console.log(primerDocumento.redactedText)


  } catch (error) {
    console.error(error.message);
  }
}

anonimizarDatos();