# Implementações e Padrões — Caderno de Tecnologia

Documento de referência com tudo o que foi implementado/refatorado e os padrões
que devem ser seguidos daqui em diante. Vale para `tech-book-frontend` (Angular 21 +
PrimeNG 21 + Lucide) e `tech-book-backend` (Go 1.22 + MongoDB).

---

## 1. Backend (Go + MongoDB)

### 1.1 Arquitetura

Seguindo o `PADROES.md` do template (Clean Architecture):

```
entity (domínio) → repository (interface) → mongodb (implementação)
     → usecase (regras de negócio) → handler (HTTP) → main.go (wire)
```

Recursos implementados (todos com envelope `{ success, data, error }`):

| Recurso         | Rotas                                                                                      | Collection                                |
| --------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| Auth            | `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`                                      | `users`                                   |
| Áreas de estudo | CRUD `/api/v1/course-sections[/{id}]`                                                      | `course_sections`                         |
| Tópicos         | CRUD `/api/v1/course-topics[/{id}]` (filtro `?sectionSlug=`)                               | `course_topics`                           |
| Itens de estudo | CRUD `/api/v1/study-items[/{id}]` (filtros `?section=&topic=`)                             | `study_items`                             |
| Anotações       | CRUD `/api/v1/study-items/{id}/notes[/{noteId}]`                                           | `study_notes`                             |
| Recursos        | CRUD `/api/v1/study-items/{id}/resources[/{resourceId}]`                                   | `study_resources`                         |
| Sessões         | GET/POST `/api/v1/study-items/{id}/sessions`                                               | `study_sessions`                          |
| Projetos        | CRUD `/api/v1/projects[/{id}]` (filtro `?type=pessoal\|profissional`)                      | `projects`                                |
| Culinária       | CRUD `/api/v1/culinary/categories` e `/api/v1/culinary/recipes` (filtro `?category_slug=`) | `culinary_categories`, `culinary_recipes` |
| Quiz            | GET/POST/DELETE `/api/v1/quiz-questions` (filtros `?section=&topic=`)                      | `quiz_questions`                          |
| Health          | `GET /health` (público, sem envelope)                                                      | —                                         |

### 1.2 Autenticação (JWT)

- **JWT HS256 implementado em `pkg/token`** usando apenas a stdlib (sem dependência externa).
- **Senhas com bcrypt** (`golang.org/x/crypto/bcrypt`).
- **Middleware `internal/middleware/auth.go`** protege TODAS as rotas `/api/v1/*`.
  Rotas públicas: `/health` e `/api/v1/auth/*`. Token via header `Authorization: Bearer <jwt>`.
- **Seed automático**: se a collection `users` estiver vazia, é criado o usuário
  definido em `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD`
  (defaults: `admin@techbook.dev` / `admin123` — troque em produção!).
- `JWT_SECRET` é obrigatório em produção (o servidor não sobe sem ele com `APP_ENV=production`).
- Login expira em **24h** (`expiresAt` retornado no payload).
- Logout é **stateless**: o endpoint existe para simetria; o cliente descarta o token.

### 1.3 Padrões de código

- `baseRepository[T]` genérico em `internal/repository/mongodb/base.go` concentra
  list/get/insert/update/delete — repositórios novos só declaram filtros e regras próprias.
- Erros de domínio compartilhados: `ErrNotFound`, `ErrInvalidID`, `ErrDuplicate` (repository)
  e `ErrValidation`, `ErrInvalidCredentials` (usecase). O `handler/helpers.go` converte para
  status HTTP (400/401/404/409/500).
- Campos imutáveis em update (`slug`, `section`, `topic`, `studyItemId`, `createdAt`) são
  removidos do `$set` no repositório.
- Timestamps `createdAt`/`updatedAt` são preenchidos no usecase.
- Índices e collections criados em `docker/mongo-init.js` (email e slugs únicos).
- Teste unitário de referência: `pkg/token/token_test.go` (`make test`).

### 1.4 Como rodar

