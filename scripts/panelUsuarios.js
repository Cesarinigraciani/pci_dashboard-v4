// panelUsuarios.js
// ---------------------------------------------------------
// Gestión de usuarios: creación, edición, permisos y obras
// ---------------------------------------------------------

// Elementos del DOM
const panelUsuarios = document.getElementById("panel-usuarios");
const listaUsuariosDiv = document.getElementById("listaUsuarios");
const formularioUsuario = document.getElementById("formularioUsuario");
const tituloFormulario = document.getElementById("tituloFormulario");

const inputNombreUsuario = document.getElementById("inputNombreUsuario");
const selectRolUsuario = document.getElementById("selectRolUsuario");
const inputClaveUsuario = document.getElementById("inputClaveUsuario");
const inputCorreoUsuario = document.getElementById("inputCorreoUsuario");

const checkboxPermisosDiv = document.getElementById("checkboxPermisos");
const checkboxObrasDiv = document.getElementById("checkboxObras");

const btnGuardarUsuario = document.getElementById("btnGuardarUsuario");
const btnCancelarUsuario = document.getElementById("btnCancelarUsuario");

// ---------------------------------------------------------
// 📧 VALIDAR CORREO
// ---------------------------------------------------------
function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

// ---------------------------------------------------------
// 🔑 VALIDAR CLAVE
// ---------------------------------------------------------
function validarClave(clave) {
  return clave.trim().length >= 6;
}

// ---------------------------------------------------------
// VARIABLES DEL SISTEMA
// ---------------------------------------------------------
window._usuarios = JSON.parse(localStorage.getItem("usuariosPCI")) || [];
window._usuarioEditando = null;

// ---------------------------------------------------------
// RENDERIZAR LISTA DE USUARIOS
// ---------------------------------------------------------
function pintarListaUsuarios() {
  listaUsuariosDiv.innerHTML = "";

  window._usuarios.forEach(usuario => {
    const div = document.createElement("div");
    div.classList.add("usuario-item");

    div.innerHTML = `
      <strong>${usuario.nombre}</strong>
      <span>Rol: ${usuario.rol}</span>
      <button onclick="editarUsuario('${usuario.id}')">✏️ Editar</button>
      <button onclick="eliminarUsuario('${usuario.id}')">🗑️ Eliminar</button>
    `;

    listaUsuariosDiv.appendChild(div);
  });
}

// ---------------------------------------------------------
// CARGAR ROLES EN FORMULARIO
// ---------------------------------------------------------
function cargarRolesEnFormulario() {
  selectRolUsuario.innerHTML = "";

  (window._roles || []).forEach(rol => {
    const option = document.createElement("option");
    option.value = rol.id;
    option.textContent = rol.id;
    selectRolUsuario.appendChild(option);
  });
}

// ---------------------------------------------------------
// 📌 Cargar obras en el formulario de usuario
// ---------------------------------------------------------
function cargarObrasEnFormulario() {
  checkboxObrasDiv.innerHTML = "";

  (window._obras || []).forEach(obra => {
    const label = document.createElement("label");
    label.classList.add("checkbox-item");

    label.innerHTML = `
      <input type="checkbox" value="${obra}">
      ${obra}
    `;

    checkboxObrasDiv.appendChild(label);
  });
}

// ---------------------------------------------------------
// EDITAR USUARIO
// ---------------------------------------------------------
function editarUsuario(id) {
  const usuario = window._usuarios.find(u => u.id === id);
  if (!usuario) return alert("Usuario no encontrado");

  window._usuarioEditando = usuario;

  cargarRolesEnFormulario();
  generarCheckboxPermisos("checkboxPermisos", usuario.permisos);
  cargarObrasEnFormulario();

  document.querySelectorAll("#checkboxObras input[type='checkbox']").forEach(chk => {
    chk.checked = usuario.obras?.includes(chk.value) || false;
  });

  tituloFormulario.textContent = "Editar Usuario";
  inputNombreUsuario.value = usuario.nombre;
  selectRolUsuario.value = usuario.rol;
  inputClaveUsuario.value = ""; // nunca mostrar clave
  inputCorreoUsuario.value = usuario.correo || "";

  formularioUsuario.classList.remove("oculto");
  formularioUsuario.scrollIntoView({ behavior: "smooth" });

  btnGuardarUsuario.onclick = guardarUsuario;
}

