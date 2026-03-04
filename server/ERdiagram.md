Diagrama entidad relación
2/feb — tablas auth [user, account, session, verification] creadas por Better Auth
24/feb — campo "role" añadido a tabla "user"
02/mar — tablas de negocio añadidas
03/mar — campo "reviewee_role" añadido a tabla "review"

[mermaidJS](https://mermaid.live/edit#pako:eNq1WP1O6zYUfxUr0pVAKqjlq9D_uhKm7kKL2nI3TUiRG5vWkMSR7ZR2gLSH2GvsKfYme5Idp02apA5NB1RCJD4-x-f8zqfzYrmcUKtlUXHJ8ERg_z64DxD87ob2AL0sn_VP0blCjKDb74W1APu0sER9zLz12phzj-JguezMqGAPjJKiaB9PinIE8GWWmE-lwn6IXEGxosTBykSNQpKjviUmtTud_l1vVMkq7Lo8CpTDinqGgs8YoWKTEsl4FV0ZZFEpHcWfaFC0kD4IKqdGGiMby6mNWZEOnYcMpJTAkTvCvFefJl0eFvEPsZTPXJBP9MHQHg67_d5WH6SSShUuxWY3zdYahA4mBI6SJr9CcAZqi8NTI3_Yg-5Vt9MeVbF0uQbSdVaIAmGGvYhWhuXDzvnevb7-v0nvgswJF4uCzKuBbV-3ex174NwO-lfda7vSAaXJNGb83YP1L4h8KDIumvJIeAtHwIYij07uLEu86rHgiRIWOMBWIE2YmkZjA-GZjiVTtED5qCc6_d5o0O6M-p-Emsv9EAcLx-A3A6BGcL7G0Ex42L_dQt7Y8FzJVqhq1MOBW2KxYsqjZhQKq4RKV7BQMZ4pJ1pdBLoL5ZBc-MQEGpDMsskY-BvtVgO22GPwHAskWBkZFGdSRpQUNF9GSOK9tdJ2e3Q3sC91oP1id0ZfBb4R5nXrN6QWtNpH6qqqEZdatIshLodQx67in2HIOCITqhy1yHbSpBitiD4Lyml4XuzKCqtIfmK-ATa3_WG7WpVPHGBCZksEuBzmPMejSmV7WmovzDbY12VmoxiRAnxfA0NSX6vCEHKJPaOh72G0JbjKIUxwgomc0hKoyjGJy1YpJroIgl9MqAzsH137153yxmiYoDNGn0siY0Wk7xPzo3-CB3RyFkw2q7qfH862lwjwPwxpw-rV-T03hwA3cxm0FuXgrTvGGzs-Gsw3MFO3f7ar-g0SU2JdvYyqSuhtpTkdqBzQycWOSQc0Jzt54Ns31I7UNHPZfH09OOAv6S2the6tRqt3b21uSS4RmS2p0FsqHphHJdprtBqIhy4Yij30759_oSiIByQUQm-kYFIAz9gfc7lfPOLVNLbq0xQDLrSXiN3f1O7VNLuVsaZaD5-Y50nUa92kS9dYIoXHHvwL2YznyoXU29EijcrlO50zCVbBdII8jC5_SkWFVHAUcPAt8iNwjACfQdZwpG8dBJMYnTceY6vPEzSEuwUQMfTm0Pvnb5eBM-Gdls70K-7lDUKbW9Q2QSppzhsMOVvy4ETjg5Wm4FdCvQwUpQqtQsU8X6b-SLSqJCA_0-0iozhi5XhTO6-86JGDT1mgS4UHlqIAbjZuMqAbAmt1QFZuGI095uIi3uudy_6vtwrqsnEF_XNMU-zSjPAloRD68caJTrBUj5S0krnqNfmNKRSdKVZoD0JO4kfwOQ1mDBMOmcBFnGs1JFmgg5MLaHZIRvpbEYJ-BJmyv1kwcuU-BikpyBn11jtWXEld3fB0iik3S48L5VzxXLZbNWsiGLFaSkS0ZkFD87F-teKyDSdMKUz4luYn9AFHntLHvQEbtI3fOfcTTsGjydRqPWBPwtuyK6w-3qVb4iLe0VOD1TqqN2MZVuvFmlut47PTw-Pm2VH99KJx3DivX9SshdU6aR6enh2d1uvN5vlJ_aJ5-laz_ogPrR-eN2G9Xm-cHB_Vj85PTmoWXJJhqLlZfjqMvyC-_QfcXDWS)

```mermaid
erDiagram

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

    SKILL {
        text id PK
        text name
        text category
    }

    FREELANCER_PROFILE {
        text id PK
        text user_id FK
        text bio
        text category
        numeric hourly_rate
        text country
        text linkedin_url
        text github_url
        text website_url
        timestamp created_at
        timestamp updated_at
    }

    CONTRACTOR_PROFILE {
        text id PK
        text user_id FK
        text company_name
        text bio
        text country
        text website_url
        timestamp created_at
        timestamp updated_at
    }

    FREELANCER_EXPERIENCE {
        text id PK
        text freelancer_id FK
        text title
        text company
        text description
        date start_date
        date end_date
    }

    FREELANCER_CERTIFICATION {
        text id PK
        text freelancer_id FK
        text name
        text institution
        date issued_date
        text url
    }

    FEATURED_PROJECT {
        text id PK
        text freelancer_id FK
        text title
        text description
        text image_url
        text project_url
        timestamp created_at
    }

    PROJECT {
        text id PK
        text contractor_id FK
        text title
        text description
        text budget_type
        numeric budget_min
        numeric budget_max
        text status
        timestamp created_at
        timestamp updated_at
    }

    PROPOSAL {
        text id PK
        text project_id FK
        text freelancer_id FK
        text cover_letter
        numeric bid_amount
        text bid_type
        text status
        timestamp created_at
        timestamp updated_at
    }

    CONTRACT {
        text id PK
        text proposal_id FK
        text project_id FK
        text contractor_id FK
        text freelancer_id FK
        numeric agreed_amount
        text status
        timestamp started_at
        timestamp completed_at
    }

    REVIEW {
        text id PK
        text contract_id FK
        text reviewer_id FK
        text reviewee_id FK
        text reviewee_role
        numeric rating
        text comment
        timestamp created_at
    }

    CONVERSATION {
        text id PK
        text project_id FK
        text participant_a_id FK
        text participant_b_id FK
        timestamp created_at
        timestamp updated_at
    }

    MESSAGE {
        text id PK
        text conversation_id FK
        text sender_id FK
        text content
        boolean is_read
        timestamp created_at
    }

    %% Auth
    USER ||--o{ ACCOUNT : "1:N"
    USER ||--o{ SESSION : "1:N"

    %% Perfiles (1:1 opcional — un user puede tener ambos)
    USER ||--o| FREELANCER_PROFILE : "tiene (opcional)"
    USER ||--o| CONTRACTOR_PROFILE : "tiene (opcional)"

    %% Skills N:M
    %% Las tablas pivot freelancer_skill y project_skill existen en la DB
    %% pero no se muestran como entidad — }o--o{ las representa implícitamente
    FREELANCER_PROFILE }o--o{ SKILL : "freelancer_skill"
    PROJECT }o--o{ SKILL : "project_skill"

    %% Sub-entidades del freelancer
    FREELANCER_PROFILE ||--o{ FREELANCER_EXPERIENCE : "tiene"
    FREELANCER_PROFILE ||--o{ FREELANCER_CERTIFICATION : "tiene"
    FREELANCER_PROFILE ||--o{ FEATURED_PROJECT : "tiene"

    %% Flujo principal de negocio
    CONTRACTOR_PROFILE ||--o{ PROJECT : "publica"
    PROJECT ||--o{ PROPOSAL : "recibe"
    FREELANCER_PROFILE ||--o{ PROPOSAL : "hace"
    PROPOSAL ||--o| CONTRACT : "genera"
    CONTRACT ||--o{ REVIEW : "genera"

    %% Chat (mensajes enviados por USER, sin importar su rol activo)
    USER ||--o{ CONVERSATION : "participa"
    CONVERSATION ||--o{ MESSAGE : "tiene"
    PROJECT |o--o{ CONVERSATION : "contexto (opcional)"
```
