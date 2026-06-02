/* 
SERVICIO: AZURE FOUNDRY
Este Servicio permite identificar datos (informacion) clave en un documento
Telefonos, nombres, edad, direccion, etc 
*/
require('dotenv').config()
const suscriptionKey = process.env.suscriptionKey
const endpoint = process.env.endpoint


const URL = `${endpoint}/language/:analyze-text?api-version=2023-04-01`;

async function extraerDatos() {
  try {
    //Paso 1 - Documento que se desea analizar
    const texto = `El ingeniero Carlos Mendoza del equipo de TI coordinó la compra de 15 servidores marca DELL por un valor de 45000 dólares para la sucursal de Autos Nova en Lima el pasado 12 de mayo de 2026`;
    const documentoProcesar = {
      kind: "EntityRecognition",
      analysisInput: {
        documents: [
          {
            id: "1",
            language: "es",
            text: texto,
          },
        ],
      },
    };

    //Paso 2 - Enviar Documento
    console.log(`Enviando texto a Azure para la extraccion...`);
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentoProcesar),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en: ${errorData.error.message}`);
    }

    //Paso 3 - Recibir Respuesta
    const data = await response.json();

    if (data.errors > 0) {
      console.log(data.errors);
      return;
    }

    //Extraer todas los datos clave de Cada DOCUMENTO
    //... es tambien el unico documento que enviamos
    const primerDocumento = data.results.documents[0];

    //La empresa para la que desarrolla, solo quiere obtener las fechas de esta conversacion
    primerDocumento.entities.forEach((documento) => {
      //Instruccion permite visualizar todos los datos encontrados
      //console.log(documento)

      //Visualizamos solo los datos clave que sean Fecha y Hora
      if (documento.category === "DateTime") {
        console.log(documento);
      }
    });

  } catch (error) {
    console.error(error.message);
  }
}

extraerDatos();