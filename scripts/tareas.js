// ===============================
//  SISTEMA DE TAREAS PCI (VERSIÓN FINAL CON FECHAS)
// ===============================

let tareasData = [];


// ===============================
//  CARGAR TAREAS
// ===============================

function cargarTareas() {
    const data = localStorage.getItem("tareasPCI");
    tareasData = data ? JSON.parse(data) : [];
    return tareasData;
}


// ===============================
//  GUARDAR TAREAS
// ===============================

function guardarTareas() {
    localStorage.setItem("tareasPCI", JSON.stringify(tareasData));
}


// ===============================
//  CREAR TAREA
// ===============================

function crearTarea(datos) {
    const nuevaTarea = {
        id: "t" + Date.now(),
        titulo: datos.titulo,
        descripcion: datos.descripcion,
        obraId: datos.obraId,
        asignadoA: datos.asignadoA,
        creadoPor: datos.creadoPor,
        estado: datos.estado || "pendiente",
        fechaInicio: datos.fechaInicio || new Date().toISOString().split("T")[0],
        fechaFinal: null,
        fechaCreacion: new Date().toISOString()
    };

    tareasData.push(nuevaTarea);
    guardarTareas();
    return nuevaTarea;
}


// ===============================
//  EDITAR TAREA
// ===============================

function editarTarea(id, datos) {
    const tarea = tareasData.find(t => t.id === id);
    if (!tarea) return;

    tarea.titulo = datos.titulo ?? tarea.titulo;
    tarea.descripcion = datos.descripcion ?? tarea.descripcion;
    tarea.obraId = datos.obraId ?? tarea.obraId;
    tarea.asignadoA = datos.asignadoA ?? tarea.asignadoA;
    tarea.estado = datos.estado ?? tarea.estado;
    tarea.fechaInicio = datos.fechaInicio ?? tarea.fechaInicio;

    // Si se marca como completada → poner fecha final
    if (datos.estado === "completada") {
        tarea.fechaFinal = new Date().toISOString().split("T")[0];
    }

    guardarTareas();
}


// ===============================
//  ELIMINAR TAREA
// ===============================

function eliminarTarea(id) {
    tareasData = tareasData.filter(t => t.id !== id);
    guardarTareas();
}


// ===============================
//  CAMBIAR ESTADO DE TAREA
// ===============================

function cambiarEstadoTarea(id, nuevoEstado) {
    const tarea = tareasData.find(t => t.id === id);
    if (!tarea) return;

    tarea.estado = nuevoEstado;

    if (nuevoEstado === "completada") {
        tarea.fechaFinal = new Date().toISOString().split("T")[0];
    } else {
        tarea.fechaFinal = null;
    }

    guardarTareas();
}


// ===============================
//  OBTENER TAREAS POR USUARIO
// ===============================

function obtenerTareasDeUsuario(idUsuario) {
    return tareasData.filter(t => t.asignadoA === idUsuario);
}


// ===============================
//  OBTENER TAREAS POR OBRA
// ===============================

function obtenerTareasPorObra(obraId) {
    return tareasData.filter(t => t.obraId === obraId);
}


// ===============================
//  INICIALIZACIÓN
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    cargarTareas();
});
