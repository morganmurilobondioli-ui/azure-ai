# Servicios de Azure AI

Aplicación web que integra múltiples servicios de **Azure AI** (Language y Computer Vision) para realizar diferentes tipos de analisis (Texto, Imagenes, etc)

---

## Funcionalidades

| Módulo | Descripción | API de Azure |
|--------|-------------|--------------|
| **Análisis de Sentimientos** | Analiza el sentimiento de un texto (positivo, negativo, neutral) con puntuación de confianza | Azure Language Service |
| **OCR** | Extrae texto de imágenes mediante reconocimiento óptico de caracteres | Azure Computer Vision |
| **Extracción de Entidades** | Identifica y clasifica entidades (personas, lugares, organizaciones, etc.) en un texto | Azure Language Service |
| **Análisis de Imágenes** | Describe imágenes, detecta categorías, etiquetas y colores dominantes | Azure Computer Vision |

---

## Estructura del Proyecto

```
AZURE_AI/
├── Controllers/              # Controladores (lógica de las rutas API)
│   ├── sentimientoController.js
│   ├── ocrController.js
│   ├── extraccionController.js
│   └── imagenController.js
├── Routes/                   # Definición de rutas Express
│   ├── sentimientoRoutes.js
│   ├── ocrRoutes.js
│   ├── extraccionRoutes.js
│   └── imagenRoutes.js
├── Services/                 # Servicios que consumen las APIs de Azure
│   ├── sentimiento.js
│   ├── ocr.js
│   ├── extraccion.js
│   └── imagen.js
├── public/                   # Archivos estáticos del frontend
│   ├── css/
│   ├── html/
│   │   ├── index.html
│   │   ├── sentimiento.html
│   │   ├── ocr.html
│   │   ├── extraccion.html
│   │   └── imagen.html
│   └── js/
├── server.js                 # Punto de entrada del servidor
├── .env                      # Variables de entorno (no incluido en git)
├── package.json
└── README.md
```

---

## Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/)
- Una cuenta de [Microsoft Azure](https://portal.azure.com/) con los siguientes servicios activos:
  - **Azure Language Service**
  - **Azure Computer Vision**

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/sandro060606/AZURE_AI.git
   cd AZURE_AI
   ```

2. **Instalar dependencias**
   ```bash
   npm init -y
   ```

    ```bash
   npm install express
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```env
   # Azure Language Service
   AZURE_F_KEY=tu_clave_de_azure_language
   AZURE_F_ENDPOINT=https://tu-recurso.services.ai.azure.com

   # Compatibilidad con nombres antiguos:
   # API_KEY y AZURE_ENDPOINT también funcionan para Language Service.

   # Azure Computer Vision (OCR e Imágenes)
   AZURE_CV_KEY=tu_clave_de_computer_vision
   AZURE_CV_ENDPOINT=https://tu-recurso.cognitiveservices.azure.com/

   # Compatibilidad con nombres antiguos:
   # suscriptionKey y endpoint también funcionan para Computer Vision.

   # Configuración Servidor
   PORT=3000
   ```

4. **Iniciar el servidor**
   ```bash
   node server.js
   ```

5. Abrir el navegador en `http://localhost:3000`

---

## Tecnologías

- **Runtime:** Node.js
- **Framework:** Express
- **APIs:** Azure Language Service · Azure Computer Vision
- **Frontend:** HTML, CSS, JavaScript vanilla
- **Otros:** dotenv, cors
