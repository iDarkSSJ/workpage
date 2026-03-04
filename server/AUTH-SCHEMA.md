# AUTH SCHEMA

> Tablas creadas y gestionadas por **Better Auth**. No modificar manualmente.
> Última actualización: 24/feb — campo `role` añadido a `user`
> Actualmente se cambio la idea de el campo `role` y se permitio que un usuario pudiera tener perfil de freelancer y contratante. Pero se dejo el campo `role` para saber la primera opcion que el usuario eligio.

---

### `user` — Usuarios

Identidad y datos básicos del usuario. Un mismo usuario puede tener perfil de freelancer, contratante, o ambos.

| Columna          | Tipo      | Key    | Descripción                                          |
| ---------------- | --------- | ------ | ---------------------------------------------------- |
| `id`             | text      | PK     | Identificador único del usuario                      |
| `name`           | text      | —      | Nombre visible en la interfaz                        |
| `email`          | text      | UNIQUE | Correo electrónico                                   |
| `email_verified` | boolean   | —      | Si el correo fue verificado                          |
| `image`          | text      | —      | URL de foto de perfil                                |
| `role`           | text      | —      | Rol activo del usuario (`freelancer` / `contractor`) |
| `created_at`     | timestamp | —      | Fecha de creación                                    |
| `updated_at`     | timestamp | —      | Última modificación                                  |

---

### `session` — Sesiones activas

Controla quién está conectado y hasta cuándo su token es válido.

| Columna      | Tipo      | Key    | Descripción                                         |
| ------------ | --------- | ------ | --------------------------------------------------- |
| `id`         | text      | PK     | Identificador único de la sesión                    |
| `token`      | text      | UNIQUE | Token de sesión (usado para autenticar solicitudes) |
| `expires_at` | timestamp | —      | Fecha/hora en que la sesión expira                  |
| `ip_address` | text      | —      | Dirección IP del cliente                            |
| `user_agent` | text      | —      | Navegador/dispositivo de la sesión                  |
| `user_id`    | text      | FK     | -> `user.id` (cascade delete)                        |
| `created_at` | timestamp | —      | Fecha de creación                                   |
| `updated_at` | timestamp | —      | Última modificación                                 |

---

### `account` — Cuentas de autenticación

Cuentas de login asociadas a un usuario. Permite múltiples métodos (OAuth + email/password) bajo el mismo `user`.

| Columna                    | Tipo      | Key | Descripción                                         |
| -------------------------- | --------- | --- | --------------------------------------------------- |
| `id`                       | text      | PK  | Identificador único                                 |
| `account_id`               | text      | —   | ID del proveedor externo (ej: ID de Google)         |
| `provider_id`              | text      | —   | Nombre del proveedor (`"google"`, `"github"`, etc.) |
| `user_id`                  | text      | FK  | -> `user.id` (cascade delete)                        |
| `access_token`             | text      | —   | Token OAuth de acceso                               |
| `refresh_token`            | text      | —   | Token OAuth de renovación                           |
| `id_token`                 | text      | —   | Token de identidad OAuth                            |
| `access_token_expires_at`  | timestamp | —   | Expiración del access token                         |
| `refresh_token_expires_at` | timestamp | —   | Expiración del refresh token                        |
| `scope`                    | text      | —   | Permisos OAuth otorgados                            |
| `password`                 | text      | —   | Contraseña hasheada (login email/password)          |
| `created_at`               | timestamp | —   | Fecha de creación                                   |
| `updated_at`               | timestamp | —   | Última modificación                                 |

---

### `verification` — Verificaciones temporales

Tokens y códigos temporales para flujos de verificación (email, reset de contraseña).

| Columna      | Tipo      | Key   | Descripción                                   |
| ------------ | --------- | ----- | --------------------------------------------- |
| `id`         | text      | PK    | Identificador único                           |
| `identifier` | text      | INDEX | Lo que se verifica (ej: email del usuario)    |
| `value`      | text      | —     | Código o token generado                       |
| `expires_at` | timestamp | —     | Fecha/hora en que el token deja de ser válido |
| `created_at` | timestamp | —     | Fecha de creación                             |
| `updated_at` | timestamp | —     | Última modificación                           |
