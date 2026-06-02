const imageUrlInput = document.getElementById('imageUrl')
const btnVistaPrevia = document.getElementById('btnVistaPrevia')
const btnAnalizar = document.getElementById('btnAnalizar')
const previewContainer = document.getElementById('previewContainer')
const imgPreview = document.getElementById('imgPreview')
const resultado = document.getElementById('resultado')
const textoDetectado = document.getElementById('textoDetectado')
const totalLineas = document.getElementById('totalLineas')
const loading = document.getElementById('loading')
const errorDiv = document.getElementById('error')
const errorMensaje = document.getElementById('errorMensaje')

// Muestra la imagen antes de enviarla a Azure para que el usuario confirme la URL.
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

// Envía la URL al backend, espera el texto detectado y actualiza la interfaz.
btnAnalizar.addEventListener('click', async () => {
    const imageUrl = imageUrlInput.value.trim()

    if (!imageUrl) {
        mostrarError('Por favor, ingresa una URL de imagen')
        return
    }

    ocultarTodo()
    loading.style.display = 'block'

    try {
        const response = await fetch('/api/ocr/leer', {
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
    } catch (error) {
        mostrarError(error.message)
    } finally {
        loading.style.display = 'none'
    }
})

// Dibuja cada línea leída por OCR y muestra el total de líneas encontradas.
function mostrarResultado(data) {
    textoDetectado.innerHTML = ''

    if (data.textoDetectado.length === 0) {
        textoDetectado.innerHTML = '<p style="color: #666; font-style: italic;">No se detectó texto en la imagen.</p>'
    } else {
        data.textoDetectado.forEach(linea => {
            const p = document.createElement('p')
            p.textContent = linea
            textoDetectado.appendChild(p)
        })
    }

    totalLineas.textContent = data.totalLineas
    resultado.style.display = 'block'
}

// Limpia estados anteriores y enseña el mensaje de error recibido.
function mostrarError(mensaje) {
    ocultarTodo()
    errorMensaje.textContent = mensaje
    errorDiv.style.display = 'block'
}

// Oculta resultado, error y carga para preparar una nueva acción.
function ocultarTodo() {
    resultado.style.display = 'none'
    errorDiv.style.display = 'none'
    loading.style.display = 'none'
}
