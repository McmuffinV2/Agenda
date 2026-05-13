import { useState } from 'react';
import { TECHNICIANS } from '../../constants/technicians';

const CancelView = ({ jobs, searchTerm, onDelete }) => {
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
                            {cancelledJobs.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>No hay instalaciones canceladas</td></tr>
                            ) : (
                                cancelledJobs.map(job => (
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
                                            <span className="status-badge status-pending" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="actions-col">
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
            </div>
        </section>
    );
};

export default CancelView;
