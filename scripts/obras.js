// ===============================
//  MANEJO DE OBRAS PCI (SISTEMA MODERNO)
// ===============================

// Obtener todas las obras
function listarObras() {
    return JSON.parse(localStorage.getItem("obrasPCI")) || [];
}

// Guardar todas las obras
function guardarObras(lista) {
    localStorage.setItem("obrasPCI", JSON.stringify(lista));
}

// Obtener una obra por ID
function getObraById(id) {
    const obras = listarObras();
    return obras.find(o => o.id === id) || null;
}

// Guardar una obra específica (actualizarla)
function guardarObra(obraActualizada) {
    const obras = listarObras();
    const index = obras.findIndex(o => o.id === obraActualizada.id);

    if (index >= 0) {
        obras[index] = obraActualizada;
        guardarObras(obras);
    }
}

// Crear una nueva obra (versión moderna)
function guardarProyectoPCI(obra) {
    const obras = listarObras();
    obras.push(obra);
    guardarObras(obras);
}
