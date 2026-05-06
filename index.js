// Initial State Data (Mock Data to start)
let jobs = [
    {
        id: "CLI-1001",
        name: "Empresa S.A. de C.V.",
        date: "2026-05-06",
        time: "09:00",
        tech: "Tec. Roberto Gómez",
        locationStr: "Centro Histórico",
        lat: 20.659698,
        lng: -103.349609,
        scheduledAt: "2026-05-05 14:30",
        scheduler: "Admin Despacho",
        status: "Pendiente"
    },
    {
        id: "CLI-1002",
        name: "María Fernández",
        date: "2026-05-06",
        time: "11:30",
        tech: "Tec. Roberto Gómez",
        locationStr: "Zapopan Centro",
        lat: 20.676667,
        lng: -103.421667,
        scheduledAt: "2026-05-05 15:00",
        scheduler: "Admin Despacho",
        status: "Pendiente"
    }
];

let map;
let routingControl;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    updateDateTime();
    setInterval(updateDateTime, 60000);

    setupTabs();
    setupForm();
    renderJobsTable();
    initMap();

    document.getElementById('btnOptimize').addEventListener('click', generateRoute);
    document.getElementById('routeTechnician').addEventListener('change', generateRoute);
}

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('currentDateTime').innerText = now.toLocaleDateString('es-ES', options);
}

function setupTabs() {
    const tabs = document.querySelectorAll('.nav-item');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active from all
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active to current
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');

            // If map tab, invalidate size to fix Leaflet rendering issues when hidden
            if (targetId === 'ruta' && map) {
                setTimeout(() => {
                    map.invalidateSize();
                    generateRoute(); // Auto generate route on load
                }, 100);
            }
        });
    });
}

function setupForm() {
    const form = document.getElementById('agendaForm');

    // Set default date to today
    document.getElementById('installDate').valueAsDate = new Date();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const clientId = document.getElementById('clientId').value;
        const clientName = document.getElementById('clientName').value;
        const date = document.getElementById('installDate').value;
        const time = document.getElementById('installTime').value;
        const tech = document.getElementById('technician').value;
        const scheduler = document.getElementById('schedulerName').value;

        const cityZoneSelect = document.getElementById('cityZone');
        const locationStr = cityZoneSelect.options[cityZoneSelect.selectedIndex].text;
        const coords = cityZoneSelect.value.split(',');
        const lat = parseFloat(coords[0]);
        const lng = parseFloat(coords[1]);

        // Small offset so if same zone is selected, markers don't overlap completely
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;

        const now = new Date();
        const scheduledAt = `${now.toLocaleDateString()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newJob = {
            id: clientId,
            name: clientName,
            date,
            time,
            tech,
            locationStr,
            lat: lat + latOffset,
            lng: lng + lngOffset,
            scheduledAt,
            scheduler,
            status: "Pendiente"
        };

        jobs.push(newJob);

        // Show success and reset form
        alert('Instalación agendada exitosamente.');
        form.reset();
        document.getElementById('installDate').valueAsDate = new Date();

        // Update UI
        renderJobsTable();

        // Switch to dashboard
        document.querySelector('.nav-item[data-tab="dashboard"]').click();
    });
}

function renderJobsTable() {
    const tbody = document.querySelector('#jobsTable tbody');
    tbody.innerHTML = '';

    // Sort by date and time
    const sortedJobs = [...jobs].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });

    sortedJobs.forEach(job => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td><strong>${job.id}</strong></td>
            <td>
                <div>${job.name}</div>
                <small style="color: var(--text-secondary)">Agendado por: ${job.scheduler}</small>
            </td>
            <td>
                <div>${job.date}</div>
                <small style="color: var(--text-secondary)">${job.time}</small>
            </td>
            <td>${job.tech}</td>
            <td>${job.locationStr}</td>
            <td><span class="status-badge status-pending">${job.status}</span></td>
        `;

        tbody.appendChild(tr);
    });

    document.getElementById('stat-today').innerText = jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length;
}

function initMap() {
    // Guadalajara center coordinates
    map = L.map('map').setView([20.659698, -103.349609], 12);

    // Dark theme map tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
}

function generateRoute() {
    const selectedTech = document.getElementById('routeTechnician').value;

    // Clear previous routes and markers
    if (routingControl) {
        map.removeControl(routingControl);
    }
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    // Filter jobs
    let filteredJobs = jobs;
    if (selectedTech !== 'all') {
        filteredJobs = jobs.filter(j => j.tech === selectedTech);
    }

    if (filteredJobs.length === 0) {
        alert('No hay instalaciones agendadas para este filtro.');
        return;
    }

    // Sort jobs by time to simulate a sequential route
    filteredJobs.sort((a, b) => {
        return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
    });

    const waypoints = filteredJobs.map(job => L.latLng(job.lat, job.lng));

    // Add custom markers with info
    filteredJobs.forEach((job, index) => {
        const marker = L.marker([job.lat, job.lng]).addTo(map);
        marker.bindPopup(`
            <div style="font-family: 'Outfit'; color: #333;">
                <h3 style="margin:0 0 5px 0;">${job.id}</h3>
                <p style="margin:0;"><strong>Cliente:</strong> ${job.name}</p>
                <p style="margin:0;"><strong>Hora:</strong> ${job.time}</p>
                <p style="margin:0;"><strong>Técnico:</strong> ${job.tech}</p>
                <p style="margin:0; font-size:11px; color:#666;">Agendado a las: ${job.scheduledAt}</p>
            </div>
        `);
        markers.push(marker);
    });

    // Create Routing Control using Open Source Routing Machine (OSRM)
    // Leaflet Routing Machine uses OSRM demo server by default
    routingControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        addWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        lineOptions: {
            styles: [{ color: '#3b82f6', opacity: 0.8, weight: 6 }]
        },
        createMarker: function () { return null; } // We use our own markers
    }).addTo(map);

    // Update statuses
    filteredJobs.forEach(j => j.status = "En Ruta");
    renderJobsTable();
}
