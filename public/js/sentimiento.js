const btnAnalizar = document.getElementById('btnAnalizar')
const textoInput = document.getElementById('texto')
const resultado = document.getElementById('resultado')
const loading = document.getElementById('loading')
const error = document.getElementById('error')

// Escucha el clic del usuario, valida el texto y llama a la API del servidor.
btnAnalizar.addEventListener('click', async () => {
    const texto = textoInput.value.trim()

    if (!texto) {
        mostrarError('Por favor, escribe un texto para analizar')
        return
    }

    ocultarTodo()
    loading.style.display = 'block'

    try {
        const response = await fetch('/api/sentimiento/analizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Error al analizar')
        }

        mostrarResultado(data.data)
    } catch (err) {
        mostrarError(err.message)
    } finally {
        loading.style.display = 'none'
    }
})

// Recibe la respuesta de Azure y la coloca en los elementos visibles de la página.
function mostrarResultado(data) {
    const sentimientoElement = document.getElementById('sentimiento')
    sentimientoElement.textContent = data.sentimiento
    sentimientoElement.className = `sentimiento ${data.sentimiento}`

    document.getElementById('positivo').textContent = `${data.confianza.positivo}%`
    document.getElementById('negativo').textContent = `${data.confianza.negativo}%`
    document.getElementById('neutral').textContent = `${data.confianza.neutral}%`
    document.getElementById('textoOriginal').textContent = data.textoOriginal

    resultado.style.display = 'block'
}

// Muestra un mensaje de error cuando falta información o falla la petición.
function mostrarError(mensaje) {
    ocultarTodo()
    document.getElementById('errorMensaje').textContent = mensaje
    error.style.display = 'block'
}

// Oculta estados anteriores para que solo se vea carga, resultado o error.
function ocultarTodo() {
    resultado.style.display = 'none'
    error.style.display = 'none'
    if (loading) loading.style.display = 'none'
}
