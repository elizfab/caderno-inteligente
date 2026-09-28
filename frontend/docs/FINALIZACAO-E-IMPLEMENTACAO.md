# Finalização e Implementação — Caderno Inteligente

Documento consolidado do que foi entregue no projeto (backend Go + frontend
Angular), como validar e o que permanece pendente. Complementa
`IMPLEMENTACAO-AUTH-USUARIOS.md`, `autenticacao-autorizacao-usuarios.md` e as
docs de modelagem em `../../backend/docs/modelagem-fluxograma/`.

Data: 2026-07-13.

---

## 1. Estrutura e infraestrutura

- Projetos movidos para `Repos/github/projects/caderno-inteligente/{backend, frontend}`
  preservando `.git`, histórico e remotes.
- Backend atualizado para **Go 1.25** (`go.mod`, `Dockerfile` `golang:1.25-alpine`,
  runtime `alpine:3.21`).
- Estrutura **BMAD** em ambos os projetos: `.agents/`, `agentes/` e `docs/BMAD/`.
- Documentação de modelagem/fluxos, Swagger (futuro), mapas de teste e READMEs.

## 2. Backend (Go + MongoDB) — implementado

### Domínio
- `entity.User` estendido: `phone`, `avatarUrl`, `role`, `status`, `provider`,
  `lastLoginAt` + constantes de status/role/provider.
- `entity.AuditLog` + constantes de ações.

### Persistência
- `UserRepository`: `GetByEmail`, `GetByID`, `List`, `Create`, `UpdateFields`,
  `Delete`, `Count`, `CountByStatus`.
- `AuditRepository`: `Create`, `List`.
- `docker/mongo-init.js`: índices `users.status`, `users.role`, collection
  `audit_logs` (índices `createdAt`, `userId`).

### Regras de negócio
- `AuthUseCase`: `Login` (bloqueia pendente/bloqueado, grava `lastLoginAt` e
  auditoria), `Register` (status pendente), `GetProfile`, `UpdateProfile`,
  `ChangePassword`, `SeedDefaultUser` (idempotente, admin via env).
- `UserUseCase` (admin): `List`, `Get`, `Stats`, `IsAdmin`, `Approve`, `Block`,
  `Unblock`, `Delete`, `Audit`.

### HTTP (envelope `{success,data,error}`)
| Método | Rota | Auth |
|---|---|---|
| POST | `/api/v1/auth/login` | pública |
| POST | `/api/v1/auth/logout` | pública |
| POST | `/api/v1/auth/register` | pública |
| GET/PUT | `/api/v1/profile` | Bearer |
| PUT | `/api/v1/profile/password` | Bearer |
| GET | `/api/v1/admin/users` `/stats` `/{id}` | Bearer + admin |
| POST | `/api/v1/admin/users/{id}/approve` `/block` `/unblock` | Bearer + admin |
| DELETE | `/api/v1/admin/users/{id}` | Bearer + admin |
| GET | `/api/v1/admin/audit` | Bearer + admin |
| GET | `/health` | pública |

Recursos existentes preservados: áreas/tópicos de estudo, itens de estudo
(+ notas, recursos, sessões), projetos, culinária e quiz.

## 3. Frontend (Angular 21) — implementado

- **Tipos/serviços:** `AuthUser` estendido; `AuthService` com `register`,
  `loadProfile`, `updateProfile`, `changePassword`, `isAdmin`; `UserService`
  (admin); `ThemeService` (claro/escuro persistido); `adminGuard`.
- **Cadastro:** modal "Criar conta" no login (avatar com preview + validação
  PNG/JPG/JPEG/WebP, máscara de telefone, confirmação de senha).
- **Perfil:** página "Meu Perfil" (dados + avatar + troca de senha).
- **Admin:** painel `/admin/usuarios` — cards (total/ativos/pendentes/bloqueados),
  tabela responsiva (busca, ordenação, paginação, filtro por status), ações
  aprovar/bloquear/desbloquear/excluir com confirmação. Admin não pode ser
  bloqueado/excluído (botões desabilitados).
- **Tema:** alternância clara/escura no header, tokens `--color-*` sobrescritos
  em `.app-dark` (footer, cards, inputs, botões e ícones com contraste).
- **Navegação:** header com tema, atalho admin, perfil e sair; logout removido do
  sidebar (fica só no header); breadcrumbs corrigidos para seções/tópicos de
  estudo e demais rotas; botão "Novo conteúdo de estudo" movido para o header
  global (`HeaderActionsService`).
- **Ícones:** fallback quando `iconClass` do banco não está registrado (corrige
  `.studyCard__icon` "invisível").
- **Modais:** botões de ação ocupam 50% cada (`.formActions .p-button { flex:1 }`).

## 4. Ajustes de UI aplicados (checklist do usuário)

- [x] Admin: botões "Voltar"/"Atualizar" com padding correto; "Atualizar" só ícone.
- [x] Admin: tabela responsiva (wrapper com scroll + larguras em rem), ícones de
      ação no modelo `study-detail-template` (`.tableAction`).
- [x] Admin: filtro com lupa alinhada e semântica (search box).
- [x] Admin: modais Bloquear/Excluir com botões 50/50.
- [x] Admin: admin não pode ser bloqueado/excluído.
- [x] `/backend`: ícones dos cards de estudo com fallback.
- [x] `/backend/nodejs`: breadcrumbs e botão "Novo conteúdo" no header.
- [x] `/estudos-labs`: modal com botões 50/50.
- [x] Sidebar sem logout.
- [x] Tema escuro completo (footer, cards, inputs, botões, ícones).
- [x] Botão "Escolher avatar" + modais de cadastro/perfil 50/50.

## 5. Pendências

| Item | Estado | Observação |
|---|---|---|
| Login com Google (OAuth) | Pendente (bloqueado) | requer `GOOGLE_CLIENT_ID`/`SECRET` |
| E-mail de aprovação | Pendente (bloqueado) | requer SMTP; fluxo/estado prontos |
| Refresh token | Pendente | endpoint + storage |
| Detalhe de projeto (`/projetos/.../:detalhe`) | Não implementado | ver seção 7 |
| Testes E2E / performance | Pendente | ver `plano-testes-futuros.md` |

## 6. Como validar (na sua máquina)

> O ambiente de edição não tem Go instalável nem builda o Angular de forma
> confiável; valide localmente.

```bash
# Backend
cd backend/app
go mod tidy && go build ./... && go vet ./... && go test ./...

# Frontend
cd frontend
npm install && npm run build && npm test
```

## 7. Nota sobre "Ver Detalhes" de projetos

O botão "Ver Detalhes" (em `/projetos/profissionais` e `/pessoais`) só aparece
quando o projeto tem `detailRoute` preenchido (dado que você cadastra no backend).
**Hoje não existe uma rota/página de detalhe de projeto** em `app.routes.ts`, então
o botão não leva a lugar nenhum útil (cairia no wildcard → dashboard). Para
funcionar, é preciso: (a) cadastrar o projeto com `detailRoute`, e (b) criar a
página/rota de detalhe do projeto. Item registrado como pendência.

## 8. Configuração do admin (.env do backend)

```
JWT_SECRET=<openssl rand -hex 32>
ADMIN_NAME=Elizabete Fabri
ADMIN_EMAIL=elizabetesousafabri@gmail.com
ADMIN_PASSWORD=<senha forte, nunca versionar>
```

O admin é criado/garantido no start (idempotente). Nunca comite o `.env`.
