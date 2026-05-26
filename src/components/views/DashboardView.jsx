import { useState } from 'react';
import { TECHNICIANS } from '../../constants/technicians';

const DashboardView = ({ jobs, searchTerm, onStatusChange, onCancel, onEdit, onDelete, onReportNoRecibido, role, currentUser }) => {
    const [selectedTech, setSelectedTech] = useState('all');
    const [commentingJobId, setCommentingJobId] = useState(null);
    const [commentText, setCommentText] = useState('');

    const isTechRole = role === 'tecnico';
    const activeTechFilter = isTechRole ? currentUser?.name : selectedTech;

    const myJobs = isTechRole ? jobs.filter(j => j.tech === currentUser?.name) : jobs;

    const today = new Date().toISOString().split('T')[0];
    const todayJobsCount = myJobs.filter(j => j.date === today && j.status !== 'Completado' && j.status !== 'Cancelado').length;
    const completedJobsCount = myJobs.filter(j => j.status === 'Completado').length;

    const filteredJobs = jobs.filter(j => 
        j.status !== 'Completado' && 
        j.status !== 'Cancelado' &&
        (activeTechFilter === 'all' || j.tech === activeTechFilter) &&
        (j.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         j.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         j.tech.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    const openCommentModal = (id) => {
        setCommentingJobId(id);
        setCommentText('');
    };

    const closeCommentModal = () => {
        setCommentingJobId(null);
        setCommentText('');
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) {
            alert('Por favor ingrese un comentario.');
            return;
        }
        onReportNoRecibido(commentingJobId, commentText);
        closeCommentModal();
    };

    return (
        <section className="tab-content active">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                        <i className="bx bx-calendar-event"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Hoy</h3>
                        <p>{todayJobsCount}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                        <i className="bx bx-check-double"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Completadas</h3>
                        <p>{completedJobsCount}</p>
                    </div>
                </div>
            </div>

            <div className="recent-jobs">
                <div className="section-header">
                    <h2>Próximas Instalaciones</h2>
                    {!isTechRole && (
                        <div className="filter-controls">
                            <select 
                                value={selectedTech} 
                                onChange={(e) => setSelectedTech(e.target.value)}
                            >
                                <option value="all">Todos los técnicos</option>
                                {TECHNICIANS.map(tech => (
                                    <option key={tech} value={tech}>{tech}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="table-responsive desktop-only">
                    <table id="jobsTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Fecha/Hora</th>
                                <th>Técnico</th>
                                <th>Ubicación</th>
                                <th>Estado</th>
                                <th className="actions-col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No hay instalaciones pendientes</td></tr>
                            ) : (
                                filteredJobs.map(job => (
                                    <tr key={job.id}>
                                        <td><strong>{job.id}</strong></td>
                                        <td>
                                            <div>{job.name}</div>
                                            <small style={{ color: 'var(--text-secondary)' }}>Agendado por: {job.scheduler}</small>
                                        </td>
                                        <td>
                                            <div>{job.date}</div>
                                            <small style={{ color: 'var(--text-secondary)' }}>{job.time}</small>
                                        </td>
                                        <td>{job.tech}</td>
                                        <td>{job.locationStr}</td>
                                        <td>
                                            <span className={`status-badge ${job.status === 'Completado' || job.status === 'En Ruta' ? 'status-routed' : 'status-pending'}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="actions-col">
                                            {isTechRole ? (
                                                <button className="btn-icon btn-cancel" onClick={() => openCommentModal(job.id)} title="Cliente no puede recibir (Agregar comentario)">
                                                    <i className="bx bx-message-rounded-error"></i>
                                                </button>
                                            ) : (
                                                <>
                                                    <button className="btn-icon btn-complete" onClick={() => onStatusChange(job.id)} title="Marcar completada">
                                                        <i className={`bx ${job.status === "Completado" ? "bx-check-circle" : "bx-circle"}`}></i>
                                                    </button>
                                                    <button className="btn-icon btn-cancel" onClick={() => onCancel(job.id)} title="Cancelar Instalación">
                                                        <i className="bx bx-block"></i>
                                                    </button>
                                                    <button className="btn-icon btn-edit" onClick={() => onEdit(job.id)} title="Editar"><i className="bx bx-edit"></i></button>
                                                    <button className="btn-icon btn-delete" onClick={() => onDelete(job.id)} title="Eliminar"><i className="bx bx-trash"></i></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Vista móvil para instalaciones pendientes */}
                <div className="mobile-only">
                    {filteredJobs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            No hay instalaciones pendientes
                        </div>
                    ) : (
                        <div className="job-cards-list">
                            {filteredJobs.map(job => (
                                <div key={job.id} className="job-card-mobile">
                                    <div className="job-card-header">
                                        <div className="client-info">
                                            <h3>{job.name}</h3>
                                            <small style={{ display: 'block', marginTop: '2px' }}>ID: {job.id}</small>
                                        </div>
                                        <span className={`status-badge ${job.status === 'Completado' || job.status === 'En Ruta' ? 'status-routed' : 'status-pending'}`}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <div className="job-card-body">
                                        <div className="job-card-row">
                                            <i className="bx bx-calendar"></i>
                                            <div>
                                                <span>Fecha:</span> {job.date}
                                            </div>
                                        </div>
                                        <div className="job-card-row">
                                            <i className="bx bx-time-five"></i>
                                            <div>
                                                <span>Hora:</span> {job.time}
                                            </div>
                                        </div>
                                        <div className="job-card-row">
                                            <i className="bx bx-user"></i>
                                            <div>
                                                <span>Técnico:</span> {job.tech}
                                            </div>
                                        </div>
                                        <div className="job-card-row">
                                            <i className="bx bx-map"></i>
                                            <div>
                                                <span>Ubicación:</span> {job.locationStr}
                                            </div>
                                        </div>
                                        <div className="job-card-row">
                                            <i className="bx bx-edit-alt"></i>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                <span>Agendado por:</span> {job.scheduler}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="job-card-actions">
                                        {isTechRole ? (
                                            <button className="btn-primary" onClick={() => openCommentModal(job.id)} style={{ margin: 0, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--danger-color)' }}>
                                                <i className="bx bx-message-rounded-error"></i> Cliente no puede recibir
                                            </button>
                                        ) : (
                                            <>
                                                <button className="btn-icon btn-complete" onClick={() => onStatusChange(job.id)} title="Marcar completada">
                                                    <i className={`bx ${job.status === "Completado" ? "bx-check-circle" : "bx-circle"}`}></i>
                                                </button>
                                                <button className="btn-icon btn-cancel" onClick={() => onCancel(job.id)} title="Cancelar Instalación">
                                                    <i className="bx bx-block"></i>
                                                </button>
                                                <button className="btn-icon btn-edit" onClick={() => onEdit(job.id)} title="Editar">
                                                    <i className="bx bx-edit"></i>
                                                </button>
                                                <button className="btn-icon btn-delete" onClick={() => onDelete(job.id)} title="Eliminar">
                                                    <i className="bx bx-trash"></i>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Comment Modal */}
            <div className={`modal-overlay ${commentingJobId ? 'show' : ''}`} onClick={closeCommentModal}>
                <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>Reportar Inasistencia / Sin recibir</h3>
                        <button className="modal-close-btn" onClick={closeCommentModal}>
                            <i className="bx bx-x"></i>
                        </button>
                    </div>
                    <form onSubmit={handleCommentSubmit}>
                        <div className="modal-body">
                            <label>Comentario del Técnico</label>
                            <textarea 
                                placeholder="Explica por qué el cliente no pudo recibir la instalación..." 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                required
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="modal-btn-cancel" onClick={closeCommentModal}>
                                Cancelar
                            </button>
                            <button type="submit" className="modal-btn-submit">
                                Enviar Reporte
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default DashboardView;
