//Deteccion de imagenes (DATOS CONFIDENCIANES | BACKEND)
const suscriptionKey =
  "";
const endpoint = "";

const url = `${endpoint}vision/v3.2/analyze?visualFeatures=Objects`;

const imagenURL = `https://smart-office.com.ar/wp-content/uploads/2022/06/young-smiley-businesswomen-working-with-laptop-desk-scaled-1.jpg`;

async function detectarObjetos() {
  try {
    console.log("Iniciando la deteccion de Objetos...");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imagenURL })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en: ${errorData.error.message}`);
    }

    //Exito
    /* console.log(data); */
    const data = await response.json()

    data.objects.forEach(obj => {
      const confianza = (obj.confidence * 100).toFixed(2)
      console.log(`Objeto Identificado: ${obj.object} - Confianza: ${confianza}%`)

      //Ubicacion - ¿En que parte de la imagen esta este objeto?
      const rect = obj.rectangle
      console.log(`Coordenadas del Rectangulo:`)
      console.log(`   Inicio (Superior, Izquierdo): ${rect.x}, ${rect.y}`)
      console.log(`   Dimensiones (px): ${rect.w} ancho, ${rect.h} alto`)
    });

  } catch (error) {
    console.error(`Error al analizar la imagen:", ${error.message}`);
  }
}

detectarObjetos();