```bash
cd tech-book-backend/app
cp .env.example .env       # ajuste JWT_SECRET / ADMIN_*
make docker-up             # Mongo + Mongo Express + API
# ou local:
go mod tidy && make run
```

---

## 2. Frontend (Angular 21)

### 2.1 Autenticação

- `core/services/auth/auth.service.ts` — signals (`currentUser`, `isAuthenticated`),
  sessão persistida em `localStorage` (chave `techbook.session`), safe para SSR.
- `core/guards/auth.guard.ts` — `canActivateChild` no grupo de rotas privadas;
  redireciona para `/login?returnUrl=...`.
- `core/interceptors/auth-interceptor.ts` — anexa `Authorization: Bearer` e trata 401
  (limpa sessão + redireciona). Registrado ANTES do `apiErrorInterceptor`.
- Páginas `/login` e `/logout` têm layout próprio (sem sidebar/header/footer) —
  o `App` esconde o shell quando a rota é de autenticação.
- O botão **Sair** da sidebar navega para `/logout`, que encerra a sessão.

### 2.2 Ações contextuais no header (padrão para botões de cadastro)

**Nunca** coloque botões "Cadastrar X" soltos na página. O padrão é:

```ts
// na página
private readonly headerActions = inject(HeaderActionsService);

ngOnInit(): void {
  this.headerActions.set([
    { id: 'nova-area', label: 'Cadastrar nova área de estudo', icon: 'plus',
      variant: 'accent', run: () => this.openCreateModal() },
  ]);
}

ngOnDestroy(): void {
  this.headerActions.clear();  // OBRIGATÓRIO — o botão some ao sair da página
}
```

O `Header` global renderiza as ações registradas. Variants: `accent`
(outline amarelo) e `primary` (escuro). Já usam esse padrão: Dashboard
("Adicionar curso"), Estudos e Labs, Trilhas (novo tópico), Projetos Pessoais,
Projetos Profissionais, Culinária (nova categoria/nova receita) e Receita (editar).

### 2.3 Ícones (Lucide)

- **primeicons foi removido** (dependência e CSS). Não use `pi pi-*` nem o atributo
  `icon=` do PrimeNG.
- Use SEMPRE o componente compartilhado:

```html
<app-icon name="plus" size="16" /> <app-icon [name]="item.iconClass" size="20" />
<!-- nomes vindos do banco -->
<app-icon name="loader-circle" [spin]="true" />
<!-- substitui pi-spin -->
```

- Registro central: `shared/icons/icon.registry.ts` (`provideAppIcons()` no `app.config.ts`).
  Para adicionar um ícone novo: importe o componente `Lucide*` e adicione às duas listas.
- Compatibilidade: nomes legados `pi-*` salvos no banco são convertidos pelo mapa
  `PI_TO_LUCIDE` — os dados antigos continuam funcionando.
- Botões com ícone: conteúdo projetado, nunca o atributo `icon`:

```html
<button pButton type="submit" class="btn-primary" [disabled]="saving()">
  <app-icon name="check" size="16" aria-hidden="true" />
  <span>Salvar</span>
</button>
```

### 2.4 PrimeNG (tema e componentes)

- **Tema Aura registrado** em `app.config.ts` via `providePrimeNG({ theme: { preset: Aura } })`
  (antes não havia provider — causa do visual quebrado dos botões).
- Modais: `p-dialog` com `styleClass="studyModal"`, `[modal]="true"`, `[draggable]="false"`,
  `[resizable]="false"`; footer com `.formActions` e botões `.btn-cancel` / `.btn-primary`.
  Confirmação de exclusão segue o bloco `.delete-confirm` com ícone `triangle-alert`.
- Selects: `p-select` (o antigo `p-dropdown` foi substituído; `CUSTOM_ELEMENTS_SCHEMA`
  removido — era o que mascarava o erro).
- Tabelas: `p-table` (atividade recente do dashboard, study-detail, course-detail);
  status sempre com `p-tag` + `getStatusSeverity()`.
