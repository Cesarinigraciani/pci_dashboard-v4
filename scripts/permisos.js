// permisos.js
// ---------------------------------------------------------
// Lista oficial de permisos del sistema (ALINEADO CON roles.js)
// ---------------------------------------------------------

window._permisos = [
  // Gestión de obras
  { id: "crear_obra", nombre: "Crear obra" },
  { id: "editar_obra", nombre: "Editar obra" },
  { id: "borrar_obra", nombre: "Borrar obra" },
  { id: "ver_obras", nombre: "Ver obras" },

  // Gestión de usuarios
  { id: "crear_usuario", nombre: "Crear usuario" },
  { id: "editar_usuario", nombre: "Editar usuario" },
  { id: "borrar_usuario", nombre: "Borrar usuario" },
  { id: "ver_usuarios", nombre: "Ver usuarios" },

  // Gestión de tareas
  { id: "crear_tarea", nombre: "Crear tarea" },
  { id: "editar_tarea", nombre: "Editar tarea" },
  { id: "borrar_tarea", nombre: "Borrar tarea" },
  { id: "ver_tareas", nombre: "Ver tareas" },
  { id: "asignar_tareas", nombre: "Asignar tareas" },
  { id: "completar_tareas", nombre: "Completar tareas" },

  // Paneles y módulos
  { id: "ver_dashboard", nombre: "Dashboard" },
  { id: "ver_planning", nombre: "Planning" },
  { id: "ver_kpi", nombre: "Indicadores KPI" },
  { id: "ver_recursos", nombre: "Recursos" },
  { id: "ver_panel_admin", nombre: "Panel de administración" }
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

  const mapa = {
    crear_tarea: "btnCrearTarea",
    ver_tareas: "btnVerTareas",
    asignar_tareas: "btnAsignarTareas",
    completar_tareas: "btnCompletarTareas",
    ver_usuarios: "btnPanelUsuarios",
    ver_obras: "btnPanelObras",
    ver_dashboard: "btnDashboard",
    ver_planning: "btnPlanning",
    ver_kpi: "btnKPI",
    ver_recursos: "btnRecursos",
    ver_panel_admin: "btnPanelAdmin"
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


