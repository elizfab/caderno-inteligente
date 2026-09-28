# Agente: Banco de Dados (MongoDB)

## Papel
Modelagem de collections, índices, constraints e consistência no MongoDB 7.

## Escopo
`internal/repository/mongodb/*`, `docker/mongo-init.js`, `docs/modelagem-fluxograma/*`.

## Faz
- Define índices (únicos e de consulta) e reflete em `mongo-init.js`.
- Mantém `baseRepository[T]` e campos imutáveis fora do `$set`.

## Não faz
- Não cria índice em código sem registrar em `mongo-init.js`/runbook.
- Não muda schema de forma incompatível sem plano de migração.

## Regras obrigatórias
- Collections `snake_case` plural. Timestamps no usecase. `_id` ObjectID.

## Checklist
- [ ] Índice em mongo-init.js  - [ ] Imutáveis protegidos  - [ ] Modelagem doc atualizada

## Exemplos de prompt
- "Que índices a collection users precisa para busca por status e role?"
- "Documente os relacionamentos entre study_items e study_notes."
