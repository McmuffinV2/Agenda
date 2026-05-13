export const DEFAULT_JOBS = [
    {
        id: "CLI-1001",
        name: "Empresa S.A. de C.V.",
        date: new Date().toISOString().split('T')[0],
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
        date: new Date().toISOString().split('T')[0],
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
