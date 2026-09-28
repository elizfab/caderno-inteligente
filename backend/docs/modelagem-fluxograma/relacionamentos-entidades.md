# Relacionamentos entre Entidades — Backend

Os relacionamentos são **lógicos** (referências por `slug` ou `ObjectID`), pois o
MongoDB não impõe chaves estrangeiras. A aplicação garante a consistência.

## Diagrama Entidade-Relacionamento (Mermaid)

```mermaid
erDiagram
    USERS {
        ObjectID _id PK
        string name
        string email UK
        string passwordHash
        string phone
        string avatarUrl
        string role "admin|user"
        string status "pending|active|blocked"
        string provider "local|google"
        date lastLoginAt
        string googleId "planejado (OAuth)"
    }
    COURSE_SECTIONS {
        ObjectID _id PK
        string slug UK
        string name
        int order
    }
    COURSE_TOPICS {
        ObjectID _id PK
        string sectionSlug FK
        string slug
        string label
    }
    STUDY_ITEMS {
        ObjectID _id PK
        string section FK
        string topic FK
        string courseName
        string status
    }
    STUDY_NOTES {
        ObjectID _id PK
        ObjectID studyItemId FK
        int progress
    }
    STUDY_RESOURCES {
        ObjectID _id PK
        ObjectID studyItemId FK
        string url
    }
    STUDY_SESSIONS {
        ObjectID _id PK
        ObjectID studyItemId FK
        int durationSeconds
    }
    PROJECTS {
        ObjectID _id PK
        string type
        string slug
    }
    CULINARY_CATEGORIES {
        ObjectID _id PK
        string slug UK
    }
    CULINARY_RECIPES {
        ObjectID _id PK
        string categorySlug FK
        string slug
    }
    QUIZ_QUESTIONS {
        ObjectID _id PK
        string section FK
        string topic FK
    }
    AUDIT_LOGS {
        ObjectID _id PK
        string userId "hex do ObjectID"
        string userEmail
        string action
        string target
        date createdAt
    }

    COURSE_SECTIONS ||--o{ COURSE_TOPICS : "sectionSlug → slug"
    COURSE_SECTIONS ||--o{ STUDY_ITEMS : "section"
    COURSE_TOPICS   ||--o{ STUDY_ITEMS : "topic"
    STUDY_ITEMS     ||--o{ STUDY_NOTES : "studyItemId"
    STUDY_ITEMS     ||--o{ STUDY_RESOURCES : "studyItemId"
    STUDY_ITEMS     ||--o{ STUDY_SESSIONS : "studyItemId"
    COURSE_SECTIONS ||--o{ QUIZ_QUESTIONS : "section"
    COURSE_TOPICS   ||--o{ QUIZ_QUESTIONS : "topic"
    CULINARY_CATEGORIES ||--o{ CULINARY_RECIPES : "categorySlug → slug"
    USERS ||--o{ AUDIT_LOGS : "userId"
```

## Cardinalidades

| Relação | Cardinalidade | Chave | Regra |
|---|---|---|---|
| Área → Tópicos | 1:N | `course_topics.sectionSlug` = `course_sections.slug` | tópico pertence a uma área |
| Área/Tópico → Itens de estudo | 1:N | `study_items.section`/`.topic` | item referencia área e tópico |
| Item de estudo → Notas | 1:N | `study_notes.studyItemId` | notas do item |
| Item de estudo → Recursos | 1:N | `study_resources.studyItemId` | recursos do item |
| Item de estudo → Sessões | 1:N | `study_sessions.studyItemId` | sessões registradas |
| Área/Tópico → Quiz | 1:N | `quiz_questions.section`/`.topic` | perguntas por trilha |
| Categoria → Receitas | 1:N | `culinary_recipes.categorySlug` = `culinary_categories.slug` | receita de uma categoria |
| Usuário → Audit logs | 1:N | `audit_logs.userId` | trilha de auditoria (implementado) |

## Integridade referencial (responsabilidade da aplicação)

- Ao excluir uma área/tópico/item, avaliar órfãos (hoje não há cascade automático).
- `slug` e FKs por slug são imutáveis em update (protegidos no repositório).
- Unicidade garantida por índices (`email`, `slug`, `sectionSlug+slug`).
