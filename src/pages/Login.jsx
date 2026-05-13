import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DB from '../utils/db';
import { PREDEFINED_USERS } from '../constants/users';
import logo from '../assets/logo.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Inicializamos la DB con los usuarios por defecto si está vacía
        DB.init(null, PREDEFINED_USERS);

        // Si ya hay sesión, redirigimos
        const loggedUser = sessionStorage.getItem('netroute_user');
        if (loggedUser) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const usernameInput = username.trim().toLowerCase();
        const users = DB.getUsers();
        const user = users.find(u => u.username === usernameInput && u.password === password);

        if (user) {
            sessionStorage.setItem('netroute_user', JSON.stringify({
                name: user.name,
                role: user.role,
                username: user.username
            }));
            navigate('/dashboard');
        } else {
            alert('Usuario o contraseña incorrectos. \n\nPrueba con:\n- admin / 123\n- tecnico1 / 789');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo">
                    <img src={logo} alt="Sanfercom Logo" style={{ width: '300px', height: 'auto' }} />
                    <span></span>
                </div>
                <p>Inicia sesión para continuar</p>
                <form id="loginForm" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Usuario</label>
                        <input
                            type="text"
                            id="username"
                            required
                            placeholder="Ingresa tu usuario"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            required
                            placeholder="Ingresa tu contraseña"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary mt-1">
                        Ingresar <i className="bx bx-right-arrow-alt fs-1-2"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
