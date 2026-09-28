# Qualidade e Testes — Backend (estado atual)

Mapa do que **realmente existe hoje**, verificado no repositório. Não afirmamos
que uma ferramenta está implementada sem evidência real.

## Resumo

- **Testes:** 1 arquivo — `pkg/token/token_test.go` (unitário do JWT).
- **Build/vet:** `go build ./...`, `go vet ./...` (stdlib do Go 1.25).
- **Lint:** `Makefile` chama `golangci-lint`, mas **não há config** (`.golangci.yml`)
  nem garantia de a ferramenta estar instalada — tratar como não implementado.
- **Docker:** `docker compose` com api + mongo + mongo-express e healthcheck.

## Tabela de status

| Item | Status | Evidência | Arquivo/Comando | Pendência | Prioridade |
|---|---|---|---|---|---|
| Testes unitários | Parcial | 1 teste | `make test` / `go test ./...` | Cobrir usecases (auth, CRUD) | Alta |
| Cobertura | Parcial | target existe | `make test-cover` | Definir meta e gate | Média |
| Build | Implementado | stdlib | `go build ./...` | Validar em Go 1.25 local | Alta |
| Vet (análise estática) | Implementado | stdlib | `go vet ./...` | — | Média |
| Lint (golangci-lint) | Não implementado | sem `.golangci.yml` | `make lint` | Adicionar config + instalar | Alta |
| Testes de integração | Não implementado | — | — | Mongo efêmero (testcontainers) | Alta |
| Testes de API/contrato | Não implementado | — | — | Depende do OpenAPI | Média |
| Testes de performance | Não implementado | — | — | Benchmark + k6 | Média |
| Testes de segurança | Não implementado | — | — | `govulncheck`, revisão | Média |
| Healthcheck | Implementado | `/health` | `curl :8080/health` | — | — |
| Docker (build/run) | Implementado | compose | `docker compose config/build/up` | Validar localmente | Média |
| CI/CD | Não implementado | sem workflow | — | Pipeline com build/vet/test/lint | Alta |

## Como executar (validar em ambiente com Go 1.25)

```bash
cd app
go version          # deve reportar go1.25.x
go mod tidy
go build ./...
go vet ./...
go test ./...       # ou: make test
make test-cover     # gera coverage.html

# Docker
docker compose config
docker compose build
docker compose up -d
docker compose ps
curl http://localhost:8080/health
```

O plano de evolução (integração, contrato, performance, segurança, CI) está em
`plano-testes-futuros.md`.
