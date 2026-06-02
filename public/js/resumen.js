const btnResumir = document.getElementById('btnResumir')
const textoInput = document.getElementById('texto')
const numOracionesInput = document.getElementById('numOraciones')
const resultado = document.getElementById('resultado')
const resumenLista = document.getElementById('resumenLista')
const loading = document.getElementById('loading')
const error = document.getElementById('error')
const errorMensaje = document.getElementById('errorMensaje')

// Valida el formulario y pide al backend que genere un resumen extractivo.
btnResumir.addEventListener('click', async () => {
    const texto = textoInput.value.trim()
    const numOraciones = Number(numOracionesInput.value) || 2

    if (!texto) {
        mostrarError('Por favor, ingresa un texto para resumir.')
        return
    }

    ocultarTodo()
    loading.style.display = 'block'

    try {
        const response = await fetch('/api/resumen/resumir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto, numOraciones })
        })

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error || 'Error al generar el resumen.')
        }

        mostrarResultado(result.data)
    } catch (err) {
        mostrarError(err.message)
    } finally {
        loading.style.display = 'none'
    }
})

// Muestra cada oración resumida en un párrafo separado para facilitar la lectura.
function mostrarResultado(data) {
    resumenLista.innerHTML = ''

    data.resumen.forEach(oracion => {
        const parrafo = document.createElement('p')
        parrafo.textContent = oracion
        resumenLista.appendChild(parrafo)
    })

    resultado.style.display = 'block'
}

// Enseña errores de validación, conexión o respuesta de Azure.
function mostrarError(mensaje) {
    ocultarTodo()
    errorMensaje.textContent = mensaje
    error.style.display = 'block'
}

// Limpia estados anteriores para que la pantalla no mezcle resultados y errores.
function ocultarTodo() {
    resultado.style.display = 'none'
    error.style.display = 'none'
    loading.style.display = 'none'
}
