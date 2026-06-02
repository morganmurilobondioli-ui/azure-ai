// Servicio FOUNDRY (AZURE)
require('dotenv').config()
const suscriptionKey = process.env.suscriptionKey
const endpoint = process.env.endpoint

//URL
const URL = `${endpoint}/language/analyze-text/jobs?api-version=2023-04-01`;

async function resumirTexto() {
  //Texto que debera ser resumido
  const documentoLargo =
    "La Primera Guerra Mundial marcó el primer gran conflicto internacional del siglo XX. El asesinato del archiduque Francisco Fernando, heredero de la corona austrohúngara, y de su esposa, la duquesa Sofía, en Sarajevo el 28 de junio de 1914, desencadenó las hostilidades. Los combates comenzaron en agosto de 1914 y continuaron en varios continentes durante los cuatro años siguientes.";

  //Parametrizar el Documento
  const cuerpoPeticion = {
    displayName: "La Invasion de Europa Occidental",
    analysisInput: {
      documents: [
        {
          id: "1",
          language: "es",
          text: documentoLargo,
        },
      ],
    },
    tasks: [
      {
        kind: "ExtractiveSummarization",
        taskName: "resumen_invasion",
        parameters: { sentenceCount: 2 },
      },
    ],
  };

  try {
    console.log("Enviando Documento Largo a AZURE...");

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cuerpoPeticion),
    });

    if (!response.ok) {
      const ErrorData = await response.json();
      throw new Error(`Error en: ${ErrorData.error.message}`);
    }

    //Hasta este Punto, la mitad del trabajo esta resuelto
    const URLSEGUIMIENTO = response.headers.get("operation-location");
    console.log("Trabajo Aceptado en el Servido, Procesando....");

    //Bucle que verifique cada 2 segundos si tiene la respuesta lista
    let resultadoFinal = null
    while (true){
        const respuestaSeguimiento = await fetch(URLSEGUIMIENTO, {
            headers: { "Ocp-Apim-Subscription-Key": suscriptionKey }
        })

        resultadoFinal = await respuestaSeguimiento.json()

        if(resultadoFinal.status === 'succeeded'){ break; }
        if(resultadoFinal.status === 'failed'){ throw new Error(`El servidor no pudo Completar el Proceso`); }

        await new Promise(resolve => setTimeout(resolve,2000))
    }

    //Finalmente, tenemos la respuesta
    console.log("Resumen Generado por la IA")
    const tareaFinalizada = resultadoFinal.tasks.items[0]
    const frasesResumen = tareaFinalizada.results.documents[0].sentences
    console.log(`Tarea Finalizada: $${tareaFinalizada}`)   
    frasesResumen.forEach((frase, indice) => {
        console.log(`${indice} - ${frase.text}`)
    }); 

  } catch (error) {
    console.error(error.message);
  }
}

resumirTexto();