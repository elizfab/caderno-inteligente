# Implementação — Autenticação, Cadastro, Aprovação, Perfil e Admin

Registro do que foi **implementado em código** nesta rodada (backend + frontend),
complementando `autenticacao-autorizacao-usuarios.md` (estado/escopo) e
`MODULO-AUTENTICACAO.md` (especificação).

## Backend (Go)

### Modelo
- `entity/user.go`: novos campos `phone`, `avatarUrl`, `role`, `status`,
  `provider`, `lastLoginAt` + constantes de status/role/provider.
- `entity/audit.go` (novo): `AuditLog` + constantes de ações.

### Repositórios
- `UserRepository`: `GetByID`, `List`, `UpdateFields`, `Delete`, `CountByStatus`.
- `AuditRepository` (novo): `Create`, `List`.
- `docker/mongo-init.js`: índices `users.status`, `users.role` e collection
  `audit_logs` (índices `createdAt`, `userId`).

### Casos de uso
- `AuthUseCase`: `Register` (status pendente), login com bloqueio de
  pendente/bloqueado + `lastLoginAt` + auditoria, `GetProfile`, `UpdateProfile`,
  `ChangePassword`. Novos erros: `ErrUserPending`, `ErrUserBlocked`, `ErrWrongPassword`.
- `SeedDefaultUser`: idempotente — cria/garante o admin (role=admin, status=active)
  a partir de `ADMIN_*` (env; nunca hardcoded).
- `UserUseCase` (novo, admin): `List`, `Get`, `Stats`, `IsAdmin`, `Approve`,
  `Block`, `Unblock`, `Delete`, `Audit`.

### HTTP
Novos endpoints (todos no envelope `{success,data,error}`):

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/v1/auth/register` | pública | cadastro (status pendente) |
| GET | `/api/v1/profile` | Bearer | perfil do usuário |
| PUT | `/api/v1/profile` | Bearer | edita nome/telefone/avatar |
| PUT | `/api/v1/profile/password` | Bearer | troca senha |
| GET | `/api/v1/admin/users` | Bearer + admin | lista usuários |
| GET | `/api/v1/admin/users/stats` | Bearer + admin | contadores |
| GET | `/api/v1/admin/users/{id}` | Bearer + admin | detalhe |
| POST | `/api/v1/admin/users/{id}/approve` | Bearer + admin | aprovar |
| POST | `/api/v1/admin/users/{id}/block` | Bearer + admin | bloquear/reprovar |
| POST | `/api/v1/admin/users/{id}/unblock` | Bearer + admin | desbloquear |
| DELETE | `/api/v1/admin/users/{id}` | Bearer + admin | excluir |
| GET | `/api/v1/admin/audit` | Bearer + admin | auditoria |

Autorização admin: `UserHandler.guard` valida claims + `UserUseCase.IsAdmin`
(role=admin e status=active). Login continua bloqueando pendente (403) e
bloqueado (403), com mensagens específicas em `handler/helpers.go`.

## Frontend (Angular)

- `shared/types/auth.interface.ts`: `AuthUser` estendido + `RegisterDto`,
  `ProfileDto`, `ChangePasswordDto`, `UserStats`, `AuditLog`, `UserRole`, `UserStatus`.
- `core/services/auth/auth.service.ts`: `register`, `loadProfile`, `updateProfile`,
  `changePassword`, `isAdmin` (computed), `patchUser`.
- `core/services/user/user.service.ts` (novo): consumo de `/api/v1/admin/*`.
- `core/services/theme/theme.service.ts` (novo): tema claro/escuro com persistência
  (`localStorage`) e classe `app-dark` no `<html>` (PrimeNG `darkModeSelector: '.app-dark'`).
- `core/guards/admin.guard.ts` (novo): restringe rotas a admin.
- `shared/components/register-modal/*` (novo): modal "Criar conta" com avatar
  (preview + validação PNG/JPG/JPEG/WebP), máscara de telefone, confirmação de senha.
- `pages/profile/*` (novo): "Meu Perfil" (dados + avatar + troca de senha).
- `pages/admin/users/*` (novo): painel com cards (total/ativos/pendentes/bloqueados),
  `p-table` (busca, ordenação, paginação, filtro por status), ações
  aprovar/bloquear/desbloquear/excluir com modal de confirmação.
- `shared/components/header/*`: botão de tema, atalho admin (se admin), link de
  perfil (avatar) e sair.
- `pages/login/*`: botão "Criar conta" que abre o modal; mensagens de pendente/bloqueado.
- `app.routes.ts`: `/perfil` e `/admin/usuarios` (com `adminGuard`).
- `icon.registry.ts`: ícones `ban`, `key`, `phone`, `sun`, `unlock`, `upload`,
  `user-check`, `user-plus`, `user-x`.

## Pendências (mantidas)

- **Login com Google (OAuth)** — bloqueado (requer `GOOGLE_CLIENT_ID`/`SECRET`).
- **E-mail de aprovação** — bloqueado (requer SMTP). O fluxo/estado já existe;
  falta o envio real.
- Refresh token, testes E2E/performance — ver planos de teste.

## Validação necessária (na sua máquina)

> O sandbox onde o código foi escrito **não** tem Go instalável e sua camada de
> arquivos apresentou leitura inconsistente para arquivos muito editados, então a
> compilação **não** pôde ser executada aqui. Os arquivos estão íntegros em disco.

Backend:

```bash
cd backend/app
go mod tidy
go build ./...
go vet ./...
go test ./...
```

Frontend:

```bash
cd frontend
npm install
npm run build
npm test
```

Fluxo manual sugerido: cadastrar usuário → ver "pendente" no login → logar como
admin (ADMIN_EMAIL/ADMIN_PASSWORD) → aprovar no painel → novo usuário loga →
editar perfil e trocar senha → alternar tema claro/escuro.
