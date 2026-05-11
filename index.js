// Initial State Data (Mock Data to start)
const defaultJobs = [
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

// Cargamos de la base de datos local o usamos los defaults
DB.init(defaultJobs, null);
let jobs = DB.getJobs();

let map;
let routingControl;
let markers = [];

// Role state
let currentUserRole = 'user';
let currentUserName = 'Usuario';
let editingJobId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check login
    const userStr = sessionStorage.getItem('netroute_user');
    if (!userStr) {
        window.location.href = 'Login.html';
        return;
    }

    const user = JSON.parse(userStr);
    currentUserRole = user.role;
    currentUserName = user.name;

    initApp();
    setupInactivityTimer(); // Iniciar temporizador de inactividad

    // Show welcome toast
    const toast = document.getElementById('welcomeToast');
    const msg = document.getElementById('welcomeMessage');
    if (toast && msg) {
        msg.innerText = `¡Bienvenido, ${currentUserName}!`;
        setTimeout(() => {
            toast.classList.add('show');
        }, 500);

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
});

// Función para cerrar sesión por inactividad
function setupInactivityTimer() {
    let timer;
    const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutos en milisegundos

    function logout() {
        console.log("Cerrando sesión por inactividad...");
        sessionStorage.removeItem('netroute_user');
        window.location.href = 'Login.html';
    }

    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(logout, INACTIVITY_LIMIT);
    }

    // Eventos que reinician el temporizador
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer; // Clicks
    window.ontouchstart = resetTimer; // Toques en móviles
    window.onclick = resetTimer;     
    window.onkeypress = resetTimer;  // Teclado
    window.onscroll = resetTimer;    // Scroll
}

function initApp() {
    updateDateTime();
    setInterval(updateDateTime, 60000);

    setupTabs();
    setupForm();
    initMap();
    updateRoleUI();

    document.getElementById('btnOptimize').addEventListener('click', generateRoute);
    document.getElementById('routeTechnician').addEventListener('change', generateRoute);

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem('netroute_user');
            window.location.href = 'Login.html';
        });
    }
}

function updateRoleUI() {
    const avatar = document.getElementById('userAvatar');
    const nameDisplay = document.getElementById('userNameDisplay');
    const label = document.getElementById('userRoleLabel');
    const schedulerInput = document.getElementById('schedulerName');

    if (nameDisplay) nameDisplay.innerText = currentUserName;

    if (currentUserRole === 'admin') {
        avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}&background=0D8ABC&color=fff`;
        label.innerText = "Administrador";
        schedulerInput.value = currentUserName;
        document.body.classList.add('role-admin');
        document.body.classList.remove('role-user');
    } else {
        avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserName)}&background=6B7280&color=fff`;
        label.innerText = "Agendador";
        schedulerInput.value = currentUserName;
        document.body.classList.add('role-user');
        document.body.classList.remove('role-admin');
    }
    renderJobsTable();
}

function deleteJob(id) {
    if (currentUserRole !== 'admin') {
        alert('No tienes permisos para eliminar instalaciones.');
        return;
    }
    if (confirm(`¿Estás seguro de eliminar la instalación con ID ${id}?`)) {
        jobs = jobs.filter(j => j.id !== id);
        DB.saveJobs(jobs); // Guardar cambios
        renderJobsTable();
        if (document.getElementById('ruta').classList.contains('active')) {
            generateRoute();
        }
    }
}

function editJob(id) {
    if (currentUserRole !== 'admin') {
        alert('No tienes permisos para editar instalaciones.');
        return;
    }
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    editingJobId = id;

    document.getElementById('clientId').value = job.id;
    document.getElementById('clientName').value = job.name;
    document.getElementById('installDate').value = job.date;
    document.getElementById('installTime').value = job.time;
    document.getElementById('technician').value = job.tech;
    document.getElementById('coordsInput').value = `${job.lat}, ${job.lng}`;

    document.getElementById('formSubmitBtn').innerHTML = "<i class='bx bx-save'></i> Guardar Cambios";
    document.getElementById('formCancelBtn').style.display = "inline-flex";

    // Switch to tab
    document.querySelector('.nav-item[data-tab="agenda"]').click();
}

function cancelEdit() {
    editingJobId = null;
    document.getElementById('agendaForm').reset();
    document.getElementById('installDate').valueAsDate = new Date();
    document.getElementById('formSubmitBtn').innerHTML = "<i class='bx bx-save'></i> Guardar y Agendar";
    document.getElementById('formCancelBtn').style.display = "none";
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

    const cancelBtn = document.getElementById('formCancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEdit);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const clientId = document.getElementById('clientId').value;
        const clientName = document.getElementById('clientName').value;
        const date = document.getElementById('installDate').value;
        const time = document.getElementById('installTime').value;
        const tech = document.getElementById('technician').value;
        const scheduler = document.getElementById('schedulerName').value;

        const coordsStr = document.getElementById('coordsInput').value;
        const coordsArray = coordsStr.split(',');
        const lat = parseFloat(coordsArray[0].trim());
        const lng = parseFloat(coordsArray[1].trim());
        const locationStr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        const now = new Date();
        const scheduledAt = `${now.toLocaleDateString()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newJob = {
            id: clientId,
            name: clientName,
            date,
            time,
            tech,
            locationStr,
            lat: lat,
            lng: lng,
            scheduledAt,
            scheduler,
            status: "Pendiente"
        };

        if (editingJobId) {
            const jobIndex = jobs.findIndex(j => j.id === editingJobId);
            if (jobIndex > -1) {
                newJob.scheduledAt = jobs[jobIndex].scheduledAt;
                newJob.status = jobs[jobIndex].status;
                jobs[jobIndex] = newJob;
            }
            DB.saveJobs(jobs); // Guardar cambios
            alert('Instalación actualizada exitosamente.');
            cancelEdit();
        } else {
            jobs.push(newJob);
            DB.saveJobs(jobs); // Guardar cambios
            alert('Instalación agendada exitosamente.');
            form.reset();
            document.getElementById('installDate').valueAsDate = new Date();
        }

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
            <td class="actions-col">
                <button class="btn-icon btn-edit" onclick="editJob('${job.id}')" title="Editar"><i class='bx bx-edit'></i></button>
                <button class="btn-icon btn-delete" onclick="deleteJob('${job.id}')" title="Eliminar"><i class='bx bx-trash'></i></button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    document.getElementById('stat-today').innerText = jobs.filter(j => j.date === new Date().toISOString().split('T')[0]).length;
}

function initMap() {
    // Guadalajara center coordinates
    map = L.map('map').setView([23.247596, -106.411560], 12);

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
    DB.saveJobs(jobs); // Guardar cambios de estado
    renderJobsTable();
}
