// roles.js
// ---------------------------------------------------------
// Gestión de roles y permisos predefinidos
// ---------------------------------------------------------

window._roles = [
  {
    id: "Administrador",
    permisos: [
      "crearProyecto",
      "borrarProyecto",
      "modificarProyecto",
      "verProyectos",

      "crearTareas",
      "verTareas",
      "asignarTareas",
      "completarTareas",

      "informes",
      "usuarios",
      "proyectos"
    ]
  },
  {
    id: "Supervisor",
    permisos: [
      "verProyectos",
      "crearTareas",
      "verTareas",
      "asignarTareas",
      "completarTareas",
      "informes"
    ]
  },
  {
    id: "Tecnico",
    permisos: [
      "verProyectos",
      "verTareas",
      "completarTareas"
    ]
  },
  {
    id: "Ingeniero Técnico",
    permisos: [
      "verProyectos",
      "crearTareas",
      "verTareas",
      "asignarTareas",
      "completarTareas",
      "informes"
    ]
  },
  {
    id: "Encargado de Obra",
    permisos: [
      "verProyectos",
      "verTareas",
      "completarTareas"
    ]
  },
  {
    id: "Oficial de Primera",
    permisos: [
      "verProyectos",
      "verTareas",
      "completarTareas"
    ]
  },
  {
    id: "Oficial de Segunda",
    permisos: [
      "verProyectos",
      "verTareas",
      "completarTareas"
    ]
  },
  {
    id: "Sub-contrata",
    permisos: [
      "verProyectos",
      "verTareas",
      "completarTareas"
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


