// Lógica de registro de usuario

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return; // Evita error si el formulario no existe
  const registerError = document.getElementById('register-error');
  const registerSuccess = document.getElementById('register-success');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const login = document.getElementById('login').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const body = {
      login,
      email,
      password
    };

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (response.ok) {
        registerSuccess.textContent = '¡Registro exitoso! Redirigiendo al inicio de sesión...';
        registerError.textContent = '';
        registerForm.reset();
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      } else {
        registerError.textContent = data.message || 'Error al registrar usuario';
        registerSuccess.textContent = '';
      }
    } catch (error) {
      registerError.textContent = 'Error de conexión con el servidor';
      registerSuccess.textContent = '';
    }
  });
}); 