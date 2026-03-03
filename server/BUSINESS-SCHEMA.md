# BUSINESS SCHEMA

> Tablas de lógica de negocio del proyecto. Ubicadas en `src/database/schema/`.
> Creadas: 02/mar

---

## Perfiles · `src/database/schema/profiles.ts`

Un mismo `user` puede tener **ambos perfiles simultáneamente**.

### `freelancer_profile` — Perfil público del freelancer

| Columna        | Tipo          | Key    | Descripción                            |
| -------------- | ------------- | ------ | -------------------------------------- |
| `id`           | text          | PK     | Identificador único                    |
| `user_id`      | text          | FK, UQ | -> `user.id` (1:1, cascade delete)      |
| `bio`          | text          | —      | Descripción larga del freelancer       |
| `category`     | text          | —      | Rubro principal (ej: "Desarrollo Web") |
| `hourly_rate`  | numeric(10,2) | —      | Tarifa por hora                        |
| `country`      | text          | —      | País                                   |
| `linkedin_url` | text          | —      | Perfil LinkedIn                        |
| `github_url`   | text          | —      | Perfil GitHub                          |
| `website_url`  | text          | —      | Sitio web personal                     |
| `created_at`   | timestamp     | —      | Fecha de creación                      |
| `updated_at`   | timestamp     | —      | Última modificación                    |

### `contractor_profile` — Perfil público del contratante

| Columna        | Tipo      | Key    | Descripción                       |
| -------------- | --------- | ------ | --------------------------------- |
| `id`           | text      | PK     | Identificador único               |
| `user_id`      | text      | FK, UQ | -> `user.id` (1:1, cascade delete) |
| `company_name` | text      | —      | Nombre de empresa (opcional)      |
| `bio`          | text      | —      | Descripción                       |
| `country`      | text      | —      | País                              |
| `website_url`  | text      | —      | Sitio web                         |
| `created_at`   | timestamp | —      | Fecha de creación                 |
| `updated_at`   | timestamp | —      | Última modificación               |

### `skill` — Catálogo de habilidades

Tabla normalizada de skills. Se reutiliza en perfiles y proyectos para evitar duplicados.

| Columna    | Tipo | Key    | Descripción                      |
| ---------- | ---- | ------ | -------------------------------- |
| `id`       | text | PK     | Identificador único              |
| `name`     | text | UNIQUE | Nombre de la skill (ej: "React") |
| `category` | text | —      | Categoría (ej: "Frontend")       |

### `freelancer_skill` — Skills del freelancer 

| Columna         | Tipo | Key | Descripción               |
| --------------- | ---- | --- | ------------------------- |
| `freelancer_id` | text | FK  | -> `freelancer_profile.id` |
| `skill_id`      | text | FK  | -> `skill.id`              |

> PK compuesta: `(freelancer_id, skill_id)`

### `freelancer_experience` — Experiencia laboral

| Columna         | Tipo | Key | Descripción                           |
| --------------- | ---- | --- | ------------------------------------- |
| `id`            | text | PK  | Identificador único                   |
| `freelancer_id` | text | FK  | -> `freelancer_profile.id`             |
| `title`         | text | —   | Cargo / título del puesto             |
| `company`       | text | —   | Empresa                               |
| `description`   | text | —   | Descripción de las tareas             |
| `start_date`    | date | —   | Fecha de inicio                       |
| `end_date`      | date | —   | Fecha de fin (`NULL` = empleo actual) |

### `freelancer_certification` — Certificaciones

| Columna         | Tipo | Key | Descripción                     |
| --------------- | ---- | --- | ------------------------------- |
| `id`            | text | PK  | Identificador único             |
| `freelancer_id` | text | FK  | -> `freelancer_profile.id`       |
| `name`          | text | —   | Nombre de la certificación      |
| `institution`   | text | —   | Institución que la emitió       |
| `issued_date`   | date | —   | Fecha de emisión                |
| `url`           | text | —   | Link de verificación (opcional) |

### `featured_project` — Portafolio del freelancer

| Columna         | Tipo      | Key | Descripción               |
| --------------- | --------- | --- | ------------------------- |
| `id`            | text      | PK  | Identificador único       |
| `freelancer_id` | text      | FK  | -> `freelancer_profile.id` |
| `title`         | text      | —   | Título del proyecto       |
| `description`   | text      | —   | Descripción               |
| `image_url`     | text      | —   | Imagen de preview         |
| `project_url`   | text      | —   | Link al proyecto          |
| `created_at`    | timestamp | —   | Fecha de creación         |

---

## Proyectos y flujo de contratación · `src/database/schema/projects.ts`

Flujo: `project` -> `proposal` -> `contract`

### `project` — Trabajo publicado por un contratante

| Columna         | Tipo          | Key | Descripción                                             |
| --------------- | ------------- | --- | ------------------------------------------------------- |
| `id`            | text          | PK  | Identificador único                                     |
| `contractor_id` | text          | FK  | -> `contractor_profile.id`                               |
| `title`         | text          | —   | Título del proyecto                                     |
| `description`   | text          | —   | Descripción detallada                                   |
| `budget_type`   | text          | —   | `"fixed"` o `"hourly"`                                  |
| `budget_min`    | numeric(10,2) | —   | Presupuesto mínimo                                      |
| `budget_max`    | numeric(10,2) | —   | Presupuesto máximo                                      |
| `status`        | text          | —   | `"open"` / `"in_progress"` / `"closed"` / `"completed"` |
| `created_at`    | timestamp     | —   | Fecha de publicación                                    |
| `updated_at`    | timestamp     | —   | Última modificación                                     |

