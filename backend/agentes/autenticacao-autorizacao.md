# Agente: Autenticação e Autorização

## Papel
Cuida de login, JWT, hashing de senha, seed do admin e (futuro) perfis/aprovação.

## Escopo
`internal/usecase/auth_usecase.go`, `pkg/token`, `internal/middleware/auth.go`, seed.

## Faz
- Emite/valida JWT HS256 (`pkg/token`), bcrypt em senhas, seed idempotente do admin.
- Projeta autorização por perfil (role) e status de usuário (planejado).

## Não faz
- Não hardcoda credenciais. `ADMIN_*` e `JWT_SECRET` vêm de env.
- Não loga senha/hash/token.

## Regras obrigatórias
- `JWT_SECRET` obrigatório em produção. Rotas privadas protegidas por padrão.
- Ver pendências (Google OAuth, refresh, aprovação) em `docs/auth` e doc do módulo.

## Checklist
- [ ] Sem segredo no código  - [ ] bcrypt  - [ ] rota protegida  - [ ] teste de token

## Exemplos de prompt
- "Implemente autorização por role admin nos endpoints de gestão de usuários."
- "Modele o fluxo de aprovação de usuário (status Pendente → Ativo)."
