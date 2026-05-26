import { useState } from 'react';
import { TECHNICIANS } from '../../constants/technicians';

const CancelView = ({ jobs, searchTerm, onDelete, onRestore }) => {
    const [selectedTech, setSelectedTech] = useState('all');
    const cancelledJobs = jobs.filter(j => 
        j.status === 'Cancelado' &&
        (selectedTech === 'all' || j.tech === selectedTech) &&
        (j.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         j.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         j.tech.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

    return (
        <section className="tab-content active">
            <div className="recent-jobs">
                <div className="section-header">
                    <h2>Instalaciones Canceladas</h2>
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
                <div className="table-responsive desktop-only">
                    <table>
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
                            {cancelledJobs.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No hay instalaciones canceladas</td></tr>
                            ) : (
                                cancelledJobs.map(job => (
                                    <tr key={job.id}>
                                        <td><strong>{job.id}</strong></td>
                                        <td>
                                            <div>{job.name}</div>
                                            <small style={{ color: 'var(--text-secondary)' }}>Agendado por: {job.scheduler}</small>
                                            {job.comment && (
                                                <div style={{ marginTop: '4px', fontSize: '0.85rem', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                                                    <strong>Inasistencia:</strong> {job.comment}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div>{job.date}</div>
                                            <small style={{ color: 'var(--text-secondary)' }}>{job.time}</small>
                                        </td>
                                        <td>{job.tech}</td>
                                        <td>{job.locationStr}</td>
                                        <td>
                                            <span className="status-badge status-pending" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="actions-col">
                                            <button 
                                                className="btn-icon btn-complete" 
                                                onClick={() => onRestore(job.id)} 
                                                title="Re-agendar instalación"
                                                style={{ color: '#10b981' }}
                                            >
                                                <i className="bx bx-calendar-plus"></i>
                                            </button>
                                            <button className="btn-icon btn-delete" onClick={() => onDelete(job.id)} title="Eliminar definitivamente">
                                                <i className="bx bx-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Vista móvil para cancelados */}
                <div className="mobile-only">
                    {cancelledJobs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            No hay instalaciones canceladas
                        </div>
                    ) : (
                        <div className="job-cards-list">
                            {cancelledJobs.map(job => (
                                <div key={job.id} className="job-card-mobile">
                                    <div className="job-card-header">
                                        <div className="client-info">
                                            <h3>{job.name}</h3>
                                            <small style={{ display: 'block', marginTop: '2px' }}>ID: {job.id}</small>
                                        </div>
                                        <span className="status-badge status-pending" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
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
                                        {job.comment && (
                                            <div className="job-card-row" style={{ marginTop: '8px', padding: '6px 8px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '6px', alignItems: 'flex-start' }}>
                                                <i className="bx bx-message-rounded-error" style={{ color: '#fca5a5', marginTop: '2px' }}></i>
                                                <div style={{ fontSize: '0.85rem', color: '#fca5a5' }}>
                                                    <span>Comentario:</span> {job.comment}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="job-card-actions">
                                        <button 
                                            className="btn-icon btn-complete" 
                                            onClick={() => onRestore(job.id)} 
                                            title="Re-agendar"
                                            style={{ color: '#10b981' }}
                                        >
                                            <i className="bx bx-calendar-plus"></i>
                                        </button>
                                        <button className="btn-icon btn-delete" onClick={() => onDelete(job.id)} title="Eliminar definitivamente">
                                            <i className="bx bx-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CancelView;
