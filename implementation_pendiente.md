# Plan de Implementación: Apartado "Mis Reportes" para el Rol Técnico

Este plan describe la creación y adición de un nuevo apartado llamado **"Mis Reportes"** en el panel de Netroute. Esta pestaña será exclusiva para el rol de `tecnico` y le permitirá ver el historial de sus instalaciones reportadas (las que no pudieron recibirlo) con sus respectivos comentarios.

## Preguntas Abiertas

> [!NOTE]
> 1. **Nombre del Apartado**: Proponemos llamar a la nueva pestaña **"Mis Reportes"** en la barra lateral con el icono de un portapapeles con alerta (`bx bxs-report` o `bx bx-comment-error`). ¿Le parece un nombre adecuado?
> 2. **Filtro de Datos**: Este apartado mostrará únicamente las instalaciones asignadas al técnico actual que tengan estado `'Cancelado'` y contengan un comentario (`job.comment`). ¿Es correcto?

## Cambios Propuestos

### 1. Nueva Vista de Reportes del Técnico
#### [NEW] [MyReportsView.jsx](file:///c:/Users/PC%20ALFONSO/Documents/Agenda/src/components/views/MyReportsView.jsx)
Crear un nuevo componente para mostrar las instalaciones no recibidas con sus comentarios:
- **Vista de Escritorio**: Tabla con columnas: ID, Cliente, Fecha/Hora, Ubicación y Comentario.
- **Vista Móvil**: Listado de tarjetas adaptadas a pantallas pequeñas, destacando el comentario del técnico en una caja roja descriptiva.
- **Buscador**: Soporte para buscar entre los reportes del técnico actual (por ID o nombre del cliente).

---

### 2. Panel Principal (Dashboard)
#### [MODIFY] [Dashboard.jsx](file:///c:/Users/PC%20ALFONSO/Documents/Agenda/src/pages/Dashboard.jsx)
- Importar el nuevo componente `MyReportsView`.
- Modificar la barra lateral (sidebar):
  - Si `user.role === 'tecnico'`, mostrar la pestaña **"Mis Reportes"**.
  - Si es otro rol (admin o agendador), **no** mostrar este apartado.
- Actualizar `handleTabChange` para permitir el acceso a `'mis-reportes'` al rol de técnico.
- Renderizar `<MyReportsView jobs={jobs} currentUser={user} searchTerm={searchTerm} />` en el bloque de contenido si `activeTab === 'mis-reportes'`.

## Plan de Verificación

### Pruebas Manuales
1. Iniciar sesión como `tecnico1` (Tec. Roberto Gómez):
   - Confirmar que la pestaña **"Mis Reportes"** aparece en la barra lateral.
   - En el Dashboard, reportar que un cliente no puede recibir la instalación ingresando un comentario.
   - Ir a la pestaña **"Mis Reportes"** y confirmar que la instalación aparece allí listada con el comentario que acabas de escribir.
   - Probar el buscador dentro de esa pestaña.
2. Iniciar sesión como `admin` (Administrador Principal):
   - Confirmar que **no** aparece la pestaña "Mis Reportes" en su barra lateral.
