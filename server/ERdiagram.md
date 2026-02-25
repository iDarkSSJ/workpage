Diagrama entidad relación hasta el momento
2/feb de las tablas [user, account, session, verification] (cuyos schemas han sido creados por Better Auth para poder manejar correcta y mas facilmente el apartado de autenticación de el proyecto)

-- ACTUALIZADO 24/FEB (CAMPO "role" añadido a la tabla "users")
mermaid diagram -> (mermaid JS)[https://mermaid.live/edit#pako:eNqtVN9v2jAQ_leie05RAgkQv1WMSmganUq7hylS5MUHWEvsyHYYG-V_n5OMtA1BZdr8ZH93990v3x0glQyBAKoPnG4UzWMRC8eep9X8wTk09-oY3BuHM-fzxw4maI4dCHPKsxfsm5QZUtHAyQ4VX3NkXeqcbro8ytq9gniO2tC8cFKF1CBLqOmTlgV7Iz2eUrqdze6flo9XZUXTVJbCJLwbZ6HkjjNU55JS16hz18OFWidGfkfRzRDXCvW2V8bZGdzm-JoywX3BLcuFcrxx0a9bedOpLLr1L6jWP6Ri_7EHq_lqtbhfvtuDluliwBdr83eRvURQJJQx60r39dV-TmHeaXib5Jf5w-JuMbt9vCbTBrPs1VSojmBHsxKvLsu_Nqee-efnmxt5aIeFODH4ZBnDucqpl60KuLBRnAExqkQXclR24u0T6hrEYLZodwVU-gzXtMxMRXu0ZgUVX6XMT5ZKlpstkDXNtH018f7ZT60KCjuFs2pIgUQ1A5AD7IH443AQRYEX-N5oEo6m_tSFn0CC4WDse1EQBeNwOJp4wdGFX7VPbzAdhv5o6kXDysgPJy4g40aqT81yrHfk8TesRJU9]

`erDiagram

    USER {
        text id PK
        text name
        text email
        boolean email_verified
        text image
        text role
        timestamp created_at
        timestamp updated_at
    }

    ACCOUNT {
        text id PK
        text account_id
        text provider_id
        text user_id FK
        text access_token
        text refresh_token
        text id_token
        timestamp access_token_expires_at
        timestamp refresh_token_expires_at
        text scope
        text password
        timestamp created_at
        timestamp updated_at
    }

    SESSION {
        text id PK
        timestamp expires_at
        text token
        timestamp created_at
        timestamp updated_at
        text ip_address
        text user_agent
        text user_id FK
    }

    VERIFICATION {
        text id PK
        text identifier
        text value
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }

    USER ||--o{ ACCOUNT : "1:N"
    USER ||--o{ SESSION : "1:N"

`
