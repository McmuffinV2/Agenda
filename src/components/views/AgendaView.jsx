import { useState, useEffect } from 'react';
import { TECHNICIANS } from '../../constants/technicians';

const AgendaView = ({ onSave, editingJob, onCancelEdit, currentUser }) => {
    const [formData, setFormData] = useState({
        clientId: '',
        clientName: '',
        installDate: new Date().toISOString().split('T')[0],
        installTime: '',
        technician: 'Tec. Roberto Gómez',
        coordsInput: '20.659698, -103.349609'
    });

    useEffect(() => {
        if (editingJob) {
            setFormData({
                clientId: editingJob.id,
                clientName: editingJob.name,
                installDate: editingJob.date,
                installTime: editingJob.time,
                technician: editingJob.tech,
                coordsInput: `${editingJob.lat}, ${editingJob.lng}`
            });
        } else {
            setFormData({
                clientId: '',
                clientName: '',
                installDate: new Date().toISOString().split('T')[0],
                installTime: '',
                technician: 'Tec. Roberto Gómez',
                coordsInput: '20.659698, -103.349609'
            });
        }
    }, [editingJob]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const coords = formData.coordsInput.split(',');
        const lat = parseFloat(coords[0].trim());
        const lng = parseFloat(coords[1].trim());

        const jobData = {
            id: formData.clientId,
            name: formData.clientName,
            date: formData.installDate,
            time: formData.installTime,
            tech: formData.technician,
            lat: lat,
            lng: lng,
            locationStr: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            scheduler: currentUser.name,
            scheduledAt: editingJob ? editingJob.scheduledAt : `${new Date().toLocaleDateString()} ${new Date().getHours()}:${new Date().getMinutes().toString().padStart(2, '0')}`,
            status: editingJob ? editingJob.status : "Pendiente"
        };

        onSave(jobData);
        if (!editingJob) {
            setFormData({
                clientId: '',
                clientName: '',
                installDate: new Date().toISOString().split('T')[0],
                installTime: '',
                technician: 'Tec. Roberto Gómez',
                coordsInput: '20.659698, -103.349609'
            });
        }
    };

    return (
        <section className="tab-content active">
            <div className="form-container">
                <h2>{editingJob ? 'Editar Instalación' : 'Agendar Nueva Instalación'}</h2>
                <form id="agendaForm" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-group">
                            <label>ID del Cliente / Contrato</label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: CLI-1234"
                                value={formData.clientId}
                                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Nombre del Cliente</label>
                            <input
                                type="text"
                                required
                                placeholder="Nombre completo"
                                value={formData.clientName}
                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Fecha de Instalación</label>
                            <input
                                type="date"
                                required
                                value={formData.installDate}
                                onChange={(e) => setFormData({ ...formData, installDate: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Hora Aproximada</label>
                            <input
                                type="time"
                                required
                                value={formData.installTime}
                                onChange={(e) => setFormData({ ...formData, installTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label>Técnico Asignado</label>
                            <select
                                value={formData.technician}
                                onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                            >
                                {TECHNICIANS.map(tech => (
                                    <option key={tech} value={tech}>{tech}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Coordenadas (Lat, Lng)</label>
                            <div className="coords-picker">
                                <input
                                    type="text"
                                    placeholder="20.659698, -103.349609"
                                    required
                                    value={formData.coordsInput}
                                    onChange={(e) => setFormData({ ...formData, coordsInput: e.target.value })}
                                />
                            </div>
                            <small>Obtén las coordenadas de Google Maps</small>
                        </div>
                    </div>

                    <div className="form-row full-width">
                        <div className="input-group">
                            <label>Agendador (Tú)</label>
                            <input type="text" value={currentUser.name} readOnly />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">
                        <i className={`bx ${editingJob ? 'bx-save' : 'bx-calendar-check'}`}></i>
                        {editingJob ? 'Guardar Cambios' : 'Agendar Instalación'}
                    </button>
                    {editingJob && (
                        <button type="button" className="btn-secondary" onClick={onCancelEdit} style={{ width: '100%', marginTop: '10px' }}>
                            Cancelar Edición
                        </button>
                    )}
                </form>
            </div>
        </section>
    );
};

export default AgendaView;
