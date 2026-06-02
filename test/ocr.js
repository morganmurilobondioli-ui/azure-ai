//Deteccion de texto en imagen - OCR
const suscriptionKey =
  "";
const endpoint = "";

const url = `${endpoint}/vision/v3.2/read/analyze`;
const imageURL = `https://image.slidesharecdn.com/eleditorialperiodstico-110615172743-phpapp01/85/El-editorial-periodistico-3-320.jpg`;

async function leerTexto() {
  try {
    console.log("Enviando imagen a Azure...");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageURL }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en: ${errorData.error.message}`);
    }

    //Tratamiento Especial
    //AZURE no devuelve el texto inmediatamente, devuelve la URL en el Header
    const operationLocation = response.headers.get("operation-location");
    console.log("Procesando... esperando resultados");

    //PARTE 2 - Consultar URL de la operacion hasta que se encuentre como "succeeded"
    let result = null;
    while (true) {
      const checkResponse = await fetch(operationLocation, {
        headers: { "Ocp-Apim-Subscription-Key": suscriptionKey }
      })

      result = await checkResponse.json()

      if(result.status === 'succeeded'){ break } //Escapar del While
      if(result.status === 'failed'){ throw new Error('Error analizando datos...')}

      //Esperar 1 segundo para volver a intentarlo
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    //Parte 3 - Extraer y mostrar el texto detectado
    console.log("Texto Detectado")

    //Como el resultado se encuentra dentro de una matriz [[]] necesitamos
    //Recorrer la estructura con 2 Ciclos
    result.analyzeResult.readResults.forEach(page => {
      page.lines.forEach(line => {
        console.log(line.text)
      })
    });

  } catch (error) {
    console.error(`Error en el servicio: ${error.message}`);
  } 
}

leerTexto()