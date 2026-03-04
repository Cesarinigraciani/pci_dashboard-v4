let tareas = [];
let obras = [];
let usuarios = [];
let planning = [];

// ===============================
// CARGA INICIAL
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
    cargarLocalStorage();
    await cargarPlanning();
    cargarFiltros();
    cargarAños();
    document.getElementById("filtroMes").value = new Date().getMonth();
    renderKanban();
});

// ===============================
// CARGAR LOCALSTORAGE
// ===============================
function cargarLocalStorage() {
    tareas = JSON.parse(localStorage.getItem("tareasPCI")) || [];
    obras = JSON.parse(localStorage.getItem("obrasPCI")) || [];
    usuarios = JSON.parse(localStorage.getItem("usuariosPCI")) || [];
}

// ===============================
// CARGAR PLANNING DESDE JSON
// ===============================
async function cargarPlanning() {
    const res = await fetch("data/planning_acacias.json");
    planning = await res.json();
}

// ===============================
// FILTROS
// ===============================
function cargarFiltros() {
    const selObra = document.getElementById("filtroObra");
    obras.forEach(o => {
        const opt = document.createElement("option");
        opt.value = o.id;
        opt.textContent = o.nombre;
        selObra.appendChild(opt);
    });

    const selUser = document.getElementById("filtroUsuario");
    usuarios.forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.id;
        opt.textContent = u.nombre;
        selUser.appendChild(opt);
    });
}

function cargarAños() {
    const sel = document.getElementById("filtroAño");
    const añoActual = new Date().getFullYear();
    for (let a = añoActual - 3; a <= añoActual + 3; a++) {
        const opt = document.createElement("option");
        opt.value = a;
        opt.textContent = a;
        sel.appendChild(opt);
    }
    sel.value = añoActual;
}

// ===============================
// BUSCAR TAREA EN PLANNING
// ===============================
function buscarTareaPlanning(id) {
    return planning.find(p => p.id === id);
}

// ===============================
// CÁLCULO DE CUMPLIMIENTO
// ===============================
function calcularCumplimiento(tareaReal, tareaPlan) {
    if (!tareaPlan) return "Sin datos de planning";
    if (!tareaReal.fechaFinal) return "Pendiente";

    const realFin = new Date(tareaReal.fechaFinal);
    const previstoFin = new Date(tareaPlan.fecha_fin);

    return realFin <= previstoFin ? "Cumplida" : "No cumplida";
}

// ===============================
// RENDER KANBAN
// ===============================
function renderKanban() {
    const mesSel = parseInt(document.getElementById("filtroMes").value);
    const añoSel = parseInt(document.getElementById("filtroAño").value);
    const obraSel = document.getElementById("filtroObra").value;
    const usuarioSel = document.getElementById("filtroUsuario").value;

    let lista = tareas.filter(t => {
        if (!t.fechaInicio) return false;
        const f = new Date(t.fechaInicio);
        return f.getMonth() === mesSel && f.getFullYear() === añoSel;
    });

    if (obraSel !== "todas") lista = lista.filter(t => t.obraId === obraSel);
    if (usuarioSel !== "todos") lista = lista.filter(t => t.asignadoA === usuarioSel);

    document.querySelectorAll(".kanban-column .tarea-card").forEach(e => e.remove());

    let count = { bloqueada:0, proceso:0, pendiente:0, completada:0 };

    lista.forEach(t => {
        const card = document.createElement("div");
        card.className = "tarea-card";
        card.draggable = true;
        card.id = t.id;
        card.ondragstart = drag;

        const plan = buscarTareaPlanning(t.id);

        const fechaPrevistaInicio = plan ? plan.fecha_inicio : "-";
        const fechaPrevistaFin = plan ? plan.fecha_fin : "-";

        const estadoCumplimiento = calcularCumplimiento(t, plan);

        card.innerHTML = `
            <strong>${t.titulo}</strong><br>
            Obra: ${t.obraId}<br>
            Responsable: ${t.asignadoA}<br><br>

            <strong>Inicio previsto:</strong> ${fechaPrevistaInicio}<br>
            <strong>Fin previsto:</strong> ${fechaPrevistaFin}<br><br>

            <strong>Inicio real:</strong> ${t.fechaInicio || "-"}<br>
            <strong>Fin real:</strong> ${t.fechaFinal || "-"}<br><br>

            <strong>Estado:</strong> ${estadoCumplimiento}
        `;

        // COLORES SEGÚN CUMPLIMIENTO
        if (estadoCumplimiento === "Cumplida") {
            card.style.borderLeft = "5px solid #2ecc71"; // verde
        }
        else if (estadoCumplimiento === "No cumplida") {
            card.style.borderLeft = "5px solid #e74c3c"; // rojo
        }
        else if (estadoCumplimiento === "Sin datos de planning") {
            card.style.borderLeft = "5px solid #7f8c8d"; // gris
        }
        else {
            card.style.borderLeft = "5px solid #f1c40f"; // amarillo
        }

        document.getElementById(t.estado).appendChild(card);
        count[t.estado]++;
    });

    document.getElementById("titulo-bloqueada").textContent = `🟥 Bloqueadas (${count.bloqueada})`;
    document.getElementById("titulo-proceso").textContent = `🟦 En proceso (${count.proceso})`;
    document.getElementById("titulo-pendiente").textContent = `🟨 Pendientes (${count.pendiente})`;
    document.getElementById("titulo-completada").textContent = `🟩 Completadas (${count.completada})`;
}

// ===============================
// DRAG & DROP
// ===============================
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, nuevoEstado) {
    event.preventDefault();
    const idTarea = event.dataTransfer.getData("text");

    let lista = JSON.parse(localStorage.getItem("tareasPCI")) || [];
    let t = lista.find(x => x.id === idTarea);

    if (!t) return;

    t.estado = nuevoEstado;

    if (nuevoEstado === "completada" && !t.fechaFinal) {
        t.fechaFinal = new Date().toISOString().split("T")[0];
    }

    localStorage.setItem("tareasPCI", JSON.stringify(lista));

    cargarLocalStorage();
    renderKanban();
}
