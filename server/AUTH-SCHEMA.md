# AUTH SCHEMA

> Tablas creadas y gestionadas automáticamente por **Better Auth**. No modificar manualmente.
> Archivo de definición: `src/database/auth-schema.ts`
>
> **Historial de cambios:**
> - `24/feb` — Campo `role` añadido a la tabla `user` como `additionalField`
> - `02/mar` — Se adoptó el modelo de perfil dual: un mismo `user` puede tener perfil de freelancer **y** contratante simultáneamente. El campo `role` quedó para registrar la primera elección del usuario.

---

## Overview

Better Auth gestiona por completo el ciclo de vida de autenticación: cookies de sesión, tokens OAuth, verificación de email y flujos de recuperación de contraseña. El servidor **no manipula estas tablas directamente**; toda interacción pasa a través del handler oficial montado en `/api/auth/*splat`.

---

## Tablas

### `user` — Identidad del usuario

Un mismo usuario puede tener perfil de freelancer, contratante, o ambos simultáneamente. El campo `role` refleja la **primera opción registrada**.

| Columna          | Tipo      | Key    | Descripción                                          |
| ---------------- | --------- | ------ | ---------------------------------------------------- |
| `id`             | text      | PK     | Identificador único del usuario (UUID)               |
| `name`           | text      | —      | Nombre visible en la interfaz                        |
| `email`          | text      | UNIQUE | Correo electrónico                                   |
| `email_verified` | boolean   | —      | Si el correo fue verificado por el usuario           |
| `image`          | text      | —      | URL de foto de perfil (puede ser null)               |
| `role`           | text      | —      | Primera elección del usuario: `freelancer` / `contractor` |
| `created_at`     | timestamp | —      | Fecha de creación de la cuenta                       |
| `updated_at`     | timestamp | —      | Última modificación del registro                     |

> `role` es un `additionalField` de Better Auth declarado en `src/auth/auth.ts`. Se escribe durante el registro y se puede leer desde `req.session.user` en el servidor.

---

### `session` — Sesiones activas

Controla qué usuarios están conectados y la validez temporal de su token.

| Columna      | Tipo      | Key    | Descripción                                          |
| ------------ | --------- | ------ | ---------------------------------------------------- |
| `id`         | text      | PK     | Identificador único de la sesión                     |
| `token`      | text      | UNIQUE | Token de sesión (usado para autenticar solicitudes)  |
| `expires_at` | timestamp | —      | Fecha/hora en que la sesión expira                   |
| `ip_address` | text      | —      | Dirección IP del cliente                             |
| `user_agent` | text      | —      | Navegador/dispositivo de la sesión                   |
| `user_id`    | text      | FK     | → `user.id` (cascade delete)                         |
| `created_at` | timestamp | —      | Fecha de creación                                    |
| `updated_at` | timestamp | —      | Última modificación                                  |

---

### `account` — Cuentas de autenticación (providers)

Cuentas de login asociadas a un usuario. Permite múltiples métodos de autenticación (Google OAuth + email/password) bajo el mismo `user`.

| Columna                    | Tipo      | Key | Descripción                                          |
| -------------------------- | --------- | --- | ---------------------------------------------------- |
| `id`                       | text      | PK  | Identificador único                                  |
| `account_id`               | text      | —   | ID del proveedor externo (ej: ID de Google)          |
| `provider_id`              | text      | —   | Nombre del proveedor (`"credential"`, `"google"`)    |
| `user_id`                  | text      | FK  | → `user.id` (cascade delete)                         |
| `access_token`             | text      | —   | Token OAuth de acceso                                |
| `refresh_token`            | text      | —   | Token OAuth de renovación                            |
| `id_token`                 | text      | —   | Token de identidad OAuth                             |
| `access_token_expires_at`  | timestamp | —   | Expiración del access token                          |
| `refresh_token_expires_at` | timestamp | —   | Expiración del refresh token                         |
| `scope`                    | text      | —   | Permisos OAuth otorgados                             |
| `password`                 | text      | —   | Contraseña hasheada (solo para login email/password) |
| `created_at`               | timestamp | —   | Fecha de creación                                    |
| `updated_at`               | timestamp | —   | Última modificación                                  |

---

### `verification` — Tokens temporales de verificación

Tokens y códigos de uso único para flujos sensibles: verificación de email, reset de contraseña y eliminación de cuenta.

| Columna      | Tipo      | Key   | Descripción                                      |
| ------------ | --------- | ----- | ------------------------------------------------ |
| `id`         | text      | PK    | Identificador único                              |
| `identifier` | text      | INDEX | Lo que se verifica (ej. `"verify-email-{userId}"`) |
| `value`      | text      | —     | Token generado (URL o código)                    |
| `expires_at` | timestamp | —     | Fecha/hora en que el token deja de ser válido    |
| `created_at` | timestamp | —     | Fecha de creación (usada para calcular cooldowns)|
| `updated_at` | timestamp | —     | Última modificación                              |

> **Cooldowns:** El router personalizado (`src/router/auth.ts`) lee `created_at` de esta tabla para implementar un rate-limit de **5 minutos** entre solicitudes de verificación, reset de contraseña y eliminación de cuenta. Los registros se limpian al completar el flujo exitosamente.
