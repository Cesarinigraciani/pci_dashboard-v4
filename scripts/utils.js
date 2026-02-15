// ===============================
//  UTILIDADES GENERALES
// ===============================

// Normalizar texto (igual que Welcome)
function normalizar(str) {
  return String(str || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

// Generar ID único
function generarID() {
  return "id-" + Math.random().toString(36).substr(2, 9);
}

// Fecha actual formateada
function fechaActual() {
  return new Date().toLocaleString();
}

// ===============================
//  HASH SHA-256 PARA CIFRAR CLAVES
// ===============================
async function hashClave(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

