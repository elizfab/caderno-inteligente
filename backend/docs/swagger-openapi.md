# Swagger / OpenAPI — Plano de Implementação Futura (Backend)

> **Status: NÃO IMPLEMENTADO.** Este documento é o plano para adicionar Swagger/
> OpenAPI ao backend. Nada de Swagger existe no código hoje. Implementar apenas
> quando entrar no escopo ativo.

## Objetivo

Expor uma especificação OpenAPI 3.x navegável (Swagger UI) descrevendo todos os
endpoints `/api/v1/*`, seus contratos de request/response (envelope
`{success,data,error}`), erros e autenticação JWT — para consumo do frontend,
testes de contrato e onboarding.

## Biblioteca recomendada para Go

Como o projeto usa `net/http` puro (sem framework), há duas abordagens:

1. **`swaggo/swag` + `http-swagger`** (geração a partir de anotações em comentários).
   - Prós: rápido de adotar, anotações junto ao handler.
   - Contras: anotações podem divergir do código; acoplamento a comentários.
2. **Spec-first com `getkin/kin-openapi`** (escrever/validar o YAML e servir).
   - Prós: fonte única versionada, validação da spec, contrato-first.
   - Contras: manutenção manual do YAML.

Recomendação: **`swaggo/swag`** para começar (menor atrito com o estilo atual),
migrando para spec-first se o contrato ficar complexo.

## Instalação (quando for implementar)

```bash
go install github.com/swaggo/swag/cmd/swag@latest
go get github.com/swaggo/http-swagger
go get github.com/swaggo/files
```

## Configuração

1. Anotações gerais no `cmd/server/main.go` (título, versão, base path, security).
2. Anotações por handler (`@Summary`, `@Param`, `@Success`, `@Failure`, `@Router`).
3. Gerar a spec: `swag init -g cmd/server/main.go -o docs/openapi`.
4. Servir a UI em rota **pública** e separada do `/api/v1` (ex.: `/swagger/*`),
   fora do middleware `Auth` — mas desabilitável em produção por env.

## Anotações (exemplo, a validar quando implementar)

```go
// @title        Caderno Inteligente API
// @version      1.0
// @description  API de estudos, projetos, quiz e culinária.
// @BasePath     /api/v1
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

// Login godoc
// @Summary  Autentica e emite JWT
// @Tags     auth
// @Accept   json
// @Produce  json
// @Param    body body LoginRequest true "credenciais"
// @Success  200 {object} Envelope{data=LoginResult}
// @Failure  401 {object} Envelope
// @Router   /auth/login [post]
```

## Documentar o envelope e erros

- Modelar um schema `Envelope` genérico (`success`, `data`, `error`) e reutilizar.
- Erros padronizados por status: 400 (validação), 401 (credenciais/token),
  403 (sem permissão), 404 (não encontrado), 409 (duplicado), 500 (interno).

## Autenticação no Swagger

- Definir `BearerAuth` (apiKey no header `Authorization`).
- Botão "Authorize" na UI para colar o `Bearer <jwt>` obtido no login.

## Versionamento da API na spec

- `info.version` acompanha a versão da API. Prefixo de rota `/api/v1` no `basePath`.
- Breaking change → `/api/v2` e nova seção/spec.

## Exemplos de endpoints a documentar (todos já existentes)

`POST /auth/login`, `POST /auth/logout`, CRUD de `course-sections`,
`course-topics`, `study-items` (+ notes/resources/sessions), `projects`,
`culinary/*`, `quiz-questions`, e `GET /health` (fora do envelope).

## Integração com CI

- Passo no pipeline: `swag init` e falhar se a spec gerada divergir da versionada
  (`git diff --exit-code docs/openapi`).
- Validar a spec (lint OpenAPI) como gate.

## Checklist de implementação

- [ ] Escolher abordagem (swaggo vs spec-first)
- [ ] Anotar `main.go` + handlers
- [ ] Gerar spec e servir UI em `/swagger` (desabilitável em prod)
- [ ] Schema `Envelope` + erros padronizados
- [ ] Segurança BearerAuth
- [ ] Passo de CI validando a spec
- [ ] Referência no README

## Riscos e pendências

- Anotações desatualizadas → mitigar com o gate de CI.
- Exposição indevida da UI em produção → controlar por env.
- Sincronização com os tipos do frontend (`shared/types`) → revisar a cada mudança.
