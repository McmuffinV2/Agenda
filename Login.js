const PREDEFINED_USERS = [
    { username: 'admin', password: '123', role: 'admin', name: 'Administrador Principal' },
    { username: 'sanfer', password: '456', role: 'admin', name: 'Alfonso Sanfer' },
    { username: 'tecnico1', password: '789', role: 'user', name: 'Téc. Roberto Gómez' },
    { username: 'agendador', password: '000', role: 'user', name: 'Asistente de Agenda' }
];

// Inicializamos la DB con los usuarios por defecto si está vacía
DB.init(null, PREDEFINED_USERS);

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const usernameInput = document.getElementById('username').value.trim().toLowerCase();
    const passwordInput = document.getElementById('password').value;

    // Obtenemos los usuarios de la "base de datos" local
    const users = DB.getUsers();
    const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

    if (user) {
        // Guardamos sesión en el navegador (sessionStorage se borra al cerrar la pestaña)
        sessionStorage.setItem('netroute_user', JSON.stringify({
            name: user.name,
            role: user.role,
            username: user.username
        }));

        // Redirigimos al panel principal
        window.location.href = 'index.html';
    } else {
        // Alerta si las credenciales son incorrectas
        alert('Usuario o contraseña incorrectos. \n\nPrueba con:\n- admin / 123\n- tecnico1 / 789');
    }
});
