# Caderno Inteligente — Frontend

<p align="left">
  <img alt="Angular" src="https://img.shields.io/badge/Angular_21-DD0031?style=for-the-badge&logo=angular&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript_5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img alt="PrimeNG" src="https://img.shields.io/badge/PrimeNG_21-06B6D4?style=for-the-badge">
  <img alt="Jest" src="https://img.shields.io/badge/Jest_30-C21325?style=for-the-badge&logo=jest&logoColor=white">
</p>

Interface web do **Caderno Inteligente** — painel pessoal de estudos, projetos,
quiz e culinária. SPA Angular que consome a API Go em [`../backend`](../backend).

## Visão geral

- Navegação por módulos (dashboard, estudos & labs, projetos, culinária, espaço criativo).
- Autenticação com JWT (login/logout, guarda de rotas, interceptor).
- UI padronizada com PrimeNG (tema Aura) e ícones Lucide.
- Acessibilidade e responsividade como requisitos.

> Documentação detalhada em [`docs/`](docs/): padrões implementados
> ([IMPLEMENTACOES.md](docs/IMPLEMENTACOES.md)), integração com o backend
> ([INTEGRACAO-BACKEND.md](docs/INTEGRACAO-BACKEND.md)), módulo de identidade e
> acesso, BMAD ([docs/BMAD/](docs/BMAD/)) e mapa de testes.

## Stack

| Tecnologia                             | Uso                                         |
| -------------------------------------- | ------------------------------------------- |
| Angular 21 (standalone, zoneless, SSR) | Framework                                   |
| TypeScript 5.9                         | Linguagem                                   |
| SCSS                                   | Estilização                                 |
| PrimeNG 21 (tema Aura)                 | Componentes de UI                           |
| Lucide (`@lucide/angular`)             | Ícones (`<app-icon>`) — primeicons removido |
| NgRx 21                                | Estado global (quando necessário)           |
| Jest 30                                | Testes unitários (zoneless)                 |
| Prettier                               | Formatação                                  |

## Requisitos

- **Node.js 22** (ver [`.nvmrc`](.nvmrc)) — `nvm use`
- **npm 10+**
- Angular CLI 21 (via `npx ng`, não precisa global)
- Backend rodando em `http://localhost:8080` (ver [`../backend`](../backend))

## Como clonar e instalar

```bash
git clone https://github.com/elizabetefabri/tech-book-frontend.git frontend
cd frontend
nvm use            # usa Node 22 (.nvmrc)
npm install
```

## Como executar

```bash
npm start          # ng serve --port 6002  → http://localhost:6002
# ou
npm run start:dev  # mesmo comando (porta 6002)
```

Executar em outra porta:

```bash
npx ng serve --port 4300
```

## Build

```bash
npm run build          # build de produção (inclui SSR)
npm run watch          # build incremental (configuration development)
npm run serve:ssr:frontend   # serve o bundle SSR gerado em dist/
```

## Testes e formatação

```bash
npm test               # Jest
npm run test:watch     # Jest em watch
npm run test:coverage  # cobertura
npx prettier --check . # verifica formatação
npx prettier --write . # aplica formatação
```

> **Lint (ESLint) ainda não está configurado** — ver [docs/plano-testes-futuros.md](docs/plano-testes-futuros.md).
> Não documentamos `npm run lint` porque o script não existe hoje.

## Variáveis de ambiente

A URL da API vive em `src/environments/`:

```ts
// src/environments/environment.ts (dev)
export const environment = { production: false, apiUrl: 'http://localhost:8080' };
```

`environment.prod.ts` é usado no build de produção (troca automática via
`fileReplacements` do `angular.json`). Ajuste `apiUrl` para a URL real do backend.

## Estrutura de pastas (real)

```
src/app/
├── core/          # singletons: services, guards, interceptors, constants
│   ├── guards/            # auth.guard.ts
│   ├── interceptors/      # auth-interceptor.ts, api-error-interceptor.ts
│   └── services/          # auth, api, course, content, project, health, ...
├── pages/         # 1 pasta por rota (dashboard, login, logout, study-labs, ...)
├── shared/        # components (icon, header, sidebar, footer, breadcrumbs, ...),
│                  # icons/ (registry Lucide), styles/ (SCSS), types/ (DTOs)
└── environment/   # environment.ts / environment.prod.ts

.agents/           # instruções operacionais para agentes de IA
agentes/           # agentes especializados (BMAD)
docs/              # documentação (IMPLEMENTACOES, INTEGRACAO-BACKEND, BMAD, testes)
```

## Scripts disponíveis (package.json)

`ng`, `start`, `start:dev`, `build`, `watch`, `test`, `test:watch`,
`test:coverage`, `serve:ssr:frontend`.

## Integração com o backend

`HttpClient` + `environments/` + `ApiService` genérico consomem o envelope
`{ success, data, error }` da API. Portas: frontend `6002`, backend `8080`.
Passo a passo, CORS e troubleshooting em
[docs/INTEGRACAO-BACKEND.md](docs/INTEGRACAO-BACKEND.md).

## Padrões de UI (resumo)

- Ícones via `<app-icon name="..." />` (Lucide). **Nunca** `pi pi-*` nem `icon=` do PrimeNG.
- Modais `p-dialog styleClass="studyModal"`; selects `p-select`; tabelas `p-table`.
- Botões de cadastro via `HeaderActionsService` (registrar no init, `clear()` no destroy).
- Detalhes e demais convenções: [docs/IMPLEMENTACOES.md](docs/IMPLEMENTACOES.md).

## Acessibilidade

- Botão com ícone tem texto ou `aria-label`; ícone decorativo tem `aria-hidden`.
- Inputs com `label`; foco de teclado visível; contraste adequado.
- `button` para ações, `a` para navegação; navegação por teclado em modais.

## Governança e contribuição

- Branch principal de trabalho: `develop`; integração via Pull Request com revisão.
- Commits em Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
- Regras para agentes de IA e políticas anti-regressão: [`.agents/README.md`](.agents/README.md)
  e [docs/BMAD/](docs/BMAD/).

## Comandos Git principais

```bash
git status
git checkout -b feat/minha-mudanca
git add -A && git commit -m "feat: descrição"
git push -u origin feat/minha-mudanca
```

## Solução de problemas

| Sintoma                             | Causa provável      | Solução                                                   |
| ----------------------------------- | ------------------- | --------------------------------------------------------- |
| "Backend indisponível" no dashboard | Backend fora do ar  | Suba o backend e teste `curl :8080/health`                |
| `ERR_CONNECTION_REFUSED`            | Porta divergente    | `environment.apiUrl` deve bater com `API_PORT` do backend |
| Erro de CORS                        | Origem não liberada | Ver `internal/middleware/cors.go` no backend              |
| Estilos/botões quebrados            | Tema não carregado  | Confirmar `providePrimeNG({ theme: { preset: Aura } })`   |

## Documentação relacionada

- [docs/IMPLEMENTACOES.md](docs/IMPLEMENTACOES.md) — padrões implementados.
- [docs/INTEGRACAO-BACKEND.md](docs/INTEGRACAO-BACKEND.md) — integração com a API.
- [docs/autenticacao-autorizacao-usuarios.md](docs/autenticacao-autorizacao-usuarios.md) — módulo de identidade e acesso.
- [docs/qualidade-e-testes.md](docs/qualidade-e-testes.md) e [docs/plano-testes-futuros.md](docs/plano-testes-futuros.md).
- [docs/BMAD/](docs/BMAD/) — governança por agentes.
