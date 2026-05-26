# 🌐 Sanfercom Agenda (NetRoute) - ERP de Instalaciones

Sistema ERP moderno desarrollado en **React** para la gestión, agendamiento y optimización de rutas de instalaciones técnicas. Este proyecto ha sido migrado de una arquitectura tradicional (HTML/JS) a una estructura modular y escalable.

---

## 🚀 Características Principales

-   **🔒 Control de Acceso por Roles**:
    -   **Administrador**: Gestión total (crear, editar, eliminar, completar y cancelar instalaciones).
    -   **Agendador**: Permisos restringidos para agendamiento y visualización.
-   **📊 Dashboard en Tiempo Real**: Estadísticas instantáneas de instalaciones diarias y completadas.
-   **📅 Gestión de Agenda**: Formulario dinámico para programar instalaciones con captura de coordenadas geográficas.
-   **🗺️ Optimización de Rutas**: Integración con **Leaflet** y **Routing Machine** para visualizar la ruta más eficiente entre puntos de instalación.
-   **📑 Historial y Cancelaciones**: Secciones dedicadas para el seguimiento de trabajos terminados o anulados.
-   **💾 Persistencia Local**: Uso de `LocalStorage` para mantener los datos del sistema sin necesidad de un backend complejo inicialmente.
-   **⏲️ Seguridad de Sesión**: Temporizador de inactividad automático (10 minutos) que cierra la sesión por seguridad.

---

## 🛠️ Tecnologías Utilizadas

-   **Frontend**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
-   **Navegación**: [React Router DOM](https://reactrouter.com/)
-   **Iconografía**: [Boxicons](https://boxicons.com/)
-   **Tipografía**: [Google Fonts (Outfit)](https://fonts.google.com/specimen/Outfit)
-   **Mapas**: [Leaflet](https://leafletjs.com/) & [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/)
-   **Estilos**: CSS3 Moderno con variables y Flexbox/Grid.

---

## 📁 Estructura del Proyecto

```text
Agenda/
├── src/
│   ├── assets/             # Imágenes y recursos (Logo Sanfercom)
│   ├── components/
│   │   └── views/          # Componentes de las vistas (Dashboard, Agenda, Ruta, etc.)
│   ├── constants/          # Datos estáticos (Técnicos, Usuarios predefinidos)
│   ├── pages/              # Páginas principales (Login, Dashboard)
│   ├── utils/              # Funciones de utilidad y lógica de DB (LocalStorage)
│   ├── App.jsx             # Configuración de rutas
│   ├── main.jsx            # Punto de entrada de React
│   └── index.css           # Estilos globales y diseño premium
├── public/                 # Archivos públicos
└── index.html              # Plantilla base y CDNs externas
```

---

## 🔧 Instalación y Uso

1.  **Clonar o descargar** el repositorio.
2.  **Instalar dependencias**:
    ```powershell
    npm install
    ```
3.  **Ejecutar en modo desarrollo**:
    ```powershell
    npm run dev
    ```
4.  **Acceder al sistema**:
    -   Abrir `http://localhost:5173` en el navegador.
    -   **Usuarios de prueba**:
        -   Admin: `admin` / `123`
        -   Técnico: `tecnico1` / `789`

---

## 📝 Notas de Versión (Migración)

-   Se eliminó la manipulación directa del DOM para adoptar el **Estado de React**.
-   Se centralizaron los datos de técnicos para evitar inconsistencias.
-   Se optimizó el diseño para dispositivos móviles mediante Media Queries.
-   Se integró una lógica de "Toast" para notificaciones de bienvenida y acciones.

---

Desarrollado con y para **Sanfercom**.
