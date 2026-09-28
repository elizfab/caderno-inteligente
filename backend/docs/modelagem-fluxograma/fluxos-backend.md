# Fluxos do Backend

Fluxos reais (implementados) e planejados (marcados). Diagramas em Mermaid.

## 1. Autenticação — Login (implementado)

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant MW as Middleware (CORS/Auth)
    participant H as AuthHandler
    participant UC as AuthUseCase
    participant R as UserRepository
    participant DB as MongoDB

    FE->>MW: POST /api/v1/auth/login {email,password}
    Note over MW: rota pública (passa direto)
    MW->>H: request
    H->>UC: Login(email,password)
    UC->>R: GetByEmail(email)
    R->>DB: find {email}
    DB-->>R: user | not found
    alt não encontrado ou senha inválida
        UC-->>H: ErrInvalidCredentials
        H-->>FE: 401 {success:false,error}
    else válido
        UC->>UC: bcrypt.CompareHashAndPassword
        UC->>UC: token.Generate(HS256, 24h)
        UC-->>H: {token,expiresAt,user}
        H-->>FE: 200 {success:true,data}
    end
```

## 2. Requisição autenticada a rota protegida (implementado)

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant MW as Auth Middleware
    participant H as Handler
    FE->>MW: GET /api/v1/... (Authorization: Bearer jwt)
    MW->>MW: token.Validate(secret)
    alt token ausente/inválido/expirado
        MW-->>FE: 401 {success:false,error}
    else válido
        MW->>H: segue para o recurso
        H-->>FE: 200 {success:true,data}
    end
```

## 3. Seed do administrador (implementado)

```mermaid
flowchart TD
    A["main(): SeedDefaultUser(name,email,pass)"] --> B{"users.Count() == 0 ?"}
    B -- não --> C["não faz nada (idempotente)"]
    B -- sim --> D["bcrypt hash da senha (env ADMIN_PASSWORD)"]
    D --> E["users.Create(admin)"]
    E --> F["admin disponível para login"]
```

## 4. CRUD genérico de recurso (implementado — ex.: study_items)

```mermaid
flowchart LR
    H["Handler"] --> UC["UseCase (valida + timestamps)"]
    UC --> RI["Repository (interface)"]
    RI --> MG["baseRepository[T] (Mongo)"]
    MG --> DB[("MongoDB")]
    MG -->|ErrNotFound/ErrDuplicate/ErrInvalidID| UC
    UC -->|ErrValidation| H
    H -->|helpers: erro→status| RESP["{success,data|error}"]
```

## 5. Cadastro de usuário (implementado)

```mermaid
sequenceDiagram
    participant FE
    participant H as AuthHandler
    participant UC as AuthUseCase
    participant R as UserRepository
    FE->>H: POST /api/v1/auth/register {name,email,phone,password,avatar}
    H->>UC: Register(input)
    UC->>UC: validar (email, força de senha, avatar)
    UC->>R: GetByEmail(email)
    alt já existe
        UC-->>H: ErrDuplicate → 409
    else novo
        UC->>UC: bcrypt(senha), status=pending, role=user
        UC->>R: Create(user)
        UC-->>H: 201 {user pendente}
    end
```

## 6. Fluxo de aprovação de usuário (implementado, exceto envio de e-mail)

```mermaid
stateDiagram-v2
    [*] --> Pending: cadastro
    Pending --> Active: admin aprova (+ e-mail, + auditoria)
    Pending --> Blocked: admin reprova/bloqueia
    Active --> Blocked: admin bloqueia
    Blocked --> Active: admin desbloqueia
    Active --> [*]: exclusão (admin)
    note right of Pending
        Login com status=Pending →
        "Aguardando aprovação do administrador"
    end note
```

## 7. Login com Google OAuth (planejado / bloqueado por credenciais)

```mermaid
sequenceDiagram
    participant FE
    participant G as Google OAuth
    participant H as AuthHandler
    participant R as UserRepository
    FE->>G: consentimento (Client ID)
    G-->>FE: id_token
    FE->>H: POST /api/v1/auth/google {id_token}
    H->>G: validar id_token (chaves públicas Google)
    alt usuário não existe
        H->>R: Create(user via Google: nome,email,foto,googleId)
    else existe
        H->>R: GetByEmail / vincular googleId
    end
    H-->>FE: JWT do sistema (respeitando status de aprovação)
```

Requisitos externos: `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (env). Registrado
como pendência — ver `docs/swagger-openapi.md` e a doc do módulo de identidade.
