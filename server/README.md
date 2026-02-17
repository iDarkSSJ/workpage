
### TABLA `user` - Usuarios:

- Esta tabla guarda la identidad y datos básicos del usuario.

| Columna                       | Qué representa                                     |
| ------------------------------| -------------------------------------------------- |
| `id`                          | Identificador único del usuario (clave primaria)   |
| `name`                        | Nombre que se presenta en la interfaz              |
| `email`                       | Correo electrónico único del usuario               |
| `email_verified`              | Si el correo fue verificado (true/false)           |
| `image`                       | URL de imagen de perfil                            |
| `created_at`, `updated_at`    | Fechas de creación y última modificación           |

---
### TABLA `session` - Sesiones de Usuario activas:

- Controla quién está conectado y hasta cuándo su token es válido.
- Permite que el backend valide solicitudes con cookies o tokens almacenados.
### *Relaciones*
- - Cada sesión pertenece a un usuario vía `user_id` con eliminación en cascada.



| Columna                    | Qué representa                                            |
| -------------------------- | --------------------------------------------------------- |
| `id`                       | Identificador único de la sesión                          |
| `token`                    | Token de sesión único (usado para autenticar solicitudes) |
| `expires_at`               | Fecha/hora en que la sesión expira                        |
| `user_id`                  | FK → `user.id` (session pertenece a este usuario)         |
| `ip_address`               | Dirección IP del cliente                                  |
| `user_agent`               | Navegador/dispositivo de la sesión                        |
| `created_at`, `updated_at` | Fechas de creación y última modificación                  |

---

### TABLA `account` - Cuentas de autenticación:

- Almacena las cuentas de login asociadas a un usuario, incluyendo proveedores OAuth o credenciales locales.
- Permite integrar múltiples medios de inicio de sesión (OAuth, contraseña) bajo un solo usuario.

| Columna                                                | Qué representa                                               |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| `id`                                                   | Identificador único del registro                             |
| `account_id`                                           | ID específico del proveedor (por ejemplo, ID de Google)      |
| `provider_id`                                          | Nombre del proveedor (por ejemplo, `"google"`, `"github"`)   |
| `user_id`                                              | FK → `user.id`: a qué usuario pertenece                      |
| `access_token` / `refresh_token`                       | Tokens OAuth si existe un proveedor externo                  |
| `id_token`                                             | Token de identidad OAuth                                     |
| `access_token_expires_at` / `refresh_token_expires_at` | Cuando expiran esos tokens OAuth                             |
| `scope`                                                | Permisos de OAuth                                            |
| `password`                                             | Contraseña *hasheada* cuando se usa login por email/password |
| `created_at`, `updated_at`                             | Fechas de creación y última modificación                     |

---

### Tabla `verification` – Verificaciones temporales

- Guarda tokens y códigos temporales usados para flujos de verificación (correo, restablecer contraseña).
- Se usa en flujos como envío de email para verificación o reset de contraseña.

| Columna                    | Significado                                         |
| -------------------------- | --------------------------------------------------- |
| `id`                       | Identificador único de la verificación              |
| `identifier`               | Lo que se verifica (por ejemplo, email del usuario) |
| `value`                    | Código o token generado                             |
| `expires_at`               | Fecha/hora en que el token deja de ser válido       |
| `created_at`, `updated_at` | Fechas de creación y última modificación            |
