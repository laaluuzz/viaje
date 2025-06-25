// Lógica para listar usuarios

document.addEventListener('DOMContentLoaded', () => {
  const btnListar = document.getElementById('listar-usuarios');
  const listaUsuarios = document.getElementById('usuarios-lista');

  if (btnListar) {
    btnListar.addEventListener('click', async () => {
      listaUsuarios.textContent = 'Cargando...';
      try {
        const response = await fetch(`https://user-opyf.onrender.com/api/users`);
        if (!response.ok) throw new Error('Error al obtener usuarios');
        const usuarios = await response.json();
        if (usuarios.length === 0) {
          listaUsuarios.textContent = 'No hay usuarios registrados.';
        } else {
          listaUsuarios.innerHTML = '<ul>' + usuarios.map(u => `<li><b>${u.login}</b> - ${u.email}</li>`).join('') + '</ul>';
        }
      } catch (error) {
        listaUsuarios.textContent = 'Error al conectar con el servidor.';
      }
    });
  }
}); 