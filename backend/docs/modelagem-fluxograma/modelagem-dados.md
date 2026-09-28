# Modelagem de Dados — Backend (MongoDB)

Documento gerado a partir do código real (`internal/domain/entity/*`,
`internal/repository/mongodb/*`, `docker/mongo-init.js`). Campos marcados como
**(planejado)** ainda não existem no código — são a extensão prevista pelo módulo
de identidade/acesso e estão registrados como pendência.

Convenções: `_id` é `ObjectID`. JSON em `camelCase`; BSON espelha o JSON.
`createdAt`/`updatedAt` preenchidos no usecase. Campos imutáveis não entram no `$set`.

---

## Collection `users`

| Campo | Tipo | Índice/Constraint | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `name` | string | | obrigatório |
| `email` | string | **único** (`email:1`) | normalizado lowercase/trim |
| `passwordHash` | string | | bcrypt; `json:"-"` (nunca serializado) |
| `createdAt` | date | | |
| `updatedAt` | date | | |
| `phone` | string | | com máscara/validação no frontend |
| `avatarUrl` | string | | avatar (data URL / base64 no cadastro) |
| `role` | string | **índice** (`role:1`) | `admin` \| `user` |
| `status` | string | **índice** (`status:1`) | `pending` \| `active` \| `blocked` |
| `provider` | string | | `local` \| `google` (origem do login) |
| `lastLoginAt` | date | | último acesso (atualizado no login) |
| `googleId` | string | (planejado, único esparso) | login com Google OAuth (pendente) |

> **Status:** todos os campos acima (exceto `googleId`) estão **implementados**.
> `phone`, `avatarUrl`, `role`, `status`, `provider`, `lastLoginAt` fazem parte da
> entidade `entity.User` e são persistidos.

Seed: garante o admin configurado (role=admin, status=active) a partir de
`ADMIN_NAME/EMAIL/PASSWORD` (env; nunca hardcoded). Idempotente: se o e-mail já
existe, apenas ajusta role/status.

## Collection `course_sections` (áreas de estudo)

| Campo | Tipo | Índice | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `slug` | string | **único** | imutável em update |
| `name`, `description`, `bannerColor`, `iconClass` | string | | |
| `imageUrl` | string | | opcional |
| `active` | bool | | |
| `order` | int | `order:1` | ordenação |
| `createdAt`/`updatedAt` | date | | |

## Collection `course_topics` (tópicos)

| Campo | Tipo | Índice | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `sectionSlug` | string | **único composto** (`sectionSlug:1, slug:1`) | FK lógica → `course_sections.slug` |
| `slug` | string | (composto acima) | imutável |
| `label`, `description`, `bannerColor`, `iconClass`, `skill` | string | | |
| `imageUrl` | string | | opcional |
| `active` | bool | | |
| `order` | int | `order:1` | |
| `createdAt`/`updatedAt` | date | | |

## Collection `study_items`

| Campo | Tipo | Índice | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `section` | string | `section:1, topic:1` | FK lógica → área |
| `topic` | string | (composto acima) | FK lógica → tópico |
| `courseName`, `status`, `date`, `url`, `imageUrl` | string | | |
| `createdAt` | date | `createdAt:-1` | |
| `updatedAt` | date | | |
| `detailRoute` | string | `bson:"-"` | derivado, não persiste |

## Collection `study_notes`

| Campo | Tipo | Índice | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `studyItemId` | ObjectID | `studyItemId:1` | FK → `study_items._id` |
| `date`, `title`, `description`, `status`, `type`, `link` | string | | |
| `progress` | int | | 0–100 |
| `createdAt`/`updatedAt` | date | | |

## Collection `study_resources`

| Campo | Tipo | Índice | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `studyItemId` | ObjectID | `studyItemId:1` | FK → `study_items._id` |
| `title`, `url`, `type`, `description`, `source`, `priority`, `resourceStatus` | string | | |
| `createdAt`/`updatedAt` | date | | |

## Collection `study_sessions`

| Campo | Tipo | Índice | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `studyItemId` | ObjectID | `studyItemId:1` | FK → `study_items._id` |
| `startedAt`, `endedAt`, `topic`, `notes`, `focus` | string | | |
| `durationSeconds`, `rating`, `milestonesCompleted` | int | | |
| `createdAt` | date | | (sem `updatedAt`; sessão é imutável) |

## Collection `projects`

| Campo | Tipo | Índice | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `type` | string | `type:1, order:1` | `pessoal` \| `profissional` |
| `name`, `description`, `slug`, `bannerColor`, `repoUrl`, `deployUrl`, `imageUrl`, `imageAlt`, `detailRoute` | string | | |
| `tags` | []string | | |
| `active` | bool | | |
| `order` | int | (composto acima) | |
| `createdAt`/`updatedAt` | date | | |

## Collection `culinary_categories`

| Campo | Tipo | Índice | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `slug` | string | **único** | |
| `name`, `description`, `tag`, `color`, `icon`, `imageUrl` | string | | |
| `order` | int | | |
| `active` | bool | | |
| `createdAt`/`updatedAt` | date | | |

## Collection `culinary_recipes`

| Campo | Tipo | Índice | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `categorySlug` | string | `categorySlug:1` | FK lógica → categoria |
| `slug` | string | `slug:1` | |
| `categoryId`, `name`, `description`, `servingsStr`, `difficulty`, `status`, `imageUrl`, `youtubeUrl`, `sourceUrl`, `utensils`, `tips`, `substitutions`, `storageInstructions`, `testedAt`, `notes` | string | | |
| `prepTimeMinutes`, `cookTimeMinutes`, `personalRating` | int | | |
| `estimatedCost` | float64 | | |
| `tested`, `active` | bool | | |
| `tags`, `ingredients`, `preparationSteps` | []string | | |
| `createdAt`/`updatedAt` | date | | |

## Collection `quiz_questions`

| Campo | Tipo | Índice | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `section` | string | `section:1, topic:1` | FK lógica → área |
| `topic` | string | (composto acima) | FK lógica → tópico |
| `question`, `answer`, `explanation`, `difficulty` | string | | |
| `tags` | []string | | |
| `createdAt` | date | | (imutável) |

## Collection `audit_logs` (implementado)

| Campo | Tipo | Índice | Observações |
|---|---|---|---|
| `_id` | ObjectID | PK | |
| `userId` | string | `userId:1` | quem executou (hex do ObjectID) |
| `userEmail` | string | | e-mail do autor |
| `action` | string | | `login`/`register`/`approve_user`/`block_user`/`delete_user`/`profile_update`/`password_change`/... |
| `target` | string | | alvo da ação (ex.: e-mail do usuário afetado) |
| `ip` | string | | quando disponível |
| `createdAt` | date | `createdAt:-1` | data/hora |

> **Status: implementado.** Escrito de forma tolerante a falhas em login, cadastro,
> aprovação/bloqueio/exclusão, atualização de perfil e troca de senha. Exposto em
> `GET /api/v1/admin/audit` (somente admin).

Ver diagrama de relacionamentos em `relacionamentos-entidades.md`.
