// Lógica para mostrar y editar el itinerario día a día

document.addEventListener('DOMContentLoaded', async () => {
  const viajeId = localStorage.getItem('viajeId');
  const token = localStorage.getItem('token');
  const div = document.getElementById('detalle-viaje');

  if (!viajeId || !token) {
    div.innerHTML = '<div class="error">No se encontró el viaje o el token. Vuelve a perfil.</div>';
    return;
  }

  try {
    // Obtener el viaje (requiere endpoint GET /api/trips/:id)
    const response = await fetch(`${API_BASE_URL}/trips/${viajeId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const viaje = await response.json();
    if (!response.ok) throw new Error(viaje.message || 'Error al obtener el viaje');

    div.innerHTML = `
      <h2>${viaje.nombre}</h2>
      <p>Desde: ${new Date(viaje.fechaIda).toLocaleDateString()}<br>
      Hasta: ${new Date(viaje.fechaVuelta).toLocaleDateString()}</p>
      <form id="itinerario-form"></form>
    `;

    // Generar los días del viaje
    const fechaInicio = new Date(viaje.fechaIda);
    const fechaFin = new Date(viaje.fechaVuelta);
    const dias = [];
    for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
      dias.push(new Date(d));
    }

    const form = document.getElementById('itinerario-form');
    dias.forEach((fecha, idx) => {
      const fechaStr = fecha.toLocaleDateString();
      const group = document.createElement('div');
      group.style.marginBottom = '16px';

      // Busca la info guardada para este día (por índice)
      let infoGuardada = '';
      if (Array.isArray(viaje.itinerario) && viaje.itinerario[idx]) {
        infoGuardada = viaje.itinerario[idx].actividades || '';
      }

      group.innerHTML = `
        <label class="dia-label"><b>Día ${idx + 1} (${fechaStr})</b></label><br>
        <textarea id="info-dia-${idx}" rows="2" style="width:90%" placeholder="Agrega información para este día...">${infoGuardada}</textarea>
      `;
      form.appendChild(group);
    });
    const btnGuardar = document.createElement('button');
    btnGuardar.type = 'button';
    btnGuardar.textContent = 'Guardar Itinerario';
    btnGuardar.style.marginTop = '12px';
    form.appendChild(btnGuardar);

    btnGuardar.onclick = async () => {
      for (let idx = 0; idx < dias.length; idx++) {
        const fecha = dias[idx];
        const actividades = document.getElementById(`info-dia-${idx}`).value;
        console.log(`Enviando día ${idx}:`, { fecha: fecha.toISOString(), actividades });
        try {
          const response = await fetch(`${API_BASE_URL}/trips/${viajeId}/itinerario/${idx + 1}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fecha: fecha.toISOString(), actividades })
          });
          const data = await response.json();
          if (!response.ok) {
            alert(data.message || `Error al guardar el día ${idx + 1}`);
            return;
          }
        } catch (error) {
          alert('Error de conexión con el servidor');
          return;
        }
      }
      alert('¡Itinerario guardado correctamente!');
    };

    // Agregar botón eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar viaje';
    btnEliminar.type = 'button';
    btnEliminar.style.background = 'linear-gradient(90deg,#e74c3c 0%,#ffb347 100%)';
    btnEliminar.style.color = '#fff';
    btnEliminar.style.border = 'none';
    btnEliminar.style.borderRadius = '10px';
    btnEliminar.style.padding = '12px 24px';
    btnEliminar.style.fontSize = '1.05em';
    btnEliminar.style.fontWeight = 'bold';
    btnEliminar.style.cursor = 'pointer';
    btnEliminar.style.margin = '24px auto 0 auto';
    btnEliminar.style.display = 'block';
    btnEliminar.style.boxShadow = '0 2px 12px #e74c3c22';
    btnEliminar.style.transition = 'background 0.2s, transform 0.1s';
    btnEliminar.onmouseover = () => btnEliminar.style.background = 'linear-gradient(90deg,#ffb347 0%,#e74c3c 100%)';
    btnEliminar.onmouseout = () => btnEliminar.style.background = 'linear-gradient(90deg,#e74c3c 0%,#ffb347 100%)';
    div.appendChild(btnEliminar);

    btnEliminar.onclick = async () => {
      if (!confirm('¿Estás seguro de que deseas eliminar este viaje? Esta acción no se puede deshacer.')) return;
      try {
        const response = await fetch(`${API_BASE_URL}/trips/${viajeId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          alert('Viaje eliminado correctamente.');
          window.location.href = 'perfil.html';
        } else {
          alert(data.message || 'Error al eliminar el viaje');
        }
      } catch (error) {
        alert('Error de conexión con el servidor');
      }
    };

  } catch (error) {
    div.innerHTML = `<div class="error">${error.message}</div>`;
  }
}); 