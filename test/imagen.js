require('dotenv').config()
const suscriptionKey = process.env.suscriptionKey
const endpoint = process.env.endpoint


//URL describe las funcionalidades que deseamos aprovechar
const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Categories,Description,Color`;

// Imagen a analizar
const imageUrl =
  "https://static.vecteezy.com/system/resources/previews/008/026/165/non_2x/dog-playing-with-toy-in-the-park-dog-in-grass-field-photo.jpg";

//Esta funcionalidad requiere ejecutarse como promesa
async function analizarImagen() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": suscriptionKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    // Manejo de errores
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error en: ${errorData.error.message}`);
    }

    // Resultado Favorable
    const data = await response.json();
    const confianza = (data.description.captions[0].confidence * 100).toFixed(2);
    console.log(data)

    console.log("Descripcion de la Imagen:", data.description.captions[0].text);
    console.log("Confianza", `${confianza} %`);
    console.log("Etiquetas:" + data.description.tags.join(", "));
    // console.log(data.description);
  } catch (error) {
    console.error(`Error al analizar la imagen:", ${error.message}`);
  }
}

analizarImagen();
