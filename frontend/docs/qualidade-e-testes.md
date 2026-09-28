# Qualidade e Testes — Frontend (estado atual)

Mapa do que **realmente existe hoje**, verificado nos arquivos e no `package.json`.
Não afirmamos que uma ferramenta está implementada sem evidência real.

## Resumo

- **Framework de testes:** Jest 30 (Vitest removido). App zoneless (`src/setup-jest.ts`).
- **Specs existentes:** 49 arquivos `*.spec.ts` — cobrindo services, guards, interceptors,
  pages e componentes (inclui auth, user, theme, admin de usuários, perfil e cadastro).
- **Formatação:** Prettier (`.prettierrc`).
- **Build:** Angular 21 (`ng build`, com SSR).
- **Lint (ESLint):** não configurado (sem `eslint.config.*` nem script `lint`).

## Tabela de status (implementado)

| Item | Status | Evidência | Arquivo/Comando | Pendência | Prioridade |
|---|---|---|---|---|---|
| Testes unitários (Jest) | Implementado | 49 specs | `npm test` | Aprofundar asserções de comportamento | Média |
| Setup zoneless de testes | Implementado | `setupZonelessTestEnv()` | `src/setup-jest.ts` | — | — |
| Cobertura | Parcial | script existe | `npm run test:coverage` | Meta e relatório não definidos | Média |
| Formatação | Implementado | `.prettierrc` | `npx prettier --check .` | Sem script dedicado no package.json | Baixa |
| Build | Implementado | Angular CLI | `npm run build` | — | — |
| Lint (ESLint) | Não implementado | sem config | — | Adicionar `@angular-eslint` | Alta |
| Testes E2E | Não implementado | sem Cypress/Playwright | — | Escolher ferramenta | Alta |
| Testes de contrato | Não implementado | — | — | Validar DTOs vs backend | Média |
| Testes de acessibilidade | Não implementado | — | — | axe/pa11y | Média |
| Testes de performance | Não implementado | — | — | Lighthouse/Web Vitals | Média |
| Análise de segurança (deps) | Não implementado | — | `npm audit` (manual) | Automatizar | Média |

## Specs existentes (amostra)

Services: `course-section.service`, `project.service`, `health.service`,
`breadcrumb.service`. Pages: `login`, `logout`, `dashboard`, `culinaria`,
`settings`, `projetos*`, `estudos-labs`, `painel-financeiro`, `vida-criativa`.
Componentes: `back-button`, `breadcrumbs`, `footer`, `header`, `project-card-grid`.

## Como executar

```bash
npm install
npm test                 # Jest
npm run test:watch       # Jest em watch
npm run test:coverage    # cobertura
npm run build            # build de produção (SSR)
npx prettier --check .   # formatação
```

O plano de evolução (E2E, lint, contrato, a11y, performance, segurança) está em
`plano-testes-futuros.md`.
