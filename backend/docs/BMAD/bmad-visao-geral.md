# BMAD — Visão Geral (Backend)

## O que é

BMAD, neste projeto, é o **método de governança por agentes** que organiza como
IA e pessoas evoluem o backend do Caderno Inteligente de forma segura, rastreável
e sem regressões. A ideia central: em vez de um "assistente genérico", temos
**agentes especializados** com escopo, regras e limites claros, mais um conjunto
de **instruções operacionais** que todos seguem.

A sigla é usada aqui no sentido de desenvolvimento ágil dirigido por agentes
(Breakthrough Method for Agile AI-Driven Development). Não copiamos uma estrutura
genérica: os agentes e regras foram **adaptados à arquitetura real** (Go 1.25 +
Clean Architecture + MongoDB + JWT próprio).

## Por que está sendo usado

- **Consistência:** todo agente parte das mesmas regras (`.agents/README.md`).
- **Anti-regressão:** contratos de API e schema têm política explícita.
- **Rastreabilidade:** decisões e pendências ficam documentadas em `docs/`.
- **Onboarding:** um novo colaborador (humano ou IA) sabe onde atuar e como.
- **Qualidade:** checklists antes/depois de editar reduzem defeitos.

## Estrutura criada

```
backend/
├── .agents/
│   └── README.md                 # instruções operacionais (contrato para todos)
├── agentes/                      # 15 agentes especializados (1 arquivo cada)
│   ├── arquitetura-backend.md    ├── go.md            ├── api-rest.md
│   ├── autenticacao-autorizacao.md  ├── banco-de-dados.md  ├── migrations.md
│   ├── seguranca.md              ├── observabilidade.md   ├── testes-unitarios.md
│   ├── testes-integracao.md      ├── performance.md       ├── documentacao.md
│   ├── revisao-codigo.md         ├── docker.md            └── ci-cd.md
└── docs/
    └── BMAD/
        ├── bmad-visao-geral.md       (este arquivo)
        ├── bmad-agentes.md
        ├── bmad-fluxo-de-trabalho.md
        └── bmad-governanca.md
```

## Como se conecta ao resto da documentação

- `app/PADROES.md` — padrão de código e passo a passo de novo recurso.
- `docs/modelagem-fluxograma/*` — modelagem de dados e fluxos.
- `docs/swagger-openapi.md` — plano de documentação de API (futuro).
- `docs/qualidade-e-testes.md` / `docs/plano-testes-futuros.md` — estado dos testes.

## Como evoluir a estrutura

1. Novo domínio de conhecimento recorrente → **novo agente** em `agentes/`.
2. Nova regra que vale para todos → **atualize `.agents/README.md`**.
3. Decisão arquitetural → registre uma ADR (ver `bmad-governanca.md`).
4. Mantenha esta visão geral sincronizada quando a estrutura mudar.
