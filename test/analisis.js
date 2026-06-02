//Deteccion de imagenes
const suscriptionKey = "";
const endpoint = "";

const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Description,Tags,Objects`;
const imageUrl =
  "https://cooperativa.abacus.coop/app/uploads/2021/05/jocs-infantils1.jpg";

async function analizarContenido() {
  try {
    console.log("Analizando Imagen....");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    if (!response.ok) {
      const dataError = await response.json();
      throw new Error(`Error en: ${dataError.error.message}`);
    }
    //  
    const data = await response.json()

    //Etiquetas, descripcion y Objetos
    //Motrar la descripcion de la imagen
    const descripcion = data.description.captions[0].text;
    const confianza = (data.description.captions[0].confidence * 100).toFixed(2);
    console.log(`Resumen: ${descripcion} - Confianza: ${confianza} %`)

    //Etiquetas
    const listaEtiquetas = data.tags.map(fila => `${fila.name} - ${fila.confidence.toFixed(2)}%`)
    listaEtiquetas.forEach(element => {
        console.log(`   ${element}`)
    });

    //Ubicacion de Objetos
    console.log("Ubicacion de Objetos")
    data.objects.forEach(element => {
        console.log(`   ${element.object} - X: ${element.rectangle.x}; Y: ${element.rectangle.y}; W: ${element.rectangle.w}; H: ${element.rectangle.h}`)
    })

  } catch (error) {
    console.error(error.message);
  }
}

analizarContenido();