document.addEventListener("DOMContentLoaded", cargarDashboard);

function cargarDashboard() {
  const id = localStorage.getItem("proyectoActivo");
  const proyectos = JSON.parse(localStorage.getItem("proyectosPCI")) || [];
  const proyecto = proyectos.find(p => p.id === id);

  if (!proyecto) {
    alert("Proyecto no encontrado.");
    return;
  }

  document.getElementById("titulo-proyecto").textContent = proyecto.nombre;

  // ============================
  // VARIABLES GLOBALES
  // ============================
  let totalEquipos = 0;
  let totalInstalados = 0;

  const tipos = {}; // { "Detector óptico": {total: X, instalados: Y} }

  // ============================
  // RECORRER PLANTAS Y EQUIPOS
  // ============================
  proyecto.plantas.forEach(planta => {
    planta.equipos.forEach(equipo => {
      totalEquipos += equipo.cantidad;
      totalInstalados += equipo.instalados;

      if (!tipos[equipo.tipo]) {
        tipos[equipo.tipo] = { total: 0, instalados: 0 };
      }

      tipos[equipo.tipo].total += equipo.cantidad;
      tipos[equipo.tipo].instalados += equipo.instalados;
    });
  });

  const totalPendientes = totalEquipos - totalInstalados;
  const porcentajeGlobal = totalEquipos === 0 ? 0 : Math.round((totalInstalados / totalEquipos) * 100);

  // ============================
  // MOSTRAR TOTALES
  // ============================
  document.getElementById("total-equipos").textContent = totalEquipos;
  document.getElementById("total-instalados").textContent = totalInstalados;
  document.getElementById("total-pendientes").textContent = totalPendientes;

  // ============================
  // BARRA GLOBAL
  // ============================
  document.getElementById("barra-global").innerHTML = crearBarra(porcentajeGlobal);

  // ============================
  // AVANCE POR PLANTA
  // ============================
  const contPlantas = document.getElementById("dashboard-plantas");
  contPlantas.innerHTML = "";

  proyecto.plantas.forEach(planta => {
    let eqTotal = 0;
    let eqInst = 0;

    planta.equipos.forEach(e => {
      eqTotal += e.cantidad;
      eqInst += e.instalados;
    });

    const porcentaje = eqTotal === 0 ? 0 : Math.round((eqInst / eqTotal) * 100);

    const div = document.createElement("div");
    div.className = "item-dashboard";
    div.innerHTML = `
      <h3>${planta.nombre}</h3>
      ${crearBarra(porcentaje)}
    `;
    contPlantas.appendChild(div);
  });

  // ============================
  // AVANCE POR TIPO DE EQUIPO
  // ============================
  const contTipos = document.getElementById("dashboard-tipos");
  contTipos.innerHTML = "";

  Object.keys(tipos).forEach(tipo => {
    const t = tipos[tipo];
    const porcentaje = t.total === 0 ? 0 : Math.round((t.instalados / t.total) * 100);

    const div = document.createElement("div");
    div.className = "item-dashboard";
    div.innerHTML = `
      <h3>${tipo}</h3>
      ${crearBarra(porcentaje)}
    `;
    contTipos.appendChild(div);
  });

  // ============================
  // TABLA RESUMEN
  // ============================
  const tbody = document.getElementById("tabla-resumen-body");
  tbody.innerHTML = "";

  Object.keys(tipos).forEach(tipo => {
    const t = tipos[tipo];
    const pendientes = t.total - t.instalados;
    const porcentaje = t.total === 0 ? 0 : Math.round((t.instalados / t.total) * 100);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${tipo}</td>
      <td>${t.total}</td>
      <td>${t.instalados}</td>
      <td>${pendientes}</td>
      <td>${porcentaje}%</td>
    `;
    tbody.appendChild(tr);
  });
}

// ============================
// FUNCIÓN PARA CREAR BARRAS
// ============================
function crearBarra(porcentaje) {
  const color = porcentaje < 50 ? "red" :
                porcentaje < 80 ? "orange" :
                "green";

  return `
    <div class="barra-externa">
      <div class="barra-interna" style="width:${porcentaje}%; background:${color};">
        ${porcentaje}%
      </div>
    </div>
  `;
}
