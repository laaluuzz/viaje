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
      let actividadesGuardadas = '';
      if (Array.isArray(viaje.itinerario) && viaje.itinerario[idx]) {
        actividadesGuardadas = viaje.itinerario[idx].actividades || '';
      }

      group.innerHTML = `
        <label><b>Día ${idx + 1} (${fechaStr}):</b></label><br>
        <textarea id="info-dia-${idx}" rows="2" style="width:90%" placeholder="Agrega información para este día...">${actividadesGuardadas}</textarea>
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

  } catch (error) {
    div.innerHTML = `<div class="error">${error.message}</div>`;
  }
}); 