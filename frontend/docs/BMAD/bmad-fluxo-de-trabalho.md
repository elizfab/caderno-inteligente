# BMAD — Fluxo de Trabalho (Frontend)

Fluxo recomendado para qualquer mudança no frontend, do pedido ao merge.

## 1. Enquadrar

- Ler o pedido e o `git status`.
- Consultar `.agents/README.md` e `docs/IMPLEMENTACOES.md` (padrões).
- Escolher o(s) agente(s) — ver `bmad-agentes.md`.

## 2. Planejar

- Confirmar reuso: já existe componente/service/tipo equivalente?
- Definir qual endpoint do backend será consumido (envelope `{success,data,error}`).
- Mudança em componente compartilhado → checar todos os consumidores.

## 3. Implementar (padrões obrigatórios)

- Standalone + signals + control flow (`@if/@for`).
- UI: PrimeNG Aura, `<app-icon>` (Lucide), modal `p-dialog studyModal`, `p-select`.
- Botão de cadastro via `HeaderActionsService` (`set` no init, `clear` no destroy).
- HTTP: service sobre `ApiService`, tipo em `shared/types`, `environment.apiUrl`.
- a11y: roles/landmarks, `aria-label`, `role="alert"` em erros.

## 4. Validar

```bash
npm install
npm run build      # inclui SSR
npm test
# quando houver
npm run test:coverage
```

## 5. Documentar

- Atualizar `docs/IMPLEMENTACOES.md` / `CHANGELOG.md` e a doc da feature.
- Registrar pendências (E2E, OAuth, tema, etc.) em `docs/plano-testes-futuros.md`.

## 6. Revisar e fechar

- Passar o checklist do agente **revisao-codigo** e **acessibilidade**.
- Commit em Conventional Commits.

## Fluxo para uma feature típica (ex.: painel administrativo de usuários)

1. **arquitetura-frontend** — nova page em `pages/`, service em `core`.
2. **integracao-http** — `UserService` sobre `ApiService` + tipos.
3. **ui-design-system** — tabela `p-table`, cards `panelCard`, modais padrão.
4. **estado-global** — filtro/paginação/ordenção (signals ou NgRx).
5. **acessibilidade** — tabela e ações acessíveis por teclado.
6. **testes-unitarios** — specs de componente/service.
7. **documentacao** + **revisao-codigo** — fechar.
