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

    // Asegurar ID único
    if (!obra.id) obra.id = "obra_" + Date.now();

    // Normalizar estructura
    obra.fechaCreacion = obra.fechaCreacion || new Date().toLocaleString();
    obra.ultimoAcceso = obra.ultimoAcceso || null;
    obra.plantas = obra.plantas || [];
    obra.equipos = obra.equipos || [];

    obras.push(obra);
    guardarObras(obras);

    // Asignar obra al administrador automáticamente
    asignarObraAlAdministrador(obra.id);

    return obra;
}

// Eliminar obra
function eliminarObra(id) {
    const obras = listarObras().filter(o => o.id !== id);
    guardarObras(obras);
}

// Asignar obra al administrador
function asignarObraAlAdministrador(idObra) {
    const usuarios = JSON.parse(localStorage.getItem("usuariosPCI")) || [];
    const admin = usuarios.find(u => u.rol === "Administrador");

    if (admin) {
        admin.obras = admin.obras || [];
        if (!admin.obras.includes(idObra)) {
            admin.obras.push(idObra);
        }
        localStorage.setItem("usuariosPCI", JSON.stringify(usuarios));
    }
}
