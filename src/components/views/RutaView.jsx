import { useEffect, useRef, useState } from 'react';
import DB from '../../utils/db';

const RutaView = ({ jobs, setJobs }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const routingControl = useRef(null);
    const markers = useRef([]);
    const [selectedTech, setSelectedTech] = useState('all');

    useEffect(() => {
        if (!mapInstance.current && window.L) {
            mapInstance.current = window.L.map(mapRef.current).setView([20.659698, -103.349609], 12);
            window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapInstance.current);
        }

        return () => {
            if (mapInstance.current) {
                // We keep it for better performance or destroy it if needed
            }
        };
    }, []);

    const generateRoute = () => {
        if (!mapInstance.current || !window.L || !window.L.Routing) return;

        // Clear previous
        if (routingControl.current) {
            mapInstance.current.removeControl(routingControl.current);
        }
        markers.current.forEach(m => mapInstance.current.removeLayer(m));
        markers.current = [];

        let filteredJobs = jobs.filter(j => j.status !== 'Completado' && j.status !== 'Cancelado');
        if (selectedTech !== 'all') {
            filteredJobs = filteredJobs.filter(j => j.tech === selectedTech);
        }

        if (filteredJobs.length === 0) {
            alert('No hay instalaciones agendadas para este filtro.');
            return;
        }

        filteredJobs.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        const waypoints = filteredJobs.map(job => window.L.latLng(job.lat, job.lng));

        filteredJobs.forEach(job => {
            const marker = window.L.marker([job.lat, job.lng]).addTo(mapInstance.current);
            marker.bindPopup(`
                <div style="font-family: 'Outfit'; color: #333;">
                    <h3 style="margin:0 0 5px 0;">${job.id}</h3>
                    <p style="margin:0;"><strong>Cliente:</strong> ${job.name}</p>
                    <p style="margin:0;"><strong>Hora:</strong> ${job.time}</p>
                    <p style="margin:0;"><strong>Técnico:</strong> ${job.tech}</p>
                </div>
            `);
            markers.current.push(marker);
        });

        routingControl.current = window.L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            addWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            lineOptions: {
                styles: [{ color: '#3b82f6', opacity: 0.8, weight: 6 }]
            },
            createMarker: function () { return null; }
        }).addTo(mapInstance.current);

        // Update status in state and DB
        const updatedJobs = jobs.map(j => {
            const isFiltered = filteredJobs.some(fj => fj.id === j.id);
            if (isFiltered) return { ...j, status: 'En Ruta' };
            return j;
        });
        setJobs(updatedJobs);
        DB.saveJobs(updatedJobs);
    };

    return (
        <section className="tab-content active">
            <div className="route-header">
                <h2>Ruta del Día</h2>
                <div className="route-controls">
                    <select value={selectedTech} onChange={(e) => setSelectedTech(e.target.value)}>
                        <option value="all">Todos los técnicos</option>
                        <option value="Tec. Roberto Gómez">Tec. Roberto Gómez</option>
                        <option value="Téc. Juan Pérez">Téc. Juan Pérez</option>
                        <option value="Téc. Ana López">Téc. Ana López</option>
                    </select>
                    <button className="btn-primary" onClick={generateRoute} style={{ margin: 0, padding: '0.75rem 1.5rem' }}>
                        <i className="bx bx-repost"></i> Optimizar y Generar Ruta
                    </button>
                </div>
            </div>
            <div className="map-container">
                <div id="map" ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
            </div>
        </section>
    );
};

export default RutaView;
