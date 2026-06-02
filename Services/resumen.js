// Genera un resumen extractivo: Azure elige las oraciones más representativas del texto.
exports.resumirTexto = async (texto, numOraciones = 2) => {
    try {
        const URL = `${process.env.AZURE_F_ENDPOINT}/language/analyze-text/jobs?api-version=2023-04-01`;

        // Arma el trabajo asíncrono que Azure debe ejecutar para resumir el texto.
        const cuerpoPeticion = {
            displayName: "Resumen de Texto",
            analysisInput: {
                documents: [
                    {
                        id: "1",
                        language: "es",
                        text: texto,
                    },
                ],
            },
            tasks: [
                {
                    kind: "ExtractiveSummarization",
                    taskName: "resumen_extractivo",
                    parameters: { sentenceCount: numOraciones },
                },
            ],
        };

        // Inicia el trabajo de resumen en Azure Language Service.
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.AZURE_F_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cuerpoPeticion),
        });

        if (!response.ok) {
            const ErrorData = await response.json();
            throw new Error(ErrorData.error.message);
        }

        const URLSEGUIMIENTO = response.headers.get("operation-location");

        // Consulta el estado del trabajo hasta que Azure termine el procesamiento.
        let resultadoFinal = null;
        while (true) {
            const respuestaSeguimiento = await fetch(URLSEGUIMIENTO, {
                headers: { "Ocp-Apim-Subscription-Key": process.env.AZURE_F_KEY },
            });

            resultadoFinal = await respuestaSeguimiento.json();

            if (resultadoFinal.status === "succeeded") { break; }
            if (resultadoFinal.status === "failed") { throw new Error("El servidor no pudo completar el proceso"); }

            await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Extrae las oraciones resumidas desde la estructura final de Azure.
        const tareaFinalizada = resultadoFinal.tasks.items[0];
        const frasesResumen = tareaFinalizada.results.documents[0].sentences;

        return {
            textoOriginal: texto,
            resumen: frasesResumen.map((frase) => frase.text),
        };
    } catch (error) {
        throw error;
    }
};
