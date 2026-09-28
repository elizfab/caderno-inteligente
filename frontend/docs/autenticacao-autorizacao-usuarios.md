# Módulo de Identidade e Acesso — Autenticação, Autorização e Usuários

Documento de escopo e **estado real** do módulo. A especificação funcional
completa (requisitos) permanece em [`MODULO-AUTENTICACAO.md`](MODULO-AUTENTICACAO.md);
este arquivo registra **o que já existe**, **a arquitetura adotada** e **o que está
pendente**, conforme a priorização atual (Reorganização + BMAD + Documentação).

> Renomeação sugerida pela governança: este é o documento abrangente
> (`autenticacao-autorizacao-usuarios.md`) que cobre autenticação, autorização,
> cadastro, aprovação, perfil, administração, integração e testes.

---

## 1. Escopo

Cobre login, emissão/validação de token, proteção de rotas, sessão no frontend e a
base para cadastro, aprovação, perfil e administração de usuários. Integra frontend
(Angular) e backend (Go + MongoDB).

## 2. Arquitetura adotada

**Backend (Go):** `AuthUseCase` (login, seed) → `UserRepository` (Mongo) →
`pkg/token` (JWT HS256, stdlib) → middleware `Auth` protege `/api/v1/*`.
**Frontend (Angular):** `auth.service` (signals + sessão `techbook.session`) →
`auth.guard` (rotas privadas) → `auth-interceptor` (Bearer + trato de 401) →
páginas `/login` e `/logout` com layout próprio.

Diagramas em [`../../backend/docs/modelagem-fluxograma/fluxos-backend.md`](../../backend/docs/modelagem-fluxograma/fluxos-backend.md)
e no editável [`../../backend/docs/auth/fluxo-autenticacao.drawio`](../../backend/docs/auth/fluxo-autenticacao.drawio).

## 3. Estado atual (implementado)

| Item | Estado | Onde |
|---|---|---|
| Login tradicional (e-mail/senha) | Implementado | `auth_usecase.go`, `pages/login` |
| JWT HS256 (24h) | Implementado | `pkg/token` |
| Senhas com bcrypt | Implementado | `auth_usecase.go` |
| Middleware de proteção de rotas | Implementado | `internal/middleware/auth.go` |
| Guard + interceptor no frontend | Implementado | `core/guards`, `core/interceptors` |
| Sessão persistida (signals) | Implementado | `core/services/auth` |
| Logout (stateless) | Implementado | `pages/logout`, endpoint de simetria |
| Seed de admin (idempotente, via env) | Implementado | `SeedDefaultUser` + `.env` |

## 4. Endpoints atuais

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/v1/auth/login` | pública | credenciais → JWT |
| POST | `/api/v1/auth/logout` | pública | simetria (cliente descarta token) |
| GET | `/health` | pública | status do serviço |
| * | `/api/v1/*` (demais) | Bearer JWT | recursos protegidos |

## 5. Regras de negócio

- E-mail normalizado (lowercase/trim) e único.
- Senha nunca serializada (`json:"-"`); comparação via bcrypt.
- `JWT_SECRET` obrigatório em produção; token expira em 24h.
- Admin não é hardcoded: criado por seed a partir de `ADMIN_*` (env).

## 6. Pendências (não implementado / bloqueado)

| Item | Estado | Observação |
|---|---|---|
| Cadastro de usuário (nome, telefone, e-mail, senha, avatar) | Não implementado | Endpoint `POST /auth/register` + página/modal |
| Validação de força de senha e máscara de telefone | Não implementado | Frontend + backend |
| Upload e armazenamento de avatar | Não implementado | Definir storage (disco/objeto) |
| Fluxo de aprovação (status Pendente→Ativo/Bloqueado) | Não implementado | Campo `status` em `users` + regra no login |
| Perfis/roles (admin vs user) e autorização | Não implementado | Campo `role` + checagem nos handlers |
| Painel administrativo de usuários (cards, tabela, ações) | Não implementado | Página Angular + `UserService` |
| Perfil "Meu Perfil" (editar nome/telefone/senha/avatar) | Não implementado | Página + endpoints |
| Refresh token / renovação automática | Não implementado | Endpoint + storage |
| Auditoria (login, cadastro, aprovação, ...) | Não implementado | Collection `audit_logs` |
| Tema claro/escuro (theme switch persistido) | Não implementado | CSS variables + PrimeNG |
| Revisão dos botões "Voltar" e breadcrumbs dinâmicos | Parcial | Componentes existem (`back-button`, `breadcrumbs`) |
| **Login com Google (OAuth)** | **Bloqueado** | Requer `GOOGLE_CLIENT_ID`/`SECRET` (credenciais não disponíveis) |
| **E-mail de aprovação** | **Bloqueado** | Requer SMTP (credenciais não disponíveis) |
| Testes E2E / performance do fluxo | Não implementado | Ver `plano-testes-futuros.md` |

## 7. Decisões técnicas

- JWT com stdlib (sem dependência externa), assinado com `JWT_SECRET`.
- Frontend espelha o contrato do backend em `shared/types` (não inventa campos).
- Proteção "por padrão": tudo em `/api/v1/*` é privado, salvo `/auth/*` e `/health`.

## 8. Cenários de erro previstos

- Credenciais inválidas → 401. Token ausente/expirado → 401.
- (Planejado) Usuário pendente → 403 "Aguardando aprovação do administrador".
- (Planejado) E-mail duplicado no cadastro → 409.

## 9. Próximos passos recomendados

1. Modelar extensão de `users` (status, role, phone, avatarUrl, googleId).
2. `POST /auth/register` + fluxo de aprovação + autorização admin.
3. Painel admin e página de perfil no frontend.
4. Tema claro/escuro e revisão de navegação/breadcrumbs.
5. OAuth Google e e-mail quando as credenciais estiverem disponíveis.
6. Testes (unitários de usecase, E2E de login/navegação).

> **Nota de credenciais/segurança:** o e-mail administrador e a senha citados na
> especificação devem ser definidos via `.env` (`ADMIN_EMAIL`/`ADMIN_PASSWORD`) e
> **nunca** versionados. O seed já suporta esse fluxo.
