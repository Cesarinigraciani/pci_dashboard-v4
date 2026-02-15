// login.js
// ---------------------------------------------------------
// Inicio de sesión con validación y carga de permisos/rol
// ---------------------------------------------------------

document.getElementById("btnLogin").onclick = iniciarSesion;

async function iniciarSesion() {
  const correoInput = document.getElementById("loginUsuario").value.trim();
  const claveInput = document.getElementById("loginClave").value.trim();

  if (!correoInput || !claveInput) {
    alert("Debes introducir correo y clave.");
    return;
  }

  // Cargar usuarios del sistema
  const usuarios = JSON.parse(localStorage.getItem("usuariosPCI")) || [];

  // Buscar usuario por EMAIL (antes buscabas por "correo")
  const usuario = usuarios.find(u => u.email === correoInput);

  if (!usuario) {
    alert("Correo no encontrado.");
    return;
  }

  // Validar clave SIN HASH (si usas hash, me lo dices y lo ajusto)
  if (usuario.password !== claveInput) {
    alert("Clave incorrecta.");
    return;
  }

  // Si el usuario no tiene permisos propios, cargar los del rol
  if (!usuario.permisos || usuario.permisos.length === 0) {
    const rolInfo = (window._roles || []).find(r => r.id === usuario.rol);
    if (rolInfo) {
      usuario.permisos = rolInfo.permisos || [];
    }
  }

  // Guardar solo el ID del usuario (lo que tu sistema espera)
  localStorage.setItem("usuarioActual", usuario.id);

  // Ir al panel principal
  window.location.href = "index.html";
}
