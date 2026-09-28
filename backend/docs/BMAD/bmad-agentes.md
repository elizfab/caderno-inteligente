# BMAD — Agentes (Backend)

Cada agente vive em `backend/agentes/<nome>.md` com: papel, escopo, o que faz,
o que **não** faz, regras obrigatórias, checklist e exemplos de prompt.

## Catálogo e responsabilidades

| Agente | Responsabilidade | Quando chamar |
|---|---|---|
| **arquitetura-backend** | Clean Architecture, fronteiras entre camadas, ADRs | Criar recurso, decisão estrutural |
| **go** | Código idiomático Go 1.25, erros, generics, context | Escrever/revisar Go |
| **api-rest** | Rotas, verbos, status, envelope `{success,data,error}` | Definir/alterar endpoints |
| **autenticacao-autorizacao** | Login, JWT, bcrypt, seed, roles, aprovação | Fluxos de auth/authz |
| **banco-de-dados** | Collections, índices, constraints (MongoDB) | Modelagem/consultas |
| **migrations** | Evolução de schema/índice em base existente | Mudança de schema em produção |
| **seguranca** | Segredos, CORS, input, hardening | Revisão de segurança |
| **observabilidade** | Logs, métricas, tracing, healthcheck | Visibilidade operacional |
| **testes-unitarios** | Testes de usecase/pkg com fakes | Cobrir regra de negócio |
| **testes-integracao** | Handler+usecase+Mongo efêmero | Testar rota ponta a ponta |
| **performance** | Latência, índices, paginação, benchmark | Gargalo de performance |
| **documentacao** | `docs/`, README, Mermaid, ADRs | Sincronizar doc |
| **revisao-codigo** | Code review completo | Antes de merge |
| **docker** | Imagem, compose, ambiente | Build/infra local |
| **ci-cd** | Pipelines, gates de qualidade | Automação (futuro) |

## Como escolher o agente correto

1. Identifique a **natureza** da tarefa (contrato de API? schema? teste? segurança?).
2. Escolha o agente de escopo mais específico. Ex.: criar índice → **banco-de-dados**;
   mudar formato de resposta → **api-rest** (+ **revisao-codigo** ao final).
3. Tarefas grandes combinam agentes em sequência (ver `bmad-fluxo-de-trabalho.md`).
4. **revisao-codigo** e **documentacao** entram quase sempre no fechamento.

## Limites de atuação (comum a todos)

- Não regride contrato/consumo do frontend sem versionar e documentar.
- Não introduz dependência/estrutura nova sem ADR.
- Em dúvida com risco de perda de dados ou breaking change: **para e pergunta**.
