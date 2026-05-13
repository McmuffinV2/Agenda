import { useState } from 'react';
import { TECHNICIANS } from '../../constants/technicians';

const DashboardView = ({ jobs, searchTerm, onStatusChange, onCancel, onEdit, onDelete, role }) => {
    const [selectedTech, setSelectedTech] = useState('all');
    const today = new Date().toISOString().split('T')[0];
    const todayJobsCount = jobs.filter(j => j.date === today && j.status !== 'Completado' && j.status !== 'Cancelado').length;
    const completedJobsCount = jobs.filter(j => j.status === 'Completado').length;

    const filteredJobs = jobs.filter(j => 
        j.status !== 'Completado' && 
        j.status !== 'Cancelado' &&
        (selectedTech === 'all' || j.tech === selectedTech) &&
        (j.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         j.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         j.tech.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

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
                </div>
                <div className="table-responsive">
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
                                            <button className="btn-icon btn-complete" onClick={() => onStatusChange(job.id)} title="Marcar completada">
                                                <i className={`bx ${job.status === "Completado" ? "bx-check-circle" : "bx-circle"}`}></i>
                                            </button>
                                            <button className="btn-icon btn-cancel" onClick={() => onCancel(job.id)} title="Cancelar Instalación">
                                                <i className="bx bx-block"></i>
                                            </button>
                                            <button className="btn-icon btn-edit" onClick={() => onEdit(job.id)} title="Editar"><i className="bx bx-edit"></i></button>
                                            <button className="btn-icon btn-delete" onClick={() => onDelete(job.id)} title="Eliminar"><i className="bx bx-trash"></i></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default DashboardView;
