// ===============================
//  MANEJO DE OBRAS PCI (SISTEMA UNIFICADO)
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

// Crear una nueva obra
function crearObra(datos) {
    const obras = listarObras();

    const nuevaObra = {
        id: "obra_" + Date.now(),
        nombre: datos.nombre || "",
        direccion: datos.direccion || "",
        ciudad: datos.ciudad || "",
        fechaInicio: datos.fechaInicio || new Date().toISOString().split("T")[0],
        encargado: datos.encargado || "",
        horasEstimadas: datos.horasEstimadas || 0,
        plantas: [],
        fechaCreacion: new Date().toISOString()
    };

    obras.push(nuevaObra);
    guardarObras(obras);

    return nuevaObra;
}

// Guardar obra desde crear_proyecto.html
function guardarProyectoPCI(obra) {
    const obras = listarObras();
    obras.push(obra);
    guardarObras(obras);
}
