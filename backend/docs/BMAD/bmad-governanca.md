# BMAD — Governança (Backend)

Regras de decisão, mudança e qualidade que sustentam o método.

## Princípios

1. **Não regredir.** Reutilizar sempre. Toda nova estrutura é justificada e documentada.
2. **Contrato é sagrado.** API `/api/v1/*` consumida pelo frontend só muda de forma
   aditiva; breaking change exige nova versão de rota e comunicação.
3. **Sem segredos no código.** Apenas env/`.env.example`/secrets.
4. **Documentar o real.** Não descrever comando/rota/ferramenta que não exista/execute.
5. **Parar em caso de risco.** Perda de dados, breaking change ou decisão arquitetural
   relevante → interromper e perguntar.

## Política de alteração de contratos (API)

- Adição de campo → permitido (compatível).
- Remoção/renome/mudança de tipo → **breaking**: `/api/v2` + atualização do frontend
  na mesma entrega + registro em `docs/`.
- Erros mapeados para status consistentes (400/401/403/404/409/500).

## Política de migrations

- `docker/mongo-init.js` só roda na primeira subida do volume.
- Alterar índice/campo em base existente exige script idempotente + runbook + rollback.
- Nunca apagar dados sem backup documentado.

## Política de versionamento

- SemVer para a aplicação; prefixo de versão para a API (`/api/v1`).
- Conventional Commits. Tag de release quando publicar imagem.

## ADRs (Architecture Decision Records)

Decisões relevantes (nova dependência, mudança de arquitetura, troca de storage)
viram um ADR curto:

```
# ADR NNN — Título
Status: proposto | aceito | substituído
Contexto: ...
Decisão: ...
Consequências: ...
Alternativas consideradas: ...
```

Guardar em `docs/BMAD/adr/` (criar quando surgir o primeiro).

## Checklist de validação de governança

- [ ] Reuso confirmado (sem duplicação)
- [ ] Contrato preservado ou versionado
- [ ] Sem segredo versionado
- [ ] Testes e build verdes
- [ ] Documentação sincronizada
- [ ] Pendências registradas
- [ ] Commit semântico

## Pendências de governança (registrar e evoluir)

| Item | Status | Próxima ação |
|---|---|---|
| CI/CD (gates automáticos) | Não iniciado | Workflow com build/vet/test/lint |
| Rate limiting / lockout de login | Não iniciado | Definir estratégia e implementar |
| Refresh token / rotação | Não iniciado | Projetar endpoint e storage |
| Auditoria persistida | Não iniciado | Collection `audit_logs` + escrita nos usecases |
