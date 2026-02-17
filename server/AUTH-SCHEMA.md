

## user

| Columna         | Tipo de dato | Key     |
|-----------------|-------------|---------|
| id              | text        | PK      |
| name            | text        | —       |
| email           | text        | UNIQUE  |
| email_verified  | boolean     | —       |
| image           | text        | —       |
| created_at      | timestamp   | —       |
| updated_at      | timestamp   | —       |


## account

| Columna                    | Tipo de dato | Key |
|----------------------------|-------------|-----|
| id                         | text        | PK  |
| account_id                 | text        | —   |
| provider_id                | text        | —   |
| user_id                    | text        | FK  |
| access_token               | text        | —   |
| refresh_token              | text        | —   |
| id_token                   | text        | —   |
| access_token_expires_at    | timestamp   | —   |
| refresh_token_expires_at   | timestamp   | —   |
| scope                      | text        | —   |
| password                   | text        | —   |
| created_at                 | timestamp   | —   |
| updated_at                 | timestamp   | —   |


## session

| Columna     | Tipo de dato | Key     |
|------------|-------------|---------|
| id         | text        | PK      |
| expires_at | timestamp   | —       |
| token      | text        | UNIQUE  |
| created_at | timestamp   | —       |
| updated_at | timestamp   | —       |
| ip_address | text        | —       |
| user_agent | text        | —       |
| user_id    | text        | FK      |


## verification

| Columna     | Tipo de dato | Key   |
|------------|-------------|-------|
| id         | text        | PK    |
| identifier | text        | INDEX |
| value      | text        | —     |
| expires_at | timestamp   | —     |
| created_at | timestamp   | —     |
| updated_at | timestamp   | —     |