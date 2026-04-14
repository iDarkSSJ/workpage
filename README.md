# Workpage

Plataforma de contratación freelance full-stack construida con Node.js/Express (Backend), React/Vite (Frontend) y PostgreSQL (Base de datos). Permite a contratantes publicar proyectos, a freelancers postularse con propuestas, formalizar contratos, calificarse mutuamente y comunicarse en tiempo real.

---

# Manual de Instalación y Ejecución

Este documento describe los pasos necesarios para configurar, instalar las dependencias y ejecutar tanto el cliente como el servidor del proyecto.

## Requisitos Previos

-    Tener instalado [Node.js](https://nodejs.org/).
    
-    Tener una base de datos **PostgreSQL** disponible (ya sea local o en la nube) y tener a la mano su URL de conexión (*connection string*).
    
-    Asegúrate de estar en la carpeta raíz del proyecto antes de ejecutar los comandos.
    

- --

## Pasos de Instalación y Configuración

### Paso 1: Instalar todas las dependencias

El primer paso es instalar las librerías necesarias para el Frontend (cliente) y el Backend (servidor).

Ejecuta el siguiente comando en tu terminal:

Bash

```
npm run install:all
```

> **Nota:** Este comando instalará automáticamente las dependencias dentro de las carpetas `client` y `server`.

### Paso 2: Configurar las Variables de Entorno

Antes de ejecutar el proyecto, debes configurar las variables de entorno.

En cada uno de los módulos (`client` y `server`) encontrarás un archivo de ejemplo llamado `.env.example`. Debes copiar estos archivos, renombrarlos a `.env` y llenarlos con tu información.

De todas las variables, las únicas que requieren **credenciales reales** son:

1.  **Resend API Key:** Necesaria para el envío de correos electrónicos.
    
2.  **Credenciales de Google OAuth:** Necesarias para la autenticación y login con Google.
    
3.  **URL de PostgreSQL:** La cadena de conexión (*connection string*) hacia tu base de datos.
    

### Paso 3: Base de Datos y Automatización

Asegúrate de colocar correctamente tu URL de conexión de PostgreSQL en las variables de entorno del servidor.

**No necesitas crear las tablas manualmente.** El backend está configurado para sincronizar automáticamente el esquema con la base de datos cada vez que se inicia (`npm run dev` o `npm run start`).

### Paso 4: Construir (Build) el Cliente

Para que el frontend funcione correctamente en modo producción o vista previa, necesitas compilar el código.

Ejecuta en tu terminal:

Bash

```
npm run build:client
```

---

## Ejecución del Proyecto

Para levantar la aplicación, necesitas iniciar tanto el servidor como el cliente. Se recomienda abrir **dos terminales distintas** (ambas en la raíz del proyecto).

### Paso 5: Iniciar el Servidor (Backend)

En tu **primera terminal**, inicia el servidor ejecutando:

Bash

```
npm run start:server
```

El servidor ejecutará automáticamente `db:setup` (sincronizando tablas e insertando skills) y quedará escuchando las peticiones.

### Paso 6: Iniciar el Cliente (Frontend)

En tu **segunda terminal**, inicia la vista previa de la interfaz web ejecutando:

Bash

```
npm run start:client
```

Este comando levantará el frontend para que puedas acceder a la interfaz de Workpage desde tu navegador.

# Acceder al frontend

Automaticamente el frontend se abrirá en la dirección `http://localhost:5173`.
Y se comunicara al backend en la dirección `http://localhost:3000`.
(Si verificas correctamente la url del backend en el archivo `.env` del frontend, no deberas cambiar nada)

- --

## Stack Tecnológico

| Capa       | Tecnología                                          |
| ---------- | --------------------------------------------------- |
| Backend    | Node.js, Express, TypeScript                        |
| Base de datos | PostgreSQL + Drizzle ORM                         |
| Autenticación | Better Auth (email/password + Google OAuth)      |
| Emails     | Resend SDK                                          |
| WebSockets | Socket.io                                           |
| Frontend   | React 19, Vite, TypeScript                          |
| Estado     | TanStack Query (React Query)                        |
| Validación | Zod (cliente y servidor)                            |
| Estilos    | Tailwind CSS                                        |

---

## Estructura del Monorepo

```
workpage/
├── client/          # Frontend (React / Vite)
└── server/          # Backend (Node.js / Express)
```

Cada sub-proyecto tiene su propio `package.json`, `tsconfig.json` y su propia configuración. No se comparte código entre ambos.

---

## Arquitectura del Backend (`server/`)

El servidor sigue una **arquitectura en capas estricta** (ROUTER -> CONTROLLER -> SERVICE -> DATABASE). Cada capa tiene una responsabilidad única y no puede saltarse niveles.

```
HTTP Request
    ↓
Router       (src/router/)         — Define rutas y aplica middlewares
    ↓
Controller   (src/controllers/)    — Extrae datos del request, llama al servicio
    ↓
Service      (src/services/)       — Toda la lógica de negocio y acceso a BD
    ↓
Database     (src/database/)       — Schema Drizzle ORM (PostgreSQL)
```

### Directorios del Backend

```
server/src/
├── auth/            # Configuración de Better Auth (social providers, additionalFields)
├── controllers/     # Un archivo por dominio de negocio
├── database/        # Schema (auth-schema.ts + schema/), conexión y migrations
├── email/           # Plantillas y envío de correos via Resend
├── middleware/       # errorHandler, requireAuth, requireCompletedProfile
├── router/          # Rutas Express, auth.ts usa el handler de Better Auth
├── schemas/         # Schemas Zod para validar el body de las requests
├── services/        # Lógica de negocio; único punto de acceso a la BD
├── socket.ts        # Configuración de Socket.io para el chat en tiempo real
├── tests/           # Tests unitarios
├── types/           # Extensión global del tipo Request de Express (session)
└── utils/           # AppError (error estandarizado)
```

### Reglas Arquitectónicas (Backend)

1. **Los controllers no consultan la BD.** Toda consulta vive en `services/`.
2. **Los routers no contienen lógica de negocio.** Solo aplican middlewares y delegan a controllers.
3. **Los errores se lanzan con `AppError`** y son capturados centralmente por `errorHandler.ts`.
4. **Los schemas Zod** en `src/schemas/` validan el body antes de llegar al controller.
5. **Better Auth** gestiona de forma autónoma las tablas `user`, `session`, `account` y `verification` (definidas en `auth-schema.ts`). No se manipulan directamente.

### Módulos del Backend

| Módulo        | Router                  | Controller(s)                       | Service(s)                          |
| ------------- | ----------------------- | ----------------------------------- | ----------------------------------- |
| Auth          | `router/auth.ts`        | —                                   | Better Auth + router custom          |
| Perfiles      | `router/profiles.ts`    | `profile`, `experiences`, `certifications`, `portfolio`, `skills` | `freelancer.service`, `contractor.service`, `experiences.service`, `certifications.service`, `portfolio.service`, `skills.service` |
| Proyectos     | `router/projects.ts`    | `projects.controller`               | `projects.service`                  |
| Propuestas    | `router/proposals.ts`   | `proposals.controller`              | `proposals.service`                 |
| Contratos     | `router/contracts.ts`   | `contracts.controller`              | `contracts.service`                 |
| Reviews       | `router/reviews.ts`     | `reviews.controller`                | `reviews.service`                   |
| Chat          | `router/conversation.ts`| `conversation.controller`           | `conversation.service`              |

---

## Arquitectura del Frontend (`client/`)

El cliente sigue una **Feature-based Architecture** combinada con una capa de componentes compartidos. Cada feature es autónoma: tiene sus propios componentes, hooks, llamadas API y schemas de validación.

### Directorios del Frontend

```
client/src/
├── app/             # Router principal (AppRouter con React Router v7)
├── assets/          # Archivos estáticos (SVGs, imágenes)
├── components/      # Componentes UI compartidos (Button, Card, Navbar, etc.)
│   ├── guards/      # Componentes de protección de rutas
│   ├── layouts/     # Layouts globales (GlobalLayout)
│   └── ui/          # Primitivos de UI (Input, TabSelector, etc.)
├── context/         # AuthContext (sesión global via TanStack Query)
├── data/            # Datos estáticos (Lista de Paises)
├── features/        # Módulos de negocio (ver detalle abajo)
│   ├── auth/        # Login, registro, recuperación, gestión de cuenta
│   ├── chat/        # Conversaciones y mensajes en tiempo real
│   ├── contracts/   # Listado y gestión de contratos
│   ├── profiles/    # Perfiles de freelancer y contratante
│   ├── projects/    # Proyectos: listado, detalle, creación
│   ├── proposals/   # Propuestas: envío, gestión, aceptación
│   └── reviews/     # Sistema de reseñas bidireccional
├── lib/             # Clientes: api.ts (custom fetch), authClient.ts (Better Auth)
├── pages/           # Páginas que el router monta (importan features)
└── utils/           # Utilidades (cn, formatters)
```

### Estructura Interna de un Feature

Cada feature sigue la misma convención interna:

```
features/<nombre>/
├── api/
│   ├── <nombre>.api.ts       # Funciones de petición HTTP puras
│   └── use<Nombre>.ts        # Custom hooks de React Query (useQuery / useMutation)
├── components/               # Componentes específicos del feature
└── schemas/                  # Schemas Zod de validación del formulario
```

### Reglas Arquitectónicas (Frontend)

1. **Ningún componente hace fetch directo.** Toda llamada HTTP vive en `features/*/api/*.api.ts`, expuesta a través de un custom hook de React Query.
2. **El `AppLoader`** es global y reacciona automáticamente a cualquier `useMutation` o `useQuery` activo (salvo los marcados con `meta: { silent: true }` — usado exclusivamente en el chat).
3. **Los schemas Zod** del cliente son independientes a los del servidor. Validan los formularios en el cliente antes de realizar la petición.
4. **Las páginas** (`pages/`) son componentes delgados que ensamblan features. No contienen lógica de negocio.
5. **El contexto de sesión** se gestiona con `AuthContext` (apoyado en `authClient` de Better Auth), no con estado global de Redux ni Zustand.

### Rutas del Frontend

| Ruta                       | Acceso        | Página                    |
| -------------------------- | ------------- | ------------------------- |
| `/`                        | Público       | Redirige a `/dashboard`   |
| `/login`                   | Solo invitados| `LoginPage`               |
| `/register`                | Solo invitados| `RegisterPage`            |
| `/forgot-password`         | Público       | `ForgotPasswordPage`      |
| `/reset-password`          | Público       | `ResetPasswordPage`       |
| `/projects`                | Público       | `ProjectsPage`            |
| `/projects/:id`            | Público       | `ProjectDetailPage`       |
| `/freelancers/:id`         | Público       | `FreelancerProfilePage`   |
| `/contractors/:id`         | Público       | `ContractorProfilePage`   |
| `/dashboard`               | 🔒 Autenticado | `DashboardPage`           |
| `/dashboard/account`       | 🔒 Autenticado | `AccountSettingsPage`     |
| `/dashboard/edit-profile`  | 🔒 Autenticado | `EditProfilePage`         |
| `/dashboard/contracts`     | 🔒 Autenticado | `ContractsPage`           |
| `/dashboard/chat`          | 🔒 Autenticado | `ChatPage`                |
| `/dashboard/chat/:id`      | 🔒 Autenticado | `ChatPage`                |
| `/projects/new`            | 🔒 Autenticado | `NewProjectPage`          |
| `/profile/setup`           | 🔒 Autenticado | `ProfileSetupPage`        |
| `*`                        | Público       | `NotFoundPage` (404)      |

---

## Flujo Principal del Negocio

```
1. Contractor crea cuenta → configura perfil de contratante
2. Contractor publica PROJECT con presupuesto y skills requeridas
3. Freelancer busca proyectos → envía PROPOSAL con bid y carta
4. Contractor revisa propuestas → acepta una → se genera CONTRACT
   → El proyecto pasa a estado "in_progress"
5. Ambas partes se comunican vía CHAT (en tiempo real con Socket.io)
6. Contractor o Freelancer marca el contrato como completado
   → El proyecto pasa a estado "completed"
7. Ambas partes pueden dejar un REVIEW bidireccional (rating + comentario)
```

---

## Documentación de Schemas

- [`server/AUTH-SCHEMA.md`](./server/AUTH-SCHEMA.md) — Tablas gestionadas por Better Auth
- [`server/BUSINESS-SCHEMA.md`](./server/BUSINESS-SCHEMA.md) — Tablas de lógica de negocio
- [`server/ERdiagram.md`](./server/ERdiagram.md) — Diagrama entidad-relación completo (Mermaid)
