# BUSINESS SCHEMA

> Tablas de lógica de negocio del proyecto. Ubicadas en `src/database/schema/`.
>
> **Historial de cambios:**
> - `02/mar` — Tablas de negocio iniciales creadas
> - `03/mar` — Campo `reviewee_role` añadido a tabla `review`

---

## Overview

El esquema de negocio modela una **plataforma de contratación freelance bidireccional**. El flujo principal es:

```
contractor publica PROJECT
    → freelancer envía PROPOSAL
        → contractor acepta → se genera CONTRACT
            → al completar → ambas partes pueden dejar REVIEW
```

Un mismo `user` puede operar como freelancer **y** contratante simultáneamente (perfiles duales). El chat puede estar contextualizado a un proyecto o ser libre entre usuarios.

---

## Perfiles · `src/database/schema/profiles.ts`

Un mismo `user` puede tener **ambos perfiles simultáneamente**.

### `freelancer_profile` — Perfil público del freelancer

| Columna        | Tipo          | Key    | Descripción                                  |
| -------------- | ------------- | ------ | -------------------------------------------- |
| `id`           | text          | PK     | Identificador único                          |
| `user_id`      | text          | FK, UQ | → `user.id` (1:1, cascade delete)            |
| `bio`          | text          | —      | Descripción larga del freelancer             |
| `category`     | text          | —      | Rubro principal (ej: "Desarrollo Web")       |
| `hourly_rate`  | numeric(10,2) | —      | Tarifa por hora                              |
| `country`      | text          | —      | País                                         |
| `linkedin_url` | text          | —      | Perfil LinkedIn (opcional)                   |
| `github_url`   | text          | —      | Perfil GitHub (opcional)                     |
| `website_url`  | text          | —      | Sitio web personal (opcional)                |
| `created_at`   | timestamp     | —      | Fecha de creación                            |
| `updated_at`   | timestamp     | —      | Última modificación                          |

### `contractor_profile` — Perfil público del contratante

| Columna        | Tipo      | Key    | Descripción                        |
| -------------- | --------- | ------ | ---------------------------------- |
| `id`           | text      | PK     | Identificador único                |
| `user_id`      | text      | FK, UQ | → `user.id` (1:1, cascade delete)  |
| `company_name` | text      | —      | Nombre de empresa (opcional)       |
| `bio`          | text      | —      | Descripción                        |
| `country`      | text      | —      | País                               |
| `website_url`  | text      | —      | Sitio web                          |
| `created_at`   | timestamp | —      | Fecha de creación                  |
| `updated_at`   | timestamp | —      | Última modificación                |

---

### `skill` — Catálogo de habilidades

Tabla normalizada de skills. Se reutiliza en perfiles de freelancer y en proyectos para evitar duplicados. Sembrada con registros iniciales en `src/data/`.

| Columna    | Tipo | Key    | Descripción                      |
| ---------- | ---- | ------ | -------------------------------- |
| `id`       | text | PK     | Identificador único              |
| `name`     | text | UNIQUE | Nombre de la skill (ej: "React") |
| `category` | text | —      | Categoría (ej: "Frontend")       |

### `freelancer_skill` — Pivot: skills del freelancer (N:M)

| Columna         | Tipo | Key | Descripción                   |
| --------------- | ---- | --- | ----------------------------- |
| `freelancer_id` | text | FK  | → `freelancer_profile.id`     |
| `skill_id`      | text | FK  | → `skill.id`                  |

> PK compuesta: `(freelancer_id, skill_id)`

### `project_skill` — Pivot: skills requeridas en el proyecto (N:M)

| Columna      | Tipo | Key | Descripción      |
| ------------ | ---- | --- | ---------------- |
| `project_id` | text | FK  | → `project.id`   |
| `skill_id`   | text | FK  | → `skill.id`     |

> PK compuesta: `(project_id, skill_id)`

---

