function limpiarValor(valor) {
  if (!valor) {
    return "";
  }

  return valor.trim().replace(/^[`'"]+|[`'";]+$/g, "");
}

function normalizarEndpoint(endpoint) {
  return limpiarValor(endpoint).replace(/\/+$/, "");
}

function obtenerConfigLanguage() {
  const key = limpiarValor(process.env.AZURE_F_KEY || process.env.AZURE_L_KEY || process.env.API_KEY);
  const endpoint = normalizarEndpoint(process.env.AZURE_F_ENDPOINT || process.env.AZURE_L_ENDPOINT || process.env.AZURE_ENDPOINT);

  if (!key || !endpoint) {
    throw new Error("Falta configurar Azure Language Service. Revisa AZURE_F_KEY y AZURE_F_ENDPOINT en el archivo .env.");
  }

  return { key, endpoint };
}

function obtenerConfigComputerVision() {
  const key = limpiarValor(process.env.AZURE_CV_KEY || process.env.suscriptionKey);
  const endpoint = normalizarEndpoint(process.env.AZURE_CV_ENDPOINT || process.env.endpoint);

  if (!key || !endpoint) {
    throw new Error("Falta configurar Azure Computer Vision. Revisa AZURE_CV_KEY y AZURE_CV_ENDPOINT en el archivo .env.");
  }

  return { key, endpoint };
}

module.exports = {
  obtenerConfigLanguage,
  obtenerConfigComputerVision,
};