// ---------------------------------------------------------
// CREAR USUARIO
// ---------------------------------------------------------
function mostrarFormularioCrearUsuario() {
  window._usuarioEditando = null;

  cargarRolesEnFormulario();
  generarCheckboxPermisos("checkboxPermisos", []);
  cargarObrasEnFormulario();

  tituloFormulario.textContent = "Crear Usuario";
  inputNombreUsuario.value = "";
  selectRolUsuario.value = "";
  inputClaveUsuario.value = "";
  inputCorreoUsuario.value = "";

  formularioUsuario.classList.remove("oculto");
  formularioUsuario.scrollIntoView({ behavior: "smooth" });

  btnGuardarUsuario.onclick = guardarUsuario;
}

// ---------------------------------------------------------
// 💾 GUARDAR USUARIO (CON CIFRADO SHA-256)
// ---------------------------------------------------------
async function guardarUsuario() {
  const nombre = inputNombreUsuario.value.trim();
  const rol = selectRolUsuario.value;
  const clave = inputClaveUsuario.value.trim();
  const correo = inputCorreoUsuario.value.trim();

  if (!nombre) return alert("El nombre es obligatorio.");
  if (!rol) return alert("Debes seleccionar un rol.");
  if (!validarCorreo(correo)) return alert("El correo no es válido.");

  let claveFinalHash = null;

  if (window._usuarioEditando) {
    // MODO EDICIÓN
    if (clave === "") {
      claveFinalHash = window._usuarioEditando.claveHash;
    } else {
      if (!validarClave(clave)) return alert("La clave debe tener al menos 6 caracteres.");
      claveFinalHash = await hashClave(clave);
    }
  } else {
    // MODO CREACIÓN
    if (!validarClave(clave)) return alert("La clave debe tener al menos 6 caracteres.");
    claveFinalHash = await hashClave(clave);
  }

  // Permisos seleccionados
  const permisos = Array.from(document.querySelectorAll("#checkboxPermisos input[type='checkbox']:checked"))
    .map(chk => chk.value);

  // Obras seleccionadas
  const obras = Array.from(document.querySelectorAll("#checkboxObras input[type='checkbox']:checked"))
    .map(chk => chk.value);

  // Cargar usuarios
  let usuarios = JSON.parse(localStorage.getItem("usuariosPCI")) || [];

  if (window._usuarioEditando) {
    // EDITAR
    usuarios = usuarios.map(u => {
      if (u.id === window._usuarioEditando.id) {
        return {
          ...u,
          nombre,
          rol,
          claveHash: claveFinalHash,
          correo,
          permisos,
          obras
        };
      }
      return u;
    });

  } else {
    // CREAR
    usuarios.push({
      id: "u" + Date.now(),
      nombre,
      rol,
      claveHash: claveFinalHash,
      correo,
      permisos,
      obras
    });
  }

  // Guardar
  localStorage.setItem("usuariosPCI", JSON.stringify(usuarios));
  window._usuarios = usuarios;

  alert("Usuario guardado correctamente.");

  formularioUsuario.classList.add("oculto");
  pintarListaUsuarios();
}

// ---------------------------------------------------------
// ELIMINAR USUARIO
// ---------------------------------------------------------
function eliminarUsuario(id) {
  window._usuarios = window._usuarios.filter(u => u.id !== id);
  localStorage.setItem("usuariosPCI", JSON.stringify(window._usuarios));
  pintarListaUsuarios();
}

// ---------------------------------------------------------
// CANCELAR
// ---------------------------------------------------------
btnCancelarUsuario.onclick = () => {
  formularioUsuario.classList.add("oculto");
};

// ---------------------------------------------------------
// INICIALIZAR
// ---------------------------------------------------------
pintarListaUsuarios();
document.getElementById("btnCrearUsuario").onclick = mostrarFormularioCrearUsuario;
