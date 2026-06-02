let entidades = []

const btnAnalizar = document.getElementById('btnAnalizar')
const textoInput = document.getElementById('texto')
const resultadosTabla = document.getElementById('resultadosTabla')
const checkboxes = document.querySelectorAll('.filtro-categoria')
const resultado = document.getElementById('resultado')
const loading = document.getElementById('loading')
const error = document.getElementById('error')

// Vuelve a pintar la tabla cada vez que el usuario cambia un filtro.
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', renderizar)
})

// Envía el texto al backend para obtener entidades reconocidas por Azure.
btnAnalizar.addEventListener('click', async () => {
    const textoValue = textoInput.value.trim()

    if (!textoValue) {
        mostrarError('Por favor, ingresa un texto para analizar.')
        return
    }

    ocultarTodo()
    loading.style.display = 'block'

    try {
        btnAnalizar.disabled = true
        btnAnalizar.innerText = 'Analizando...'

        const response = await fetch('/api/extraccion/analizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto: textoValue })
        })

        const result = await response.json()

        if (response.ok && result.success) {
            entidades = result.data
            resultado.style.display = 'block'
            renderizar()
        } else {
            mostrarError(result.error || 'Error en la extracción de datos.')
        }
    } catch (error) {
        console.error(error)
        mostrarError('Error al conectar con el servidor.')
    } finally {
        btnAnalizar.disabled = false
        btnAnalizar.innerText = 'Analizar texto'
        loading.style.display = 'none'
    }
})

// Presenta un mensaje de error sin borrar el texto escrito por el usuario.
function mostrarError(mensaje) {
    document.getElementById('errorMensaje').textContent = mensaje
    error.style.display = 'block'
}

// Oculta resultado, error y carga antes de iniciar un nuevo análisis.
function ocultarTodo() {
    resultado.style.display = 'none'
    error.style.display = 'none'
    if (loading) loading.style.display = 'none'
}

// Aplica los filtros seleccionados y actualiza la tabla con las entidades visibles.
function renderizar() {
    const categoriasSeleccionadas = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value)

    if (entidades.length === 0) {
        mostrarFilaVacia('No hay datos para mostrar')
        return
    }

    const entidadesFiltradas = entidades.filter(entidad => {
        if (categoriasSeleccionadas.length === 0) {
            return true
        }

        return categoriasSeleccionadas.includes(entidad.category)
    })

    if (entidadesFiltradas.length === 0) {
        mostrarFilaVacia('Ninguna entidad coincide con los filtros seleccionados')
        return
    }

    resultadosTabla.innerHTML = ''
    entidadesFiltradas.forEach(entidad => {
        resultadosTabla.appendChild(crearFilaEntidad(entidad))
    })
}

// Crea una fila segura con createElement para evitar insertar texto externo como HTML.
function crearFilaEntidad(entidad) {
    const fila = document.createElement('tr')
    const texto = document.createElement('td')
    const categoria = document.createElement('td')
    const confianza = document.createElement('td')
    const categoriaTag = document.createElement('span')
    const confianzaTag = document.createElement('span')

    texto.className = 'text-entity'
    texto.textContent = entidad.text

    categoriaTag.className = 'cat-tag'
    categoriaTag.textContent = entidad.category
    categoria.appendChild(categoriaTag)

    confianzaTag.className = `score-badge ${obtenerClaseConfianza(entidad.confidenceScore)}`
    confianzaTag.textContent = `${entidad.confidenceScore}%`
    confianza.appendChild(confianzaTag)

    fila.append(texto, categoria, confianza)
    return fila
}

// Decide el color del porcentaje según el nivel de confianza de Azure.
function obtenerClaseConfianza(confidenceScore) {
    const score = Number(confidenceScore)

    if (score >= 80) {
        return 'badge-high'
    }

    if (score >= 50) {
        return 'badge-medium'
    }

    return 'badge-low'
}

// Muestra una fila única cuando no existen resultados disponibles.
function mostrarFilaVacia(mensaje) {
    resultadosTabla.innerHTML = ''

    const fila = document.createElement('tr')
    const celda = document.createElement('td')

    celda.colSpan = 3
    celda.className = 'no-data'
    celda.textContent = mensaje
    fila.appendChild(celda)
    resultadosTabla.appendChild(fila)
}
