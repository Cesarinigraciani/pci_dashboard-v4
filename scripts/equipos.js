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

  const select = document.getElementById("selectPlanta");
  select.innerHTML = "";

  proyecto.plantas.forEach((planta, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = planta.nombre;
    select.appendChild(option);
  });

  cargarEquipos();
}

function cargarEquipos() {
  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  const indexPlanta = document.getElementById("selectPlanta").value;
  const planta = proyecto.plantas[indexPlanta];

  const contenedor = document.getElementById("listaEquipos");
  contenedor.innerHTML = "";

  planta.equipos = planta.equipos || [];

  planta.equipos.forEach((equipo, index) => {
    const div = document.createElement("div");
    div.className = "item-lista";

    div.innerHTML = `
      <h3>${equipo.tipo}</h3>
      <p><strong>Cantidad:</strong> ${equipo.cantidad}</p>
      <p><strong>Instalados:</strong> ${equipo.instalados}</p>

      <button class="btn-primario" onclick="editarEquipo(${index})">✏️ Editar</button>
      <button class="btn-secundario" onclick="eliminarEquipo(${index})">🗑️ Eliminar</button>
    `;

    contenedor.appendChild(div);
  });
}

function agregarEquipo() {
  const tipo = document.getElementById("tipoEquipo").value.trim();
  const cantidad = parseInt(document.getElementById("cantidadEquipo").value);

  if (!tipo || !cantidad || cantidad <= 0) {
    alert("Introduce un tipo y una cantidad válida.");
    return;
  }

  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  const indexPlanta = document.getElementById("selectPlanta").value;
  const planta = proyecto.plantas[indexPlanta];

  planta.equipos.push({
    id: Date.now().toString(),
    tipo,
    cantidad,
    instalados: 0
  });

  localStorage.setItem("proyectosPCI", JSON.stringify(proyectos));

  document.getElementById("tipoEquipo").value = "";
  document.getElementById("cantidadEquipo").value = "";

  cargarEquipos();
}

function editarEquipo(index) {
  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  const indexPlanta = document.getElementById("selectPlanta").value;
  const planta = proyecto.plantas[indexPlanta];

  const equipo = planta.equipos[index];

  const nuevoTipo = prompt("Nuevo tipo:", equipo.tipo);
  if (!nuevoTipo) return;

  const nuevaCantidad = parseInt(prompt("Nueva cantidad:", equipo.cantidad));
  if (!nuevaCantidad || nuevaCantidad <= 0) return;

  equipo.tipo = nuevoTipo.trim();
  equipo.cantidad = nuevaCantidad;

  localStorage.setItem("proyectosPCI", JSON.stringify(proyectos));
  cargarEquipos();
}

function eliminarEquipo(index) {
  if (!confirm("¿Seguro que deseas eliminar este equipo?")) return;

  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  const indexPlanta = document.getElementById("selectPlanta").value;
  const planta = proyecto.plantas[indexPlanta];

  planta.equipos.splice(index, 1);

  localStorage.setItem("proyectosPCI", JSON.stringify(proyectos));
  cargarEquipos();
}
