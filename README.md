# TaskFlow

Aplicacion web para administrar proyectos y sus tareas. Esta construida con React, TypeScript, Vite y Material UI.

## Requisitos

- Node.js y npm
- Acceso a la API de TaskFlow

## Instalacion

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Durante el desarrollo, la aplicacion usa `/api` como URL base. Vite redirige ese prefijo a:

```text
https://d3ujwk09smrk9z.cloudfront.net
```

## Configuracion de la API

La URL base se determina en `src/types.ts` con este orden:

1. `VITE_API_URL`, si esta definida.
2. `/api` durante el desarrollo local.
3. `https://d3ujwk09smrk9z.cloudfront.net` en produccion.

Para usar otra API, crea un archivo `.env` en la raiz:

```env
VITE_API_URL=https://tu-api.example.com
```

Despues de cambiar las variables de entorno, reinicia Vite.

`src/services/httpClient.ts` configura Axios para usar esta URL y agrega automaticamente el token JWT guardado en `localStorage`.

## Rutas actuales

| Ruta | Acceso | Funcion |
| --- | --- | --- |
| `/login` | Publico | Iniciar sesion |
| `/dashboard` | Protegido | Ver, crear, editar y eliminar proyectos |
| `/projects` | Protegido | Alias del dashboard |
| `/projects/:id` | Protegido | Ver un proyecto y administrar sus tareas |

No existe una seccion global de tareas. Las tareas se acceden, crean, editan y eliminan desde el detalle de su proyecto.

## Flujo principal

1. Inicia sesion en `/login`.
2. Desde el dashboard, crea un proyecto o selecciona uno existente.
3. En `/projects/:id`, consulta las tareas del proyecto.
4. Usa **Nueva tarea** para crear una tarea asociada a ese proyecto.
5. Edita o elimina tareas desde sus controles en la misma pantalla.

## Arquitectura

```text
src/
├── components/       Componentes reutilizables para proyectos y tareas
├── config/           Configuracion de la URL de la API
├── context/          Contextos de autenticacion y notificaciones
├── hooks/            Hooks de autenticacion, formularios, proyectos y tareas
├── pages/            Pantallas de login, dashboard y detalle de proyecto
├── services/         Cliente HTTP y operaciones de autenticacion, proyectos y tareas
├── App.tsx           Tema, proveedores y rutas
├── Layout.tsx        Cabecera de las paginas protegidas
├── ErrorBoundary.tsx Fallback para errores de renderizado
├── theme.ts          Tema fijo de Material UI
└── types.ts          Tipos de dominio y configuracion base
```

### Servicios

- `authService`: inicia sesion, guarda, obtiene y elimina el token JWT.
- `projectService`: lista, crea, actualiza y elimina proyectos.
- `taskService`: lista las tareas de un proyecto, crea tareas, actualiza tareas y estados, y elimina tareas.
- `httpClient`: cliente Axios con URL base dinamica, encabezado JSON y autenticacion Bearer.

Los responsables disponibles para nuevas tareas se mantienen en `src/config/users.ts`. Esta lista es estatica porque la API actual no ofrece un endpoint para listar usuarios. Si se registra otro usuario y debe aparecer como responsable, hay que agregarlo manualmente con su ID, usuario y email.

### Hooks principales

- `useAuth`: accede al estado y las acciones de autenticacion.
- `useProjects`: carga proyectos y permite volver a cargarlos.
- `useProjectForm`: gestiona el formulario de proyectos.
- `useTaskForm`: gestiona la creacion de tareas dentro de un proyecto.
- `useTasks`: carga y vuelve a cargar las tareas de un proyecto.

### Manejo de errores y notificaciones

- `ProtectedRoute` redirige a `/login` cuando no existe una sesion valida.
- `ErrorBoundary` muestra una pantalla de recuperacion ante errores de renderizado.
- `ToastProvider` muestra confirmaciones breves despues de operaciones exitosas.
- Los errores de API se muestran en la pantalla correspondiente.

## Comandos disponibles

```bash
npm run dev         # Servidor de desarrollo
npm run build:pages # Compilacion para GitHub Pages
npm run lint        # Comprobacion con Oxlint
npm test            # Pruebas con Vitest
npm run preview     # Vista previa de la compilacion
npx tsc -b          # Comprobacion de TypeScript
```

## Publicacion en GitHub Pages

```bash
npm run build:pages
```

Cuando `GITHUB_PAGES=true`, Vite usa `/proyecto_final/` como base y genera `dist/404.html` como fallback para GitHub Pages.
