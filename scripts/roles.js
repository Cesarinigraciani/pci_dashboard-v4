// roles.js
// ---------------------------------------------------------
// Gestión de roles y permisos predefinidos
// ---------------------------------------------------------

window._roles = [
  {
    id: "Administrador",
    permisos: [
      // Gestión de obras
      "crear_obra",
      "editar_obra",
      "borrar_obra",
      "ver_obras",

      // Gestión de usuarios
      "crear_usuario",
      "editar_usuario",
      "borrar_usuario",
      "ver_usuarios",

      // Gestión de tareas
      "crear_tarea",
      "editar_tarea",
      "borrar_tarea",
      "ver_tareas",
      "asignar_tareas",
      "completar_tareas",

      // Paneles y módulos
      "ver_dashboard",
      "ver_planning",
      "ver_kpi",
      "ver_recursos",
      "ver_panel_admin"
    ]
  },

  {
    id: "Supervisor",
    permisos: [
      "ver_obras",
      "crear_tarea",
      "editar_tarea",
      "ver_tareas",
      "asignar_tareas",
      "completar_tareas",
      "ver_dashboard",
      "ver_planning",
      "ver_kpi"
    ]
  },

  {
    id: "Tecnico",
    permisos: [
      "ver_obras",
      "ver_tareas",
      "completar_tareas"
    ]
  },

  {
    id: "Ingeniero Técnico",
    permisos: [
      "ver_obras",
      "crear_tarea",
      "editar_tarea",
      "ver_tareas",
      "asignar_tareas",
      "completar_tareas",
      "ver_dashboard",
      "ver_planning"
    ]
  },

  {
    id: "Encargado de Obra",
    permisos: [
      "ver_obras",
      "ver_tareas",
      "completar_tareas"
    ]
  },

  {
    id: "Oficial de Primera",
    permisos: [
      "ver_obras",
      "ver_tareas",
      "completar_tareas"
    ]
  },

  {
    id: "Oficial de Segunda",
    permisos: [
      "ver_obras",
      "ver_tareas",
      "completar_tareas"
    ]
  },

  {
    id: "Sub-contrata",
    permisos: [
      "ver_obras",
      "ver_tareas"
    ]
  }
];

// ---------------------------------------------------------
// Cargar roles en el <select> del formulario de usuarios
// ---------------------------------------------------------

function cargarRolesEnFormulario() {
  const select = document.getElementById("selectRolUsuario");
  if (!select) return;

  select.innerHTML = "";

  window._roles.forEach(rol => {
    const option = document.createElement("option");
    option.value = rol.id;
    option.textContent = rol.id;
    select.appendChild(option);
  });
}

// ---------------------------------------------------------
// Obtener permisos según el rol seleccionado
// ---------------------------------------------------------

function obtenerPermisosPorRol(rolId) {
  const rol = window._roles.find(r => r.id === rolId);
  return rol ? rol.permisos : [];
}

// ---------------------------------------------------------
// Aplicar permisos del rol al formulario
// ---------------------------------------------------------

function aplicarPermisosDeRol(rolId) {
  const permisosRol = obtenerPermisosPorRol(rolId);

  document.querySelectorAll("#checkboxPermisos input[type='checkbox']").forEach(chk => {
    chk.checked = permisosRol.includes(chk.value);
  });
}

// ---------------------------------------------------------
// Evento: cambio de rol
// ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const selectRol = document.getElementById("selectRolUsuario");

  if (selectRol) {
    selectRol.addEventListener("change", () => {
      aplicarPermisosDeRol(selectRol.value);
    });
  }
});

