# BMAD — Visão Geral (Frontend)

## O que é

BMAD, neste projeto, é o **método de governança por agentes** que organiza como
IA e pessoas evoluem o frontend Angular do Caderno Inteligente com consistência
visual, acessibilidade e sem regressões. Em vez de um assistente genérico, há
**agentes especializados** (com escopo e limites) e **instruções operacionais**
comuns em `.agents/README.md`.

A sigla é usada no sentido de desenvolvimento ágil dirigido por agentes. Os
agentes foram **adaptados à stack real**: Angular 21 (standalone, zoneless, SSR),
PrimeNG 21 (tema Aura), ícones Lucide, NgRx e Jest.

## Por que está sendo usado

- **Consistência de UI/UX** (design system, ícones, modais padrão).
- **Acessibilidade** como requisito, não acabamento.
- **Anti-regressão** em contratos HTTP e componentes compartilhados.
- **Onboarding** rápido: cada agente diz onde e como atuar.

## Estrutura criada

```
frontend/
├── .agents/
│   └── README.md                 # instruções operacionais (contrato para todos)
├── agentes/                      # 13 agentes especializados
│   ├── arquitetura-frontend.md   ├── angular.md          ├── ui-design-system.md
│   ├── acessibilidade.md         ├── autenticacao.md     ├── integracao-http.md
│   ├── estado-global.md          ├── testes-unitarios.md ├── testes-e2e.md
│   ├── performance.md            ├── documentacao.md     ├── revisao-codigo.md
│   └── seguranca-frontend.md
└── docs/
    └── BMAD/
        ├── bmad-visao-geral.md       (este arquivo)
        ├── bmad-agentes.md
        ├── bmad-fluxo-de-trabalho.md
        └── bmad-governanca.md
```

## Como se conecta ao resto da documentação

- `docs/IMPLEMENTACOES.md` — padrões implementados (fonte de verdade).
- `docs/INTEGRACAO-BACKEND.md` — consumo da API.
- `docs/autenticacao-autorizacao-usuarios.md` — escopo e estado do módulo de identidade.
- `docs/qualidade-e-testes.md` / `docs/plano-testes-futuros.md` — estado dos testes.

## Como evoluir

1. Novo tema recorrente → novo agente em `agentes/`.
2. Regra geral nova → atualizar `.agents/README.md`.
3. Decisão de arquitetura → ADR (ver `bmad-governanca.md`).
4. Manter esta visão sincronizada com a estrutura.
