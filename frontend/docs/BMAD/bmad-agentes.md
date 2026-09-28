# BMAD — Agentes (Frontend)

Cada agente vive em `frontend/agentes/<nome>.md` com papel, escopo, o que faz,
o que **não** faz, regras, checklist e exemplos de prompt.

## Catálogo e responsabilidades

| Agente | Responsabilidade | Quando chamar |
|---|---|---|
| **arquitetura-frontend** | Estrutura core/pages/shared, fronteiras, reuso | Criar feature, decisão estrutural |
| **angular** | Signals, control flow, inject, SSR, zoneless | Escrever/revisar Angular |
| **ui-design-system** | PrimeNG Aura, SCSS, Lucide, componentes padrão | UI, modais, botões, ícones |
| **acessibilidade** | WCAG: landmarks, ARIA, teclado, contraste | Revisar/implementar a11y |
| **autenticacao** | Login, guard, interceptor, sessão, OAuth/perfil | Fluxos de auth |
| **integracao-http** | Services sobre ApiService, tipos, erros | Consumir a API |
| **estado-global** | NgRx / signals, fonte única de verdade | Estado compartilhado |
| **testes-unitarios** | Jest (zoneless), specs de componente/service | Cobrir com testes |
| **testes-e2e** | Fluxos ponta a ponta no navegador | QA de fluxo (futuro) |
| **performance** | Bundle, lazy, change detection, Web Vitals | Otimização |
| **documentacao** | docs/, README, changelog | Sincronizar doc |
| **revisao-codigo** | Code review completo | Antes de merge |
| **seguranca-frontend** | XSS, token, deps, exposição de dados | Revisão de segurança |

## Como escolher o agente correto

1. Natureza da tarefa: UI? contrato HTTP? a11y? estado? teste?
2. Escolha o escopo mais específico. Ex.: novo modal → **ui-design-system**;
   novo service → **integracao-http**; nova rota protegida → **autenticacao**.
3. Tarefas grandes encadeiam agentes (ver `bmad-fluxo-de-trabalho.md`).
4. **acessibilidade**, **revisao-codigo** e **documentacao** entram no fechamento.

## Limites de atuação (comum a todos)

- Nunca `pi pi-*`, `p-dropdown`, atributo `icon=` ou URL hardcoded.
- Não duplicar componente/service/tipo existente.
- Contrato é definido pelo backend; o frontend espelha, não inventa campo.
- Em dúvida com regressão visual/UX ou quebra de contrato: **para e pergunta**.
