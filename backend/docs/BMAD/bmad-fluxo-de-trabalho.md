# BMAD — Fluxo de Trabalho (Backend)

Fluxo recomendado para qualquer mudança no backend, do pedido ao merge.

## 1. Enquadrar

- Ler o pedido e o `git status`.
- Consultar `.agents/README.md` (regras) e a doc do recurso afetado.
- Escolher o(s) agente(s) — ver `bmad-agentes.md`.

## 2. Planejar

- Confirmar reuso: já existe entity/repo/usecase/handler que resolve?
- Se muda contrato de API ou schema → aplicar políticas das seções 8–9 do
  `.agents/README.md` e avisar o frontend.
- Decisão arquitetural relevante → abrir ADR (`bmad-governanca.md`).

## 3. Implementar (ordem por camada)

```
entity → repository (interface) → repository/mongodb (usar baseRepository)
      → usecase (validação + timestamps) → handler (RegisterRoutes)
      → registrar no cmd/server/main.go → índice em docker/mongo-init.js
```

## 4. Validar

```bash
go build ./...
go vet ./...
go test ./...
go mod tidy      # go.mod/go.sum limpos
# Docker (quando aplicável)
docker compose config && docker compose build
```

## 5. Documentar

- Atualizar `docs/` e READMEs impactados.
- Registrar pendências (ex.: OAuth, e-mail, CI) nos docs de plano.

## 6. Revisar e fechar

- Passar o checklist do agente **revisao-codigo**.
- Commit em Conventional Commits (`feat:`, `fix:`, `docs:`, ...).

## Fluxo para uma feature típica (ex.: aprovação de usuário)

1. **arquitetura-backend** — onde encaixa (novo campo em User? novo usecase?).
2. **banco-de-dados** — status/role em `users`, índices, `mongo-init.js`.
3. **autenticacao-autorizacao** — regra de status/role, autorização admin.
4. **api-rest** — endpoints de aprovar/reprovar/bloquear + status HTTP.
5. **seguranca** — só admin executa; sem vazamento de dado sensível.
6. **testes-unitarios** — casos de usecase.
7. **documentacao** + **revisao-codigo** — fechar.
