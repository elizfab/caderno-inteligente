# BMAD — Governança (Frontend)

Regras de decisão, mudança e qualidade que sustentam o método no frontend.

## Princípios

1. **Não regredir.** Reutilizar componentes/services/tipos. Nova estrutura é justificada.
2. **Consistência visual e a11y** são requisitos, não opcionais.
3. **Contrato vem do backend.** O frontend espelha em `shared/types`; não inventa campo.
4. **Sem segredo versionado.** `environment.prod.ts` aponta para URL real (HTTPS).
5. **Parar em caso de risco** de regressão visual/UX ou quebra de contrato.

## Política de componentes compartilhados

- Alterar input/output público de componente em `shared/` exige atualizar todos os
  consumidores na mesma entrega.
- Novo padrão visual → extrair para `shared/components` em vez de duplicar.

## Política de contratos HTTP

- Tipo em `shared/types` deve refletir exatamente o que o backend retorna.
- Mudança de contrato só entra depois que o backend a expõe (evitar campo fantasma).

## Política de dependências e versões

- Angular 21 / PrimeNG 21 / Node 22 / Jest 30. Sem primeicons, sem Vitest.
- Atualização de major exige teste de regressão e nota no `CHANGELOG.md`.

## ADRs

Decisões relevantes (troca de lib de estado, novo padrão de UI, mudança de build)
viram ADR curto (Contexto / Decisão / Consequências / Alternativas) em
`docs/BMAD/adr/` (criar quando surgir o primeiro).

## Checklist de validação de governança

- [ ] Reuso confirmado (sem duplicação)
- [ ] Sem `pi pi-*` / `p-dropdown` / `icon=` / URL hardcoded
- [ ] a11y preservada
- [ ] Tipos espelham o backend
- [ ] `npm run build` e `npm test` verdes
- [ ] Documentação e CHANGELOG atualizados
- [ ] Commit semântico

## Pendências de governança (registrar e evoluir)

| Item | Status | Próxima ação |
|---|---|---|
| Testes E2E | Não iniciado | Escolher Playwright/Cypress e cobrir login/navegação |
| Tema claro/escuro (persistência) | Não iniciado | Theme switch com CSS variables + persistência |
| Cadastro / perfil / painel admin | Não iniciado | Implementar consumindo endpoints de auth |
| Google OAuth | Bloqueado (credenciais) | Integrar com Client ID/Secret quando disponíveis |
