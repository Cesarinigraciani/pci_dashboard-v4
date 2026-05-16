// ===============================
//  SISTEMA DE TAREAS PCI (UNIFICADO)
// ===============================

let tareasData = [];

// ===============================
//  CARGAR TAREAS
// ===============================
function cargarTareas() {
    const data = localStorage.getItem("tareasPCI");
    tareasData = data ? JSON.parse(data) : [];

    // Compatibilidad con tareas antiguas
    tareasData.forEach(t => {
        if (t.fechaFinal && !t.fechaFin) t.fechaFin = t.fechaFinal;
        if (!t.subtareas) t.subtareas = [];
        if (!t.resultado_plazo) t.resultado_plazo = null;
        if (!t.posX) t.posX = 0;
        if (!t.posY) t.posY = 0;
    });

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
        plantaId: datos.plantaId || null,
        planoId: datos.planoId || null,
        posX: datos.posX ?? 0,
        posY: datos.posY ?? 0,
        asignadoA: datos.asignadoA,
        creadoPor: datos.creadoPor,
        estado: datos.estado || "pendiente",
        fechaInicio: datos.fechaInicio || new Date().toISOString().split("T")[0],
        fechaFin: null,
        resultado_plazo: null,
        id_planning: datos.id_planning || null,
        fechaCreacion: new Date().toISOString(),
        subtareas: datos.subtareas || []
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

    // 🔥 ACTUALIZAR SUBTAREAS
    if (datos.subtareas) {
        tarea.subtareas = datos.subtareas;
    }

    if (datos.id_planning !== undefined) {
        tarea.id_planning = datos.id_planning;
    }

    // Si se marca como completada
    if (datos.estado === "completada") {
        tarea.fechaFin = new Date().toISOString().split("T")[0];
        tarea.resultado_plazo = calcularCumplimientoPlanning(tarea);
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
        tarea.fechaFin = new Date().toISOString().split("T")[0];
        tarea.resultado_plazo = calcularCumplimientoPlanning(tarea);
    } else {
        tarea.fechaFin = null;
        tarea.resultado_plazo = null;
    }

    guardarTareas();
}

// ===============================
//  CALCULAR CUMPLIMIENTO DEL PLANNING
// ===============================
function calcularCumplimientoPlanning(tarea) {
    if (!tarea.id_planning) return null;

    const planning = JSON.parse(localStorage.getItem("planningPCI")) || [];
    const plan = planning.find(p => p.id === tarea.id_planning);
    if (!plan) return null;

    const fechaFinReal = new Date(tarea.fechaFin);
    const fechaFinPlan = new Date(plan.fecha_fin);

    return fechaFinReal <= fechaFinPlan ? "en_plazo" : "fuera_de_plazo";
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
//  OBTENER TAREA POR ID
// ===============================
function getTareaById(id) {
    return tareasData.find(t => t.id === id) || null;
}

// ===============================
//  INICIALIZACIÓN
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    cargarTareas();
});



