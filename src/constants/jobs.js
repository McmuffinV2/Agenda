export const DEFAULT_JOBS = [
    {
        id: "CLI-1001",
        name: "Empresa S.A. de C.V.",
        date: new Date().toISOString().split('T')[0],
        time: "09:00",
        tech: "Tec. Roberto Gómez",
        locationStr: "Hogar del pescador",
        lat: 23.274071,
        lng: -106.410356,
        scheduledAt: "2026-05-05 14:30",
        scheduler: "Admin Despacho",
        status: "Pendiente"
    },
    //cordenad de prueba 23.274071, -106.410356, || 23.274344, -106.366864,

    {
        id: "CLI-1002",
        name: "María Fernández",
        date: new Date().toISOString().split('T')[0],
        time: "11:30",
        tech: "Tec. Roberto Gómez",
        locationStr: "Pradera dorada",
        lat: 23.274344,
        lng: -106.366864,
        scheduledAt: "2026-05-05 15:00",
        scheduler: "Admin Despacho",
        status: "Pendiente"
    }
];
