// ===============================
//  SISTEMA DE USUARIOS (VERSIÓN UNIFICADA)
// ===============================

// Lista de usuarios cargados
let usuariosData = [];

// Usuario actualmente logueado
let usuarioActual = null;


// ===============================
//  CARGAR USUSARIOS
// ===============================

async function cargarUsuarios() {
    try {
        const usuariosLocal = localStorage.getItem("usuariosPCI");

        if (usuariosLocal) {
            usuariosData = JSON.parse(usuariosLocal);
            return usuariosData;
        }

        // Si no existe en localStorage, cargar desde usuarios.json
        const res = await fetch("data/usuarios.json");
        usuariosData = await res.json();

        guardarUsuarios();
        return usuariosData;

    } catch (error) {
        console.error("Error cargando usuarios:", error);
    }
}


// ===============================
//  GUARDAR USUARIOS
// ===============================

function guardarUsuarios() {
    localStorage.setItem("usuariosPCI", JSON.stringify(usuariosData));
}


// ===============================
//  OBTENER USUARIO POR ID
// ===============================

function obtenerUsuarioPorId(id) {
    return usuariosData.find(u => u.id === id) || null;
}


// ===============================
//  ESTABLECER USUARIO ACTUAL
// ===============================

function setUsuarioActual(idUsuario) {
    usuarioActual = obtenerUsuarioPorId(idUsuario);

    if (!usuarioActual) {
        console.warn("Usuario no encontrado:", idUsuario);
        return;
    }

    // Guardar ID del usuario
    localStorage.setItem("usuarioActual", usuarioActual.id);

    // Asignar obras al administrador
    asignarTodasLasObrasAlAdministrador();

    // Recargar usuarioActual con las obras ya asignadas
    usuarioActual = obtenerUsuarioPorId(idUsuario);
    localStorage.setItem("usuarioActual", usuarioActual.id);
}


// ===============================
//  OBTENER USUARIO ACTUAL
// ===============================

function getUsuarioActual() {
    const id = localStorage.getItem("usuarioActual");
    if (!id) return null;

    return obtenerUsuarioPorId(id);
}


// ===============================
//  PERMISOS
// ===============================

function usuarioTienePermiso(permiso) {
    const user = getUsuarioActual();
    if (!user || !user.permisos) return false;

    return user.permisos.includes(permiso);
}


// ===============================
//  CREAR USUARIO
// ===============================

function crearUsuario(datos) {
    const nuevoUsuario = {
        id: "u" + Date.now(),
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono,
        rol: datos.rol,
        permisos: datos.permisos,
        obras: datos.obras || [],     // CORREGIDO
        password: datos.password,
        activo: true
    };

    usuariosData.push(nuevoUsuario);
    guardarUsuarios();
    return nuevoUsuario;
}


// ===============================
//  EDITAR USUARIO
// ===============================

function editarUsuario(id, datos) {
    const usuario = obtenerUsuarioPorId(id);
    if (!usuario) return;

    usuario.nombre = datos.nombre;
    usuario.email = datos.email;
    usuario.telefono = datos.telefono;
    usuario.rol = datos.rol;
    usuario.permisos = datos.permisos;
    usuario.obras = datos.obras || [];   // CORREGIDO
    usuario.password = datos.password;

    guardarUsuarios();
}


// ===============================
//  ELIMINAR USUARIO
// ===============================

function eliminarUsuario(id) {
    usuariosData = usuariosData.filter(u => u.id !== id);
    guardarUsuarios();
}


// ===============================
//  INICIALIZACIÓN
// ===============================

document.addEventListener("DOMContentLoaded", async () => {

    await cargarUsuarios();

    // Si no hay usuarios, crear un administrador por defecto
    if (usuariosData.length === 0) {
        const admin = {
            id: "u001",
            nombre: "Administrador",
            email: "admin@admin.com",
            telefono: "",
            rol: "Administrador",
            permisos: window._roles.find(r => r.id === "Administrador").permisos,
            obras: [],               // CORREGIDO
            password: "admin",
            activo: true
        };

        usuariosData.push(admin);
        guardarUsuarios();
    }

    // NO forzar login automático
    usuarioActual = getUsuarioActual();
    console.log("Usuario actual:", usuarioActual?.nombre);
});


// ===============================
//  ASIGNAR OBRAS AL ADMIN
// ===============================

function asignarTodasLasObrasAlAdministrador() {
    const admin = usuariosData.find(u => u.rol === "Administrador");
    if (!admin) return;

    const obras = JSON.parse(localStorage.getItem("obrasPCI")) || []; // CORREGIDO
    admin.obras = obras.map(o => o.id);

    guardarUsuarios();
}
