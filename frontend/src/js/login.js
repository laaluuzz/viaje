// Lógica de inicio de sesión

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    const body = {
      loginOrEmail: usuario,
      password: contrasena
    };

    try {
      const response = await fetch(`https://user-opyf.onrender.com/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (response.ok) {
        // Redirigir o mostrar éxito
        window.location.href = 'perfil.html';
      } else {
        loginError.textContent = data.message || 'Error al iniciar sesión';
      }
    } catch (error) {
      loginError.textContent = 'Error de conexión con el servidor';
    }
  });
}); 