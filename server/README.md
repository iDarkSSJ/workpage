# Workpage — Server

Backend del proyecto **Workpage**, una plataforma freelance estilo.  
Construido con **Express.js + TypeScript**, usando **Drizzle ORM** sobre **PostgreSQL** y **Better Auth** para autenticación.

---

## Stack

| Tecnología            | Uso                                    |
| --------------------- | -------------------------------------- |
| Express.js            | Framework HTTP                         |
| TypeScript / tsx      | Lenguaje + ejecución directa           |
| Drizzle ORM           | ORM + query builder                    |
| drizzle-kit           | Generación y aplicación de migraciones |
| PostgreSQL (pg)       | Base de datos                          |
| Better Auth           | Autenticación completa                 |
| Zod                   | Validación de datos                    |
| Resend + @react-email | Emails transaccionales                 |

---

## Comandos

# PNPM O NPM O EL MANAGER DE PAQUETES QUE SE UTILIZE.
Yo -jose luis- uso pnpm. mientras que mis compañeros de equipo usan npm.

```bash
# Iniciar en desarrollo
pnpm dev                      # tsx watch src/index.ts

# Generar migración tras cambios en el schema
pnpm drizzle-kit generate

# Aplicar migraciones a la DB
pnpm drizzle-kit migrate
```

---

## Estructura
Esta estructura visual para ayudar a comprender la organización del proyecto la realicé con la ayuda de claude. Esperando que sea de utilidad para llegar entendimiento de la logica del proyecto.

```
server/
├── drizzle/                    ← Archivos SQL de migraciones (generados)
├── drizzle.config.ts           ← Configuración de drizzle-kit
├── src/
│   ├── index.ts                ← Entry point del servidor
│   ├── auth/                   ← Configuración de Better Auth
│   ├── database/
│   │   ├── auth-schema.ts      ← Tablas de Better Auth (no modificar)
│   │   ├── database.ts         ← Cliente Drizzle (db)
│   │   └── schema/             ← Tablas de lógica de negocio
│   │       ├── profiles.ts     ← freelancer_profile, contractor_profile, skills
│   │       ├── projects.ts     ← project, proposal, contract
│   │       ├── reviews.ts      ← review
│   │       ├── chat.ts         ← conversation, message
│   │       ├── relations.ts    ← Relations de Drizzle (query API)
│   │       └── index.ts        ← Barrel export
│   ├── middleware/
│   ├── router/
│   ├── email/
│   └── types/
├── AUTH-SCHEMA.md              ← Documentación tablas de auth
├── BUSINESS-SCHEMA.md          ← Documentación tablas de negocio
└── ERdiagram.md                ← Diagrama ER completo (mermaid)
```

---

## Schema de base de datos

### Tablas de autenticación — `auth-schema.ts`

> Gestionadas por Better Auth. Ver [`AUTH-SCHEMA.md`](./AUTH-SCHEMA.md)

| Tabla          | Propósito                               |
| -------------- | --------------------------------------- |
| `user`         | Identidad del usuario (+ campo `role`)  |
| `session`      | Sesiones activas                        |
| `account`      | Cuentas OAuth / email-password          |
| `verification` | Tokens temporales (verificación, reset) |

### Tablas de negocio — `schema/`

> Ver [`BUSINESS-SCHEMA.md`](./BUSINESS-SCHEMA.md)

| Tabla                      | Archivo     | Propósito                                     |
| -------------------------- | ----------- | --------------------------------------------- |
| `skill`                    | profiles.ts | Catálogo de habilidades normalizado           |
| `freelancer_profile`       | profiles.ts | Perfil público del freelancer (1:1 con user)  |
| `contractor_profile`       | profiles.ts | Perfil público del contratante (1:1 con user) |
| `freelancer_skill`         | profiles.ts | Skills del freelancer (pivot N:M)             |
| `freelancer_experience`    | profiles.ts | Experiencia laboral                           |
| `freelancer_certification` | profiles.ts | Certificaciones                               |
| `featured_project`         | profiles.ts | Portafolio                                    |
| `project`                  | projects.ts | Trabajo publicado por un contratante          |
| `project_skill`            | projects.ts | Skills requeridas en el proyecto (pivot N:M)  |
| `proposal`                 | projects.ts | Oferta de un freelancer a un proyecto         |
| `contract`                 | projects.ts | Contrato generado al aceptarse una propuesta  |
| `review`                   | reviews.ts  | Rating bidireccional al completar un contrato |
| `conversation`             | chat.ts     | Chat privado entre dos usuarios               |
| `message`                  | chat.ts     | Mensaje individual                            |

---
