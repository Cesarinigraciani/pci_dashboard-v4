document.addEventListener("DOMContentLoaded", cargarPlantas);

function cargarPlantas() {
  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  if (!proyecto) {
    alert("Proyecto no encontrado.");
    window.location.href = "lista_proyectos.html";
    return;
  }

  const contenedor = document.getElementById("listaPlantas");
  contenedor.innerHTML = "";

  proyecto.plantas = proyecto.plantas || [];

  proyecto.plantas.forEach((planta, index) => {
    const div = document.createElement("div");
    div.className = "item-lista";

    div.innerHTML = `
      <h3>${planta.nombre}</h3>

      <button class="btn-primario" onclick="renombrarPlanta(${index})">✏️ Renombrar</button>
      <button class="btn-secundario" onclick="eliminarPlanta(${index})">🗑️ Eliminar</button>
    `;

    contenedor.appendChild(div);
  });
}

function agregarPlanta() {
  const nombre = document.getElementById("nuevaPlanta").value.trim();
  if (!nombre) {
    alert("Introduce un nombre para la planta.");
    return;
  }

  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  proyecto.plantas.push({
    id: Date.now().toString(),
    nombre,
    equipos: []
  });

  localStorage.setItem("proyectosPCI", JSON.stringify(proyectos));

  document.getElementById("nuevaPlanta").value = "";
  cargarPlantas();
}

function renombrarPlanta(index) {
  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  const nuevoNombre = prompt("Nuevo nombre de la planta:", proyecto.plantas[index].nombre);
  if (!nuevoNombre) return;

  proyecto.plantas[index].nombre = nuevoNombre.trim();

  localStorage.setItem("proyectosPCI", JSON.stringify(proyectos));
  cargarPlantas();
}

function eliminarPlanta(index) {
  if (!confirm("¿Seguro que deseas eliminar esta planta?")) return;

  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  proyecto.plantas.splice(index, 1);

  localStorage.setItem("proyectosPCI", JSON.stringify(proyectos));
  cargarPlantas();
}
