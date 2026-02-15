// permisos.js
// ---------------------------------------------------------
// Gestión de permisos del sistema
// ---------------------------------------------------------

// Lista oficial de permisos del sistema
window._permisos = [
  { id: "crearProyecto", nombre: "Crear proyectos" },
  { id: "borrarProyecto", nombre: "Borrar proyectos" },
  { id: "modificarProyecto", nombre: "Modificar proyectos" },
  { id: "verProyectos", nombre: "Ver proyectos" },

  { id: "crearTareas", nombre: "Crear tareas" },
  { id: "verTareas", nombre: "Ver tareas" },
  { id: "asignarTareas", nombre: "Asignar tareas" },
  { id: "completarTareas", nombre: "Completar tareas" },

  { id: "informes", nombre: "Ver informes" },

  { id: "usuarios", nombre: "Administrar usuarios" },
  { id: "proyectos", nombre: "Administrar obras" }
];

// ---------------------------------------------------------
// Generar checkboxes de permisos dinámicamente
// ---------------------------------------------------------

function generarCheckboxPermisos(contenedorId, permisosUsuario = []) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.innerHTML = "";

  window._permisos.forEach(permiso => {
    const label = document.createElement("label");
    label.classList.add("permiso-item");

    const checked = permisosUsuario.includes(permiso.id) ? "checked" : "";

    label.innerHTML = `
      <input type="checkbox" value="${permiso.id}" ${checked}>
      ${permiso.nombre}
    `;

    contenedor.appendChild(label);
  });
}

// ---------------------------------------------------------
// Obtener permisos seleccionados desde el formulario
// ---------------------------------------------------------

function obtenerPermisosSeleccionados(contenedorId) {
  return Array.from(
    document.querySelectorAll(`#${contenedorId} input[type="checkbox"]:checked`)
  ).map(chk => chk.value);
}

// ---------------------------------------------------------
// Aplicar permisos al dashboard (ocultar/mostrar botones)
// ---------------------------------------------------------

function aplicarPermisosAlDashboard(usuario) {
  if (!usuario || !usuario.permisos) return;

  // Mapa entre permisos y botones reales del index
  const mapa = {
    crearTareas: "btnCrearTarea",
    verTareas: "btnAsignacionTareas",
    asignarTareas: "btnAsignacionTareas",
    completarTareas: "btnCompletarTareas",
    informes: "btnInformesTareas",
    usuarios: "btnPanelUsuarios",
    proyectos: "btnPanelObras"
  };

  Object.entries(mapa).forEach(([permiso, botonId]) => {
    const btn = document.getElementById(botonId);
    if (!btn) return;

    if (usuario.permisos.includes(permiso)) {
      btn.classList.remove("oculto");
    } else {
      btn.classList.add("oculto");
    }
  });
}


