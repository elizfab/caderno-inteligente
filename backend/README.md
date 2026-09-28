# Caderno Inteligente — Backend

<p align="left">
  <img alt="Go" src="https://img.shields.io/badge/Go_1.25-00ADD8?style=for-the-badge&logo=go&logoColor=white">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB_7-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
</p>

API REST do **Caderno Inteligente** — estudos, projetos, quiz e culinária.
Go 1.25 com Clean Architecture, `net/http` puro (pattern matching nativo),
MongoDB e JWT HS256 próprio (stdlib, sem framework nem lib externa de JWT).

> O projeto Go vive em [`app/`](app/). Este README é a porta de entrada;
> a documentação técnica está em [`docs/`](docs/) e os padrões de código em
> [`app/PADROES.md`](app/PADROES.md).

## Visão geral

- Recursos: auth, áreas/tópicos de estudo, itens de estudo (+ notas, recursos,
  sessões), projetos, culinária (categorias/receitas) e quiz.
- Toda rota `/api/v1/*` responde no envelope `{ success, data, error }`
  (exceção: `GET /health`).
- Autenticação JWT; rotas privadas protegidas por middleware; seed idempotente de admin.

## Arquitetura

```
entity → repository (interface) → repository/mongodb → usecase → handler → main.go
```

Detalhes e diagramas em [`docs/modelagem-fluxograma/arquitetura-backend.md`](docs/modelagem-fluxograma/arquitetura-backend.md).

## Stack

- **Go 1.25** — `net/http` (sem framework)
- **MongoDB 7.0** — driver `go.mongodb.org/mongo-driver`
- **Mongo Express** — administração via web
- **Docker Compose** — orquestração local
- **bcrypt** (`golang.org/x/crypto`) — hashing de senha

## Requisitos

- **Go 1.25**
- **Git**
- **Docker** e **Docker Compose**
- (Opcional) `golangci-lint` — lint ainda sem configuração no repo
- Migrations: não há ferramenta dedicada; schema/índices via `app/docker/mongo-init.js`

## Como clonar

```bash
git clone https://github.com/elizabetefabri/tech-book-backend.git backend
cd backend/app
```

## Configuração (variáveis de ambiente)

```bash
cp .env.example .env
# Edite:
#   JWT_SECRET  → obrigatório em produção (openssl rand -hex 32)
#   ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD → admin criado no primeiro start
```

> **Nunca** faça commit do `.env` real nem de senhas. O admin é criado por **seed**
> a partir das variáveis `ADMIN_*` quando a collection `users` está vazia.

## Executar localmente (sem Docker)

```bash
cd app
go mod download
go run ./cmd/server        # ou: make run
# API em http://localhost:8080/health
```

## Executar via Docker Compose

```bash
cd app
docker compose up -d --build     # ou: make docker-up
docker compose ps
docker compose logs -f api       # ou: make docker-logs
docker compose down              # ou: make docker-down
```

Serviços:
- **API:** http://localhost:8080/health
- **Mongo Express:** http://localhost:8081 (usuário/senha do `.env`)

## Testes, build e análise

```bash
cd app
go build ./...
go vet ./...
go test ./...          # ou: make test
make test-cover         # cobertura → coverage.html
```

> **Lint:** o `Makefile` referencia `golangci-lint`, mas ainda **não há**
> `.golangci.yml`. Ver [docs/plano-testes-futuros.md](docs/plano-testes-futuros.md).

## Endpoints (resumo)

| Recurso | Rotas |
|---|---|
| Auth | `POST /api/v1/auth/login`, `POST /api/v1/auth/logout` |
| Áreas de estudo | CRUD `/api/v1/course-sections[/{id}]` |
| Tópicos | CRUD `/api/v1/course-topics[/{id}]` (`?sectionSlug=`) |
| Itens de estudo | CRUD `/api/v1/study-items[/{id}]` (`?section=&topic=`) |
| Notas / Recursos / Sessões | sob `/api/v1/study-items/{id}/...` |
| Projetos | CRUD `/api/v1/projects[/{id}]` (`?type=`) |
| Culinária | `/api/v1/culinary/categories`, `/api/v1/culinary/recipes` |
| Quiz | `/api/v1/quiz-questions` (`?section=&topic=`) |
| Health | `GET /health` (público, sem envelope) |

## Autenticação

- Login retorna JWT HS256 (expira em 24h) no envelope padrão.
- Rotas privadas exigem `Authorization: Bearer <jwt>`.
- Públicas: `/health` e `/api/v1/auth/*`.
- Healthcheck: `curl http://localhost:8080/health`.

## Estrutura de pastas

```
backend/
├── README.md                      # este arquivo
├── .agents/  agentes/             # BMAD (governança por agentes)
├── docs/                          # modelagem, fluxos, swagger, testes, BMAD
└── app/
    ├── cmd/server/main.go
    ├── config/  internal/  pkg/
    ├── docker/mongo-init.js
    ├── Dockerfile  docker-compose.yml  Makefile  .env.example
    └── PADROES.md  SETUP-NOVO-PROJETO.md
```

## Erros comuns

| Sintoma | Causa | Solução |
|---|---|---|
| Servidor não sobe em produção | `JWT_SECRET` vazio com `APP_ENV=production` | Definir `JWT_SECRET` forte |
| `MongoDB não responde` | Mongo fora do ar | `docker compose up -d mongo` e checar `docker compose ps` |
| 401 em todas as rotas | Sem `Authorization: Bearer` | Fazer login e enviar o token |
| Porta em uso | Outro serviço em 8080/27017 | Ajustar `API_PORT`/`MONGO_PORT` no `.env` |

## Documentação técnica

- [app/PADROES.md](app/PADROES.md) — padrão de código e novo recurso.
- [docs/modelagem-fluxograma/](docs/modelagem-fluxograma/) — modelagem, relacionamentos, fluxos, arquitetura.
- [docs/swagger-openapi.md](docs/swagger-openapi.md) — plano de OpenAPI (futuro).
- [docs/qualidade-e-testes.md](docs/qualidade-e-testes.md) / [docs/plano-testes-futuros.md](docs/plano-testes-futuros.md).
- [docs/BMAD/](docs/BMAD/) — governança por agentes.

## Versionamento

- API por prefixo (`/api/v1`). Commits em Conventional Commits. Go **1.25**.
