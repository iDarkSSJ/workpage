Diagrama entidad relación hasta el momento
2/feb de las tablas [user, account, session, verification] (cuyos schemas han sido creados por Better Auth para poder manejar correcta y mas facilmente el apartado de autenticación de el proyecto)

mermaid diagram -> (mermaid JS)[https://mermaid.live/edit#pako:eNqtVN9v2jAQ_leie04RhqSEvFWMSqganUq7hylS5MUHWE3syHYoHeV_n5OMlIagMm1-ir_zfffjy90OEskQQkD1hdOVolkkIuHY87SYPji7-rs8BrfG4cz5dtfCBM2wBWFGefqO_ZQyRSpqON6g4kuOrE2d0dUxD89QG5rlTqKQGmQxNV3WImcfrPtD_jeTyf3T_PGiEmiSyEKYmLeTypXccIbq1FLoCnVuO7hQ69jIZxQtk8KlQr3utHF2Ajc1HlPGuM25ZTnTjg8hut-W0XQi87ZoOdX6RSr2HzVYTBeL2f38Uw0aprMJn-3N32X2nkEeU8ZsKN2lq_0ThflE8KbI79OH2e1scvN4SaU1ZtnLEVAtw4amBV7cln8Vpxrwt7erK7lrhiV0IiDhPILTJwctj56ACyvFGYRGFehChsoOuL1C1YUIzBrtaoDSg-GSFqkpvfbWLafih5TZwVPJYrWGcElTbW91xn_WUYMqFHYQJ-WcQjgc-RUJhDvY2uug542HHgk83_OuBwFx4RXCgd8Lhn1_RAJ_7Pv-cLx34VcVlfTIgFx7Qd_r9wkhwXjkAjJupPpab8NqKe5_A1OVkS0]

`erDiagram

    USER {
        text id PK
        text name
        text email
        boolean email_verified
        text image
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