### `freelancer_experience` — Experiencia laboral

| Columna         | Tipo | Key | Descripción                           |
| --------------- | ---- | --- | ------------------------------------- |
| `id`            | text | PK  | Identificador único                   |
| `freelancer_id` | text | FK  | → `freelancer_profile.id`             |
| `title`         | text | —   | Cargo / título del puesto             |
| `company`       | text | —   | Empresa                               |
| `description`   | text | —   | Descripción de las tareas             |
| `start_date`    | date | —   | Fecha de inicio                       |
| `end_date`      | date | —   | Fecha de fin (`NULL` = empleo actual) |

### `freelancer_certification` — Certificaciones

| Columna         | Tipo | Key | Descripción                      |
| --------------- | ---- | --- | -------------------------------- |
| `id`            | text | PK  | Identificador único              |
| `freelancer_id` | text | FK  | → `freelancer_profile.id`        |
| `name`          | text | —   | Nombre de la certificación       |
| `institution`   | text | —   | Institución que la emitió        |
| `issued_date`   | date | —   | Fecha de emisión                 |
| `url`           | text | —   | Link de verificación (opcional)  |

### `freelancer_portfolio` — Portafolio del freelancer

| Columna         | Tipo      | Key | Descripción                |
| --------------- | --------- | --- | -------------------------- |
| `id`            | text      | PK  | Identificador único        |
| `freelancer_id` | text      | FK  | → `freelancer_profile.id`     |
| `title`         | text      | —   | Título del proyecto        |
| `description`   | text      | —   | Descripción                |
| `image_url`     | text      | —   | Imagen de preview             |
| `project_url`   | text      | —   | Link al proyecto              |
| `created_at`    | timestamp | —   | Fecha de creación             |

---

## Proyectos y Flujo de Contratación · `src/database/schema/projects.ts`

Flujo principal: `project` → `proposal` → `contract`

### `project` — Trabajo publicado por un contratante

| Columna         | Tipo          | Key | Descripción                                               |
| --------------- | ------------- | --- | --------------------------------------------------------- |
| `id`            | text          | PK  | Identificador único                                       |
| `contractor_id` | text          | FK  | → `contractor_profile.id`                                 |
| `title`         | text          | —   | Título del proyecto                                       |
| `description`   | text          | —   | Descripción detallada                                     |
| `budget_type`   | text          | —   | `"fixed"` o `"hourly"`                                    |
| `budget_min`    | numeric(10,2) | —   | Presupuesto mínimo                                        |
| `budget_max`    | numeric(10,2) | —   | Presupuesto máximo                                        |
| `status`        | text          | —   | `"open"` / `"in_progress"` / `"closed"` / `"completed"`  |
| `created_at`    | timestamp     | —   | Fecha de publicación                                      |
| `updated_at`    | timestamp     | —   | Última modificación                                       |

### `proposal` — Oferta de un freelancer a un proyecto

| Columna         | Tipo          | Key | Descripción                                                 |
| --------------- | ------------- | --- | ----------------------------------------------------------- |
| `id`            | text          | PK  | Identificador único                                         |
| `project_id`    | text          | FK  | → `project.id`                                              |
| `freelancer_id` | text          | FK  | → `freelancer_profile.id`                                   |
| `cover_letter`  | text          | —   | Carta de presentación                                       |
| `bid_amount`    | numeric(10,2) | —   | Monto ofertado                                              |
| `bid_type`      | text          | —   | `"fixed"` o `"hourly"`                                      |
| `status`        | text          | —   | `"pending"` / `"accepted"` / `"rejected"` / `"withdrawn"`   |
| `created_at`    | timestamp     | —   | Fecha de la propuesta                                       |
| `updated_at`    | timestamp     | —   | Última modificación                                         |

> UNIQUE `(project_id, freelancer_id)` — un freelancer solo puede hacer 1 propuesta por proyecto.

