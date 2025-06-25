// Calendario interactivo para seleccionar rango de fechas

document.addEventListener('DOMContentLoaded', () => {
  const calendarioDiv = document.getElementById('calendario-visual');
  const resumenDiv = document.getElementById('resumen-fechas');
  const guardarBtn = document.getElementById('guardar-fechas-btn');

  let hoy = new Date();
  let mesActual = hoy.getMonth();
  let anioActual = hoy.getFullYear();
  let fechaInicio = null;
  let fechaFin = null;

  function renderCalendario(mes, anio) {
    calendarioDiv.innerHTML = '';
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    // Header con mes y año
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'center';
    header.style.alignItems = 'center';
    header.style.marginBottom = '12px';
    header.style.gap = '12px';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '◀';
    prevBtn.style.background = 'linear-gradient(90deg,#66a6ff 0%,#89f7fe 100%)';
    prevBtn.style.color = '#fff';
    prevBtn.style.border = 'none';
    prevBtn.style.borderRadius = '6px';
    prevBtn.style.fontSize = '1.2em';
    prevBtn.style.cursor = 'pointer';
    prevBtn.style.padding = '6px 14px';
    prevBtn.onclick = () => {
      if (mesActual === 0) {
        mesActual = 11;
        anioActual--;
      } else {
        mesActual--;
      }
      renderCalendario(mesActual, anioActual);
    };

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '▶';
    nextBtn.style.background = 'linear-gradient(90deg,#66a6ff 0%,#89f7fe 100%)';
    nextBtn.style.color = '#fff';
    nextBtn.style.border = 'none';
    nextBtn.style.borderRadius = '6px';
    nextBtn.style.fontSize = '1.2em';
    nextBtn.style.cursor = 'pointer';
    nextBtn.style.padding = '6px 14px';
    nextBtn.onclick = () => {
      if (mesActual === 11) {
        mesActual = 0;
        anioActual++;
      } else {
        mesActual++;
      }
      renderCalendario(mesActual, anioActual);
    };

    const mesSelect = document.createElement('select');
    mesSelect.style.marginLeft = '8px';
    mesSelect.style.fontSize = '1em';
    mesSelect.style.borderRadius = '6px';
    mesSelect.style.padding = '4px 8px';
    for (let m = 0; m < 12; m++) {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = meses[m];
      if (m === mes) opt.selected = true;
      mesSelect.appendChild(opt);
    }
    mesSelect.onchange = (e) => {
      mesActual = parseInt(e.target.value);
      renderCalendario(mesActual, anioActual);
    };

    const yearSelect = document.createElement('select');
    yearSelect.style.marginLeft = '8px';
    yearSelect.style.fontSize = '1em';
    yearSelect.style.borderRadius = '6px';
    yearSelect.style.padding = '4px 8px';
    for (let y = anio - 5; y <= anio + 5; y++) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      if (y === anio) opt.selected = true;
      yearSelect.appendChild(opt);
    }
    yearSelect.onchange = (e) => {
      anioActual = parseInt(e.target.value);
      renderCalendario(mesActual, anioActual);
    };

    header.appendChild(prevBtn);
    header.appendChild(mesSelect);
    header.appendChild(yearSelect);
    header.appendChild(nextBtn);
    calendarioDiv.appendChild(header);

    // Días de la semana
    const diasRow = document.createElement('div');
    diasRow.style.display = 'grid';
    diasRow.style.gridTemplateColumns = 'repeat(7, 1fr)';
    diasRow.style.marginBottom = '4px';
    diasSemana.forEach(d => {
      const dia = document.createElement('div');
      dia.textContent = d;
      dia.style.fontWeight = 'bold';
      dia.style.textAlign = 'center';
      dia.style.padding = '4px 0';
      dia.style.background = '#eaf1fb';
      dia.style.borderRadius = '4px';
      diasRow.appendChild(dia);
    });
    calendarioDiv.appendChild(diasRow);

    // Días del mes
    const primerDia = new Date(anio, mes, 1).getDay();
    const offset = primerDia === 0 ? 6 : primerDia - 1; // Lunes como primer día
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const diasPrevioMes = new Date(anio, mes, 0).getDate();
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
    grid.style.gap = '2px';
    grid.style.background = '#f4f8fd';
    grid.style.borderRadius = '8px';
    grid.style.padding = '8px 0 4px 0';
    grid.style.boxShadow = '0 2px 8px #66a6ff22';

    // Días del mes anterior (no seleccionables)
    for (let i = 0; i < offset; i++) {
      const diaPrevio = document.createElement('button');
      diaPrevio.textContent = (diasPrevioMes - offset + i + 1);
      diaPrevio.disabled = true;
      diaPrevio.style.background = '#f0f0f0';
      diaPrevio.style.color = '#b0b0b0';
      diaPrevio.style.border = '1px solid #e0e0e0';
      diaPrevio.style.borderRadius = '6px';
      diaPrevio.style.margin = '1px';
      grid.appendChild(diaPrevio);
    }
    // Días del mes actual (seleccionables)
    for (let d = 1; d <= diasEnMes; d++) {
      const fecha = new Date(anio, mes, d);
      const btn = document.createElement('button');
      btn.textContent = d;
      btn.style.padding = '8px 0';
      btn.style.border = '1px solid #b0c4de';
      btn.style.borderRadius = '6px';
      btn.style.background = '#fff';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'background 0.2s, color 0.2s';
      btn.style.fontWeight = 'bold';
      btn.style.margin = '1px';
      btn.style.color = '#234567';
      btn.dataset.fecha = fecha.toISOString().slice(0, 10);
      // Marcar selección
      if (fechaInicio && fechaFin && fecha >= fechaInicio && fecha <= fechaFin) {
        btn.style.background = 'linear-gradient(90deg,#66a6ff 0%,#89f7fe 100%)';
        btn.style.color = '#fff';
      } else if (fechaInicio && fecha.toDateString() === fechaInicio.toDateString()) {
        btn.style.background = '#27ae60';
        btn.style.color = '#fff';
      } else if (fechaFin && fecha.toDateString() === fechaFin.toDateString()) {
        btn.style.background = '#e67e22';
        btn.style.color = '#fff';
      }
      btn.onmouseover = () => {
        btn.style.background = '#d0e6ff';
      };
      btn.onmouseout = () => {
        if (fechaInicio && fechaFin && fecha >= fechaInicio && fecha <= fechaFin) {
          btn.style.background = 'linear-gradient(90deg,#66a6ff 0%,#89f7fe 100%)';
          btn.style.color = '#fff';
        } else if (fechaInicio && fecha.toDateString() === fechaInicio.toDateString()) {
          btn.style.background = '#27ae60';
          btn.style.color = '#fff';
        } else if (fechaFin && fecha.toDateString() === fechaFin.toDateString()) {
          btn.style.background = '#e67e22';
          btn.style.color = '#fff';
        } else {
          btn.style.background = '#fff';
          btn.style.color = '#234567';
        }
      };
      btn.onclick = () => {
        if (!fechaInicio || (fechaInicio && fechaFin)) {
          fechaInicio = fecha;
          fechaFin = null;
        } else if (fecha < fechaInicio) {
          fechaFin = fechaInicio;
          fechaInicio = fecha;
        } else {
          fechaFin = fecha;
        }
        renderCalendario(mesActual, anioActual);
        mostrarResumen();
      };
      grid.appendChild(btn);
    }
    // Días del mes siguiente (no seleccionables)
    const totalCeldas = offset + diasEnMes;
    const diasSiguiente = (7 - (totalCeldas % 7)) % 7;
    for (let i = 1; i <= diasSiguiente; i++) {
      const diaSig = document.createElement('button');
      diaSig.textContent = i;
      diaSig.disabled = true;
      diaSig.style.background = '#f0f0f0';
      diaSig.style.color = '#b0b0b0';
      diaSig.style.border = '1px solid #e0e0e0';
      diaSig.style.borderRadius = '6px';
      diaSig.style.margin = '1px';
      grid.appendChild(diaSig);
    }
    calendarioDiv.appendChild(grid);
  }

  function mostrarResumen() {
    if (fechaInicio && fechaFin) {
      resumenDiv.textContent = `Viaje del ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()}`;
      guardarBtn.disabled = false;
    } else if (fechaInicio) {
      resumenDiv.textContent = `Selecciona la fecha final`;
      guardarBtn.disabled = true;
    } else {
      resumenDiv.textContent = '';
      guardarBtn.disabled = true;
    }
  }

  renderCalendario(mesActual, anioActual);
  mostrarResumen();

  // Guardar viaje al enviar el formulario
  const form = document.getElementById('fechas-viaje');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-viaje').value;
    if (!nombre || !fechaInicio || !fechaFin) return;

    const token = localStorage.getItem('token');
    console.log('Token obtenido de localStorage:', token);
    if (!token) {
      alert('No se encontró el token. Inicia sesión de nuevo.');
      window.location.href = 'index.html';
      return;
    }

    const body = {
      nombre,
      fechaIda: fechaInicio.toISOString(),
      fechaVuelta: fechaFin.toISOString()
    };
    console.log('Datos a enviar:', body);

    try {
      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (response.ok) {
        alert('¡Viaje guardado correctamente!');
        window.location.href = 'perfil.html';
      } else {
        alert(data.message || 'Error al guardar el viaje');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  });
}); 