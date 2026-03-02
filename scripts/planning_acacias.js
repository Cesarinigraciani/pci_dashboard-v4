/* ============================================================
   MODO DE TRABAJO: "local" o "firebase"
============================================================ */
const modo = "local"; 
// Cambia a "firebase" cuando quieras trabajar conectado a Firestore

let planning = [];

/* ============================================================
   CARGAR PLANNING (HÍBRIDO)
============================================================ */
async function cargarPlanning() {

    if (modo === "local") {
        // Cargar desde JSON local
        fetch("data/planning_acacias.json")
            .then(r => r.json())
            .then(data => {
                planning = data;
                renderTabla();
            })
            .catch(err => console.error("Error cargando JSON del planning:", err));
        return;
    }

    if (modo === "firebase") {
        // Cargar desde Firestore
        const snap = await db.collection("planning_acacias").get();
        planning = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderTabla();
    }
}

/* ============================================================
   GUARDAR O EDITAR TAREA DEL PLANNING
============================================================ */
async function guardarPlanning() {
    const id = document.getElementById("idPlan").value.trim();
    const nombre = document.getElementById("nombrePlan").value.trim();
    const duracion = document.getElementById("duracionPlan").value;
    const inicio = document.getElementById("inicioPlan").value;
    const fin = document.getElementById("finPlan").value;

    if (!id || !nombre || !duracion || !inicio || !fin) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const nuevaTarea = {
        id: id,
        nombre_tarea: nombre,
        duracion_dias: duracion,
        fecha_inicio: inicio,
        fecha_fin: fin
    };

    // Guardar en local (solo actualiza la tabla)
    if (modo === "local") {
        const index = planning.findIndex(p => p.id === id);

        if (index >= 0) {
            planning[index] = nuevaTarea;
        } else {
            planning.push(nuevaTarea);
        }

        renderTabla();
        alert("Guardado en modo LOCAL (no subido a Firebase).");
        return;
    }

    // Guardar en Firebase
    if (modo === "firebase") {
        await db.collection("planning_acacias").doc(id).set(nuevaTarea);
        alert("Tarea guardada correctamente en Firebase.");
        cargarPlanning();
    }
}

/* ============================================================
   EDITAR TAREA
============================================================ */
function editarPlanning(id) {
    const p = planning.find(x => x.id === id);

    document.getElementById("idPlan").value = p.id;
    document.getElementById("nombrePlan").value = p.nombre_tarea;
    document.getElementById("duracionPlan").value = p.duracion_dias;
    document.getElementById("inicioPlan").value = p.fecha_inicio;
    document.getElementById("finPlan").value = p.fecha_fin;
}

/* ============================================================
   ELIMINAR TAREA
============================================================ */
async function eliminarPlanning(id) {
    if (!confirm("¿Eliminar esta tarea del planning?")) return;

    if (modo === "local") {
        planning = planning.filter(p => p.id !== id);
        renderTabla();
        alert("Eliminado en modo LOCAL.");
        return;
    }

    if (modo === "firebase") {
        await db.collection("planning_acacias").doc(id).delete();
        cargarPlanning();
    }
}

/* ============================================================
   RENDER TABLA
============================================================ */
function renderTabla() {
    const tbody = document.getElementById("tablaPlanning");
    tbody.innerHTML = "";

    planning.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td>${p.nombre_tarea}</td>
                <td>${p.duracion_dias}</td>
                <td>${p.fecha_inicio}</td>
                <td>${p.fecha_fin}</td>
                <td>
                    <button class="btn btn-edit" onclick="editarPlanning('${p.id}')">Editar</button>
                    <button class="btn btn-delete" onclick="eliminarPlanning('${p.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

/* ============================================================
   INICIALIZACIÓN
============================================================ */
document.addEventListener("DOMContentLoaded", cargarPlanning);
