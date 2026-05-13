import { useState } from 'react';
import { TECHNICIANS } from '../../constants/technicians';

const HistoryView = ({ jobs, searchTerm, onUndoStatus }) => {
    const [selectedTech, setSelectedTech] = useState('all');
    const completedJobs = jobs.filter(j => 
        j.status === 'Completado' &&
        (selectedTech === 'all' || j.tech === selectedTech) &&
        (j.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         j.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         j.tech.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

    return (
        <section className="tab-content active">
            <div className="recent-jobs">
                <div className="section-header">
                    <h2>Historial de Instalaciones Completadas</h2>
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
                            {completedJobs.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No hay instalaciones completadas</td></tr>
                            ) : (
                                completedJobs.map(job => (
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
                                        <td><span className="status-badge status-routed">{job.status}</span></td>
                                        <td className="actions-col">
                                            <button className="btn-icon btn-complete" onClick={() => onUndoStatus(job.id)} title="Desmarcar (Volver a pendiente)">
                                                <i className="bx bx-undo"></i>
                                            </button>
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

export default HistoryView;
