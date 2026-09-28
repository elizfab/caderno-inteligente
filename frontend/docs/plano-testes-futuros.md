# Plano de Testes Futuros — Frontend

Roadmap do que ainda **não** está implementado. Nada aqui deve ser descrito como
pronto até existir arquivo, dependência, script e execução real.

| Item | Status | Evidência | Arquivo/Comando (alvo) | Pendência | Prioridade |
|---|---|---|---|---|---|
| Lint (ESLint) | Não iniciado | — | `eslint.config.js` + `npm run lint` | Adotar `@angular-eslint` | Alta |
| Testes E2E | Não iniciado | — | Playwright `e2e/` + `npm run e2e` | Escolher ferramenta e cobrir fluxos | Alta |
| Cobertura com meta | Parcial | script existe | `npm run test:coverage` | Definir meta (ex.: 70%) e gate | Média |
| Testes de contrato | Não iniciado | — | Validar `shared/types` vs OpenAPI do backend | Depende do Swagger do backend | Média |
| Testes de acessibilidade | Não iniciado | — | axe-core / pa11y em CI | Automatizar | Média |
| Testes de performance | Não iniciado | — | Lighthouse CI / Web Vitals | Metas P50/P90/P95 | Média |
| Testes de regressão visual | Não iniciado | — | Playwright screenshots | Baseline de telas | Baixa |
| Testes de carga (frontend) | Não iniciado | — | k6 + backend | Depende de ambiente | Baixa |
| Testes de concorrência/estado | Não iniciado | — | specs de store NgRx | Cobrir effects | Baixa |
| Análise de deps (segurança) | Não iniciado | — | `npm audit` em CI | Gate de vulnerabilidades | Média |

## Cenários de QA prioritários (a automatizar em E2E)

Alinhados ao módulo de identidade e acesso:

- **Login:** válido, inválido, usuário pendente, usuário bloqueado, token expirado,
  logout, renovação de token (quando refresh existir).
- **Cadastro:** válido, campos obrigatórios, senha fraca, e-mail duplicado,
  upload de avatar, cadastro via Google (quando OAuth existir).
- **Perfil:** alterar nome, senha, avatar; persistência.
- **Administração:** aprovar, reprovar, excluir, bloquear, pesquisa, filtros, paginação.
- **Navegação:** sidebar, breadcrumbs, botão voltar, refresh, deep links.

## Sequência recomendada

1. ESLint (base de qualidade) → 2. E2E de login/navegação → 3. Cobertura com meta
→ 4. a11y automatizada → 5. contrato (após Swagger) → 6. performance.