- Cards de painel: `p-card styleClass="panelCard"`; tabs/accordions: `p-accordion`.

### 2.5 Acessibilidade

- Landmarks: `role="banner"` (header), `role="navigation"` (sidebar), `role="main"`
  (conteúdo), `role="contentinfo"` (footer), `role="region"` + `aria-label` nas páginas.
- Grids de cards são `<ul role="list">` com `<li>` (+ `display: contents` para não
  afetar o layout).
- Botões icon-only têm `aria-label`; ícones decorativos têm `aria-hidden="true"`.
- Erros de formulário usam `role="alert"`; loading usa `role="status"` + `aria-live`.
- `aria-current="page"` na navegação ativa; `aria-expanded` no toggle da sidebar.

### 2.6 Footer fixo no bottom

`.app-main { min-height: 100vh; flex-direction: column }` + `.app-content { flex: 1 }`

- `.footer { margin-top: auto }` — o footer fica no fim da viewport mesmo em páginas curtas.

### 2.7 Estrutura de diretórios

```
src/app/
├── core/                  # singleton: services, guards, interceptors, constants
│   ├── guards/            # auth.guard.ts
│   ├── interceptors/      # auth-interceptor.ts, api-error-interceptor.ts
│   └── services/          # auth/, course/, content/, project/, header-actions/, ...
├── pages/                 # 1 pasta por rota (standalone components)
├── shared/
│   ├── components/        # reutilizáveis (icon, header, sidebar, footer, grids, ...)
│   ├── icons/             # icon.registry.ts (Lucide)
│   ├── styles/            # abstracts/base (SCSS global)
│   └── types/             # interfaces/DTOs
└── environment/           # environment.ts / environment.prod.ts
```

Limpezas feitas: removido `pages/study-labs/courses/course/*` (9 componentes órfãos,
sem rota e com specs quebrados); corrigido `fileReplacements` do `angular.json`
(apontava para `src/environments/`, pasta inexistente).

Pendência conhecida (não crítica): a pasta `core/services/Breadcrumb` deveria ser
minúscula (`breadcrumb`). Renomear exige `git mv` em duas etapas no Windows —
fazer numa mudança isolada.

### 2.8 Testes (Jest)

- **Vitest removido** (dependência e builder `test` do angular.json). Fica só o Jest.
- Criado `src/setup-jest.ts` com `setupZonelessTestEnv()` (app é zoneless).
- `tsconfig.spec.json` agora usa `types: ["jest"]`.
- Scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`.
- Padrão de spec de componente: sempre incluir nos providers
  `provideAppIcons()`, `provideRouter([])` (ou `RouterModule.forRoot([])`),
  `provideHttpClient()` + `provideHttpClientTesting()` quando houver HTTP.

---

## 3. Integração frontend ↔ backend

1. Suba o backend (`make docker-up` em `tech-book-backend/app`) — porta 8080.
2. `environment.ts` já aponta para `http://localhost:8080`.
3. `npm start` no frontend (porta 6002).
4. Acesse `http://localhost:6002` → você será redirecionada para `/login`.
5. Entre com o usuário seed (`admin@techbook.dev` / `admin123` por padrão).

Contrato de resposta da API (obrigatório para novos endpoints):

```json
{ "success": true,  "data": { ... } }
{ "success": false, "error": "mensagem" }
```

---

## 4. Checklist para novas features

**Backend**: entity → interface do repositório → repositório Mongo (usar `baseRepository`)
→ usecase (validação + timestamps) → handler (`RegisterRoutes`) → registrar no `main.go`
→ índice no `mongo-init.js` → rota protegida por padrão.

**Frontend**: service em `core/services/<domínio>/` consumindo o envelope → tipos em
`shared/types/` → página standalone em `pages/` → botão de cadastro via
`HeaderActionsService` → modais `p-dialog` padrão → ícones via `<app-icon>` →
roles/aria → spec Jest com os providers padrão.
