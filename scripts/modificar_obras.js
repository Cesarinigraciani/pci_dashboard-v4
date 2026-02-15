// ===============================
//  OBTENER ID DE LA OBRA DESDE LA URL
// ===============================
document.addEventListener("DOMContentLoaded", cargarObra);

function cargarObra() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("No se ha seleccionado ninguna obra.");
    window.location.href = "lista_obras.html";
    return;
  }

  const obras = JSON.parse(localStorage.getItem("obrasPCI")) || [];
  const obra = obras.find(o => o.id === id);

  if (!obra) {
    alert("Obra no encontrada.");
    window.location.href = "lista_obras.html";
    return;
  }

  // Cargar datos en los inputs
  document.getElementById("nombreObra").value = obra.nombre;
  document.getElementById("direccionObra").value = obra.direccion || "";
  document.getElementById("ciudadObra").value = obra.ciudad || "";
  document.getElementById("fechaInicio").value = obra.fechaInicio || "";
  document.getElementById("encargadoObra").value = obra.encargado || "";
  document.getElementById("horasObra").value = obra.horasEstimadas || 0;
}

// ===============================
//  GUARDAR CAMBIOS EN LA OBRA
// ===============================
function guardarCambios() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const obras = JSON.parse(localStorage.getItem("obrasPCI")) || [];
  const index = obras.findIndex(o => o.id === id);

  if (index === -1) {
    alert("Error: no se encontró la obra.");
    return;
  }

  // Actualizar datos
  obras[index].nombre = document.getElementById("nombreObra").value.trim();
  obras[index].direccion = document.getElementById("direccionObra").value.trim();
  obras[index].ciudad = document.getElementById("ciudadObra").value.trim();
  obras[index].fechaInicio = document.getElementById("fechaInicio").value;
  obras[index].encargado = document.getElementById("encargadoObra").value.trim();
  obras[index].horasEstimadas = Number(document.getElementById("horasObra").value);

  // Guardar en localStorage
  localStorage.setItem("obrasPCI", JSON.stringify(obras));

  alert("Cambios guardados correctamente.");
  window.location.href = "lista_obras.html";
}
