// Lógica para la página de perfil (mis viajes)

document.addEventListener('DOMContentLoaded', async () => {
  console.log('perfil.js cargado correctamente');
  const token = localStorage.getItem('token');
  console.log('Token obtenido de localStorage:', token);
  const listaDiv = document.getElementById('viajes-lista');

  if (!token) {
    listaDiv.innerHTML = '<div class="error">No se encontró el token. Inicia sesión de nuevo.</div>';
    setTimeout(() => window.location.href = 'index.html', 2000);
    return;
  }

  try {
    listaDiv.textContent = 'Cargando viajes...';
    const response = await fetch(`${API_BASE_URL}/trips`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log('Respuesta completa del backend:', data);
    if (!response.ok) throw new Error(data.message || 'Error al obtener viajes');
    if (data.length === 0) {
      listaDiv.innerHTML = '<div>No tienes viajes guardados.</div>';
    } else {
      listaDiv.innerHTML = '<ul>' + data.map(v => `
        <li>
          <b>${v.nombre}</b>: ${new Date(v.fechaIda).toLocaleDateString()} - ${new Date(v.fechaVuelta).toLocaleDateString()}
          <button onclick="verDetallesViaje('${v._id}')">Ver detalles</button>
          <button onclick="eliminarViaje('${v._id}')" style="margin-left:10px; background:linear-gradient(90deg,#e74c3c 0%,#ffb347 100%); color:#fff; border:none; border-radius:8px; padding:6px 14px; font-weight:bold; cursor:pointer;">Eliminar</button>
        </li>
      `).join('') + '</ul>';
    }
  } catch (error) {
    listaDiv.innerHTML = `<div class="error">${error.message}</div>`;
  }
});

window.verDetallesViaje = function(viajeId) {
  localStorage.setItem('viajeId', viajeId);
  window.location.href = 'detalle-viaje.html';
};

window.eliminarViaje = async function(viajeId) {
  const token = localStorage.getItem('token');
  if (!confirm('¿Estás seguro de que deseas eliminar este viaje? Esta acción no se puede deshacer.')) return;
  try {
    const response = await fetch(`${API_BASE_URL}/trips/${viajeId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (response.ok) {
      alert('Viaje eliminado correctamente.');
      window.location.reload();
    } else {
      alert(data.message || 'Error al eliminar el viaje');
    }
  } catch (error) {
    alert('Error de conexión con el servidor');
  }
}; 