# .agents — Instruções operacionais para agentes de IA (Backend)

Este arquivo é o **contrato operacional** para qualquer agente de IA (ou pessoa)
que for editar o backend do **Caderno Inteligente**. Leia por completo antes de
qualquer alteração. Ele complementa `app/PADROES.md` e a documentação em `docs/`.

> Regra de ouro: **não regredir**. Reutilize o que já existe. Não invente
> estruturas, rotas, entidades ou dependências sem registrar como nova
> implementação na documentação.

---

## 1. Contexto do projeto

- **Produto:** Caderno Inteligente — painel pessoal de estudos, projetos, quiz e culinária.
- **Repositório:** `https://github.com/elizabetefabri/tech-book-backend`
- **Responsabilidade do backend:** API REST que serve o frontend Angular
  (`../frontend`), com persistência em MongoDB e autenticação JWT.
- **Contrato de resposta:** todo endpoint `/api/v1/*` responde no envelope
  `{ "success": bool, "data": ..., "error": string }`. Exceção: `GET /health`.

## 2. Arquitetura (Clean Architecture)

```
entity (domínio) → repository (interface) → repository/mongodb (implementação)
      → usecase (regras de negócio) → handler (HTTP) → cmd/server/main.go (wire)
```

Direção da dependência: **de fora para dentro**. `handler` conhece `usecase`;
`usecase` conhece as **interfaces** de `repository` (nunca a implementação Mongo);
`entity` não importa nada do projeto. Fonte de verdade: `app/PADROES.md`.

## 3. Stack e versões obrigatórias

- **Go 1.25** (`app/go.mod`, `app/Dockerfile`).
- **MongoDB 7.0**, driver `go.mongodb.org/mongo-driver v1.15.0`.
- **net/http** puro (pattern matching nativo — sem framework web).
- **JWT HS256** próprio em `pkg/token` (stdlib, sem lib externa).
- **bcrypt** (`golang.org/x/crypto/bcrypt`) para senhas.

Não adicione framework web, ORM ou lib de JWT externa sem uma ADR aprovada
(ver `docs/BMAD/bmad-governanca.md`).

## 4. Convenções de nomenclatura

- Pacotes em minúsculo, sem underscore (`usecase`, `mongodb`).
- Arquivos: `snake_case.go` (`auth_usecase.go`, `user_repository.go`).
- Tipos exportados em `PascalCase`; erros de domínio começam com `Err`.
- Um recurso = um arquivo por camada (`*_repository.go`, `*_usecase.go`, `*_handler.go`).
- Collections MongoDB em `snake_case` plural (`course_sections`, `study_items`).
- Campos JSON em `camelCase`; campos BSON espelham o JSON.

## 5. Checklist ANTES de editar

1. Rodei `git status` e sei o que está pendente.
2. Li `app/PADROES.md` e a doc do recurso afetado em `docs/`.
3. Confirmei que **não existe** já um service/repo/entity que resolva isso (evitar duplicação).
4. Entendi o contrato consumido pelo frontend (ver `../frontend/docs/INTEGRACAO-BACKEND.md`).
5. Se a mudança altera contrato de API ou schema, li a política das seções 8 e 9.

## 6. Checklist DEPOIS de editar

1. `go build ./...` compila.
2. `go vet ./...` sem alertas novos.
3. `go test ./...` passa (adicionei/atualizei testes quando aplicável).
4. `go mod tidy` não deixou o `go.mod`/`go.sum` sujos.
5. Envelope de resposta e status HTTP corretos (400/401/403/404/409/500).
6. Índices/collections novos refletidos em `docker/mongo-init.js`.
7. Atualizei a documentação impactada (`docs/` e READMEs).
8. Nenhum segredo no código — apenas `.env`/`.env.example`.

## 7. Regras de testes

- Teste de referência: `pkg/token/token_test.go`. Rode com `make test`.
- Regras de negócio (usecase) devem ter teste unitário com repositório fake.
- Não marque um teste como "implementado" na doc sem execução real comprovada.
- Cobertura: `make test-cover` gera `coverage.html`.

## 8. Política contra regressões e de alteração de contratos

- **Nunca remova nem renomeie** um campo de resposta consumido pelo frontend sem
  atualizar o frontend na mesma entrega e registrar em `docs/`.
- Campos novos são **aditivos** (compatíveis). Mudanças que quebram → nova versão
  de rota (`/api/v2/...`) ou flag, documentada como breaking change.
- Campos imutáveis em update (`slug`, `createdAt`, FKs) permanecem fora do `$set`.

## 9. Política de migrations e versionamento

- Schema é aplicado por `docker/mongo-init.js` (índices/collections) — só roda na
  primeira subida do volume. Alterações de índice em base existente devem ser
  descritas em `docs/plano-testes-futuros.md`/runbook e aplicadas manualmente.
- Versionamento semântico da API por prefixo (`/api/v1`). Commits seguem
  Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).

## 10. Regras de segurança

- Segredos só via env (`JWT_SECRET`, `ADMIN_*`). `JWT_SECRET` é obrigatório em produção.
- Senhas sempre com bcrypt; nunca logar senha, hash ou token.
- Toda rota `/api/v1/*` é protegida por padrão pelo middleware `Auth`; públicas
  apenas `/health` e `/api/v1/auth/*`.
- Restringir CORS ao domínio real do frontend antes de produção
  (`internal/middleware/cors.go`).

## 11. Integração frontend ↔ backend

- Mudou contrato aqui? Atualize o espelho em `../frontend/src/app/shared/types/`
  e o service correspondente, e valide o fluxo ponta a ponta.
- Portas padrão: API `8080`, frontend dev `6001`. Ver `../frontend/docs/INTEGRACAO-BACKEND.md`.

## 12. Como escolher o agente certo

Veja `agentes/` e `docs/BMAD/bmad-agentes.md`. Cada agente tem escopo e limites.
Em dúvida que envolva perda de dados, quebra de contrato ou decisão arquitetural:
**pare e pergunte** (regra herdada do prompt de governança do projeto).
