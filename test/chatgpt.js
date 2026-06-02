//Configuracion
require('dotenv').config()
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT
const DEPLOYMENT_NAME = `gpt-5.4-mini`
const API_KEY = process.env.API_KEY
const API_VERSION = `2025-04-01-preview`

async function preguntarAzure(pregunta = ``, historial = []) {
    /* pregunta += `, dame una respuesta corta` */

    //Endpoint Final
    const url = `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}`

    //Objeto conteniendo informacion Body
    const body = {
        messages: [
            { role: "system", content: "Eres un asistente 'util" },
            ...historial,
            { role: "user", content: pregunta },
        ],
        max_completion_tokens: 500,
        temperature: 0.7
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": API_KEY
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        console.error(`No se Accedio al servicio`)
        return
    }

    const data = await response.json()
    const mensaje = data.choices[0].message

    //Esta Funcion devolvera un objeto
    return {
        respuesta: mensaje.content,
        tokens_usados: data.usage.total_tokens,
        nuevo_historial: [...historial, { role: 'user', content: pregunta }, mensaje]
    }
}

//Prepara un BATCH (lote) de preguntas que estarán relacionadas
async function test() {
    let historial = []

    //P1 - Quien es Goku
    console.log('--- Pregunta 1 ---')
    let r1 = await preguntarAzure('¿Quien es Goku?, dame una respuesta corta')
    console.log(r1.respuesta)
    historial = r1.nuevo_historial

    //¿Como se llaman sus Hijos?
    console.log('--- Pregunta 2 ---')
    let r2 = await preguntarAzure('¿Y como se llaman sus hijos?', historial)
    console.log(r2.respuesta)
    historial = r2.nuevo_historial

    //¿Y quien es el mas Fuerte?
    console.log('--- Pregunta 3 ---')
    let r3 = await preguntarAzure('¿Y cual de los dos es el mas Fuerte?', historial)
    console.log(r3.respuesta)
    historial = r3.nuevo_historial

    //FIN...
    console.log(`--- Tokens utilizados: ${r3.tokens_usados}`)

}

test()