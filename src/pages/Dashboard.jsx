import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DB from '../utils/db';
import { DEFAULT_JOBS } from '../constants/jobs';
import DashboardView from '../components/views/DashboardView';
import AgendaView from '../components/views/AgendaView';
import RutaView from '../components/views/RutaView';
import HistoryView from '../components/views/HistoryView';
import CancelView from '../components/views/CancelView';
import logo from '../assets/logo.png';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarShow, setIsMobileSidebarShow] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [dateTime, setDateTime] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingJob, setEditingJob] = useState(null);
    const [showWelcomeToast, setShowWelcomeToast] = useState(false);
    
    const navigate = useNavigate();

    const logout = useCallback(() => {
        sessionStorage.removeItem('netroute_user');
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        const userStr = sessionStorage.getItem('netroute_user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(userStr));

        DB.init(DEFAULT_JOBS, null);
        setJobs(DB.getJobs());

        const updateTime = () => {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            setDateTime(now.toLocaleDateString('es-ES', options));
        };
        updateTime();
        const timer = setInterval(updateTime, 60000);

        // Inactivity timer
        let inactivityTimer;
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(logout, 10 * 60 * 1000);
        };
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keypress', resetTimer);
        resetTimer();

        // Welcome toast
        setTimeout(() => {
            setShowWelcomeToast(true);
        }, 500);
        setTimeout(() => {
            setShowWelcomeToast(false);
        }, 4500);

        return () => {
            clearInterval(timer);
            clearTimeout(inactivityTimer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keypress', resetTimer);
        };
    }, [navigate, logout]);

    const addNotification = (type, message) => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const newNotif = { type, message, time: timeStr };
        setNotifications(prev => [newNotif, ...prev].slice(0, 20));
    };

    const handleSaveJob = (jobData) => {
        let updatedJobs;
        if (editingJob) {
            updatedJobs = jobs.map(j => j.id === editingJob.id ? jobData : j);
            addNotification('success', `Instalación de ${jobData.name} actualizada.`);
        } else {
            updatedJobs = [...jobs, jobData];
            addNotification('success', `Nueva instalación agendada para ${jobData.name}.`);
        }
        setJobs(updatedJobs);
        DB.saveJobs(updatedJobs);
        setEditingJob(null);
        setActiveTab('dashboard');
    };

    const handleStatusChange = (id) => {
        if (user.role !== 'admin') {
            alert('No tienes permisos para cambiar el estado.');
            return;
        }
        const updatedJobs = jobs.map(j => {
            if (j.id === id) {
                const isNowCompleted = j.status !== "Completado";
                if (isNowCompleted) addNotification('success', `Instalación de ${j.name} completada.`);
                return { ...j, status: isNowCompleted ? 'Completado' : 'Pendiente' };
            }
            return j;
        });
        setJobs(updatedJobs);
        DB.saveJobs(updatedJobs);
    };

    const handleCancelJob = (id) => {
        if (user.role !== 'admin') {
            alert('No tienes permisos para cancelar.');
            return;
        }
        if (window.confirm('¿Estás seguro de cancelar esta instalación?')) {
            const updatedJobs = jobs.map(j => j.id === id ? { ...j, status: 'Cancelado' } : j);
            const job = jobs.find(j => j.id === id);
            addNotification('danger', `Instalación de ${job.name} cancelada.`);
            setJobs(updatedJobs);
            DB.saveJobs(updatedJobs);
        }
    };

    const handleDeleteJob = (id) => {
        if (user.role !== 'admin') {
            alert('No tienes permisos para eliminar.');
            return;
        }
        if (window.confirm(`¿Estás seguro de eliminar la instalación con ID ${id}?`)) {
            const updatedJobs = jobs.filter(j => j.id !== id);
            setJobs(updatedJobs);
            DB.saveJobs(updatedJobs);
        }
    };

    const handleEditJob = (id) => {
        if (user.role !== 'admin') {
            alert('No tienes permisos para editar.');
            return;
        }
        const job = jobs.find(j => j.id === id);
        setEditingJob(job);
        setActiveTab('agenda');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (window.innerWidth <= 768) {
            setIsMobileSidebarShow(false);
        }
    };

    if (!user) return null;

    return (
        <div className="app-container">
            <div 
                className={`sidebar-overlay ${isMobileSidebarShow ? 'show' : ''}`}
                onClick={() => setIsMobileSidebarShow(false)}
            ></div>

            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileSidebarShow ? 'show-mobile' : ''}`}>
                <div className="logo">
                    <img src={logo} alt="Sanfercom Logo" style={{ width: '40px', height: 'auto' }} />
                    <span>Sanfercom</span>
                </div>

                <nav className="nav-menu">
                    <a href="#" className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleTabChange('dashboard'); }}>
                        <i className="bx bxs-dashboard"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'agenda' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleTabChange('agenda'); }}>
                        <i className="bx bxs-calendar-plus"></i>
                        <span>{editingJob ? 'Editar' : 'Agendar'}</span>
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'ruta' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleTabChange('ruta'); }}>
                        <i className="bx bxs-map-alt"></i>
                        <span>Ruta Óptima</span>
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'historial' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleTabChange('historial'); }}>
                        <i className="bx bx-history"></i>
                        <span>Historial</span>
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'cancelados' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleTabChange('cancelados'); }}>
                        <i className="bx bx-error-circle"></i>
                        <span>Cancelados</span>
                    </a>
                </nav>

                <div className="user-info">
                    <div className="avatar">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${user.role === 'admin' ? '0D8ABC' : '6B7280'}&color=fff`} 
                            alt="Avatar" 
                        />
                    </div>
                    <div className="details">
                        <h4>{user.name}</h4>
                        <p>{user.role === 'admin' ? 'Administrador' : 'Agendador'}</p>
                    </div>
                    <button className="icon-btn" onClick={logout} style={{ marginLeft: 'auto' }}>
                        <i className="bx bx-log-out"></i>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <button 
                        className="icon-btn" 
                        onClick={() => {
                            if (window.innerWidth <= 768) setIsMobileSidebarShow(!isMobileSidebarShow);
                            else setIsSidebarCollapsed(!isSidebarCollapsed);
                        }}
                    >
                        <i className="bx bx-menu"></i>
                    </button>

                    <div className="datetime-display">{dateTime}</div>

                    <div className="search-bar">
                        <i className="bx bx-search"></i>
                        <input 
                            type="text" 
                            placeholder="Buscar cliente, ID o técnico..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="topbar-actions">
                        <div className="notifications-wrapper">
                            <button 
                                className="icon-btn" 
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <i className="bx bx-bell"></i>
                                {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
                            </button>
                            <div className={`notifications-panel ${showNotifications ? 'show' : ''}`}>
                                <div className="notifications-header">
                                    <h3>Notificaciones</h3>
                                    <button onClick={() => setNotifications([])}>Limpiar</button>
                                </div>
                                <div className="notifications-body">
                                    {notifications.length === 0 ? (
                                        <div className="empty-notifications">No hay notificaciones</div>
                                    ) : (
                                        notifications.map((n, i) => (
                                            <div key={i} className={`notification-item ${n.type}`}>
                                                <i className={`bx ${n.type === 'success' ? 'bx-check-circle' : 'bx-x-circle'}`}></i>
                                                <div className="content">
                                                    <p>{n.message}</p>
                                                    <small>{n.time}</small>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="content-wrapper">
                    {activeTab === 'dashboard' && (
                        <DashboardView 
                            jobs={jobs} 
                            searchTerm={searchTerm} 
                            onStatusChange={handleStatusChange}
                            onCancel={handleCancelJob}
                            onEdit={handleEditJob}
                            onDelete={handleDeleteJob}
                            role={user.role}
                        />
                    )}
                    {activeTab === 'agenda' && (
                        <AgendaView 
                            onSave={handleSaveJob}
                            editingJob={editingJob}
                            onCancelEdit={() => { setEditingJob(null); setActiveTab('dashboard'); }}
                            currentUser={user}
                        />
                    )}
                    {activeTab === 'ruta' && (
                        <RutaView jobs={jobs} setJobs={setJobs} />
                    )}
                    {activeTab === 'historial' && (
                        <HistoryView 
                            jobs={jobs} 
                            searchTerm={searchTerm} 
                            onUndoStatus={handleStatusChange}
                        />
                    )}
                    {activeTab === 'cancelados' && (
                        <CancelView 
                            jobs={jobs} 
                            searchTerm={searchTerm} 
                            onDelete={handleDeleteJob}
                        />
                    )}
                </div>
            </main>

            {/* Welcome Toast */}
            <div id="welcomeToast" className={`welcome-toast ${showWelcomeToast ? 'show' : ''}`}>
                <i className='bx bx-party'></i>
                <div className="content">
                    <span id="welcomeMessage">¡Bienvenido, {user.name}!</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
