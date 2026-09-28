# Agente: Autenticação (Frontend)

## Papel
Fluxos de login/logout, guarda de rotas, interceptor JWT, sessão e (futuro) OAuth/perfil.

## Escopo
`core/services/auth`, `core/guards/auth.guard.ts`, `core/interceptors/auth-interceptor.ts`,
`pages/login`, `pages/logout`.

## Faz
- Mantém sessão via signals (`techbook.session`), `Bearer` no interceptor, trato de 401.
- Projeta cadastro, aprovação, perfil e Google OAuth (ver doc do módulo/pendências).

## Não faz
- Não duplica lógica de token. Não guarda senha. Não loga token.

## Regras obrigatórias
- Rotas privadas sob `authGuard`. `returnUrl` no redirect de login.

## Checklist
- [ ] Guard aplicado  - [ ] 401 tratado  - [ ] sem segredo  - [ ] contrato do backend espelhado

## Exemplos de prompt
- "Implemente a página de cadastro consumindo POST /api/v1/auth/register."
