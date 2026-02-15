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

  const selectPlanta = document.getElementById("selectPlanta");
  selectPlanta.innerHTML = "";

  proyecto.plantas.forEach((planta, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = planta.nombre;
    selectPlanta.appendChild(option);
  });

  cargarEquipos();
}

function cargarEquipos() {
  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  const indexPlanta = document.getElementById("selectPlanta").value;
  const planta = proyecto.plantas[indexPlanta];

  const selectEquipo = document.getElementById("selectEquipo");
  selectEquipo.innerHTML = "";

  planta.equipos.forEach((equipo, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${equipo.tipo} (${equipo.cantidad})`;
    selectEquipo.appendChild(option);
  });

  cargarTarjetas();
}

function crearTarjetaWelcome() {
  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  const indexPlanta = document.getElementById("selectPlanta").value;
  const indexEquipo = document.getElementById("selectEquipo").value;

  const descripcion = document.getElementById("descripcionWelcome").value.trim();
  if (!descripcion) {
    alert("Introduce una descripción.");
    return;
  }

  proyecto.welcome = proyecto.welcome || [];

  proyecto.welcome.push({
    id: Date.now().toString(),
    planta: indexPlanta,
    equipo: indexEquipo,
    descripcion
  });

  localStorage.setItem("proyectosPCI", JSON.stringify(proyectos));

  document.getElementById("descripcionWelcome").value = "";
  cargarTarjetas();
}

function cargarTarjetas() {
  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  const contenedor = document.getElementById("listaWelcome");
  contenedor.innerHTML = "";

  proyecto.welcome = proyecto.welcome || [];

  proyecto.welcome.forEach((tarjeta, index) => {
    const div = document.createElement("div");
    div.className = "item-lista";

    div.innerHTML = `
      <h3>${tarjeta.descripcion}</h3>
      <p><strong>Planta:</strong> ${proyecto.plantas[tarjeta.planta].nombre}</p>
      <p><strong>Equipo:</strong> ${proyecto.plantas[tarjeta.planta].equipos[tarjeta.equipo].tipo}</p>

      <button class="btn-secundario" onclick="eliminarTarjeta(${index})">🗑️ Eliminar</button>
    `;

    contenedor.appendChild(div);
  });
}

function eliminarTarjeta(index) {
  if (!confirm("¿Eliminar esta tarjeta?")) return;

  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  proyecto.welcome.splice(index, 1);

  localStorage.setItem("proyectosPCI", JSON.stringify(proyectos));
  cargarTarjetas();
}
