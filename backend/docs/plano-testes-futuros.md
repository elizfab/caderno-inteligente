# Plano de Testes Futuros — Backend

Roadmap do que ainda **não** está implementado. Nada aqui é "pronto" até existir
arquivo, dependência, comando e execução real comprovada.

| Item | Status | Evidência | Arquivo/Comando (alvo) | Pendência | Prioridade |
|---|---|---|---|---|---|
| Testes unitários (usecases) | Parcial | só `pkg/token` | `internal/usecase/*_test.go` | Cobrir auth e CRUD com fakes | Alta |
| Lint (golangci-lint) | Não iniciado | sem config | `.golangci.yml` + `make lint` | Config + instalação | Alta |
| Testes de integração | Não iniciado | — | `*_test.go` com testcontainers | Mongo efêmero | Alta |
| Testes de API | Não iniciado | — | `httptest` nas rotas | Validar envelope/status | Média |
| Testes de contrato | Não iniciado | — | Spec OpenAPI vs handlers | Depende do Swagger | Média |
| Testes de performance | Não iniciado | — | `testing.B` + k6 | Metas P50/P90/P95, throughput | Média |
| Testes de segurança | Não iniciado | — | `govulncheck ./...` | Automatizar em CI | Média |
| Testes de regressão | Não iniciado | — | suíte por release | Baseline de contratos | Média |
| Testes de carga | Não iniciado | — | k6 contra `docker compose` | Ambiente dedicado | Baixa |
| Testes de concorrência | Não iniciado | — | `-race` nos testes | `go test -race ./...` | Média |
| CI/CD | Não iniciado | — | `.github/workflows/*.yml` | build/vet/test/lint/build docker | Alta |

## Cenários de referência a cobrir

- **Auth (unitário):** login válido, credenciais inválidas, usuário inexistente,
  seed idempotente; (planejado) status pendente/bloqueado, autorização admin.
- **CRUD (integração):** criar/listar/atualizar/excluir com Mongo real efêmero;
  duplicidade (409), não encontrado (404), validação (400).
- **Token:** geração, expiração, assinatura inválida (já parcialmente em `token_test.go`).

## Sequência recomendada

1. golangci-lint (config + gate) → 2. unit de usecases (auth) →
3. integração com testcontainers → 4. `-race` e `govulncheck` →
5. API/contrato (após OpenAPI) → 6. performance/carga.

## Ferramentas candidatas

- **Integração:** `github.com/testcontainers/testcontainers-go` (Mongo).
- **HTTP:** `net/http/httptest` (stdlib).
- **Segurança:** `golang.org/x/vuln/cmd/govulncheck`.
- **Carga:** k6 (script separado, fora do módulo Go).