> Las transiciones de estado válidas están controladas en `src/services/proposals.service.ts` mediante un mapa tipado `Record<ProposalStatus, TransitionRule>`.

### `contract` — Contrato generado al aceptar una propuesta

| Columna         | Tipo          | Key    | Descripción                                   |
| --------------- | ------------- | ------ | --------------------------------------------- |
| `id`            | text          | PK     | Identificador único                           |
| `proposal_id`   | text          | FK, UQ | → `proposal.id` (1:1)                         |
| `project_id`    | text          | FK     | → `project.id`                                |
| `contractor_id` | text          | FK     | → `contractor_profile.id`                     |
| `freelancer_id` | text          | FK     | → `freelancer_profile.id`                     |
| `agreed_amount` | numeric(10,2) | —      | Monto acordado (proviene del bid de la propuesta) |
| `status`        | text          | —      | `"active"` / `"completed"` / `"cancelled"`    |
| `started_at`    | timestamp     | —      | Fecha de inicio                               |
| `completed_at`  | timestamp     | —      | Fecha de finalización (`NULL` si está activo) |

---

## Reviews · `src/database/schema/reviews.ts`

### `review` — Rating bidireccional al completar un contrato

Tanto el contratante puede reseñar al freelancer como viceversa. El sistema permite un máximo de 1 review por persona por contrato.

| Columna         | Tipo         | Key | Descripción                                                       |
| --------------- | ------------ | --- | ------------------------------------------------------------------ |
| `id`            | text         | PK  | Identificador único                                               |
| `contract_id`   | text         | FK  | → `contract.id`                                                   |
| `reviewer_id`   | text         | FK  | → `user.id` (quien escribe el review)                             |
| `reviewee_id`   | text         | FK  | → `user.id` (quien recibe el review)                              |
| `reviewee_role` | text         | —   | Rol del reviewee en el contrato: `"freelancer"` / `"contractor"`  |
| `rating`        | numeric(3,2) | —   | Calificación del 1.00 al 5.00                                     |
| `comment`       | text         | —   | Comentario escrito (opcional)                                     |
| `created_at`    | timestamp    | —   | Fecha del review                                                  |

> UNIQUE `(contract_id, reviewer_id)` — 1 review por persona por contrato.

---

## Chat · `src/database/schema/chat.ts`

### `conversation` — Conversación privada entre dos usuarios

Puede estar vinculada a un proyecto específico (acciones "Preguntar" / "Contactar" desde la vista de proyecto o perfiles) o ser una conversación libre. El campo `project_id` es nullable.

| Columna            | Tipo      | Key | Descripción                                  |
| ------------------ | --------- | --- | -------------------------------------------- |
| `id`               | text      | PK  | Identificador único                          |
| `project_id`       | text      | FK  | → `project.id` (`NULL` si es chat libre)     |
| `participant_a_id` | text      | FK  | → `user.id`                                  |
| `participant_b_id` | text      | FK  | → `user.id`                                  |
| `created_at`       | timestamp | —   | Fecha de creación                            |
| `updated_at`       | timestamp | —   | Última modificación                          |

> UNIQUE `(project_id, participant_a_id, participant_b_id)` — evita conversaciones duplicadas.

### `message` — Mensaje dentro de una conversación

Los mensajes los envía un `user` directamente, sin importar el rol activo (freelancer o contratante), ya que el chat opera al nivel de identidad del usuario.

| Columna           | Tipo      | Key | Descripción                      |
| ----------------- | --------- | --- | -------------------------------- |
| `id`              | text      | PK  | Identificador único              |
| `conversation_id` | text      | FK  | → `conversation.id`              |
| `sender_id`       | text      | FK  | → `user.id`                      |
| `content`         | text      | —   | Contenido del mensaje            |
| `is_read`         | boolean   | —   | Si fue leído (default: `false`)  |
| `created_at`      | timestamp | —   | Fecha de envío                   |
