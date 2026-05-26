import { useState } from 'react';

const MyReportsView = ({ jobs, currentUser, searchTerm }) => {
    const reportJobs = jobs.filter(j => 
        j.status === 'Cancelado' &&
        j.tech === currentUser?.name &&
        j.comment &&
        (j.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         j.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ).sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

    return (
        <section className="tab-content active">
            <div className="recent-jobs">
                <div className="section-header">
                    <h2>Mis Reportes de Inasistencia</h2>
                </div>
                
                {/* Desktop View */}
                <div className="table-responsive desktop-only">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Fecha/Hora</th>
                                <th>Ubicación</th>
                                <th>Comentario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportJobs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                        No has reportado ninguna inasistencia aún.
                                    </td>
                                </tr>
                            ) : (
                                reportJobs.map(job => (
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
                                        <td>{job.locationStr}</td>
                                        <td>
                                            <div style={{ 
                                                fontSize: '0.9rem', 
                                                color: '#fca5a5', 
                                                background: 'rgba(239, 68, 68, 0.15)', 
                                                padding: '6px 12px', 
                                                borderRadius: '6px', 
                                                borderLeft: '3px solid var(--danger-color)',
                                                maxWidth: '400px'
                                            }}>
                                                {job.comment}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="mobile-only">
                    {reportJobs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            No has reportado ninguna inasistencia aún.
                        </div>
                    ) : (
                        <div className="job-cards-list">
                            {reportJobs.map(job => (
                                <div key={job.id} className="job-card-mobile">
                                    <div className="job-card-header">
                                        <div className="client-info">
                                            <h3>{job.name}</h3>
                                            <small style={{ display: 'block', marginTop: '2px' }}>ID: {job.id}</small>
                                        </div>
                                        <span className="status-badge status-pending" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>
                                            No Recibido
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
                                        <div className="job-card-row" style={{ marginTop: '8px', padding: '8px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '6px', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                            <span style={{ color: '#fca5a5', fontWeight: '600', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <i className="bx bx-message-rounded-error"></i> Comentario del Técnico:
                                            </span>
                                            <div style={{ fontSize: '0.85rem', color: '#fca5a5', lineHeight: '1.4' }}>
                                                {job.comment}
                                            </div>
                                        </div>
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

export default MyReportsView;