### `project_skill` — Skills requeridas en el proyecto

| Columna      | Tipo | Key | Descripción    |
| ------------ | ---- | --- | -------------- |
| `project_id` | text | FK  | -> `project.id` |
| `skill_id`   | text | FK  | -> `skill.id`   |

> PK compuesta: `(project_id, skill_id)`

### `proposal` — Oferta de un freelancer a un proyecto

| Columna         | Tipo          | Key | Descripción                                               |
| --------------- | ------------- | --- | --------------------------------------------------------- |
| `id`            | text          | PK  | Identificador único                                       |
| `project_id`    | text          | FK  | -> `project.id`                                            |
| `freelancer_id` | text          | FK  | -> `freelancer_profile.id`                                 |
| `cover_letter`  | text          | —   | Carta de presentación                                     |
| `bid_amount`    | numeric(10,2) | —   | Monto ofertado                                            |
| `bid_type`      | text          | —   | `"fixed"` o `"hourly"`                                    |
| `status`        | text          | —   | `"pending"` / `"accepted"` / `"rejected"` / `"withdrawn"` |
| `created_at`    | timestamp     | —   | Fecha de la propuesta                                     |
| `updated_at`    | timestamp     | —   | Última modificación                                       |

> UNIQUE `(project_id, freelancer_id)` — un freelancer solo puede hacer 1 propuesta por proyecto.

### `contract` — Contrato generado al aceptarse una propuesta

| Columna         | Tipo          | Key    | Descripción                                   |
| --------------- | ------------- | ------ | --------------------------------------------- |
| `id`            | text          | PK     | Identificador único                           |
| `proposal_id`   | text          | FK, UQ | -> `proposal.id` (1:1)                         |
| `project_id`    | text          | FK     | -> `project.id`                                |
| `contractor_id` | text          | FK     | -> `contractor_profile.id`                     |
| `freelancer_id` | text          | FK     | -> `freelancer_profile.id`                     |
| `agreed_amount` | numeric(10,2) | —      | Monto acordado                                |
| `status`        | text          | —      | `"active"` / `"completed"` / `"cancelled"`    |
| `started_at`    | timestamp     | —      | Fecha de inicio                               |
| `completed_at`  | timestamp     | —      | Fecha de finalización (`NULL` si está activo) |

---

## Reviews · `src/database/schema/reviews.ts`

### `review` — Rating bidireccional al completar un contrato

Tanto el contratante puede reseñar al freelancer como viceversa. Máximo 1 review por persona por contrato.

| Columna       | Tipo         | Key | Descripción                          |
| ------------- | ------------ | --- | ------------------------------------ |
| `id`          | text         | PK  | Identificador único                  |
| `contract_id` | text         | FK  | -> `contract.id`                      |
| `reviewer_id` | text         | FK  | -> `user.id` (quien hace el review)   |
| `reviewee_id` | text         | FK  | -> `user.id` (quien recibe el review) |
| `rating`      | numeric(3,2) | —   | Calificación del 1.00 al 5.00        |
| `comment`     | text         | —   | Comentario (opcional)                |
| `created_at`  | timestamp    | —   | Fecha del review                     |

> UNIQUE `(contract_id, reviewer_id)` — 1 review por persona por contrato.

---

## Chat · `src/database/schema/chat.ts`

### `conversation` — Conversación privada entre dos usuarios

Puede estar asociada a un proyecto específico (botón "Preguntar" / "Ofertar") o ser libre (botón "Contratar" desde el perfil).

| Columna            | Tipo      | Key | Descripción                              |
| ------------------ | --------- | --- | ---------------------------------------- |
| `id`               | text      | PK  | Identificador único                      |
| `project_id`       | text      | FK  | -> `project.id` (`NULL` si es chat libre) |
| `participant_a_id` | text      | FK  | -> `user.id`                              |
| `participant_b_id` | text      | FK  | -> `user.id`                              |
| `created_at`       | timestamp | —   | Fecha de creación                        |
| `updated_at`       | timestamp | —   | Última modificación                      |

> UNIQUE `(project_id, participant_a_id, participant_b_id)` — evita conversaciones duplicadas.

### `message` — Mensaje individual dentro de una conversación

Los mensajes los envía un `user`, sin importar su rol activo (freelancer o contratante).

| Columna           | Tipo      | Key | Descripción                     |
| ----------------- | --------- | --- | ------------------------------- |
| `id`              | text      | PK  | Identificador único             |
| `conversation_id` | text      | FK  | -> `conversation.id`             |
| `sender_id`       | text      | FK  | -> `user.id`                     |
| `content`         | text      | —   | Contenido del mensaje           |
| `is_read`         | boolean   | —   | Si fue leído (default: `false`) |
| `created_at`      | timestamp | —   | Fecha de envío                  |
