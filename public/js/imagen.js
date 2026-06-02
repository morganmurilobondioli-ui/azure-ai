const imageUrlInput = document.getElementById('imageUrl')
const btnVistaPrevia = document.getElementById('btnVistaPrevia')
const btnAnalizar = document.getElementById('btnAnalizar')
const previewContainer = document.getElementById('previewContainer')
const imgPreview = document.getElementById('imgPreview')
const resultado = document.getElementById('resultado')
const descripcion = document.getElementById('descripcion')
const confianza = document.getElementById('confianza')
const etiquetas = document.getElementById('etiquetas')
const categorias = document.getElementById('categorias')
const colores = document.getElementById('colores')
const loading = document.getElementById('loading')
const errorDiv = document.getElementById('error')
const errorMensaje = document.getElementById('errorMensaje')

// Carga una vista previa local para comprobar que la URL apunta a una imagen real.
btnVistaPrevia.addEventListener('click', () => {
    const url = imageUrlInput.value.trim()

    if (!url) {
        mostrarError('Por favor, ingresa una URL de imagen válida')
        return
    }

    imgPreview.src = url
    previewContainer.style.display = 'block'

    imgPreview.onerror = () => {
        previewContainer.style.display = 'none'
        mostrarError('No se pudo cargar la imagen. Verifica la URL.')
    }
})

// Envía la imagen al backend para que Azure devuelva descripción, etiquetas y colores.
btnAnalizar.addEventListener('click', async () => {
    const imageUrl = imageUrlInput.value.trim()

    if (!imageUrl) {
        mostrarError('Por favor, ingresa una URL de imagen')
        return
    }

    ocultarTodo()
    loading.style.display = 'block'

    try {
        const response = await fetch('/api/imagen/analizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageUrl })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Error al procesar la imagen')
        }

        mostrarResultado(data.data)
    } catch (err) {
        mostrarError(err.message)
    } finally {
        loading.style.display = 'none'
    }
})

// Toma los datos analizados y llena cada sección del resultado en pantalla.
function mostrarResultado(data) {
    descripcion.textContent = data.descripcion
    confianza.textContent = `${data.confianza}%`

    pintarLista(etiquetas, data.etiquetas, 'etiqueta', 'No se detectaron etiquetas.')
    pintarLista(categorias, data.categorias, 'categoria', 'No se detectaron categorías.', categoria => categoria.name || categoria)
    pintarLista(colores, data.color?.dominantColors, 'color', 'No se detectaron colores.')

    resultado.style.display = 'block'
}

// Reutiliza la creación de etiquetas visuales para listas de etiquetas, categorías y colores.
function pintarLista(contenedor, items = [], clase, mensajeVacio, obtenerTexto = item => item) {
    contenedor.innerHTML = ''

    if (!items || items.length === 0) {
        contenedor.innerHTML = `<p style="color: #666; font-style: italic;">${mensajeVacio}</p>`
        return
    }

    items.forEach(item => {
        const span = document.createElement('span')
        span.className = clase
        span.textContent = obtenerTexto(item)
        contenedor.appendChild(span)
    })
}

// Muestra errores de validación o errores devueltos por la API.
function mostrarError(mensaje) {
    ocultarTodo()
    errorMensaje.textContent = mensaje
    errorDiv.style.display = 'block'
}

// Restablece la pantalla antes de una nueva vista previa o petición.
function ocultarTodo() {
    resultado.style.display = 'none'
    errorDiv.style.display = 'none'
    loading.style.display = 'none'
}
