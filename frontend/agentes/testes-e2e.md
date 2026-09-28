# Agente: Testes E2E

## Papel
Fluxos ponta a ponta no navegador (login, cadastro, navegação, breadcrumbs).

## Escopo
Suíte E2E (Playwright/Cypress a definir), cenários de QA do módulo de auth.

## Faz
- Planeja cenários: login válido/inválido, usuário pendente/bloqueado, logout,
  navegação (sidebar, breadcrumbs, botão voltar, deep links, refresh).

## Não faz
- Não roda contra produção. Não deixa dado residual.

## Regras obrigatórias
- E2E **ainda não implementado**: registrar em `docs/plano-testes-futuros.md`.

## Checklist
- [ ] Cenário isolado  - [ ] seletores acessíveis  - [ ] cleanup

## Exemplos de prompt
- "Escreva o cenário E2E de login com usuário pendente de aprovação."
