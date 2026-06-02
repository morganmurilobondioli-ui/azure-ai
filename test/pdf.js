/*
Analizar un archivo PDF, como si se tratara de un archivo PLANO (txt)
Este ejercicio se puede realizar con PDF (online https:// ...) o PDF local
*/

/*
¿Cómo utilizar este servicio con un PDF local? 
*** <input type='file' > ***
Cambiar:
 documentUrl = 'miarchivo.pdf'
 Content-Type: application/octect-stream
*/
require('dontev').config()
const endPoint = process.env.AZURE_ENDPOINT
const apikey = process.env.API_KEY
const modelId = `prebuilt-invoice` //Optimizado para lectura de boletas, facturas

const url = `${endPoint}/formrecognizer/documentModels/${modelId}:analyze?api-version=2023-07-31`

const documentUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf";

//Azure necesita Hostear el archivo PDF
async function subirDocumento(){
    try{
        const response = await fetch(url,{
            method: 'POST',
            headers:{
                'Ocp-Apim-Subscription-Key': apikey,
                'Content-Type':'application/json' //El cambio es Aquí
            },
            body: JSON.stringify({ urlSource: documentUrl})
        })

        if(!response.ok){
            console.error('Problemas de acceso')
            return
        }

        const operationLocation = response.headers.get('Operation-Location')
        console.log('Análisis iniciado, URL: ', operationLocation)
        return operationLocation

    }catch(error){
        console.error(error)
    }
}

async function analizarDocumento(operationLocation){
    try{
        const response = await fetch(operationLocation, {
            method: 'GET',
            headers: {
                'Ocp-Apim-Subscription-Key': apikey,
            }
        })

        if(!response.ok){
            console.error('Problemas de acceso')
            return
        }

        //El análisis puede tardar unos instantes
        const data = await response.json()

        if(data.status === 'running' || data.status === 'noStarted'){
            console.log('Procesando, espere por favor....')
            await new Promise(resolve => setTimeout(resolve, 2000))
            return analizarDocumento(operationLocation) //Recursividad
        }else if(data.status === 'succeeded'){
            console.log('Datos extraídos del PDF') //¡Ya funciona!
            //console.log(data.analyzeResult.documents) //Info completa
            return data.analyzeResult
        }else{
            console.error('Análisis ha fallado ', data.error)
        }

    }catch(error){console.error(error)}

}

//Test - Prueba
async function procesarFactura(){
    const urlResultado = await subirDocumento()

    //Si el objeto =/= undefined
    if(urlResultado){
        const resultadoFinal = await analizarDocumento(urlResultado)
        //console.log(resultadoFinal)
        console.log(resultadoFinal.documents[0].fields)
    }

}

procesarFactura()